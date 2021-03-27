import { c, useState, useEffect } from "atomico";
import { useRouter, getPath } from "@atomico/kit/use-router";
import { useRender } from "@atomico/kit/use-render";

const CACHE = new Map();

function routerSwitch({ transition }) {
    const [router, setRouter] = useState();
    const [request, setRequest] = useState({});
    const result = useRouter(router);

    useEffect(() => {
        if (!result) return;
        let [element, currentPath, params] = result;
        const { load, for: forId } = element;
        if (forId && !CACHE.has(forId)) {
            CACHE.set(forId, Promise.resolve({ forId }));
        }
        if (load && !CACHE.has(load)) {
            let promise;
            if (typeof load == "string") {
                promise = import(new URL(load, location));
            } else {
                promise = Promise.resolve(load(params)).then((value) => ({
                    default: value,
                }));
            }
            CACHE.set(load, promise);
        }

        let promise = CACHE.get(load || forId);
        // loading can be defined before resolving the import
        setTimeout(
            () =>
                promise &&
                setRequest({
                    loading: true,
                }),
            40
        );

        promise.then(async ({ default: view, forId }) => {
            if (currentPath != getPath()) {
                promise = null;
                return;
            }
            if (transition) {
                await transition(params);
            }
            // Check before updating the status if the path is the current one
            promise = null;
            // Check before updating the status if the path is the current one
            currentPath == getPath() &&
                setRequest({
                    view: typeof view == "function" ? view(params) : view,
                    forId,
                });
        });
        return () => (promise = null);
    }, [result]);

    useRender(
        () => (
            <section slot="view" key={getPath()}>
                {request.view}
            </section>
        ),
        [request.view]
    );

    return (
        <host shadowDom>
            <slot
                name="router-case"
                onslotchange={(ev) =>
                    setRouter(
                        [...ev.target.assignedElements()].reduce(
                            (router, element) => {
                                router[element.path] = () => element;
                                return router;
                            },
                            {}
                        )
                    )
                }
            ></slot>
            <slot name={request.forId || "view"}></slot>
            {request.loading && <slot name="loading"></slot>}
        </host>
    );
}

routerSwitch.props = {
    transition: Function,
};

export const RouterSwitch = c(routerSwitch);
