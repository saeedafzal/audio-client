import m from "mithril";
import AbstractComponent from "@/core/abstractcomponent";
import Item from "@/components/item";

export default class DashboardView extends AbstractComponent {

    override view() {
        return m(".dashboard", [
            // Top bar
            m("nav", [
                m("h3", "Audio Client"),
                m("button.primary", "Load Music Directory")
            ]),
            m("main", [
                m(Item, { title: "Title", duration: "duration" }),
                m(Item, { title: "Title", duration: "duration" }),
                m(Item, { title: "Title", duration: "duration" }),
                m(Item, { title: "Title", duration: "duration" }),
                m(Item, { title: "Title", duration: "duration" })
            ]),
            m("footer", [
                m("h3", "-"),
                m("audio[controls]")
            ])
        ]);
    }
}
