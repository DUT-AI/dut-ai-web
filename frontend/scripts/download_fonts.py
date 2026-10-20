"""Download complete Be Vietnam Pro fonts, including Vietnamese, from the author.

A single Google Fonts CSS URL may contain only one language subset. Download
full font files so Vietnamese text does not fall back to another typeface.
"""

from pathlib import Path
from urllib.request import urlopen


FONTS_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"
SOURCE = "https://raw.githubusercontent.com/bettergui/BeVietnamPro/main/"
FILES = {
    "BeVietnamPro-Variable.ttf": "fonts/variable/BeVietnamPro%5Bwght%5D.ttf",
    "BeVietnamPro-Italic-Variable.ttf": "fonts/variable/BeVietnamPro-Italic%5Bwght%5D.ttf",
    "BeVietnamPro-OFL.txt": "OFL.txt",
}


def main():
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    for name, source_path in FILES.items():
        with urlopen(SOURCE + source_path, timeout=30) as response:
            data = response.read()
        if name.endswith(".ttf") and data[:4] != bytes([0, 1, 0, 0]):
            raise ValueError(f"Invalid TrueType font: {name}")
        (FONTS_DIR / name).write_bytes(data)
        print(f"Saved {name}: {len(data)} bytes")


if __name__ == "__main__":
    main()
