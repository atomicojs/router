import { fixture, asyncEventListener } from "atomico/test-dom";
import { RouterSwitch, RouterCase } from "../router";
import { expect, describe, it } from "vitest";

describe("my test", () => {
  it("test match case", async () => {
    const ref = {};

    const node = fixture(
      <RouterSwitch>
        <RouterCase path="/" load={() => <h1>welcome</h1>}></RouterCase>
      </RouterSwitch>
    );

    await node.updated;
    // const event = await asyncEventListener(node, "Match");

    // expect(event.target.case).toEqual(ref.current);
  });
});
