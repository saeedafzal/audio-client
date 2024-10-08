function id(id) {
    return document.getElementById(id);
}

const playlist = id("playlist");
const audio = id("audio");
const titleHeader = id("title-header");
const dialog = id("dialog");
dialog.showModal();

let paths = [];

function loadFromMusic() {
    fetch("api/directory/music")
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(res => {
            console.log(res);
            paths = res;
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
