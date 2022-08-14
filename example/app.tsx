import { c, render } from "atomico";
import { RouterSwitch, RouterCase } from "../src/router";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Example = c(() => <host>welcome!</host>);

customElements.define("e-l", Example);

render(
  <host>
    <RouterSwitch>
      <header class="header">
        <a href="/">home</a>
        <a href="/user">user</a>
        <a href="/edit">edit</a>
        <a href="/config">config</a>
      </header>
      <RouterCase path="/" element={Example}></RouterCase>
      <RouterCase
        path="/{folder}"
        memo
        load={async function* (params) {
          yield <h1>Loading...</h1>;

          await delay(1000);

          return (
            <h1>
              welcome! ({JSON.stringify(params)}) <a href="/">to home</a>
            </h1>
          );
        }}
      ></RouterCase>
      <div class="router-view" slot="home">
        <h1>
          welcome!
          <a href="/config">[to config]</a>
          <a href="/users">[to users]</a>
          <a href="/out">[to out]</a>
        </h1>
      </div>
    </RouterSwitch>
  </host>,
  document.body
);
