import { beforeEach, expect, test, vi } from "vitest";
import EventBus from "@/core/eventbus";
import ItemModel from "@/components/itemmodel";

let eventbus: EventBus, itemModel: ItemModel;

beforeEach(() => {
    eventbus = new EventBus();
    itemModel = new ItemModel(eventbus);
});

test("subscribes to audio.load event on init", () => {
    const spy = vi.spyOn(eventbus, "subscribe");
    itemModel.init();

    expect(itemModel.classname).toBe("");
    expect(spy).toBeCalledWith("audio.load", expect.any(Function), expect.anything());
});

test("loadAudio", () => {
    const spy = vi.spyOn(eventbus, "publish");

    itemModel.init();
    itemModel.loadAudio("path", "filename");

    expect(spy).toBeCalledWith("audio.load", "path", "filename");
    expect(itemModel.classname).toBe("active");
});
