import { render } from "atomico";
import { RouterSwitch, RouterCase } from "../src/router";

render(
  <host>
    <RouterSwitch
      transition={async (after, before) => {
        // if (after) {
        //   after.animate([{ opacity: 1 }, { opacity: 0 }], {
        //     duration: 1000,
        //   });
        // }
        // const animate = before.animate(
        //   [
        //     // fotogramas clave
        //     { opacity: "0" },
        //     { transform: "1" },
        //   ],
        //   {
        //     // opciones de sincronización
        //     duration: 1000,
        //     iterations: Infinity,
        //   }
        // );
        // return animate.finished;
      }}
    >
      <RouterCase path="/" for="home"></RouterCase>
      <RouterCase path="/config" for="config"></RouterCase>
      <div class="view" slot="home">
        <h1>
          welcome! <a href="/config">to config</a>
        </h1>
      </div>
      <div class="view" slot="config">
        <h1>
          config! <a href="/">back home</a>
        </h1>
      </div>
    </RouterSwitch>
  </host>,
  document.body
);
