from .dashboard import Dashboard
from .podcasts import Podcasts

from PyQt6.QtWidgets import QMainWindow, QStackedWidget
from PyQt6.QtGui import QAction


class Window(QMainWindow):

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Audio Client")
        self.setFixedSize(800, 600)

        self.dashboard = Dashboard()
        self.podcasts = Podcasts()

        self.root = QStackedWidget()
        self.root.addWidget(self.dashboard)
        self.root.addWidget(self.podcasts)

        self.setCentralWidget(self.root)

        # -- Menu bar
        audioAction = QAction("Local Audio Player", self)
        audioAction.triggered.connect(self.switchToAudioClient)

        podcastAction = QAction("Podcasts", self)
        podcastAction.triggered.connect(self.switchToPodcasts)

        menu = self.menuBar()
        fileMenu = menu.addMenu("View")
        fileMenu.addAction(audioAction)
        fileMenu.addAction(podcastAction)
        # -- Menu bar

    def switchToAudioClient(self):
        if self.root.currentWidget() is not self.dashboard:
            self.root.setCurrentWidget(self.dashboard)

    def switchToPodcasts(self):
        if self.root.currentWidget() is not self.podcasts:
            self.dashboard.reset()
            self.root.setCurrentWidget(self.podcasts)
