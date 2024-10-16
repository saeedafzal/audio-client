import AbstractModel from "@/core/abstractmodel";

export default class ItemModel extends AbstractModel {

    loadAudio(path: string, filename: string): void {
        this.eventbus.publish("audio.load", path, filename);
    }
}
