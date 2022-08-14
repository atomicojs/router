import { fixture, asyncEventListener } from "atomico/test-dom";
import { RouterSwitch, RouterCase } from "../router";
import { expect, describe, it } from "vitest";

describe("my test", () => {
  it("test match case", async () => {
    const ref = {};

    const node = fixture(
      <RouterSwitch>
        <RouterCase ref={ref} path="/" for="home"></RouterCase>
        <h1 for="home">home</h1>
      </RouterSwitch>
    );

    const event = await asyncEventListener(node, "Match");

    expect(event.target.case).toEqual(ref.current);
  });
});
