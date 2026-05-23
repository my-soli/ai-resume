"""
Run this script once to generate the app icon PNG.
Requires: pip install Pillow
Then run: dart run flutter_launcher_icons
"""
import os
import math

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Installing Pillow...")
    os.system("pip install Pillow")
    from PIL import Image, ImageDraw, ImageFont

SIZE = 1024
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets", "icon")
os.makedirs(OUTPUT_DIR, exist_ok=True)

img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Rounded rectangle background with indigo gradient simulation
RADIUS = 220
BG_COLOR = (99, 102, 241)  # #6366F1 indigo

def draw_rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill)
    draw.ellipse([x0, y0, x0 + radius * 2, y0 + radius * 2], fill=fill)
    draw.ellipse([x1 - radius * 2, y0, x1, y0 + radius * 2], fill=fill)
    draw.ellipse([x0, y1 - radius * 2, x0 + radius * 2, y1], fill=fill)
    draw.ellipse([x1 - radius * 2, y1 - radius * 2, x1, y1], fill=fill)

draw_rounded_rect(draw, [0, 0, SIZE, SIZE], RADIUS, BG_COLOR)

# Draw a subtle lighter circle in top-right for depth
draw.ellipse([SIZE // 2, -SIZE // 4, SIZE + SIZE // 4, SIZE // 2],
             fill=(139, 92, 246, 60))  # purple tint

# Draw "RA" text
try:
    font_large = ImageFont.truetype("arial.ttf", 420)
    font_small = ImageFont.truetype("arial.ttf", 140)
except:
    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()

text = "RA"
bbox = draw.textbbox((0, 0), text, font=font_large)
text_w = bbox[2] - bbox[0]
text_h = bbox[3] - bbox[1]
x = (SIZE - text_w) // 2 - bbox[0]
y = (SIZE - text_h) // 2 - bbox[1] - 40

draw.text((x, y), text, font=font_large, fill=(255, 255, 255, 255))

# Draw small "AI" badge at bottom-right
badge_x, badge_y = SIZE - 260, SIZE - 220
draw.ellipse([badge_x - 10, badge_y - 10, badge_x + 180, badge_y + 100],
             fill=(139, 92, 246))
try:
    draw.text((badge_x + 10, badge_y + 5), "AI", font=font_small,
              fill=(255, 255, 255, 230))
except:
    pass

output_path = os.path.join(OUTPUT_DIR, "app_icon.png")
img.save(output_path, "PNG")
print(f"Icon saved to: {output_path}")
print("Now run: dart run flutter_launcher_icons")
