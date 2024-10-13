import m, { ClassComponent } from "mithril";

// Icons
import magnifyingGlass from "@/assets/magnifying-glass.svg?raw";
import speakerWave from "@/assets/speaker-wave.svg?raw";
import backward from "@/assets/backward.svg?raw";
import play from "@/assets/play.svg?raw";
import forward from "@/assets/forward.svg?raw";

export default class DashboardView implements ClassComponent {

    /**
     * @override
     */
    view() {
        return m(".root", [
            // Top bar
            m("nav", [
                m(".left", [
                    m("h3", "Audio Client"),
                    m(".search", [
                        m.trust(magnifyingGlass),
                        m("input[placeholder=Search media...]")
                    ])
                ]),
                m("div", [
                    m("button", "Load Music Directory")
                ])
            ]),

            // Sidebar and playlist
            m("main", [
                m("aside", [
                    m("h3.active", "Feed"),
                    m("h3", "Playlists"),
                    m("h3", "Podcasts")
                ]),
                m(".playlist", [
                    m(".active", "Item 2"),
                    m("div", "Item 3")
                ])
            ]),

            // Player
            m("footer", [
                // Currently selected media
                m(".art", [
                    m("img[alt=Title]", {
                        height: "50",
                        width: "50"
                    }),
                    m("div", [
                        m("strong", "Title"),
                        m("small", "Artist")
                    ])
                ]),

                // Controls
                m(".controls", [
                    m("button.icon", m.trust(backward)),
                    m("button.icon.play", m.trust(play)),
                    m("button.icon", m.trust(forward)),

                    // Seek
                    m("input[type=range][min=0][max=100][value=0]")
                ]),
                
                // Audio
                m(".audio", [
                    m("button.icon", m.trust(speakerWave)),
                    m("input[type=range][min=0][max=100][value=100]")
                ])

                // TODO: Extra buttons (shuffle, loop etc)
            ])
        ]);
    }
}
