import { assert, beforeEach, expect, test, vi } from "vitest";
import EventBus from "@/core/eventbus";
import DashboardModel from "@/views/dashboardmodel";

let eventbus: EventBus, dashboardModel: DashboardModel;

beforeEach(() => {
    eventbus = new EventBus();
    dashboardModel = new DashboardModel(eventbus);
});

test("init should subscribe to audio.load event", () => {
    const spy = vi.spyOn(eventbus, "subscribe");
    dashboardModel.init();

    assert.isEmpty(dashboardModel.items);
    expect(dashboardModel.loadedAudioName).toBe("-");
    expect(dashboardModel.loadedAudioSrc).toBe("#");
    expect(spy).toHaveBeenCalledWith("audio.load", expect.any(Function), expect.anything());
});

test("should update audio name and source on audio.load event", () => {
    dashboardModel.init();
    eventbus.publish("audio.load", "path", "filename");

    expect(dashboardModel.loadedAudioName).toBe("filename");
    expect(dashboardModel.loadedAudioSrc).toBe("/api/directory/file?path=path");
});

test("should load music directory", async () => {
    const data = { ok: true, json: () => Promise.resolve(["/home/file-a.mp3", "/home/file-b.mp3"]) };
    global.fetch = vi.fn().mockResolvedValueOnce(data);

    expect(dashboardModel.items.length).toBe(0);

    dashboardModel.init();
    await vi.waitFor(() => dashboardModel.loadMusicDirectory());

    expect(dashboardModel.items).toStrictEqual([
        {
            path: "/home/file-a.mp3",
            title: "file-a.mp3",
            duration: "-"
        },
        {
            path: "/home/file-b.mp3",
            title: "file-b.mp3",
            duration: "-"
        }
    ]);
});
