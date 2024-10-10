// Helpers
const id = id => document.getElementById(id);

// Elements
const playlist = id("playlist");
const audio = id("audio");
const titleHeader = id("title-header");
const dialog = id("dialog");
const rssForm = id("rss-form");
const statusIndicator = id("status-indicator");
const statusLabel = id("status-label");
const addMediaBtn = id("add-media-btn");
const playlistLabel = id("playlist-label");

// Vars
let paths = [];
let ytDlpFound = false;

// Event handlers
function loadFromMusic() {
    fetch("api/directory/music")
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(res => {
            console.log(res);
            paths = res;
            playlistLabel.innerText = "Music";
            paths.forEach(path => {
                const name = path.split("/").pop();
                const li = document.createElement("li");
                li.onclick = () => _loadAudioFile(li, name);
                li.innerText = name;
                playlist.append(li);
            });
        });
}

function playNext() {
    const children = [...playlist.children];

    let index = children.findIndex(li => li.classList.contains("active"));
    index++;
    if (index === children.length) {
        index = 0;
    }

    children.forEach(child => child.classList.remove("active"));
    children[index].classList.add("active");

    const path = encodeURIComponent(paths[index]);
    audio.src = `${location.href}api/directory/file?path=${path}`;
    titleHeader.innerText = paths[index].split("/").pop();
    audio.play();
}

function toggleRssDialog() {
    dialog.open ? dialog.close() : dialog.showModal();
}

function submitDownloadForm(e) {
    e.preventDefault();
}

// Privates
function _loadAudioFile(li, name) {
    const children = [...li.parentNode.children];
    children.forEach(child => child.classList.remove("active"));
    li.classList.add("active");

    const index = children.indexOf(li);
    const path = encodeURIComponent(paths[index]);
    audio.src = `${location.href}api/directory/file?path=${path}`;
    titleHeader.innerText = name;
    audio.play();
}

function _checkForYtDlp() {
    ytDlpFound = false;
    addMediaBtn.disabled = true;

    fetch("api/download/yt-dlp")
        .then(res => {
            if (res.ok) {
                return res.text();
            }
            throw Error();
        })
        .then(res => {
            console.debug(res);
            if (res === "true") {
                statusIndicator.classList.remove("bad");
                statusIndicator.classList.add("ok");
                statusLabel.innerText = "yt-dlp found.";
                ytDlpFound = true;
                addMediaBtn.disabled = false;
            } else {
                statusIndicator.classList.remove("ok");
                statusIndicator.classList.add("bad");
                statusLabel.innerHTML = "No <code>yt-dlp</code> in PATH.";
            }
        });
}

// Entry
document.addEventListener("DOMContentLoaded", () => {
    _checkForYtDlp();
    rssForm.onsubmit = submitDownloadForm;
});
