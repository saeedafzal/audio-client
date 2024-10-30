from PyQt6.QtCore import QObject, pyqtSignal


class Signals(QObject):
    finished = pyqtSignal()
