import { beforeEach, expect, test, vi } from "vitest";
import EventBus from "@/core/eventbus";

let eventbus: EventBus;

beforeEach(() => {
    eventbus = new EventBus();
});

test("event is published to single subscriber", () => {
    const callback = vi.fn();
    eventbus.subscribe("test.event", callback, this);
    eventbus.publish("test.event");
    expect(callback).toHaveBeenCalled();
});

test("event is not published to subscriber for different event", () => {
    const callback = vi.fn();
    eventbus.subscribe("test.event", callback, this);
    eventbus.publish("test.event.different");
    expect(callback).not.toHaveBeenCalled();
});

test("event is published to subscriber with args", () => {
    const callback = vi.fn();
    eventbus.subscribe("test.event", callback, this);
    eventbus.publish("test.event", "123", 123, true);
    expect(callback).toHaveBeenCalledWith("123", 123, true);
});

test("event is published to multiple subscribers", () => {
    const callbackOne = vi.fn();
    const callbackTwo = vi.fn();
    eventbus.subscribe("test.event", callbackOne, this);
    eventbus.subscribe("test.event", callbackTwo, this);

    eventbus.publish("test.event");

    expect(callbackOne).toHaveBeenCalled();
    expect(callbackTwo).toHaveBeenCalled();
});

test("event is published to multiple subscribers with args", () => {
    const callbackOne = vi.fn();
    const callbackTwo = vi.fn();
    eventbus.subscribe("test.event", callbackOne, this);
    eventbus.subscribe("test.event", callbackTwo, this);

    eventbus.publish("test.event", "123", 123, true);

    expect(callbackOne).toHaveBeenCalledWith("123", 123, true);
    expect(callbackTwo).toHaveBeenCalledWith("123", 123, true);
});

test("event is published to only those who subscribed", () => {
    const callbackOne = vi.fn();
    const callbackTwo = vi.fn();
    eventbus.subscribe("test.event", callbackOne, this);
    eventbus.subscribe("test.event.two", callbackTwo, this);

    eventbus.publish("test.event");
    expect(callbackOne).toHaveBeenCalled();
    expect(callbackTwo).not.toHaveBeenCalled();

    vi.clearAllMocks();

    eventbus.publish("test.event.two");
    expect(callbackOne).not.toHaveBeenCalled();
    expect(callbackTwo).toHaveBeenCalled();
});

test("event is not published when unsubscribed", () => {
    const callback = vi.fn();

    eventbus.subscribe("test.event", callback, this);
    eventbus.unsubscribe(this);
    eventbus.publish("test.event");
    
    expect(callback).not.toHaveBeenCalled();
});
