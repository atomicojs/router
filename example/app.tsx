import { render } from "atomico";
import { RouterSwitch, RouterCase } from "../src/router";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

render(
  <host>
    <RouterSwitch>
      <header class="header">
        <a href="/">home</a>
        <a href="/user">user</a>
        <a href="/edit">edit</a>
        <a href="/config">config</a>
      </header>
      <RouterCase path="/" for="home"></RouterCase>
      <RouterCase
        path="/{folder}"
        load={async (params) => {
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
      {/* <div class="view" slot="loading">
        <h1>loading...</h1>
      </div> */}
    </RouterSwitch>
  </host>,
  document.body
);
