document.addEventListener('DOMContentLoaded', async () => {
    const counters = document.querySelectorAll('.stats-number');
    let hasAnimated = false;
    
    // Dynamically calculate total items if needed
    const statItems = document.getElementById('stat-items');
    if (statItems) {
        try {
            // Add other catalogs to this array as they are created
            const catalogs = ['bangladesh-coins'];
            let totalItems = 0;
            for (const cat of catalogs) {
                const res = await fetch(`catalog/${cat}.json`);
                if (res.ok) {
                    const data = await res.json();
                    totalItems += data.filter(i => i.status === 'published').length;
                }
            }
            statItems.setAttribute('data-target', totalItems);
        } catch (e) {
            console.error('Error fetching catalog stats:', e);
            statItems.setAttribute('data-target', 0);
        }
    }

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (target === 0) {
                counter.innerText = '0';
                return;
            }
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                    // Add plus sign for items
                    if (counter.id === 'stat-items' || counter.id === 'stat-years' || counter.id === 'stat-countries') {
                        counter.innerText += '+';
                    }
                }
            };
            updateCounter();
        });
    };

    // Intersection Observer to trigger on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        observer.observe(statsBar);
    }
});
