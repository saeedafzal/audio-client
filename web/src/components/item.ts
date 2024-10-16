import m, { Vnode } from "mithril";
import AbstractComponent from "@/core/abstractcomponent";
import ItemModel from "./itemmodel";

interface ItemAttrs {
    path: string;
    title: string;
    duration: string;
}

export default class Item extends AbstractComponent<ItemModel, ItemAttrs> {

    override view({ attrs }: Vnode<ItemAttrs>) {
        return m("li", {
            onclick: () => this.model.loadAudio(attrs.path, attrs.title)
        }, [
            m("strong", attrs.title),
            m("small", attrs.duration)
        ]);
    }
}
