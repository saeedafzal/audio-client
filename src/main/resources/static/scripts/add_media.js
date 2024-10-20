const mediaDialog = id("media-dialog");
const mediaDialogForm = id("media-dialog-form");
const downloadQueue = id("download-queue");

const queue = [];

function toggleMediaDialog() {
    mediaDialog.open ? mediaDialog.close() : mediaDialog.showModal();
}

function triggerDownload(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get("media-url");
    console.debug(url);

    if (queue.includes(url)) {
        return;
    }

    queue.push(url);
    const li = document.createElement("li");
    li.innerHTML = formData.get("media-url") + " | <strong style='color: red'>QUEUED</strong>";
    li.onclick = () => triggerDownloadOfMedia(li, url);
    downloadQueue.append(li);

    toggleMediaDialog();
}

function triggerDownloadOfMedia(li, url) {
    const strong = li.children[0];
    strong.style.color = "yellow";
    strong.innerText = "DOWNLOADING";
    li.onclick = null;

    let apiUrl = `/api/download?url=${url}`;
    if (currentDirectory) {
        apiUrl = `${apiUrl}&path=${currentDirectory}`;
    }

    console.debug(`API URL to download: ${apiUrl}`);

    fetch(apiUrl, {
        method: "POST"
    }).then(res => {
        if (res.ok) {
            return res.text();
        }
    }).then(res => {
        console.log(res);
        console.log(typeof res);
        if (res === "true") {
            strong.style.color = "green";
            strong.innerText = "DONE";

            loadFromMusic();
            if (currentPlaying) {
                for (let child of playlist.children) {
                    if (child.innerText === currentPlaying) {
                        child.classList.add("active");
                        break;
                    }
                }
            }
        }
    });
}

mediaDialogForm.onsubmit = triggerDownload;
