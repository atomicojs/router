import {
  Props,
  c,
  css,
  render,
  useRef,
  useMemo,
  useHost,
  useState,
  useProp,
  useLayoutEffect,
} from "atomico";
import { useRouter, useRedirect, getPath } from "@atomico/hooks/use-router";
import { useSlot } from "@atomico/hooks/use-slot";
import { RouterCase } from "./router-case";

function useHistory<T>(value: T, maxLength = 100) {
  const [state] = useState<{ history: T[] }>(() => ({ history: [] }));
  if (state.history.at(-1) !== value) {
    state.history = [...state.history, value].slice(maxLength * -1);
  }
  return state.history;
}

function routerSwitch(props: Props<typeof routerSwitch>) {
  const host = useHost();

  const refRouterCase = useRef();

  const [transition, setTransition] = useState<string>();
  const [inTransition, setInTransition] = useProp<boolean>("inTransition");
  const [loading, setLoading] = useProp<boolean>("loading");
  const [views] = useState(Object);

  const slotRouterCase =
    useSlot<InstanceType<typeof RouterCase>>(refRouterCase);

  const router = useMemo(
    () =>
      slotRouterCase.reduce(
        (router, routerCase) => ({
          ...router,
          [routerCase.path]: () => routerCase,
        }),
        {}
      ),
    slotRouterCase
  );

  const [currentCase, , params] =
    useRouter<InstanceType<typeof RouterCase>>(router);

  const currentPath = getPath();
  const history = useHistory(currentPath, 2);

  views[currentPath] = currentCase;

  useRedirect(host);

  useLayoutEffect(() => {
    if (!currentCase) return;
    const { load } = currentCase;
    if (load) {
      Promise.resolve(load(params as any)).then((view) => {
        const currentView = history.at(-1);
        setLoading(false);
        render(
          <host>
            <div slot={currentView} class="router-view" key={currentView}>
              {view}
            </div>
          </host>,
          host.current,
          currentView
        );
      });
      setLoading(true);
    }
    if (history.length > 1) setInTransition(true);
  }, [currentPath, currentCase]);

  return (
    <host shadowDom>
      <slot key="router-case" name="router-case" ref={refRouterCase}></slot>
      <slot key="router-content"></slot>
      {history.map((id, i) => (
        <section
          key={id}
          part="view"
          ref={(node) => {
            const set = () => {
              node.className =
                history.length - 1 === i
                  ? "router-in"
                  : history.length - 2 === i && inTransition
                  ? "router-out"
                  : "router-wait";
            };
            history.length > 1 ? requestAnimationFrame(set) : set();
          }}
          ontransitionend={({ currentTarget }) => {
            if (currentTarget.className === "router-out") {
              setInTransition(false);
            }
          }}
        >
          <slot name={(views[id] && views[id]?.for) || id}></slot>
        </section>
      ))}
      {/* <section
        part="loading"
        ref={(node) => {
          const set = () => {
            node.className = loading ? "router-loading" : "";
          };
          transition ? requestAnimationFrame(set) : set();
        }}
      >
        <slot name="loading"></slot>
      </section> */}
    </host>
  );
}

routerSwitch.props = {
  inTransition: {
    type: Boolean,
    reflect: true,
  },
  loading: {
    type: Boolean,
    reflect: true,
  },
};

routerSwitch.styles = css`
  :host([in-transition]) {
    overflow: hidden;
  }
  section {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  [part="view"] {
    transition: var(--router-transition-wait, 0s);
    opacity: var(--router-opacity-wait, 0);
    transform: var(--router-transform-wait);
  }
  [part="loading"] {
    transition: var(--router-transition-loading-wait, 0s);
    opacity: var(--router-opacity-loading-wait, 0);
    transform: var(--router-transform-loading-wait);
  }
  .router-in {
    position: relative;
    z-index: 1;
    transition: var(--router-transition-in, 0s);
    opacity: var(--router-opacity-in, 1);
    transform: var(--router-transform-in);
  }
  .router-out {
    transition: var(--router-transition-out, 0s);
    opacity: var(--router-opacity-out, 0);
    transform: var(--router-transform-out);
  }
  .router-loading {
    z-index: 2;
    transition: var(--router-transition-loading-in, 0s);
    opacity: var(--router-opacity-loading-in, 1);
    transform: var(--router-transform-loading-in);
  }
`;

export const RouterSwitch = c(routerSwitch);

customElements.define("router-switch", RouterSwitch);
