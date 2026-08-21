document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const cat = params.get('cat');
    const container = document.getElementById('item-detail');

    const emptyStateHtml = (msg, msg_en) => `
        <div class="container" style="display:grid; place-items:center; min-height:50vh;">
            <div class="empty-state" style="max-width: 500px; width: 100%;">
                <i class="fa-solid fa-box-archive"></i>
                <h3>${msg}</h3>
                <p>${msg_en}</p>
            </div>
        </div>
    `;

    if (!id || !cat) {
        container.innerHTML = emptyStateHtml('সঠিক আইটেম পাওয়া যায়নি', 'Invalid item parameters.');
        return;
    }

    // Show skeleton layout before fetch
    container.innerHTML = `
        <div class="container" style="display:grid; gap:30px; margin-top:40px;">
            <div class="skeleton-box" style="height: 400px; width: 100%; max-width:400px; margin: 0 auto; border-radius: 8px;"></div>
            <div style="text-align:center;">
                <div class="skeleton-box skeleton-title" style="margin: 0 auto 15px;"></div>
                <div class="skeleton-box skeleton-text" style="margin: 0 auto 10px;"></div>
                <div class="skeleton-box skeleton-text short" style="margin: 0 auto;"></div>
            </div>
        </div>
    `;

    try {
        const response = await fetch(`catalog/${cat}.json`);
        if (!response.ok) throw new Error('Catalog not found');
        const items = await response.json();
        
        const item = items.find(i => i.id === id);
        if (!item) {
            container.innerHTML = emptyStateHtml('আইটেমটি খুঁজে পাওয়া যায়নি', 'Item not found in the catalog.');
            return;
        }

        if (item.status === 'hold') {
            container.innerHTML = emptyStateHtml('এই আইটেমটি শীঘ্রই প্রকাশিত হবে', 'This item is currently on hold and will be published soon.');
            return;
        }

        // Apply theme based on era
        if (item.era_theme === 'vintage') {
            document.body.classList.add('era-vintage');
        } else {
            document.body.classList.add('era-modern');
        }
        // Update document title and social meta tags
        const pageTitle = `${item.name_en} | Cholafera Heritage Archive`;
        document.title = pageTitle;
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", pageTitle);
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", item.description_en);
        
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && item.full_image) {
            ogImage.setAttribute("content", `https://cholafera-heritage-archive.netlify.app/assets/images/${cat}/${item.full_image}`);
        }
        
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute("content", window.location.href);

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

        let historyHtml = '';
        if (item.history_sections && Array.isArray(item.history_sections) && item.history_sections.length > 0) {
            item.history_sections.forEach(sec => {
                historyHtml += `
                    <div class="history-section">
                        ${sec.heading_en ? `<h3>${sec.heading_en}</h3>` : ''}
                        ${sec.content_en ? `<p>${sec.content_en}</p>` : ''}
                        ${sec.heading_bn ? `<h3>${sec.heading_bn}</h3>` : ''}
                        ${sec.content_bn ? `<p>${sec.content_bn}</p>` : ''}
                    </div>
                `;
            });
        } else {
            historyHtml = `
                <h3 style="color: var(--primary); margin-bottom:10px;">Description</h3>
                <p style="margin-bottom: 25px; color: var(--text);">${item.description_en || 'No description available.'}</p>
                
                <h3 style="color: var(--primary); margin-bottom:10px;">বিবরণ</h3>
                <p style="color: var(--text);">${item.description_bn || 'কোনো বিবরণ দেওয়া নেই।'}</p>
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
                        ${historyHtml}
                        
                        <p style="margin-top: 40px; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 15px;">
                            <strong>Source / Provenance:</strong> ${item.source || 'Archive'}
                        </p>
                    </div>
                </div>
            </div>
        `;

    } catch (e) {
        console.error(e);
        container.innerHTML = emptyStateHtml('Error loading item.', 'Error loading item data. Please ensure the catalog exists and is valid JSON.');
    }

    // Lightbox Logic
    const overlay = document.getElementById('lightbox');
    const overlayImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    
    if (overlay && overlayImg && closeBtn) {
        const images = container.querySelectorAll('.flip-container img, .single-image img');
        images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.stopPropagation(); 
                overlayImg.src = img.src.replace('/thumbs/', '/full/');
                overlay.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    }
});
