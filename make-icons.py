from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

target = Path(__file__).parent / 'extension' / 'icons'
target.mkdir(exist_ok=True)
image = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((8, 8, 504, 504), radius=150, fill='#143b3b')
draw.arc((112, 112, 400, 400), 205, 330, fill='#8ff1d2', width=34)
draw.arc((112, 112, 400, 400), 25, 150, fill='#8ff1d2', width=34)
draw.line((126, 183, 126, 120), fill='#8ff1d2', width=31)
draw.line((126, 183, 193, 183), fill='#8ff1d2', width=31)
draw.line((386, 329, 386, 392), fill='#8ff1d2', width=31)
draw.line((386, 329, 319, 329), fill='#8ff1d2', width=31)
draw.polygon([(391,38),(405,72),(439,86),(405,100),(391,134),(377,100),(343,86),(377,72)], fill='#dcfef0')
for size in (16, 48, 128):
    image.resize((size, size), Image.Resampling.LANCZOS).save(target / f'{size}.png')
