const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
    if (path.extname(file) === '.html') {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add cache busting
        let modified = content.replace(/assets\/css\/style\.css(\?v=\d+)?/g, 'assets/css/style.css?v=2');
        modified = modified.replace(/js\/navigation\.js(\?v=\d+)?/g, 'js/navigation.js?v=2');
        
        if (content !== modified) {
            fs.writeFileSync(filePath, modified);
            count++;
        }
    }
});

console.log(`Updated ${count} HTML files with cache busting.`);
