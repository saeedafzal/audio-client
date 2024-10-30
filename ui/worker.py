import yt_dlp

from .signals import Signals

from PyQt6.QtCore import QRunnable, pyqtSlot


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
