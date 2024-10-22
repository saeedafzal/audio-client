const playlist = document.getElementById("playlist");
const downloadList = document.getElementById("download-list");
const mainContent = document.getElementById("main-content");
const audio = document.getElementById("audio");
const audioTitleLabel = document.getElementById("audio-title");
const downloadForm = document.getElementById("download-form");
const downloadBadge = document.getElementById("download-badge");
const ytDlpStatus = document.getElementById("yt-dlp-status");
const downloadModal = new bootstrap.Modal("#download-modal");

let directory;
let loadedAudio = "";
let activeElement;
let audioFeed = [];

const views = {
    feed: playlist,
    downloads: downloadList
};

const downloadQueue = [];

/**
 * Gets the list of audio files from the $HOME/Music directory.
 */
async function loadMusicDirectory() {
    const res = await fetch("/api/directory/music");
    const directoryResponse = await res.json();

    directory = directoryResponse.directory;
    playlist.innerHTML = "";
    audioFeed = [];

    directoryResponse.audioPaths.forEach(path => {
        const title = path.split("/").pop();
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "align-items-center", "gap-3");
        li.onclick = async e => await loadMusic(e, title, path);

        if (title === loadedAudio) {
            li.classList.add("active");
        }

        li.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/109/109190.png" alt="title" height="50" width="50" />
            <strong>${title}</strong>
        `;

        playlist.append(li);
        audioFeed.push({ title, li });
    });
}

/**
 * Loads the audio source into the player.
 */
async function loadMusic(e, title, path) {
    if (activeElement === e.currentTarget) {
        return;
    }

    if (activeElement) {
        activeElement.classList.remove("active");
    }

    activeElement = e.currentTarget;
    activeElement.classList.add("active");

    audioTitleLabel.innerText = title;
    const encoded = encodeURIComponent(path);
    audio.src = `/api/directory/file?path=${encoded}`;
    await audio.play();
}

/**
 * Changes the component displayed on the main panel based on
 * what is selected on the sidebar.
 */
function switchMainPanel(e, key) {
    if (e.classList.contains("active")) {
        return;
    }

    for (const child of e.parentElement.children) {
        child.classList.remove("active");
    }
    e.classList.add("active");

    for (const child of mainContent.children) {
        child.classList.add("d-none");
    }

    const view = views[key] || views.Playlist;
    view.classList.remove("d-none");
}

/**
 * Adds item to download queue.
 */
function addDownloadToQueue(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get("input-url");
    console.debug("Adding url to download queue:", url);

    downloadQueue.push(url);

    const li = document.createElement("li");
    li.classList.add("download-item", "list-group-item", "d-flex", "flex-column");
    li.innerHTML = `
        <strong>${url}</strong>
        <div class="download-status text-danger">Queued</div>
        <div class="progress mt-1">
            <div class="progress-bar" style="width: 0%;">0%</div>
        </div>
    `;
    li.onclick = () => downloadAudio(url, li);
    downloadList.append(li);

    downloadBadge.innerText = downloadQueue.length;
    downloadModal.toggle();
}

async function downloadAudio(url, li) {
    const status = li.querySelector(".download-status");

    if (status.classList.contains("text-warning-emphasis") || status.classList.contains("text-success")) {
        return;
    }

    status.classList.replace("text-danger", "text-warning-emphasis");
    status.innerText = "Downloading";

    const progressBar = li.querySelector(".progress-bar");
    progressBar.style.width = "100%";
    progressBar.classList.add("progress-bar-striped", "progress-bar-animated");
    progressBar.innerText = "";

    const res = await fetch(`/api/download?url=${url}`, { method: "POST" });
    if (res.ok && await res.text() === "true") {
        status.classList.replace("text-warning-emphasis", "text-success");
        status.innerText = "Complete";
        progressBar.classList.remove("progress-bar-striped", "progress-bar-animated");
        progressBar.innerText = "100%";
    } else {
        status.classList.replace("text-warning-emphasis", "text-danger");
        status.innerText = "Failed to download.";
    }

    progressBar.classList.remove("progress-bar-striped", "progress-bar-animated");
    progressBar.innerText = "100%";
}

async function checkForYtDlp() {
    ytDlpStatus.classList.replace("bg-danger", "bg-warning");

    const res = await fetch("/api/download/yt-dlp");
    const exists = await res.text() === "true";
    ytDlpStatus.classList.replace("bg-warning", exists ? "bg-success" : "bg-danger");

    if (exists) {
        document.getElementById("add-download-btn").disabled = false;
    }
}

function displayTracks(list) {
    playlist.innerHTML = "";
    list.forEach(e => playlist.append(e.li));
}

function search(e) {
    console.log(e);

    if (e.value === "") {
        displayTracks(audioFeed);
        return;
    }

    const filteredList = audioFeed.filter(feed => feed.title.toLowerCase().includes(e.value.toLowerCase()));
    displayTracks(filteredList);
}

/**
 * Run on start.
 */
downloadForm.onsubmit = addDownloadToQueue;
checkForYtDlp().catch(console.error);