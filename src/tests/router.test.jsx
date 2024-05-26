import { asyncEventListener, fixture } from "atomico/test-dom";
import { describe, it, expect } from "vitest";
import { RouterCase, RouterSwitch } from "../";

describe("my test", () => {
    it("test match case", async () => {
        const ref = {};

        const node = fixture(
            <RouterSwitch>
                <RouterCase path="/" load={() => <h1>welcome</h1>}></RouterCase>
            </RouterSwitch>
        );

        await node.updated;

        await asyncEventListener(node, "Render");

        expect(node.textContent).toEqual("welcome");
    });
});
