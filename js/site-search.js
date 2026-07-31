document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('site-search');
    if (!searchInput) return;

    let searchIndex = [];
    let isIndexLoaded = false;
    let indexLoading = false;

    // Create dropdown container
    const searchPanel = document.getElementById('site-search-panel');
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.left = '0';
    dropdown.style.right = '0';
    dropdown.style.backgroundColor = 'var(--surface)';
    dropdown.style.border = '1px solid var(--border)';
    dropdown.style.borderRadius = '8px';
    dropdown.style.maxHeight = '300px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    dropdown.style.zIndex = '2000';
    dropdown.style.display = 'none';
    searchPanel.style.position = 'relative';
    searchPanel.appendChild(dropdown);

    const loadIndex = async () => {
        if (isIndexLoaded || indexLoading) return;
        indexLoading = true;
        try {
            const res = await fetch('catalog/search-index.json');
            if (res.ok) {
                searchIndex = await res.json();
                isIndexLoaded = true;
            }
        } catch (e) {
            console.error('Failed to load search index', e);
        }
        indexLoading = false;
    };

    const performSearch = (query) => {
        if (!query.trim()) {
            dropdown.style.display = 'none';
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchIndex.filter(item => 
            (item.name_en && item.name_en.toLowerCase().includes(lowerQuery)) ||
            (item.name_bn && item.name_bn.includes(lowerQuery))
        );

        dropdown.innerHTML = '';

        if (results.length === 0) {
            const empty = document.createElement('div');
            empty.style.padding = '10px';
            empty.style.color = 'var(--text-muted)';
            empty.innerText = 'No results found.';
            dropdown.appendChild(empty);
        } else {
            // Limit to 10 results
            results.slice(0, 10).forEach(item => {
                const row = document.createElement('a');
                row.href = item.url;
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.padding = '10px';
                row.style.textDecoration = 'none';
                row.style.color = 'var(--text)';
                row.style.borderBottom = '1px solid var(--border)';

                const img = document.createElement('img');
                img.src = item.thumbnail;
                img.style.width = '40px';
                img.style.height = '40px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                img.style.marginRight = '10px';
                img.onerror = () => { img.src = 'assets/images/logo/logo.png'; };

                const textDiv = document.createElement('div');
                const titleEn = document.createElement('div');
                titleEn.style.fontWeight = 'bold';
                titleEn.style.fontSize = '0.9rem';
                titleEn.innerText = item.name_en;
                
                const titleBn = document.createElement('div');
                titleBn.style.fontSize = '0.8rem';
                titleBn.style.color = 'var(--text-muted)';
                titleBn.innerText = item.name_bn;

                textDiv.appendChild(titleEn);
                textDiv.appendChild(titleBn);
                row.appendChild(img);
                row.appendChild(textDiv);

                row.onmouseover = () => row.style.backgroundColor = 'var(--surface-muted)';
                row.onmouseout = () => row.style.backgroundColor = 'transparent';

                dropdown.appendChild(row);
            });
        }
        dropdown.style.display = 'block';
    };

    searchInput.addEventListener('focus', loadIndex);
    
    // Use input event for live search
    searchInput.addEventListener('input', (e) => {
        if (!isIndexLoaded) {
            loadIndex().then(() => performSearch(e.target.value));
        } else {
            performSearch(e.target.value);
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchPanel.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
    // Prevent form submission if live search is used
    searchPanel.addEventListener('submit', (e) => {
        e.preventDefault();
    });
});
