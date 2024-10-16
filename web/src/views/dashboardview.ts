import m from "mithril";
import AbstractComponent from "@/core/abstractcomponent";
import DashboardModel from "@/views/dashboardmodel";
import Item from "@/components/item";

export default class DashboardView extends AbstractComponent<DashboardModel> {

    override view() {
        return m(".dashboard", [
            m("nav", [
                m("h3", "Audio Client"),
                m("button.primary", {
                    onclick: () => this.model.loadMusicDirectory()
                }, "Load Music Directory")
            ]),
            m("ul", [ this.model.items.map(item => {
                return m(Item, item));
            }]),
            m("footer", [
                m("h3", "-"),
                m("audio[controls]")
            ])
        ]);
    }
}
