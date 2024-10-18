import AbstractModel from "@/core/abstractmodel";

export default class DashboardModel extends AbstractModel {

    items: PlaylistItem[] = [];
    loadedAudioName = "-";
    loadedAudioSrc = "#";

    override init() {
        this.eventbus.subscribe("audio.load", this._audioLoadCallback, this);
    }

    async loadMusicDirectory(): Promise<void> {
        console.debug("Loading music directory.");

        try {
            const res = await fetch("/api/directory/music");
            console.debug(res.ok);
            if (!res.ok) {
                throw Error("Could not load music directory.");
            }

            const json: string[] = await res.json();
            console.debug(json);
            this.redraw(async () => {
                this.items = await json.map(path => {
                    return { path, title: this._getFilename(path), duration: "-" };
                });
            });
        } catch (e: unknown) {
            console.error(`Error getting music directory: ${e}`);
        }
    }

    private _getFilename(path: string): string {
        return path.split("/").pop()!;
    }

    private _audioLoadCallback(path: string, filename: string): void {
        this.loadedAudioName = filename;
        this.loadedAudioSrc = `/api/directory/file?path=${path}`;
    }
}
