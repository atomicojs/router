import { useListener } from "@atomico/hooks";
import { getPath, redirect, useRedirect } from "@atomico/hooks/use-router";
import { useSlot } from "@atomico/hooks/use-slot";
import {
  DOMListener,
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
import { joinRoute, nestRoute, baseRoute } from "./utils";

type Case = InstanceType<typeof RouterCase>;

const RouterProvider = createContext({
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
  const [childBase, setChildBase] = useState("");
  const { base: parentBase } = useContext(RouterProvider);
  const [path, setPath] = useState(getPath);
  const [renderId] = useState(() => Symbol());

  const slotRouterCase = useSlot<Case>(refRouterCase);

  const currentBase = joinRoute(parentBase, base);

  const router = useMemo(() => {
    const router = new Router(refCurrentRouter.current);
    refCurrentRouter.current = router;
    slotRouterCase.map((routeCase) => {
      router.on(
        joinRoute(currentBase + "/", "." + routeCase.path),
        routeCase.element ? loadElement(routeCase.element) : routeCase.load,
        routeCase
      );
    });

    return router;
  }, [...slotRouterCase, currentBase]);

  useListener(refGlobalThis, "popstate", () => setPath(getPath()));

  useLayoutEffect(() => {
    const routePromise = router.map(path, ({ value }, id) => {
      setChildBase(baseRoute(path, id));
      render(<host>{value}</host>, host.current, renderId);
    });
    return () => routePromise?.abort();
  }, [router, path]);

  const context = useMemo(
    () => ({
      base: childBase,
    }),
    [childBase]
  );

  useEffect(() => () => refCurrentRouter.current.remove(), []);

  const handlerRedirect: DOMListener<MouseEvent> = (event) => {
    const elements = event.composedPath() as HTMLElement[];
    let href = "";
    let base = "";
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (!href && element.hasAttribute?.("href")) {
        href = element.getAttribute("href");
      }
      if (element instanceof RouterProvider) {
        base = element.value.base;
        break;
      }
    }
    event.preventDefault();
    event.stopImmediatePropagation();

    redirect(
      href.startsWith("//")
        ? href.replace("//", "/")
        : href.startsWith(".")
        ? joinRoute(base + "/", href)
        : href === "/"
        ? currentBase
        : joinRoute(currentBase + "/", "." + href)
    );
  };

  return (
    <host shadowDom onclick={handlerRedirect}>
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
