import AbstractModel from "@/core/abstractmodel";

export default class DashboardModel extends AbstractModel {

    items: PlaylistItem[] = [];

    loadMusicDirectory(): void {
        console.debug("Loading music directory.");
        fetch("/api/directory/music")
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw Error("Could not load music directory.");
            })
            .then((res: string[]) => {
                this.redraw(() => {
                    console.debug(res);
                    this.items = res.map(path => {
                        return { path, title: this._getFilename(path), duration: "-" };
                    });
                });
            })
            .catch(e => {
                console.error(e.message);
            });
    }

    private _getFilename(path: string): string {
        return path.split("/").pop()!;
    }
}
