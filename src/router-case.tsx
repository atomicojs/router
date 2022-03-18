import { c } from "atomico";

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
    type: Function,
  },
};

export const RouterCase = c(routerCase);

customElements.define("router-case", RouterCase);
