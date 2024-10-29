import os
import locale
import mpv

from pathlib import Path
from PyQt6.QtWidgets import *
from PyQt6.QtCore import Qt


class Dashboard(QWidget):

    def __init__(self):
        super().__init__()

        locale.setlocale(locale.LC_NUMERIC, "C")
        self.player = mpv.MPV(log_handler=print)

        # State
        self.index = -1
        self.isSeeking = False
        self.isUserTriggered = False

        # -- Top bar
        self.directoryLabel = QLabel("-")

        loadMusicDirectoryBtn = QPushButton("Load Music Directory")
        loadMusicDirectoryBtn.clicked.connect(self.loadMusicDirectory)

        topBarLayout = QHBoxLayout()
        topBarLayout.addWidget(self.directoryLabel)
        topBarLayout.addStretch()
        topBarLayout.addWidget(loadMusicDirectoryBtn)
        # -- Top bar

        # -- Playlist
        self.playlist = QListWidget()
        self.downloadList = QListWidget()

        playlistLayout = QHBoxLayout()
        playlistLayout.addWidget(self.playlist)
        # -- Playlist

        # -- Controls
        prevBtn = QPushButton("Prev")
        prevBtn.clicked.connect(self.playPrevious)

        playBtn = QPushButton("Play")
        playBtn.clicked.connect(self.playAudio)

        nextBtn = QPushButton("Next")
        nextBtn.clicked.connect(self.playNext)

        controlsBtnLayout = QHBoxLayout()
        controlsBtnLayout.addWidget(prevBtn)
        controlsBtnLayout.addWidget(playBtn)
        controlsBtnLayout.addWidget(nextBtn)

        self.seeker = QSlider(Qt.Orientation.Horizontal)
        self.seeker.setEnabled(False)
        self.seeker.sliderPressed.connect(lambda: setattr(self, "isSeeking", True))
        self.seeker.sliderReleased.connect(self.seek)
        self.seeker.sliderMoved.connect(self.updateDurationOnSeek)

        self.duration = QLabel("0:00 - 0:00")

        controlsLayout = QHBoxLayout()
        controlsLayout.addLayout(controlsBtnLayout)
        controlsLayout.addWidget(self.seeker)
        controlsLayout.addWidget(self.duration)
        # -- Controls

        # -- Layout
        layout = QVBoxLayout()
        layout.addLayout(topBarLayout)
        layout.addLayout(playlistLayout)
        layout.addLayout(controlsLayout)

        self.setLayout(layout)
        # -- Layout

        # -- Events
        self.player.observe_property("time-pos", self.onTimePos)
        self.player.observe_property("duration", self.onDuration)
        # -- Events

    def loadMusicDirectory(self):
        # Update label
        self.path = Path(f"{Path.home()}/Music")
        if not self.path.is_dir():
            return
        self.directoryLabel.setText(str(self.path))

        # Load files
        names = next(os.walk(self.path), (None, None, []))[2]
        self.playlist.clear()
        for name in names:
            self.playlist.addItem(os.path.basename(name))

    def playAudio(self):
        self.isUserTriggered = True
        if self.index is self.playlist.currentRow() and self.index != -1:
            self.player.pause = not self.player.pause
            return

        item = self.playlist.currentItem()
        if item is None:
            return

        self.index = self.playlist.currentRow()
        self.window().setWindowTitle(f"Audio Client - {item.text()}")
        self.player.play(f"{self.path}/{item.text()}")

    def playNext(self):
        self.isUserTriggered = True
        index = self.index + 1
        if index is self.playlist.count():
            index = 0
        self.playlist.setCurrentRow(index)
        self.playAudio()

    def playPrevious(self):
        self.isUserTriggered = True
        index = self.index - 1
        if index == -1:
            index = self.playlist.count() - 1
        self.playlist.setCurrentRow(index)
        self.playAudio()

    def onTimePos(self, name, value):
        if value is None:
            if not self.isUserTriggered:
                self.playNext()
            self.isUserTriggered = False
            return

        if self.player.duration is not None and not self.isSeeking:
            self.duration.setText(f"{self.formatTime(value)} - {self.formatTime(self.player.duration)}")
            self.seeker.setValue(int(value))

    def formatTime(self, seconds):
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = int(seconds % 60)
        if hours > 0:
            return f"{hours:02}:{minutes:02}:{seconds:02}"
        else:
            return f"{minutes:02}:{seconds:02}"

    def onDuration(self, name, value):
        if value is not None:
            self.seeker.setRange(0, int(value))
            self.seeker.setEnabled(True)

    def seek(self):
        position = self.seeker.value()
        self.player.seek(position, reference="absolute")
        self.isSeeking = False

    def updateDurationOnSeek(self, position):
        self.duration.setText(f"{self.formatTime(position)} - {self.formatTime(self.player.duration)}")
