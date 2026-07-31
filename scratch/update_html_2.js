const fs = require('fs');
const files = ['bangladesh-coins.html', 'world-coins.html', 'commemorative-coins.html', 'historical-banknotes.html', 'bangladesh-banknotes.html', 'world-banknotes.html', 'heritage-objects.html', 'documents.html', 'passports.html', 'photography.html', 'museums.html', 'agriculture.html'];

fs.writeFileSync('catalog/bangladesh-coins.json', '[]');

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const cat = file.replace('.html', '');
    
    if (!content.includes('data-catalog=')) {
        content = content.replace('<body>', `<body data-catalog="${cat}">`);
    }

    content = content.replace(/(<div class="collection-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/, '$1\n        $2');

    if (!content.includes('catalog-render.js')) {
        content = content.replace('</body>', '    <script src="js/catalog-render.js"></script>\n</body>');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
