import { useRouter, redirect } from '@atomico/kit/use-router';
export { redirect } from '@atomico/kit/use-router';
import { jsx } from 'atomico/jsx-runtime';
import { c, useState, useEffect } from 'atomico';
import { useRender } from '@atomico/kit/use-render';

function routerCase() {
    return jsx('host', { shadowDom: true,});
}

routerCase.props = {
    slot: { type: String, reflect: true, value: "router-case" },
    path: { type: String, path: "/" },
    load: null,
};

const RouterCase = c(routerCase);

const CACHE = new Map();

function routerSwitch() {
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
                promise = load(params);
                if (!(promise instanceof Promise)) {
                    promise = Promise.resolve({ default: promise });
                }
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
        promise.then(({ default: view }) => {
            // prevent loading state
            promise = null;
            setRequest({
                view: typeof view == "function" ? view(params) : view,
            });
        });
        return () => (element = null);
    }, [result]);

    useRender(() => jsx('slot', null, request.view), [request.view]);

    return (
        jsx('host', { shadowDom: true,}
            , jsx('slot', {
                name: "router-case",
                onslotchange: (ev) =>
                    setRouter(
                        [...ev.target.assignedElements()].reduce(
                            (router, element) => {
                                router[element.path] = () => element;
                                return router;
                            },
                            {}
                        )
                    )
                ,}
            )
            , jsx('slot', null)
            , request.loading && jsx('slot', { name: "loading",})
        )
    );
}

const RouterSwitch = c(routerSwitch);

function routerRedirect() {
    return (
        jsx('host', {
            onclick: (ev) => {
                let { target } = ev;
                do {
                    if (target.hasAttribute("href")) {
                        ev.preventDefault();
                        redirect(target.getAttribute("href"));
                        break;
                    }
                } while ((target = target.parentNode));
            },}
        )
    );
}

const RouterRedirect = c(routerRedirect);

customElements.define("router-redirect", RouterRedirect);
customElements.define("router-switch", RouterSwitch);
customElements.define("router-case", RouterCase);
