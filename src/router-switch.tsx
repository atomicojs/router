import {
  Host,
  c,
  render,
  useRef,
  useMemo,
  useHost,
  useState,
  useLayoutEffect,
} from "atomico";
import { useRouter, useRedirect, getPath } from "@atomico/hooks/use-router";
import { useSlot } from "@atomico/hooks/use-slot";
import { RouterCase } from "./router-case";
import { consumer } from "@uppercod/consume-generator";

type Case = InstanceType<typeof RouterCase>;

function routerSwitch(): Host<{ onMatch: Event }> {
  const host = useHost();
  const refRouterCase = useRef();
  const [views] = useState<{ [view: string]: Case }>(Object);
  const [cache] = useState<{ [path: string]: Promise<any> }>(Object);

  const slotRouterCase = useSlot<Case>(refRouterCase);

  const router = useMemo(
    () =>
      slotRouterCase.reduce<{
        [path: string]: () => Case;
      }>(
        (router, routerCase) =>
          routerCase.path
            ? {
                ...router,
                [routerCase.path]: () => routerCase,
              }
            : router,
        {}
      ),
    slotRouterCase
  );

  const [currentCase, , params] = useRouter<Case>(router);

  const currentPath = getPath();

  views[currentPath] = currentCase;

  useRedirect(host, { composed: true });

  useLayoutEffect(() => {
    if (!currentCase) return;
    let cancel: boolean;
    let { load, memo, href, element, destroy } = currentCase;

    if (href) {
      location.href = href;
    }

    if (element && !load) {
      let El = element as any;
      load = async () => <El {...params}></El>;
    }

    const loadRender = (view: any) =>
      !cancel &&
      render(
        <host>
          <div slot={currentPath} class="router-view" key={currentPath}>
            {view}
          </div>
        </host>,
        host.current,
        currentPath
      );

    if (load) {
      const getLoad = (): Promise<any> => {
        let lastView: any;
        return consumer(load, params, {
          set(view) {
            loadRender((lastView = view));
            return params;
          },
          get() {
            return params;
          },
        }).then(() => lastView);
      };

      if (memo) {
        if (currentPath in cache) {
          cache[currentPath].then(loadRender);
        } else {
          cache[currentPath] = getLoad();
          cache[currentPath].then(loadRender);
        }
      } else {
        getLoad().then(loadRender);
      }
    }
    return () => {
      destroy && loadRender(null);
      cancel = true;
    };
  }, [currentPath, currentCase]);

  return (
    <host shadowDom case={currentCase}>
      <slot key="router-case" name="router-case" ref={refRouterCase}></slot>
      <slot key="router-content"></slot>
      <slot
        name={(views[currentPath] && views[currentPath]?.for) || currentPath}
      ></slot>
    </host>
  );
}

routerSwitch.props = {
  case: {
    type: HTMLElement,
    event: {
      type: "Match",
    },
  },
};

export const RouterSwitch = c(routerSwitch);

customElements.define("router-switch", RouterSwitch);
