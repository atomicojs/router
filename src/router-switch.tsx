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

function routerSwitch(props: Props<typeof routerSwitch>) {
  const host = useHost();

  const refRouterCase = useRef();

  const [transition, setTransition] = useState<string>();
  const [inTransition, setInTransition] = useProp<boolean>("inTransition");
  const [loading, setLoading] = useProp<boolean>("loading");

  const [map] = useState(() => new Map());

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

  const [currentCase, id, params] =
    useRouter<InstanceType<typeof RouterCase>>(router);

  let currentView = currentCase?.for || getPath();

  if (currentCase) map.set(currentView, currentCase);

  useRedirect(host);

  useLayoutEffect(() => {
    if (!currentCase) return;
    host.before = transition;
    const { load } = currentCase;
    if (load) {
      setLoading(true);
      Promise.resolve(load(params as any)).then((view) => {
        const currentView = getPath();
        currentCase.for = currentView;
        setLoading(false);
        render(
          <host>
            <div slot={currentView} class="router-view" key={currentView}>
              {view}
            </div>
          </host>,
          host.current,
          "router"
        );
      });
    }
    setInTransition(true);
    setTransition(currentView);
  }, [currentView, id]);

  const { before } = host;

  return (
    <host shadowDom>
      <slot name="router-case" ref={refRouterCase}></slot>

      {Array.from(map).map(([id]) => (
        <section
          part="view"
          ref={(node) => {
            const set = () => {
              node.className =
                currentView === id
                  ? "router-in"
                  : before === id && inTransition
                  ? "router-out"
                  : "router-wait";
            };
            transition ? requestAnimationFrame(set) : set();
          }}
          ontransitionend={() => currentView === id && setInTransition(false)}
        >
          <slot name={id}></slot>
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
