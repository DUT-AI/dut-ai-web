import os
import re
import urllib.request

FONTS_DIR = os.path.join(os.path.dirname(__file__), "frontend", "public", "fonts")
os.makedirs(FONTS_DIR, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

def get_font_url(family_query):
    url = f"https://fonts.googleapis.com/css2?family={family_query}&display=swap"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req) as resp:
        css = resp.read().decode("utf-8")
    # find woff2 url in latin block
    # prioritize latin subset
    urls = re.findall(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)", css)
    if urls:
        return urls[-1] # usually latin is at the bottom
    raise ValueError(f"No woff2 found for {family_query}")

def download_file(url, out_path):
    print(f"Downloading {url} -> {out_path}...")
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
    with open(out_path, "wb") as f:
        f.write(data)
    print(f"Saved {len(data)} bytes to {out_path}")

try:
    inter_url = get_font_url("Inter:wght@400..900")
    download_file(inter_url, os.path.join(FONTS_DIR, "Inter-Variable.woff2"))

    jakarta_url = get_font_url("Plus+Jakarta+Sans:wght@400..800")
    download_file(jakarta_url, os.path.join(FONTS_DIR, "PlusJakartaSans-Variable.woff2"))

    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
    # Fallback to direct ttf
    try:
        download_file("https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", os.path.join(FONTS_DIR, "Inter-Regular.ttf"))
        download_file("https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NSg.ttf", os.path.join(FONTS_DIR, "PlusJakartaSans-Regular.ttf"))
        print("SUCCESS_FALLBACK")
    except Exception as e2:
        print(f"FALLBACK_ERROR: {e2}")
