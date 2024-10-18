import { afterAll, assert, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import EventBus from "@/core/eventbus";
import DashboardModel from "@/views/dashboardmodel";

const handler = http.get("/api/directory/music", () => {
    return HttpResponse.json(["file-a.mp3", "file-b.mp3", "file-c.mp3"]);
});
const server = setupServer(handler);

let eventbus: EventBus, dashboardModel: DashboardModel;

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    eventbus = new EventBus();
    dashboardModel = new DashboardModel(eventbus);
    server.resetHandlers();
});

afterAll(() => {
    server.close();
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

test("should load music directory", () => {
    server.events.on('request:start', ({ request }) => {
        console.log('MSW intercepted:', request.method, request.url)
    })
    const spy = vi.spyOn(dashboardModel, "redraw");

    dashboardModel.init();
    dashboardModel.loadMusicDirectory();

    expect(spy).toHaveBeenCalled();
});
