import { expect, test } from "vitest";
import Container from "@/core/container";

test("should register object and resolve it", () => {
    class TestObject {}
    const testObject = new TestObject();

    Container.register(testObject, TestObject);
    const resolvedObject = Container.resolve(TestObject);

    expect(testObject).toBe(resolvedObject);
});
