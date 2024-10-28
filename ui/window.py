from .dashboard import Dashboard

from PyQt6.QtWidgets import QMainWindow


class Window(QMainWindow):

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Audio Client")
        self.setFixedSize(800, 600)

        self.setCentralWidget(Dashboard())
