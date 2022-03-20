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

type Case = InstanceType<typeof RouterCase>;

function routerSwitch() {
  const host = useHost();

  const refRouterCase = useRef();

  const [inTransition, setInTransition] = useProp<boolean>("inTransition");
  const [loading, setLoading] = useProp<string>("loading");
  const [views] = useState<{ [view: string]: Case }>({});
  const [memos] = useState<{ [path: string]: Promise<any> }>();

  const slotRouterCase = useSlot<Case>(refRouterCase);

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

  const [currentCase, , params] = useRouter<Case>(router);

  const currentPath = getPath();

  const history = useHistory(currentPath, 2);

  views[currentPath] = currentCase;

  useRedirect(host);

  useLayoutEffect(() => {
    if (!currentCase) return;
    const { load, memo } = currentCase;
    if (load) {
      Promise.resolve(load(params as any)).then((view) => {
        setLoading(null);
        render(
          <host>
            <div slot={currentPath} class="router-view" key={currentPath}>
              {view}
            </div>
          </host>,
          host.current,
          currentPath
        );
      });

      setLoading(currentPath);
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
          ref={(node) => {
            const set = () => {
              const { length } = history;
              node.part.value = loading
                ? length - 2 !== i
                  ? "wait"
                  : "in"
                : length - 1 === i
                ? "in"
                : length - 2 === i && inTransition
                ? "out"
                : "wait";
            };
            history.length > 1 ? requestAnimationFrame(set) : set();
          }}
          ontransitionend={({ currentTarget }) => {
            if (currentTarget.part.value === "out") setInTransition(false);
          }}
        >
          <slot name={(views[id] && views[id]?.for) || id}></slot>
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
  loading: {
    type: String,
    reflect: true,
    event: {
      type: "loading",
    },
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
  [part="wait"] {
    transition: var(--router-transition-wait, 0s);
    opacity: var(--router-opacity-wait, 0);
    transform: var(--router-transform-wait);
  }
  [part="in"] {
    position: relative;
    z-index: 1;
    transition: var(--router-transition-in, 0s);
    opacity: var(--router-opacity-in, 1);
    transform: var(--router-transform-in);
  }
  [part="out"] {
    transition: var(--router-transition-out, 0s);
    opacity: var(--router-opacity-out, 0);
    transform: var(--router-transform-out);
  }
`;

export const RouterSwitch = c(routerSwitch);

customElements.define("router-switch", RouterSwitch);
