import { createMatch, Match } from "@uppercod/exp-route";

type Param<
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
  memo?: boolean;
}

export interface RouteCallback<Props = Record<string, string>> {
  (params: Props, signal: AbortSignal): RouteResult;
}

export interface RouteRecord {
  config: RouteConfig;
  callback: RouteCallback;
  match: Match<any>;
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
    this.abort = (clean = !route.config.memo) => clean && controller.abort();
    this.signal = controller.signal;
  }
}

export function createRouter() {
  const routes: Record<string, RouteRecord> = {};
  const cache: Record<string, RouteCycle> = {};
  let lastCycle: RouteCycle;
  const promises = new Set<RoutePromise>();

  function on<P extends string>(
    path: P,
    callback: RouteCallback<GetParams<P>>,
    config: RouteConfig = {}
  ) {
    routes[path] = routes[path] || {
      callback,
      config,
      match: createMatch(path),
    };
    routes[path].callback = callback;
  }

  function match(path: string): RouteMatch {
    for (const prop in routes) {
      const route = routes[prop];
      const params = route.match(path);
      if (params) return { params, route: route, path: prop };
    }
  }

  async function mapCycle(cycle: RouteCycle, callback: (param: any) => any) {
    if (lastCycle !== cycle) {
      cycle.promise.abort();
      return;
    }
    try {
      if (cycle.result) {
        const resolvedResult = await cycle.result;
        if (resolvedResult.done) {
          if (lastCycle === cycle) {
            cycle.promise.resolve(callback(resolvedResult));
          }
          cycle.promise.abort();
          return;
        }
      }
      const result = cycle.value.next();
      cycle.result = result;
      const resolvedResult = await cycle.result;
      if (lastCycle === cycle) {
        callback(resolvedResult);
        return mapCycle(cycle, callback);
      } else {
        cycle.promise.abort();
      }
    } catch (e) {
      cycle.promise.reject(e);
    }
  }

  function createCycle(
    params: RouteMatch["params"],
    route: RouteRecord
  ): RouteCycle {
    const routePromise = new RoutePromise(route);
    return {
      value: route.callback(params, routePromise.signal),
      promise: routePromise,
      result: undefined,
    };
  }

  function map<Value = any>(
    path: string,
    callback: (data: { done: boolean; value: Value }, path: string) => any
  ): RoutePromise<any> | undefined {
    const result = match(path);

    if (result) {
      const { params, route } = result;

      const cycle = cache[path] || createCycle(params, route);

      if (route.config.memo) cache[path] = cycle;

      lastCycle = cycle;

      mapCycle(cycle, (data) => callback(data, result.path));

      promises.add(cycle.promise);

      return cycle.promise;
    }
  }

  function remove() {
    promises.forEach((promise) => promise.abort(true));
  }

  return { on, map, remove };
}
