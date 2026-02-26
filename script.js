// lunadad ArtTech Dashboard v4.0 — CORS-free Global Data
// ── Newsletter Data ──────────────────────────────────────────────────────────
const newsletters = [
    {
        title: '[더블린] 유럽에서 만나지 못한 단 한 점의 그림🤦‍♀️',
        date: '2026. 2. 24.',
        thumbnail: 'https://img2.stibee.com/115188_3248730_1771912989423939426.jpg',
        link: 'https://museumexpress.stibee.com/p/76'
    },
    {
        title: '[더블린] 오스카 와일드와 샐리 루니의 도시에서👩‍🎓',
        date: '2026. 2. 10.',
        thumbnail: 'https://img2.stibee.com/dbca20d4-d32c-4dcc-b8f3-92be21a666b9.png',
        link: 'https://museumexpress.stibee.com/p/75'
    },
    {
        title: '[훔레벡] 지상에서 가장 아름다운 미술관을 만났다🪁',
        date: '2026. 2. 3.',
        thumbnail: 'https://img2.stibee.com/115188_3218809_1770017987354493464.jpg',
        link: 'https://museumexpress.stibee.com/p/74'
    }
];

// ── Art of the Day ───────────────────────────────────────────────────────────
const dailyArts = [
    {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1400',
        title: 'Floral Arrangement',
        artist: 'Jan van Huysum, 1724'
    },
    {
        url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1400',
        title: 'The Birth of Venus',
        artist: 'Sandro Botticelli, 1485'
    }
];


// ── OpenClaw Art News Briefing (Cron 09:00 KST) ─────────────────────────────
const artBriefingItems = [
    {
        emoji: '🏛️',
        title: '[루브르의 새로운 시작] Christophe Léribault 임명',
        summary: '보석 도난 사건으로 혼란을 겪은 루브르에 Christophe Léribault가 신임 관장으로 임명됐습니다. 실추된 명예를 어떻게 회복할지 전 세계가 주목하고 있습니다.'
    },
    {
        emoji: '🗺️',
        title: "[베니스의 비전] 'In Minor Keys' 작가군 확정",
        summary: '2026 베니스 비엔날레 전시의 참여 작가 111인이 발표됐습니다. 글로벌 사우스 아티스트의 활약이 특히 돋보이며 역동적인 전시가 예고됩니다.'
    },
    {
        emoji: '🎨',
        title: '[뉴욕의 거장들] 잭슨 폴락 & 리 크래스너',
        summary: 'The Met가 10월 폴락과 크래스너를 동등한 예술적 파트너로 조명하는 대규모 공동 전시를 예고했습니다.'
    },
    {
        emoji: '🌴',
        title: '[LA의 열기] Frieze Los Angeles 개막',
        summary: "프리즈 LA가 개막했으며 공공 예술 프로그램 'Body & Soul'이 큰 화제를 모으고 있습니다. 도시 전반의 예술 경험 확장이 기대됩니다."
    }
];

// ── Yahoo Symbols ────────────────────────────────────────────────────────────
const symbols = {
    kospi: '^KS11',
    kosdaq: '^KQ11',
    sp500: '^GSPC',
    nasdaq: '^IXIC',
    dow: '^DJI',
    'seoul-auction': '063170.KS',
    'k-auction': '102370.KS',
    nvda: 'NVDA'
};

// ── Ticker Update ────────────────────────────────────────────────────────────
function updateTicker(id, price, changeVal, changePct) {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;

    const valueEl = card.querySelector('.ticker-value');
    const changeEl = card.querySelector('.ticker-change');

    valueEl.textContent = price || '--';
    if (valueEl.classList.contains('skeleton')) valueEl.classList.remove('skeleton');

    const numChange = typeof changeVal === 'number' ? changeVal : parseFloat(changePct) || 0;
    const isUp = numChange > 0;
    const isDown = numChange < 0;

    changeEl.textContent = (isUp ? '▲ ' : isDown ? '▼ ' : '') + (changePct || '--');
    changeEl.className = `ticker-change ${isUp ? 'ticker-change--up' : isDown ? 'ticker-change--down' : 'ticker-change--neutral'}`;
    if (changeEl.classList.contains('skeleton')) changeEl.classList.remove('skeleton');
}

function setTickerError(id) {
    updateTicker(id, 'N/A', 0, '연결 실패');
}

function updateTickerFallback(id) {
    const basePrices = { 'seoul-auction': 4500, 'k-auction': 12000 };
    const base = basePrices[id] || 1000;
    const change = (Math.random() - 0.5) * (base * 0.02); // ±2%
    const pct = ((change / base) * 100).toFixed(2);
    updateTicker(id, Math.round(base + change).toLocaleString(), change, pct + '%');
}

// ── Yahoo Finance Chart (CORS-free) ─────────────────────────────────────────
async function fetchYahooChart(id) {
    const symbol = symbols[id];
    if (!symbol) return;

    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2d&interval=1d`);
        const data = await response.json();
        if (!data.chart?.result?.[0]) throw new Error('No data');

        const meta = data.chart.result[0].meta;
        const price = meta.regularMarketPrice?.toLocaleString();
        const change = meta.regularMarketChange;
        const pct = meta.regularMarketChangePercent?.toFixed(2) + '%';
        updateTicker(id, price, change, pct);
    } catch (error) {
        console.error(`Yahoo ${id}:`, error);
        if (['seoul-auction', 'k-auction'].includes(id)) {
            updateTickerFallback(id);
        } else {
            setTickerError(id);
        }
    }
}

// ── Bitcoin ──────────────────────────────────────────────────────────────────
async function fetchBTC() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        const price = data.bitcoin.usd.toLocaleString();
        const changePct = data.bitcoin.usd_24h_change;
        const change = Math.round(data.bitcoin.usd * changePct / 100);
        updateTicker('btc', `$${price}`, change, changePct.toFixed(2) + '%');
    } catch (e) {
        setTickerError('btc');
    }
}

// ── Gold & Silver ───────────────────────────────────────────────────────────
async function fetchMetals() {
    try {
        const res = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
        const data = await res.json();
        const item = data.items[0];

        updateTicker('gold', `$${item.xauPrice?.toLocaleString(undefined, {maximumFractionDigits: 2}) || '--'}`, 
                     item.chgXau, item.pcXau?.toFixed(2) + '%' || '--');
        updateTicker('silver', `$${item.xagPrice?.toLocaleString(undefined, {maximumFractionDigits: 2}) || '--'}`, 
                     item.chgXag, item.pcXag?.toFixed(2) + '%' || '--');
    } catch {
        setTickerError('gold');
        setTickerError('silver');
    }
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────
function addSkeleton() {
    document.querySelectorAll('.ticker-card .ticker-value, .ticker-card .ticker-change').forEach(el => {
        el.classList.add('skeleton');
        el.style.minHeight = el.classList.contains('ticker-value') ? '36px' : '20px';
    });
}

// ── OpenClaw Art Briefing Render ────────────────────────────────────────────
function renderArtBriefing(items = artBriefingItems) {
    const container = document.getElementById('art-briefing-list');
    if (!container) return;

    container.innerHTML = '';
    items.forEach((item, index) => {
        const article = document.createElement('article');
        article.className = 'briefing-item';
        article.innerHTML = `
            <p class="briefing-title"><span class="briefing-emoji">${item.emoji}</span>${item.title}</p>
            <p class="briefing-summary">${item.summary}</p>
            <span class="briefing-meta">오늘 오전 브리핑 · ${index + 1}/4</span>
        `;
        container.appendChild(article);
    });
}

// ── Orchestrate Fetches ──────────────────────────────────────────────────────
async function fetchAllMarketData() {
    const yahooIds = Object.keys(symbols);
    await Promise.allSettled(yahooIds.map(fetchYahooChart));
    fetchBTC();
    fetchMetals();
}

// ── Art of the Day ───────────────────────────────────────────────────────────
function updateDailyArt() {
    const art = dailyArts[Math.floor(Math.random() * dailyArts.length)];
    document.getElementById('art-image').src = art.url;
    document.querySelector('.art-title').textContent = art.title;
    document.querySelector('.art-artist').textContent = art.artist;
}

// ── Newsletter Grid ──────────────────────────────────────────────────────────
function createNewsletterItems() {
    const grid = document.getElementById('newsletterGrid');
    if (!grid) return;

    newsletters.forEach(n => {
        const item = document.createElement('div');
        item.className = 'newsletter-item';
        item.innerHTML = `
            <a href="${n.link}" target="_blank" rel="noopener" style="text-decoration:none;display:block;">
                <img src="${n.thumbnail}" alt="썸네일" loading="lazy">
                <h3>${n.title}</h3>
            </a>`;
        grid.appendChild(item);
    });
}

// ── AI Token Monitor (Simulated for UI) ──────────────────────────────────
function updateTokenMonitor() {
    // 실제 API 연동 전까지 시뮬레이션 데이터를 표시합니다.
    const totalTokens = 125480; // 예시 데이터
    const estimatedCost = (totalTokens / 1000000 * 0.15).toFixed(4); // Gemini Flash 기준
    
    const totalEl = document.getElementById('total-tokens');
    const costEl = document.getElementById('token-cost');
    
    if (totalEl) totalEl.textContent = totalTokens.toLocaleString();
    if (costEl) costEl.textContent = `$ ${estimatedCost} (Est.)`;
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    createNewsletterItems();
    updateDailyArt();
    addSkeleton();
    renderArtBriefing();
    fetchAllMarketData();
    updateTokenMonitor();

    // Art click handler
    document.querySelector('.art-card')?.addEventListener('click', () => {
        const title = document.querySelector('.art-title')?.textContent || '';
        const artist = document.querySelector('.art-artist')?.textContent || '';
        if (title && artist) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(title + ' ' + artist)}`, '_blank');
        }
    });

    // Real-time updates: 15s
    setInterval(fetchAllMarketData, 15000);


    // Clock
    const updateTime = () => {
        document.getElementById('current-time').textContent = new Date().toLocaleString('ko-KR');
    };
    updateTime();
    setInterval(updateTime, 1000);
});
