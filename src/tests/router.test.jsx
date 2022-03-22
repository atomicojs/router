import { fixture, asyncEventListener } from "atomico/test-dom";
import { RouterSwitch, RouterCase } from "../router";
import { expect } from "@esm-bundle/chai";

describe("my test", () => {
  it("test match case", async () => {
    const ref = {};

    const node = fixture(
      <RouterSwitch>
        <RouterCase ref={ref} path="/" for="home"></RouterCase>
        <h1 for="home">home</h1>
      </RouterSwitch>
    );

    const event = await asyncEventListener(node, "match");

    expect(event.target.case).to.equal(ref.current);
  });
});
