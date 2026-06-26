import sys
from PIL import Image, ImageDraw

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    min_dim = min(w, h)
    
    # Crop to square
    left = (w - min_dim)/2
    top = (h - min_dim)/2
    right = (w + min_dim)/2
    bottom = (h + min_dim)/2
    img = img.crop((left, top, right, bottom))
    
    # Create mask for circular crop
    mask = Image.new('L', (min_dim, min_dim), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, min_dim, min_dim), fill=255)
    
    # Apply circle mask
    result = Image.new('RGBA', (min_dim, min_dim), (0,0,0,0))
    result.paste(img, (0, 0), mask=mask)
    
    # Resize to standard favicon size
    result = result.resize((128, 128), Image.Resampling.LANCZOS)
    
    result.save(output_path, "PNG")
    print(f"Saved processed logo to {output_path}")

if __name__ == "__main__":
    process_logo("client/public/logo.png", "client/public/favicon.png")
