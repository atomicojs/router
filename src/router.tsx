import { useSlot } from "@atomico/hooks";
import { redirect, useRouter } from "@atomico/use-router";
import {
    c,
    css,
    render,
    useAsync,
    useEffect,
    useMemo,
    useRef,
    useHost,
    useEvent,
    Host
} from "atomico";
import { joinPath } from "./utils";

export const RouterSwitch = c(
    ({ base }): Host<{ onRender: Event }> => {
        const host = useHost();
        const ref = useRef();
        const slots = useSlot<typeof RouterCase>(ref);
        const dispatch = useEvent("Render");

        const router = useMemo(() => {
            const cache = {};
            const router = {};
            slots
                .sort((slot) => (slot.default ? 0 : -1))
                .forEach((slot) => {
                    const path = slot.default
                        ? "/[...any]"
                        : joinPath(base, slot.path);
                    router[path] = (params: any, { id }: { id: string }) => {
                        cache[id] = cache[id] || slot.load(params);
                        return [cache[id], slot];
                    };
                });
            return router;
        }, [...slots, base]);

        const route = useRouter<[any, InstanceType<typeof RouterCase>]>(
            router,
            router
        );

        const result = useAsync(
            async (result) => {
                if (!result) return;
                const [promise] = result;
                return promise;
            },
            [route?.result]
        );

        // useRender(() => result, [result]);
        useEffect(() => {
            if (!result) return;
            const [, slot] = route.result;
            render(
                <host>{result}</host>,
                host.current,
                slot.stream ? route?.id : "router"
            );
            dispatch();
        }, [result]);

        return (
            <host
                shadowDom
                onclick={(event) => {
                    const elements = event.composedPath() as HTMLElement[];

                    const link = elements.find(
                        (child) =>
                            "hasAttribute" in child &&
                            child.hasAttribute("href")
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
                <slot name="router-case" ref={ref} />
                <slot />
            </host>
        );
    },
    {
        props: {
            base: {
                type: String,
                reflect: true,
                value: ""
            }
        },
        styles: css`
            :host {
                display: contents;
            }
        `
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
                value: "router-case"
            },
            path: {
                type: String,
                value: ""
            },
            load: {
                type: Function,
                value: (params: Record<string, string>): any => undefined
            },
            element: {
                type: HTMLElement
            },
            default: Boolean,
            stream: Boolean
        }
    }
);
