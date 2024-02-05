import { Type, c } from "atomico";
import { RouteCallback } from "./core";
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
  load: {
    type: Function as Type<RouteCallback>,
  },
  cache: Boolean,
  layer: Boolean,
  expires: Number,
  href: String,
  element: null as Type<string | HTMLElement>,
};

export const RouterCase = c(routerCase);

customElements.define("router-case", RouterCase);
