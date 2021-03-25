import { c } from "atomico";
import { redirect } from "@atomico/kit/use-router";

function routerRedirect() {
    return (
        <host
            onclick={
                /**
                 * @param {MouseEvent} ev
                 */
                (ev) => {
                    let { target } = ev;
                    do {
                        if (target.hasAttribute("href")) {
                            ev.preventDefault();
                            redirect(target.getAttribute("href"));
                            break;
                        }
                    } while ((target = target.parentNode));
                }
            }
        ></host>
    );
}

export const RouterRedirect = c(routerRedirect);
