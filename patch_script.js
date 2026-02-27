// ── OpenClaw Art Briefing Render ────────────────────────────────────────────
async function renderArtBriefing() {
    const container = document.getElementById('art-briefing-list');
    if (!container) return;

    try {
        const response = await fetch(`art-news.json?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('fetch error');
        const data = await response.json();
        const items = data.items || [];
        
        container.innerHTML = '';
        items.forEach((item, index) => {
            const article = document.createElement('article');
            article.className = 'briefing-item';
            article.innerHTML = `
                <p class="briefing-title"><span class="briefing-emoji">${item.emoji || '✨'}</span>${item.title}</p>
                <p class="briefing-summary">${item.summary}</p>
                <span class="briefing-meta">오늘 오전 브리핑 · ${index + 1}/${items.length}</span>
            `;
            container.appendChild(article);
        });
    } catch (e) {
        container.innerHTML = '<p class="news-placeholder">오늘의 브리핑을 불러오지 못했습니다.</p>';
        console.error('Art briefing error:', e);
    }
}
