export { redirect } from "@atomico/kit/use-router";
import { RouterCase } from "./router-case.jsx";
import { RouterSwitch } from "./router-switch.jsx";
import { RouterRedirect } from "./router-redirect.jsx";

customElements.define("router-redirect", RouterRedirect);
customElements.define("router-switch", RouterSwitch);
customElements.define("router-case", RouterCase);
