import { fixture } from "atomico/test-dom";
import { describe, it } from "vitest";
import { RouterCase, RouterSwitch } from "../router";

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
