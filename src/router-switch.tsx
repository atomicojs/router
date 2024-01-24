import { useListener } from "@atomico/hooks";
import { getPath, useRedirect } from "@atomico/hooks/use-router";
import { useSlot } from "@atomico/hooks/use-slot";
import {
  Props,
  c,
  createContext,
  css,
  render,
  useContext,
  useEffect,
  useHost,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "atomico";
import { Router } from "./core";
import { RouterCase } from "./router-case";
import { join, nested } from "./utils";

type Case = InstanceType<typeof RouterCase>;

const RouterProvider = createContext({
  value: "",
  base: "",
});

type Params = Record<string, string>;

const loadElement = (Element: any) =>
  async function* (props: Params) {
    return <Element {...props} />;
  };

function routerSwitch({ base }: Props<typeof routerSwitch>) {
  const host = useHost();
  const refRouterCase = useRef();
  const refCurrentRouter = useRef<Router>();
  const refGlobalThis = useRef(globalThis);
  const [currentPath, setCurrentPath] = useState("");
  const { value: parentPath, base: parentBase } = useContext(RouterProvider);
  const [path, setPath] = useState(getPath);
  const [renderId] = useState(() => Symbol());

  const slotRouterCase = useSlot<Case>(refRouterCase);

  const currentBase = join(parentBase, base);

  const router = useMemo(() => {
    const router = new Router(refCurrentRouter.current);
    refCurrentRouter.current = router;
    const scopeParentPath = join(nested(parentPath), base);
    slotRouterCase.map((routeCase) => {
      router.on(
        join(scopeParentPath, routeCase.path),
        routeCase.element ? loadElement(routeCase.element) : routeCase.load,
        routeCase
      );
    });

    return router;
  }, [...slotRouterCase, parentPath, currentBase]);

  useRedirect(host, {
    composed: true,
    proxy(nextPath) {
      return join(currentBase, nextPath);
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
      base: currentBase,
    }),
    [currentPath, currentBase]
  );

  useEffect(() => () => refCurrentRouter.current.remove(), []);

  return (
    <host shadowDom>
      <slot name="router-case" ref={refRouterCase}></slot>
      <RouterProvider value={context}>
        <slot></slot>
      </RouterProvider>
    </host>
  );
}

routerSwitch.props = {
  base: {
    type: String,
    value: "",
    reflect: true,
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
