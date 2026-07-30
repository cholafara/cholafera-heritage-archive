# Content Guide / কন্টেন্ট গাইড

## How to add a new collection item (নতুন কালেকশন আইটেম কীভাবে যোগ করবেন)

### English:
1. **Prepare the Image:** Resize your image to a maximum width of 800px. Save it in `.jpg` format. Ensure the filename is lowercase and uses hyphens instead of spaces (e.g., `rare-coin-1971.jpg`).
2. **Upload the Image:** Place the image in the appropriate sub-folder inside `assets/images/` (e.g., `assets/images/bangladesh-coins/`).
3. **Add the HTML:** Open the relevant HTML file for the category. Locate the `<!-- নতুন আইটেম কার্ড এখানে যোগ করুন - দেখুন CONTENT-GUIDE.md -->` comment inside the `.collection-grid` and paste the following HTML card template right above it.
4. **Update the Information:** Replace the bracketed placeholders (`[FOLDER]`, `[FILENAME]`, `[COIN NAME]`, `[YEAR]`, `[MATERIAL/DENOMINATION]`, `[SHORT DESCRIPTION]`) with the actual details of the item.

### বাংলা (Bengali):
১. **ছবি প্রস্তুত করুন:** আপনার ছবির width (প্রস্থ) সর্বোচ্চ 800px এ রিসাইজ করুন। ছবিটিকে `.jpg` ফরম্যাটে সেভ করুন। ফাইলের নাম ছোট হাতের অক্ষরে (lowercase) এবং স্পেসের বদলে হাইফেন দিয়ে লিখুন (যেমন: `rare-coin-1971.jpg`)।
২. **ছবি আপলোড করুন:** ছবিটি `assets/images/` এর ভেতরের সঠিক সাব-ফোল্ডারে রাখুন (যেমন: `assets/images/bangladesh-coins/`)।
৩. **HTML যোগ করুন:** ক্যাটাগরি অনুযায়ী সঠিক HTML ফাইলটি খুলুন। `.collection-grid` এর ভেতরে `<!-- নতুন আইটেম কার্ড এখানে যোগ করুন - দেখুন CONTENT-GUIDE.md -->` কমেন্টটি খুঁজে বের করুন এবং এর ঠিক ওপরে নিচের HTML কার্ড টেমপ্লেটটি পেস্ট করুন।
৪. **তথ্য আপডেট করুন:** ব্র্যাকেটে থাকা অংশগুলো (`[FOLDER]`, `[FILENAME]`, `[COIN NAME]`, `[YEAR]`, `[MATERIAL/DENOMINATION]`, `[SHORT DESCRIPTION]`) পরিবর্তন করে আইটেমের সঠিক তথ্য দিন।

### HTML Card Template

```html
<div class="card">
    <img src="assets/images/[FOLDER]/[FILENAME].jpg" alt="[COIN NAME] coin">
    <h3>[COIN NAME]</h3>
    <p class="item-meta">[YEAR] · [MATERIAL/DENOMINATION]</p>
    <p>[SHORT DESCRIPTION - 1-2 sentences]</p>
</div>
```
