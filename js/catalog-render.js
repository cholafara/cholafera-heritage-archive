document.addEventListener('DOMContentLoaded', async () => {
    const catalogName = document.body.getAttribute('data-catalog');
    if (!catalogName) return;

    const grid = document.querySelector('.collection-grid');
    if (!grid) return;
    
    // Variables for pagination
    let loadMoreBtn = null;
    let items = [];
    let currentIndex = 0;
    const batchSize = 24;

    // Intersection Observer for scroll fade-in
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    try {
        const response = await fetch(`catalog/${catalogName}.json`);
        if (!response.ok) throw new Error('Catalog fetch failed');
        items = await response.json();
        
        // Filter out items that are on hold
        items = items.filter(i => i.status === 'published');
        
        if (items.length === 0) {
            grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-muted); font-size:1.1rem; padding: 40px;">No items have been published in this collection yet. Please check back soon!</p>';
            return;
        }

        // Clear hardcoded or loading content
        grid.innerHTML = ''; 

        function renderBatch() {
            const batch = items.slice(currentIndex, currentIndex + batchSize);
            
            batch.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card catalog-card';
                // Initial state for animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                const yearText = item.year ? `${item.year}` : 'Unknown Year';
                const matText = item.material ? ` · ${item.material}` : '';
                
                let desc = item.description_en || '';
                if (desc.length > 80) desc = desc.substring(0, 80) + '...';

                card.innerHTML = `
                    <img src="assets/images/${catalogName}/${item.thumbnail}" alt="${item.name_en}" onerror="this.src='assets/images/logo/logo.png'">
                    <h3 style="margin-bottom: 5px; font-size: 1.3rem;">${item.name_en}</h3>
                    <p class="item-meta" style="margin-bottom: 12px;">${yearText}${matText}</p>
                    <p style="margin-bottom: 20px;">${desc}</p>
                    <a href="item.html?id=${item.id}&cat=${catalogName}">View Detail</a>
                `;
                
                grid.appendChild(card);
                observer.observe(card);
            });
            
            currentIndex += batchSize;

            // Handle "Load More" button
            if (currentIndex < items.length) {
                if (!loadMoreBtn) {
                    const btnContainer = document.createElement('div');
                    btnContainer.style.textAlign = 'center';
                    btnContainer.style.gridColumn = '1 / -1';
                    btnContainer.style.marginTop = '40px';
                    
                    loadMoreBtn = document.createElement('button');
                    loadMoreBtn.className = 'btn';
                    loadMoreBtn.innerText = 'Load More';
                    loadMoreBtn.style.border = 'none';
                    loadMoreBtn.style.cursor = 'pointer';
                    loadMoreBtn.onclick = () => renderBatch();
                    
                    btnContainer.appendChild(loadMoreBtn);
                    grid.appendChild(btnContainer);
                } else {
                    grid.appendChild(loadMoreBtn.parentNode);
                }
            } else if (loadMoreBtn) {
                loadMoreBtn.parentNode.remove();
                loadMoreBtn = null;
            }
        }

        renderBatch();

    } catch (e) {
        console.error(e);
        grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-muted); font-size:1.1rem; padding: 40px;">Error loading catalog data.</p>';
    }
});
