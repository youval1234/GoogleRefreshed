from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
from io import BytesIO
import json

target = Path(__file__).parent / 'extension' / 'icons' / 'services'
target.mkdir(parents=True, exist_ok=True)
base = 'https://www.gstatic.com/images/branding/product/2x/'
sources = {
    'gmail': base + 'gmail_2020q4_48dp.png',
    'youtube': base + 'youtube_48dp.png',
    'drive': base + 'drive_2020q4_48dp.png',
    'calendar': base + 'calendar_2020q4_48dp.png',
    'maps': base + 'maps_48dp.png',
    'photos': base + 'photos_48dp.png',
    'translate': base + 'translate_48dp.png',
    'google': base + 'googleg_48dp.png',
    'account': base + 'contacts_48dp.png',
    'chatgpt': 'https://cdn.oaistatic.com/assets/favicon-eex17e9e.ico',
}

def download(item):
    name, url = item
    try:
        request = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(request, timeout=25) as response:
            image = Image.open(BytesIO(response.read())).convert('RGBA')
        image.save(target / f'{name}.png')
        return (name, url, f'{image.width}x{image.height}')
    except Exception as error:
        return (name, url, str(error))

results = list(ThreadPoolExecutor(max_workers=10).map(download, sources.items()))
for result in results:
    print(*result, sep=' | ')
(target / 'sources.json').write_text(json.dumps(dict(sources), indent=2))
