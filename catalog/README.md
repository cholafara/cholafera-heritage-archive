# Catalog Structure & JSON Schema

This directory (`catalog/`) acts as the database for the digital archive. Each JSON file corresponds to a category and contains an array of items.

## Item Schema

Each item in the category JSON files MUST follow this schema:

```json
{
  "id": "bangladesh-coins-0001",
  "name_en": "Item Name in English",
  "name_bn": "আইটেমের নাম বাংলায়",
  "year": 1971,
  "material": "Gold / Paper / Silver",
  "dimensions": "30mm",
  "condition": "Excellent",
  "description_en": "Detailed description in English...",
  "description_bn": "বিস্তারিত বিবরণ বাংলায়...",
  "source": "Source / Provenance",
  "era_theme": "vintage", // "vintage" if year < 2000, "modern" otherwise
  "thumbnail": "thumbs/rare-coin-1971.jpg",
  "full_image": "full/rare-coin-1971.jpg",
  "video": "videos/rare-coin-1971.mp4", // optional
  "status": "published" // or "hold" for items not yet meant to be shown publicly
}
```

## `search-index.json` Schema

This file contains a lightweight version of all items across all catalogs to enable fast site-wide search without fetching every large catalog file.

```json
[
  {
    "id": "bangladesh-coins-0001",
    "name_en": "Item Name in English",
    "name_bn": "আইটেমের নাম বাংলায়",
    "category_id": "bangladesh-coins",
    "url": "item.html?id=bangladesh-coins-0001&cat=bangladesh-coins",
    "thumbnail": "assets/images/bangladesh-coins/thumbs/rare-coin-1971.jpg"
  }
]
```
