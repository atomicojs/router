import { useRender, useSlot } from "@atomico/hooks";
import { redirect, useRouter } from "@atomico/use-router";
import { c, css, useAsync, useMemo, useRef } from "atomico";
import { joinPath } from "./utils";

export const RouterSwitch = c(
  ({ base }) => {
    const ref = useRef();
    const slots = useSlot<typeof RouterCase>(ref);

    const router = useMemo(() => {
      const cache = {};
      const router = {};
      slots.forEach((slot) => {
        const path = joinPath(base, slot.path);
        router[path] = (params: any, { id }: { id: string }) => {
          cache[id] = cache[id] || slot.load(params);
          return cache[id];
        };
      });
      return router;
    }, [...slots, base]);

    const route = useRouter(router, router);
    console.log(route?.id);
    const result = useAsync(async (id: string) => route?.result, [route?.id]);

    useRender(() => result, [result]);

    return (
      <host
        shadowDom
        onclick={(event) => {
          const elements = event.composedPath() as HTMLElement[];

          const link = elements.find(
            (child) => "hasAttribute" in child && child.hasAttribute("href")
          );

          const href = link.getAttribute("href");

          if (!href) return;

          try {
            event.preventDefault();
            event.stopImmediatePropagation();

            redirect(joinPath(base, href));
          } catch {}
        }}
      >
        <slot name="header" />
        <slot name="router-case" ref={ref} />
        <slot />
        <slot name="footer" />
      </host>
    );
  },
  {
    props: {
      base: {
        type: String,
        reflect: true,
        value: "",
      },
    },
    styles: css`
      :host {
        display: contents;
      }
    `,
  }
);

export const RouterCase = c(
  ({ element, load }) => {
    load = element
      ? (props) => {
          const El = element as any;
          return <El {...props} />;
        }
      : load;
    return <host shadowDom load={load}></host>;
  },
  {
    props: {
      slot: {
        type: String,
        reflect: true,
        value: "router-case",
      },
      path: {
        type: String,
        value: "",
      },
      load: {
        type: Function,
        value: (params: Params): any => undefined,
      },
      element: {
        type: HTMLElement,
      },
    },
  }
);
