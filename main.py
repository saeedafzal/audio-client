import sys
import locale
import qdarktheme

from ui.window import Window
from PyQt6.QtWidgets import QApplication


if __name__ == "__main__":
    locale.setlocale(locale.LC_NUMERIC, "C")

    app = QApplication(sys.argv)
    app.setStyleSheet(qdarktheme.load_stylesheet())

    window = Window()
    window.show()

    sys.exit(app.exec())
