import { c, Type, createType } from "atomico";

function routerCase() {
  return <host shadowDom></host>;
}

routerCase.props = {
  slot: {
    type: String,
    value: "router-case",
    reflect: true,
  },
  path: {
    type: String,
    reflect: true,
  },
  for: {
    type: String,
    reflect: true,
  },
  load: {
    type: Function as Type<
      (props: { [param: string]: string }, signal: AbortSignal) => any
    >,
  },
  cache: Boolean,
  expires: Number,
  href: String,
  element: null as Type<string | HTMLElement>,
  destroy: Boolean,
};

export const RouterCase = c(routerCase);

customElements.define("router-case", RouterCase);
