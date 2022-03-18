import {
  Props,
  c,
  css,
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

  const [currentCase] = useRouter<InstanceType<typeof RouterCase>>(router);

  let currentView = currentCase?.for || getPath();

  if (currentCase) map.set(currentView, currentCase);

  useRedirect(host);

  useLayoutEffect(() => {
    if (!currentCase) return;

    host.before = transition;

    setTransition(currentView);
    setInTransition(true);
  }, [currentView]);

  const { before } = host;

  return (
    <host shadowDom>
      <slot name="router-case" ref={refRouterCase}></slot>

      {Array.from(map).map(([id]) => (
        <section
          part="view"
          ref={(node) =>
            requestAnimationFrame(() => {
              node.className =
                currentView === id
                  ? "router-in"
                  : before === id && inTransition
                  ? "router-out"
                  : "router-wait";
            })
          }
          ontransitionend={(event) =>
            currentView === id && setInTransition(false)
          }
        >
          <slot name={id}></slot>
        </section>
      ))}
    </host>
  );
}

routerSwitch.props = {
  inTransition: {
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
    transition: var(--router-transition-wait, 0s);
    opacity: var(--router-opacity-wait, 0);
    transform: var(--router-transform-wait);
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
`;

export const RouterSwitch = c(routerSwitch);

customElements.define("router-switch", RouterSwitch);
