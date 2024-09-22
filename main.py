import sys
import locale
import os
import mpv
import qdarktheme
import yt_dlp

from pathlib import Path
from PyQt6.QtWidgets import *
from PyQt6.QtCore import *


class Signals(QObject):
    finished = pyqtSignal()


class Worker(QRunnable):

    def __init__(self, url, path):
        super().__init__()
        self.url = url
        self.path = path
        self.signals = Signals()

    @pyqtSlot()
    def run(self):
        print("Starting download...")

        ydl_opts = {
            "extract_audio": True,
            "format": "bestaudio",
            "outtmpl": f"{self.path}/%(title)s.%(ext)s"
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([self.url])

        print("Download complete.")
        self.signals.finished.emit()


class Seeker(QSlider):
    def __init__(self, orientation, player):
        super().__init__(orientation)

        self.player = player;

        self.setRange(0, 1000)

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            if self.player.playback_time is not None:
                position = event.position().x() / self.width()
                new_value = self.minimum() + position * (self.maximum() - self.minimum())
                self.setValue(int(new_value))

                duration = self.player.duration or 1
                seekTime = (new_value / 1000) * duration
                self.player.seek(seekTime, reference="absolute")

        super().mousePressEvent(event) 


class Dashboard(QWidget):
    def __init__(self, player):
        super().__init__()

        self.player = player
        self.isDownloading = False
        self.downloaderPool = QThreadPool()
        print("Multithreading with maximum %d threads" % self.downloaderPool.maxThreadCount())

        # -- Top bar
        self.directoryLabel = QLabel("Media directory:")

        loadMusicDirectoryBtn = QPushButton("Load Music Directory")
        loadMusicDirectoryBtn.clicked.connect(self.loadMusicDirectory)

        changeDirectoryBtn = QPushButton("Set Media Directory")
        changeDirectoryBtn.clicked.connect(self.setMediaDirectory)

        addDownloadLinkBtn = QPushButton("Add Download Link")
        addDownloadLinkBtn.clicked.connect(self.addDownloadLink)

        topBarLayout = QHBoxLayout()
        topBarLayout.addWidget(self.directoryLabel)
        topBarLayout.addStretch()
        topBarLayout.addWidget(loadMusicDirectoryBtn)
        topBarLayout.addWidget(changeDirectoryBtn)
        topBarLayout.addWidget(addDownloadLinkBtn)
        # -- Top bar

        # -- Playlist
        self.playlist = QListWidget()
        self.downloadList = QListWidget()

        self.listLayout = QHBoxLayout()
        self.listLayout.addWidget(self.playlist)
        # -- Playlist

        # -- Controls
        playButton = QPushButton("Play")
        playButton.clicked.connect(self.playAudio)

        pauseButton = QPushButton("Pause")
        pauseButton.clicked.connect(self.pauseAudio)

        stopButton = QPushButton("Stop")
        stopButton.clicked.connect(self.stopAudio)

        conLayout = QHBoxLayout()
        conLayout.addWidget(playButton)
        conLayout.addWidget(pauseButton)
        conLayout.addWidget(stopButton)
        # -- Controls

        # -- Player
        self.seekSlider = Seeker(Qt.Orientation.Horizontal, self.player)

        timer = QTimer(self)
        timer.timeout.connect(self.updateSlider)
        timer.start(500)
        # -- Player

        # -- Layout
        layout = QVBoxLayout()
        layout.addLayout(topBarLayout)
        layout.addLayout(self.listLayout)
        layout.addLayout(conLayout)
        layout.addWidget(self.seekSlider)
        # -- Layout

        self.setLayout(layout)

        # -- Events
        self.player.observe_property("time-pos", self.onTrackEnd)
        # -- Events

    def loadMusicDirectory(self):
        self.path = f"{Path.home()}/Music"
        if not Path(self.path).is_dir():
            return
        self.directoryLabel.setText(f"Media directory: {self.path}")
        self.loadAudioFiles()

    def setMediaDirectory(self):
        self.path = QFileDialog.getExistingDirectory(self, "Select Media Directory")
        self.directoryLabel.setText(f"Media directory: {self.path}")
        self.loadAudioFiles()

    def loadAudioFiles(self):
        names = next(os.walk(self.path), (None, None, []))[2]
        self.playlist.clear()
        for name in names:
            self.playlist.addItem(os.path.basename(name))

    def playAudio(self):
        if self.player.pause:
            self.player.pause = False
            return

        item = self.playlist.currentItem()
        if item is None:
            return

        name = item.text()
        absolute = f"{self.path}/{name}"
        print(absolute)

        self.player.stop()
        print("Playing...")
        self.player.play(absolute)

    def pauseAudio(self):
        # if not self.player.core_idle:
        self.player.pause = not self.player.pause

    def stopAudio(self):
        self.player.stop()
        self.player.pause = False
        self.seekSlider.setValue(0)

    def updateSlider(self):
        if self.player.time_pos:
            duration = self.player.duration or 0
            if duration > 0:
                self.seekSlider.setValue(int((self.player.time_pos / duration) * 1000))

    def onTrackEnd(self, name, value):
        if value is None:
            print("Track ended. Looping...")
            index = self.playlist.currentRow() + 1
            if index >= self.playlist.count():
                index = 0
            self.playlist.setCurrentRow(index)
            self.playAudio()

    def addDownloadLink(self):
        if not hasattr(self, "path"):
            return

        url, ok = QInputDialog.getText(self, "Add Download Link", "Enter valid media url:")
        if ok and url:
            # TODO: Validate URL
            print(f"Adding {url} to download list.")
            self.listLayout.addWidget(self.downloadList)
            self.downloadList.addItem(f"Queued: {url}")
            if not self.isDownloading:
                self.download(url)

    def download(self, url):
        self.isDownloading = True
        text = self.downloadList.item(0).text().replace("Queued", "Downloading")
        self.downloadList.item(0).setText(text)

        print(f"Downloading {url}")

        worker = Worker(url, self.path)
        worker.signals.finished.connect(self.downloadComplete)

        self.downloaderPool.start(worker)

    def downloadComplete(self):
        print("Thread ended, because download is completed.")
        self.downloadList.takeItem(0)
        if self.downloadList.count() > 0:
            url = self.downloadList.item(0).text().split(":", 1)[1].strip()
            print("Next link to download...")
            self.download(url)


class Window(QMainWindow):
    def __init__(self, player):
        super().__init__()

        self.setWindowTitle("Audio Player")
        self.setFixedSize(800, 600)

        self.setCentralWidget(Dashboard(player))


if __name__ == "__main__":
    locale.setlocale(locale.LC_NUMERIC, "C")
    player = mpv.MPV(ao="pulse", log_handler=print)

    app = QApplication(sys.argv)
    app.setStyleSheet(qdarktheme.load_stylesheet())

    window = Window(player)
    window.show()

    sys.exit(app.exec())
