export default class Container {

    private static readonly _services: Map<any, any> = new Map();

    static register<T>(service: T, type: any): void {
        this._services.set(type, service);
    }

    static resolve<T>(type: any): T {
        return this._services.get(type);
    }
}
