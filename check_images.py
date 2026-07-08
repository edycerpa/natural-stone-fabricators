import os
import imagehash
from PIL import Image
from pillow_heif import register_heif_opener
import json

register_heif_opener()

def get_image_paths(directory):
    valid_exts = {'.png', '.jpg', '.jpeg', '.webp', '.heic'}
    paths = []
    if os.path.exists(directory):
        for f in os.listdir(directory):
            ext = os.path.splitext(f)[1].lower()
            if ext in valid_exts:
                paths.append(os.path.join(directory, f))
    return paths

def get_hash(path):
    try:
        with Image.open(path) as img:
            return imagehash.phash(img)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return None

def main():
    existing_paths = get_image_paths('src/assets')
    new_paths = get_image_paths('revisa')

    existing_hashes = {}
    for p in existing_paths:
        h = get_hash(p)
        if h is not None:
            existing_hashes[p] = h

    duplicates = []
    unique_new = []

    for p in new_paths:
        h = get_hash(p)
        if h is None:
            continue
            
        is_dup = False
        for ex_path, ex_hash in existing_hashes.items():
            if h - ex_hash <= 4:  # Hamming distance threshold for similarity
                duplicates.append((p, ex_path))
                is_dup = True
                break
                
        if not is_dup:
            unique_new.append(p)

    output = {
        'duplicates': duplicates,
        'unique_new': unique_new
    }
    
    with open('image_report.json', 'w') as f:
        json.dump(output, f, indent=2)
        
    print(f"Found {len(duplicates)} duplicates.")
    print(f"Found {len(unique_new)} unique new images.")

if __name__ == '__main__':
    main()
