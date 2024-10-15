import m, { Vnode } from "mithril";
import AbstractComponent from "@/core/abstractcomponent";

interface ItemAttrs {
    title: string;
    duration: string;
}

export default class Item extends AbstractComponent<{}, ItemAttrs> {

    override view({ attrs }: Vnode<ItemAttrs>) {
        return m(".item", [
            m(".head", [
                m("strong", attrs.title),
                m("small", attrs.duration)
            ]),
            m(".foot", [
                m("button", "Play")
            ])
        ]);
    }
}
