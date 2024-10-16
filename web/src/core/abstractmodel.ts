import m from "mithril";
import EventBus from "./eventbus";

export default abstract class AbstractModel {

    private readonly _eventbus?: EventBus;

    constructor(eventbus?: EventBus) {
        this._eventbus = eventbus;
    }

    protected get eventbus(): EventBus {
        if (!this._eventbus) {
            throw Error("No eventbus supplied for this model.");
        }
        return this._eventbus;
    }

    protected redraw(callback: () => void): void {
        callback();
        m.redraw();
    }
}
