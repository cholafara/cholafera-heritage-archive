import pandas as pd
import json
import os
import uuid
import sys

def get_era_theme(year):
    try:
        return 'vintage' if int(year) < 2000 else 'modern'
    except:
        return 'vintage' # Default

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except:
            return []

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    if len(sys.argv) < 2:
        print("Usage: python import-catalog.py <path-to-excel>")
        sys.exit(1)
        
    excel_path = sys.argv[1]
    
    if not os.path.exists(excel_path):
        print(f"Error: {excel_path} not found.")
        sys.exit(1)

    print(f"Reading {excel_path}...")
    df = pd.read_excel(excel_path)
    
    # Fill NaN with empty string
    df = df.fillna('')
    
    # Dictionary to hold updates for each catalog file
    catalogs = {}
    search_index = load_json('catalog/search-index.json')
    
    # Keep track of existing IDs in search index to avoid duplicates (optional, usually we append new)
    existing_search_ids = {item['id'] for item in search_index}
    
    added_count = 0
    
    for index, row in df.iterrows():
        category = str(row.get('category', '')).strip()
        status = str(row.get('status', 'hold')).strip().lower()
        
        if not category:
            continue
            
        json_path = f'catalog/{category}.json'
        if category not in catalogs:
            catalogs[category] = load_json(json_path)
            
        # Generate ID if not provided
        item_id = str(row.get('id', '')).strip()
        if not item_id:
            item_id = f"{category}-{uuid.uuid4().hex[:6]}"
            
        # Check if already exists in catalog
        exists = any(item['id'] == item_id for item in catalogs[category])
        if exists:
            print(f"Item {item_id} already exists in {category}. Skipping...")
            continue
            
        year = str(row.get('year', '')).strip()
        image_base = str(row.get('image_base_name', '')).strip()
        video_base = str(row.get('video_base_name', '')).strip()
        
        item = {
            "id": item_id,
            "name_en": str(row.get('name_en', '')).strip(),
            "name_bn": str(row.get('name_bn', '')).strip(),
            "year": int(year) if year.isdigit() else year,
            "material": str(row.get('material', '')).strip(),
            "dimensions": str(row.get('dimensions', '')).strip(),
            "condition": str(row.get('condition', '')).strip(),
            "description_en": str(row.get('description_en', '')).strip(),
            "description_bn": str(row.get('description_bn', '')).strip(),
            "source": str(row.get('source', '')).strip(),
            "era_theme": get_era_theme(year),
            "thumbnail": f"thumbs/{image_base}" if image_base else "",
            "full_image": f"full/{image_base}" if image_base else "",
            "status": status
        }
        
        if video_base:
            item["video"] = f"videos/{video_base}"
            
        catalogs[category].append(item)
        
        # Add to search index if published
        if status == 'published' and item_id not in existing_search_ids:
            search_item = {
                "id": item_id,
                "name_en": item["name_en"],
                "name_bn": item["name_bn"],
                "category_id": category,
                "url": f"item.html?id={item_id}&cat={category}",
                "thumbnail": f"assets/images/{category}/thumbs/{image_base}" if image_base else ""
            }
            search_index.append(search_item)
            existing_search_ids.add(item_id)
            
        added_count += 1
        
    # Save all modified catalogs
    for category, data in catalogs.items():
        save_json(f'catalog/{category}.json', data)
        print(f"Saved {len(data)} items to {category}.json")
        
    save_json('catalog/search-index.json', search_index)
    print(f"Saved search-index.json (Total: {len(search_index)} items)")
    print(f"Import process complete. {added_count} new items added.")

if __name__ == '__main__':
    main()
