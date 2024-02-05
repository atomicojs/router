import { createMatch } from "@uppercod/exp-route";

export type Param<
  Prop extends string,
  Value extends string
> = Prop extends `...${infer P}` ? Record<P, Value> : Record<Prop, Value>;

export type GetParams<
  S extends string,
  Params = {}
> = S extends `${infer Before}{${infer Prop}}${infer After}`
  ? GetParams<`${Before}${After}`, Params & Param<Prop, string>>
  : S extends `${infer Before}[${infer Prop}]${infer After}`
  ? GetParams<`${Before}${After}`, Params & Param<Prop, string>>
  : Params;

export interface RouteConfig {
  cache?: boolean;
  expires?: number;
  layer?: boolean;
}

export interface RouteCallback<Props = Record<string, string>> {
  (params: Props, signal: { signal: AbortSignal; layer: boolean }): RouteResult;
}

export interface RouteRecord {
  path: string;
  config: RouteConfig;
  callback: RouteCallback;
  match: any;
}

export interface RouteResult extends AsyncIterator<any> {}

export interface RouteMatch {
  params: Record<string, any>;
  route: RouteRecord;
  path: string;
}

export interface RouteCycle {
  value: RouteResult;
  result: Promise<IteratorResult<any>>;
  promise: RoutePromise;
  expires: number;
}

export const IgnoreResult = new Promise(() => {});

export class RoutePromise<Value = any> extends Promise<Value> {
  abort: (clean?: boolean) => void;
  resolve: (value: Value) => void;
  reject: (value: Value) => void;
  signal: AbortSignal;
  constructor(route: RouteRecord) {
    let _resolve: (value: Value) => void;
    let _reject: (value: Value) => void;
    super((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    this.resolve = _resolve;
    this.reject = _reject;
    const controller = new AbortController();
    this.abort = (clean = !route.config.cache) => clean && controller.abort();
    this.signal = controller.signal;
  }
}

export class Router {
  private routes: Record<string, RouteRecord> = {};
  private current: RouteCycle;
  cache: Record<string, RouteCycle>;
  promises: Set<RoutePromise>;
  disabled: boolean;
  constructor(router?: Router) {
    this.promises = new Set(router?.promises);
    this.cache = { ...router?.cache };
  }

  on<P extends string>(
    path: P,
    callback: RouteCallback<GetParams<P>>,
    config: RouteConfig = {}
  ) {
    const { routes } = this;
    routes[path] = routes[path] || {
      path,
      callback,
      config,
      match: createMatch(path),
    };
    routes[path].callback = callback;
  }

  map<Value = any>(
    path: string,
    callback: (
      data: { done: boolean; value: Value },
      info: { path: string; layer: boolean }
    ) => any
  ): RoutePromise<any> | undefined {
    if (this.disabled) return;
    const result = this.match(path);

    if (result) {
      const { params, route } = result;

      const timeStamp = Date.now();

      const id = result.path + ":" + JSON.stringify(params);

      if (this.cache[id] && this.cache[id].expires < timeStamp) {
        delete this.cache[id];
      }

      const cycle = this.cache[id] || this.createCycle(params, route);

      if (route.config.cache) this.cache[id] = cycle;

      this.current = cycle;

      this.mapCycle(cycle, (data) =>
        callback(data, { path: result.path, layer: route.config.layer })
      );

      this.promises.add(cycle.promise);

      return cycle.promise;
    }
  }

  remove() {
    this.promises.forEach((promise) => promise.abort(true));
  }

  private match(path: string): RouteMatch {
    const { routes } = this;
    for (const prop in routes) {
      const route = routes[prop];
      const params = route.match(path);
      if (params) return { params, route: route, path: prop };
    }
  }

  private createCycle(
    params: RouteMatch["params"],
    route: RouteRecord
  ): RouteCycle {
    const routePromise = new RoutePromise(route);
    return {
      value: route.callback(params, {
        signal: routePromise.signal,
        layer: route.config.layer,
      }),
      promise: routePromise,
      result: undefined,
      expires: Date.now() + route.config.expires || Number.MAX_SAFE_INTEGER,
    };
  }

  private async mapCycle(cycle: RouteCycle, callback: (param: any) => any) {
    if (this.current !== cycle) {
      cycle.promise.abort();
      return;
    }
    try {
      if (cycle.result) {
        const resolvedResult = await cycle.result;
        if (resolvedResult.done) {
          if (this.current === cycle) {
            cycle.promise.resolve(callback(resolvedResult));
          }
          cycle.promise.abort();
          return;
        }
      }
      const result = cycle.value.next();
      cycle.result = result;
      const resolvedResult = await cycle.result;
      if (this.current === cycle) {
        if (!resolvedResult.done) callback(resolvedResult);
        return this.mapCycle(cycle, callback);
      } else {
        cycle.promise.abort();
      }
    } catch (e) {
      cycle.promise.reject(e);
    }
  }
}
