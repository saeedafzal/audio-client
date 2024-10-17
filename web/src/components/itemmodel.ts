import AbstractModel from "@/core/abstractmodel";

export default class ItemModel extends AbstractModel {

    classname = "";

    override init() {
        this.eventbus.subscribe("audio.load", (_, __) => this.classname = "", this);
    }

    loadAudio(path: string, filename: string): void {
        this.eventbus.publish("audio.load", path, filename);
        this.classname = "active";
    }
}
