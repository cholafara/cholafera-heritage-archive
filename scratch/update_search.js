const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('site-search.js')) {
    content = content.replace('</body>', '    <script src="js/site-search.js"></script>\n</body>');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
