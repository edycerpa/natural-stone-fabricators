import os
import json
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

def main():
    os.makedirs('revisa_jpgs', exist_ok=True)
    
    with open('image_report.json', 'r') as f:
        data = json.load(f)
        
    unique_files = data.get('unique_new', [])
    converted_files = []
    
    for i, path in enumerate(unique_files):
        # path is like "revisa\\IMG_2489.HEIC"
        filename = os.path.basename(path)
        name, _ = os.path.splitext(filename)
        out_name = f"{name}.jpg"
        out_path = os.path.join('revisa_jpgs', out_name)
        
        try:
            with Image.open(path) as img:
                # Convert to RGB in case it's RGBA or something else
                rgb_im = img.convert('RGB')
                rgb_im.save(out_path, 'JPEG', quality=85)
                converted_files.append(out_path)
                print(f"Converted {path} to {out_path}")
        except Exception as e:
            print(f"Failed to convert {path}: {e}")
            
    with open('revisa_jpgs_list.json', 'w') as f:
        json.dump(converted_files, f, indent=2)

if __name__ == '__main__':
    main()
