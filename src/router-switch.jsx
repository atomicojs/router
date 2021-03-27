import { c, useState, useEffect } from "atomico";
import { useRouter } from "@atomico/kit/use-router";
import { useRender } from "@atomico/kit/use-render";

const CACHE = new Map();

function routerSwitch({ transition }) {
    const [router, setRouter] = useState();
    const [request, setRequest] = useState({});
    const result = useRouter(router);

    useEffect(() => {
        if (!result) return;
        let [element, , params] = result;
        const { load } = element;

        if (!CACHE.has(load)) {
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

        let promise = CACHE.get(load);

        setTimeout(
            () =>
                promise &&
                setRequest({
                    loading: true,
                }),
            40
        );
        promise.then(async ({ default: view }) => {
            // prevent loading state
            promise = null;
            if (transition) {
                await transition(params);
            }
            setRequest({
                view: typeof view == "function" ? view(params) : view,
            });
        });
        return () => (element = null);
    }, [result]);

    useRender(() => <slot>{request.view}</slot>, [request.view]);

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
            <slot></slot>
            {request.loading && <slot name="loading"></slot>}
        </host>
    );
}

routerSwitch.props = {
    transition: Function,
};

export const RouterSwitch = c(routerSwitch);
