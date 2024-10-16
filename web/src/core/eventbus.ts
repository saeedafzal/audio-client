type Callback = (...args: any[]) => void;
type Subscription = { callback: Callback, context: unknown };

export default class EventBus {

    private readonly _subscriptions: Record<string, Subscription[]> = {};

    subscribe(event: string, callback: Callback, context: unknown): void {
        this._subscriptions[event] = this._subscriptions[event] || [];
        this._subscriptions[event].push({ callback, context });
        console.debug(`[EventBus] New subscription: event=${event} total=${this._subscriptions[event].length}`);
    }

    publish(event: string, ...args: any[]): void {
        if (!this._subscriptions[event] || this._subscriptions[event].length === 0) {
            console.debug(`[EventBus] No subscriptions to publish to: event=${event}`);
            return;
        }

        this._subscriptions[event].forEach(({ callback, context }) => {
            callback.call(context, ...args);
        });

        console.debug(`[EventBus] Published event: event=${event} subscribers=${this._subscriptions[event].length}`);
    }
}
