import {
  Host,
  c,
  css,
  render,
  useRef,
  useMemo,
  useHost,
  useLayoutEffect,
  useContext,
  useProp,
  useState,
  useEffect,
} from "atomico";
import { useRedirect, getPath } from "@atomico/hooks/use-router";
import { useSlot } from "@atomico/hooks/use-slot";
import { RouterCase } from "./router-case";
import { Router } from "./core";
import { createContext } from "atomico";
import { useListener } from "@atomico/hooks";

type Case = InstanceType<typeof RouterCase>;

const RouterProvider = createContext<{ value: string }>({ value: "" });

function routerSwitch(): Host<{ onMatch: Event }> {
  const host = useHost();
  const refRouterCase = useRef();
  const refCurrentRouter = useRef<Router>();
  const refGlobalThis = useRef(globalThis);
  const [currentPath, setCurrentPath] = useState("");
  const { value: parentPath } = useContext(RouterProvider);
  const [path, setPath] = useState(getPath);
  const [renderId] = useState(() => Symbol());

  const slotRouterCase = useSlot<Case>(refRouterCase);

  const router = useMemo(() => {
    const router = new Router(refCurrentRouter.current);
    refCurrentRouter.current = router;
    const scopeParentPath = parentPath
      .replace(/\/({|\[)(\.){3}.+(]|})$/, "")
      .replace(
        /({|\[)([\w\.]+)(]|})/,
        (all, before, key, after) =>
          `${before}parent${key[0].toUpperCase() + key.slice(1)}${after}`
      );
    slotRouterCase.map((routeCase) => {
      router.on(
        `${scopeParentPath}${
          scopeParentPath && routeCase.path === "/" ? "" : routeCase.path
        }`,
        routeCase.load,
        routeCase
      );
    });

    return router;
  }, [...slotRouterCase, parentPath]);

  useRedirect(host, {
    composed: true,
    proxy(href) {
      const currentEvent = event as Event;
      currentEvent.stopPropagation();
      return href;
    },
  });

  useListener(refGlobalThis, "popstate", () => setPath(getPath()));

  useLayoutEffect(() => {
    const routePromise = router.map(path, ({ value }, id) => {
      setCurrentPath(id);
      render(<host>{value}</host>, host.current, renderId);
    });
    return () => routePromise?.abort();
  }, [router, path]);

  const context = useMemo(
    () => ({
      value: currentPath,
    }),
    [currentPath]
  );

  useEffect(() => () => refCurrentRouter.current.remove(), []);

  return (
    <host shadowDom $parentPath={parentPath}>
      <slot name="router-case" ref={refRouterCase}></slot>
      <RouterProvider value={context}>
        <slot></slot>
      </RouterProvider>
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

routerSwitch.styles = css`
  :host,
  ::slotted([slot="view"]) {
    display: contents;
  }
`;

export const RouterSwitch = c(routerSwitch);

customElements.define("router-switch", RouterSwitch);
customElements.define("router-switch-provider", RouterProvider);
