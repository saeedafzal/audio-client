import sys
import qdarktheme

from ui.window import Window
from PyQt6.QtWidgets import QApplication


def main():
    app = QApplication(sys.argv)
    app.setStyleSheet(qdarktheme.load_stylesheet())

    window = Window()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
