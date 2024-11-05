from PyQt6.QtWidgets import *


class Podcasts(QWidget):

    def __init__(self):
        super().__init__()

        # -- Top bar
        addFeedBtn = QPushButton("Add Feed")
        addFeedBtn.setToolTip("Add new feed from a RSS feed.")

        topBarLayout = QHBoxLayout()
        topBarLayout.addStretch()
        topBarLayout.addWidget(addFeedBtn)
        # -- Top bar

        # -- Layout
        layout = QVBoxLayout()
        layout.addLayout(topBarLayout)

        self.setLayout(layout)
        # -- Layout
