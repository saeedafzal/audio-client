import m from "mithril";
import AbstractComponent from "@/core/abstractcomponent";
import DashboardModel from "@/views/dashboardmodel";
import Item from "@/components/item";
import ItemModel from "@/components/itemmodel";
import Container from "@/core/container";
import EventBus from "@/core/eventbus";

export default class DashboardView extends AbstractComponent<DashboardModel> {

    override view() {
        return m(".dashboard", [
            m("nav", [
                m("h3", "Audio Client"),
                m("button.primary", {
                    onclick: () => this.model.loadMusicDirectory()
                }, "Load Music Directory")
            ]),
            m("ul", [
                this.model.items.map(item =>
                    m(Item, { model: new ItemModel(Container.resolve(EventBus)), ...item }))
            ]),
            m("footer", [
                m("h3", this.model.loadedAudioName),
                m("audio[controls]", { src: this.model.loadedAudioSrc })
            ])
        ]);
    }
}
