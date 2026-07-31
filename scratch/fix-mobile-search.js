const fs = require('fs');

// 1. Update style.css
let css = fs.readFileSync('assets/css/style.css', 'utf8');
const mobileCssAppend = `
    .search-panel {
        position: relative;
        z-index: 100;
        pointer-events: auto !important;
    }
    .search-panel input {
        pointer-events: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
    }
`;
css = css.replace(/(\.search-panel input \{\s*min-width: 0;\s*width: 100%;\s*\})/, '$1' + mobileCssAppend);
fs.writeFileSync('assets/css/style.css', css);

// 2. Update navigation.js
let js = fs.readFileSync('js/navigation.js', 'utf8');
// modify setSearchState
js = js.replace(/searchStatus && \(searchStatus\.textContent = ''\);\n\s*\}/, 
`searchStatus && (searchStatus.textContent = '');
        }
        
        // Fix: Auto-open nav-panel on mobile if search is toggled so it's visible
        if (expanded && window.innerWidth <= 900 && typeof navPanel !== 'undefined') {
            if (!navPanel.classList.contains('is-open')) {
                setMenuState(true);
            }
        }`);
fs.writeFileSync('js/navigation.js', js);
console.log('Fixed CSS and JS.');
