import m from "mithril";
import EventBus from "./eventbus";

export default abstract class AbstractModel {

    private readonly _eventbus?: EventBus;

    constructor(eventbus?: EventBus) {
        this._eventbus = eventbus;
    }

    /**
     * Runs when component this model is attached to is loaded.
     */
    init(): void {
        // noop
    }

    /**
     * Runs when component this model is attached to is destroyed.
     */
    teardown(): void {
        this.eventbus?.unsubscribe(this);
    }

    protected redraw(callback: () => void): void {
        callback();
        m.redraw();
    }

    protected get eventbus(): EventBus {
        if (!this._eventbus) {
            throw Error("No eventbus supplied for this model.");
        }
        return this._eventbus;
    }
}
