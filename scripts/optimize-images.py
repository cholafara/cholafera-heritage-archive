import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import glob

# Constants
THUMB_MAX_WIDTH = 400
FULL_MAX_WIDTH = 1600
WATERMARK_TEXT = "Cholafera Heritage Archive"

def add_diagonal_watermark(image):
    """
    Adds a subtle diagonal watermark at the pixel level.
    """
    # Create a transparent layer the same size as image
    watermark_layer = Image.new('RGBA', image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(watermark_layer)
    
    # Try to load a generic font, fallback to default
    try:
        # Increase font size based on image width
        font_size = max(20, int(image.width / 30))
        # Windows standard font path, or fallback if not found
        font = ImageFont.truetype("arial.ttf", font_size)
    except IOError:
        font = ImageFont.load_default()
        
    # Create a separate image for the text to rotate it
    text_bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    txt_img = Image.new('RGBA', (text_width + 4, text_height + 4), (255, 255, 255, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    # Draw text shadow for visibility on light backgrounds (opacity ~100)
    txt_draw.text((2, 2), WATERMARK_TEXT, font=font, fill=(0, 0, 0, 100))
    # Draw text with higher opacity white (opacity ~100)
    txt_draw.text((0, 0), WATERMARK_TEXT, font=font, fill=(255, 255, 255, 100))
    
    # Rotate text
    txt_rotated = txt_img.rotate(45, expand=1)
    
    # Paste the rotated text multiple times across the image (subtle pattern)
    w_x, w_y = txt_rotated.size
    step_x = max(1, int(w_x * 1.2))
    step_y = max(1, int(w_y * 1.2))
    for x in range(-w_x, image.width + w_x, step_x):
        for y in range(-w_y, image.height + w_y, step_y):
            watermark_layer.paste(txt_rotated, (x, y), txt_rotated)
            
    # Combine original image with watermark layer
    image = image.convert("RGBA")
    watermarked = Image.alpha_composite(image, watermark_layer)
    return watermarked.convert("RGB") # Convert back to RGB for saving as JPEG

def resize_and_save(img, path, max_width, watermark=False):
    # Calculate new height maintaining aspect ratio
    w_percent = (max_width / float(img.width))
    if img.width > max_width:
        h_size = int((float(img.height) * float(w_percent)))
        img_resized = img.resize((max_width, h_size), Image.Resampling.LANCZOS)
    else:
        img_resized = img.copy()
        
    if watermark:
        img_resized = add_diagonal_watermark(img_resized)
        
    # Save optimized JPEG
    img_resized.save(path, "JPEG", quality=85, optimize=True)

def process_category(category_path):
    category = os.path.basename(category_path)
    incoming_dir = os.path.join(category_path, 'incoming')
    thumbs_dir = os.path.join(category_path, 'thumbs')
    full_dir = os.path.join(category_path, 'full')
    
    if not os.path.exists(incoming_dir):
        return 0
        
    os.makedirs(thumbs_dir, exist_ok=True)
    os.makedirs(full_dir, exist_ok=True)
    
    # Get all images in incoming
    valid_exts = ('.jpg', '.jpeg', '.png', '.webp')
    count = 0
    for filename in os.listdir(incoming_dir):
        if not filename.lower().endswith(valid_exts):
            continue
            
        file_path = os.path.join(incoming_dir, filename)
        base_name = os.path.splitext(filename)[0]
        out_filename = f"{base_name}.jpg" # Convert all to jpg
        
        thumb_path = os.path.join(thumbs_dir, out_filename)
        full_path = os.path.join(full_dir, out_filename)
        
        # Process image
        try:
            with Image.open(file_path) as img:
                # Convert to RGB (in case of RGBA/PNG)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                    
                print(f"Processing {category}/{filename}...")
                
                # Generate full size (with watermark)
                resize_and_save(img, full_path, FULL_MAX_WIDTH, watermark=True)
                
                # Generate thumb size (no watermark needed for small thumbs usually, but we can add it if requested. Assuming no for clarity on small images, wait, plan said "optimize script resize image and pixel level subtle diagonal watermark". Let's put watermark on full only to save thumb legibility)
                # Actually, plan said "watermarked thumbs/ and full/ images". I'll add to both.
                resize_and_save(img, thumb_path, THUMB_MAX_WIDTH, watermark=True)
                
            # Optional: Move processed file to an 'archive' folder or delete. We'll leave it for now or user can manage.
            count += 1
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            
    return count

def main():
    base_dir = 'assets/images'
    if not os.path.exists(base_dir):
        print(f"Error: {base_dir} not found.")
        sys.exit(1)
        
    total_processed = 0
    # Iterate through all category folders
    for item in os.listdir(base_dir):
        category_path = os.path.join(base_dir, item)
        if os.path.isdir(category_path):
            total_processed += process_category(category_path)
            
    print(f"\nOptimization complete. Processed {total_processed} images.")

if __name__ == '__main__':
    main()
