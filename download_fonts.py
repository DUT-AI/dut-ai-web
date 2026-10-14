"""Run the frontend font downloader from the repository root."""

from pathlib import Path
import runpy


if __name__ == "__main__":
    runpy.run_path(
        str(Path(__file__).resolve().parent / "frontend" / "scripts" / "download_fonts.py"),
        run_name="__main__",
    )
