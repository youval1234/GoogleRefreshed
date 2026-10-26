from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

target = Path(__file__).parent / 'extension' / 'icons'
target.mkdir(exist_ok=True)
image = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((8, 8, 504, 504), radius=144, fill='#f5f4ed')
draw.ellipse((75, 75, 437, 437), fill='#c65332')
font = ImageFont.truetype('C:/Windows/Fonts/georgiai.ttf', 350)
draw.text((250, 222), 'g', font=font, anchor='mm', fill='#ffffff')
for size in (16, 48, 128):
    image.resize((size, size), Image.Resampling.LANCZOS).save(target / f'{size}.png')
