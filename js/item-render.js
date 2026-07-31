document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const cat = params.get('cat');
    const container = document.getElementById('item-detail');

    if (!id || !cat) {
        container.innerHTML = '<div class="container" style="text-align:center;"><p>Invalid item parameters.</p></div>';
        return;
    }

    try {
        const response = await fetch(`catalog/${cat}.json`);
        if (!response.ok) throw new Error('Catalog not found');
        const items = await response.json();
        
        const item = items.find(i => i.id === id);
        if (!item) {
            container.innerHTML = '<div class="container" style="text-align:center;"><p>Item not found.</p></div>';
            return;
        }

        if (item.status === 'hold') {
            container.innerHTML = `
                <div class="container" style="text-align:center; padding-top:50px;">
                    <h2 style="color: var(--primary);">এই আইটেমটি শীঘ্রই প্রকাশিত হবে</h2>
                    <p style="color: var(--text-muted);">This item is currently on hold and will be published soon.</p>
                </div>
            `;
            return;
        }

        // Apply theme based on era
        if (item.era_theme === 'vintage') {
            document.body.classList.add('era-vintage');
        } else {
            document.body.classList.add('era-modern');
        }

        // Update document title
        document.title = `${item.name_en} | Cholafera Heritage Archive`;

        // Render Media (Video or Flip Card)
        let mediaHtml = '';
        if (item.video) {
            mediaHtml = `
                <div style="text-align: center; margin-bottom: 30px;">
                    <video src="assets/images/${cat}/videos/${item.video}" autoplay muted loop playsinline 
                           style="max-width: 100%; max-height: 500px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
                    </video>
                </div>
            `;
        } else {
            mediaHtml = `
                <div class="flip-container" onclick="this.classList.toggle('flipped')">
                    <div class="flip-inner">
                        <div class="flip-front">
                            <img src="assets/images/${cat}/${item.thumbnail}" alt="Front of ${item.name_en}" onerror="this.src='assets/images/logo/logo.png'">
                        </div>
                        <div class="flip-back">
                            <img src="assets/images/${cat}/${item.full_image}" alt="Back of ${item.name_en}" onerror="this.src='assets/images/logo/logo.png'">
                        </div>
                    </div>
                    <p style="text-align:center; font-size:0.8rem; color:var(--text-muted); margin-top:15px;">Click image to flip</p>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="container">
                ${mediaHtml}
                <div class="item-details-content">
                    <h1 style="color: var(--primary); margin-bottom: 5px;">${item.name_en}</h1>
                    <h2 style="color: var(--text-muted); font-size: 1.4rem; margin-bottom: 25px;">${item.name_bn}</h2>
                    
                    <div class="item-meta-grid">
                        <div><span class="meta-label">Year</span><span class="meta-value">${item.year || 'N/A'}</span></div>
                        <div><span class="meta-label">Material</span><span class="meta-value">${item.material || 'N/A'}</span></div>
                        <div><span class="meta-label">Dimensions</span><span class="meta-value">${item.dimensions || 'N/A'}</span></div>
                        <div><span class="meta-label">Condition</span><span class="meta-value">${item.condition || 'N/A'}</span></div>
                    </div>

                    <div style="margin-top: 35px; line-height:1.7;">
                        <h3 style="color: var(--primary); margin-bottom:10px;">Description</h3>
                        <p style="margin-bottom: 25px; color: var(--text);">${item.description_en || 'No description available.'}</p>
                        
                        <h3 style="color: var(--primary); margin-bottom:10px;">বিবরণ</h3>
                        <p style="color: var(--text);">${item.description_bn || 'কোনো বিবরণ দেওয়া নেই।'}</p>
                        
                        <p style="margin-top: 40px; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 15px;">
                            <strong>Source / Provenance:</strong> ${item.source || 'Archive'}
                        </p>
                    </div>
                </div>
            </div>
        `;

    } catch (e) {
        console.error(e);
        container.innerHTML = '<div class="container" style="text-align:center;"><p>Error loading item data. Please ensure the catalog exists and is valid JSON.</p></div>';
    }
});
