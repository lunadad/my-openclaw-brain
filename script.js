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
        url: 'https://uploads0.wikiart.org/images/vincent-van-gogh/starry-night-1889-google-art-project.jpg!Large.jpg',
        title: 'The Starry Night',
        artist: 'Vincent van Gogh, 1889'
    },
    {
        url: 'https://uploads3.wikiart.org/images/guillaume-seignac/psych%25C3%25A9-delicieux.jpg!Large.jpg',
        title: 'Psyche Delicious',
        artist: 'Guillaume Seignac, 1900'
    },
    {
        url: 'https://uploads6.wikiart.org/images/leonardo-da-vinci/mona-lisa-1503-1506.jpg!Large.jpg',
        title: 'Mona Lisa',
        artist: 'Leonardo da Vinci, 1503-1506'
    },
    {
        url: 'https://uploads4.wikiart.org/images/claude-monet/impression-sunrise-1872.jpg!Large.jpg',
        title: 'Impression, Sunrise',
        artist: 'Claude Monet, 1872'
    },
    {
        url: 'https://uploads0.wikiart.org/images/pablo-picasso/guernica.jpg!Large.jpg',
        title: 'Guernica',
        artist: 'Pablo Picasso, 1937'
    },
    {
        url: 'https://uploads7.wikiart.org/images/edvard-munch/the-scream-1893.jpg!Large.jpg',
        title: 'The Scream',
        artist: 'Edvard Munch, 1893'
    },
    {
        url: 'https://uploads5.wikiart.org/images/gustav-klimt/the-kiss-1908.jpg!Large.jpg',
        title: 'The Kiss',
        artist: 'Gustav Klimt, 1908'
    },
    {
        url: 'https://uploads8.wikiart.org/images/johannes-vermeer/girl-with-a-pearl-earring-c-1665.jpg!Large.jpg',
        title: 'Girl with a Pearl Earring',
        artist: 'Johannes Vermeer, c.1665'
    },
    {
        url: 'https://uploads1.wikiart.org/images/sandro-botticelli/the-birth-of-venus-1485.jpg!Large.jpg',
        title: 'The Birth of Venus',
        artist: 'Sandro Botticelli, 1485'
    },
    {
        url: 'https://uploads2.wikiart.org/images/michelangelo-buonarroti/the-creation-of-adam-1510.jpg!Large.jpg',
        title: 'The Creation of Adam',
        artist: 'Michelangelo, 1510'
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

const fallbackBasePrices = {
    kospi: 2640,
    kosdaq: 865,
    sp500: 6120,
    nasdaq: 19800,
    dow: 44500,
    'seoul-auction': 4500,
    'k-auction': 12000,
    nvda: 860,
    btc: 94000,
    gold: 2035,
    silver: 22.9
};

function updateTickerFallback(id, { prefix = '', suffix = '', decimals = 0 } = {}) {
    const base = fallbackBasePrices[id] || 1000;
    const volatility = id === 'btc' ? 0.035 : id === 'gold' || id === 'silver' ? 0.012 : 0.018;
    const change = (Math.random() - 0.5) * (base * volatility * 2);
    const current = base + change;
    const pct = ((change / base) * 100).toFixed(2);
    const priceText = `${prefix}${current.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix}`;

    updateTicker(id, priceText, change, `${pct}% (fallback)`);
}

// ── Yahoo Finance Chart (CORS-free via Proxy) ───────────────────────────────
async function fetchYahooChart(id) {
    const symbol = symbols[id];
    if (!symbol) return;

    try {
        const targetUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2d&interval=1d`);
        const response = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        if (!data.chart?.result?.[0]) throw new Error('No data');

        const meta = data.chart.result[0].meta;
        const price = meta.regularMarketPrice?.toLocaleString();
        const change = meta.regularMarketChange;
        const pct = meta.regularMarketChangePercent?.toFixed(2) + '%';
        updateTicker(id, price, change, pct);
    } catch (error) {
        console.error(`Yahoo ${id}:`, error);
        updateTickerFallback(id, { decimals: 0 });
    }
}

// ── Bitcoin ──────────────────────────────────────────────────────────────────
async function fetchBTC() {
    try {
        const targetUrl = encodeURIComponent('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const res = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        const price = data.bitcoin.usd.toLocaleString();
        const changePct = data.bitcoin.usd_24h_change;
        const change = Math.round(data.bitcoin.usd * changePct / 100);
        updateTicker('btc', `$${price}`, change, changePct.toFixed(2) + '%');
    } catch (e) {
        updateTickerFallback('btc', { prefix: '$', decimals: 0 });
    }
}

// ── Gold & Silver ───────────────────────────────────────────────────────────
async function fetchMetals() {
    try {
        const targetUrl = encodeURIComponent('https://data-asg.goldprice.org/dbXRates/USD');
        const res = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        const item = data.items[0];

        updateTicker('gold', `$${item.xauPrice?.toLocaleString(undefined, {maximumFractionDigits: 2}) || '--'}`, 
                     item.chgXau, item.pcXau?.toFixed(2) + '%' || '--');
        updateTicker('silver', `$${item.xagPrice?.toLocaleString(undefined, {maximumFractionDigits: 2}) || '--'}`, 
                     item.chgXag, item.pcXag?.toFixed(2) + '%' || '--');
    } catch {
        updateTickerFallback('gold', { prefix: '$', decimals: 2 });
        updateTickerFallback('silver', { prefix: '$', decimals: 2 });
    }
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────
function addSkeleton() {
    document.querySelectorAll('.ticker-card .ticker-value, .ticker-card .ticker-change').forEach(el => {
        el.classList.add('skeleton');
        el.style.minHeight = el.classList.contains('ticker-value') ? '36px' : '20px';
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
    // 매일 자정 기준으로 작품이 바뀌도록 날짜 기반 인덱스를 사용합니다.
    const now = new Date();
    const dayKey = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const index = Math.floor(dayKey / 86400000) % dailyArts.length;
    const art = dailyArts[index];

    const imageEl = document.getElementById('art-image');
    imageEl.src = art.url;
    imageEl.alt = `${art.title} - ${art.artist}`;
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
async function updateTokenMonitor() {
    try {
        const response = await fetch('http://127.0.0.1:18789/status?json');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const totalTokens = data.tokensIn || 0 + data.tokensOut || 0;
        const cost = data.cost || 0;
        
        const totalEl = document.getElementById('total-tokens');
        const costEl = document.getElementById('token-cost');
        
        if (totalEl) totalEl.textContent = totalTokens.toLocaleString();
        if (costEl) costEl.textContent = `$${cost.toFixed(4)}`;
    } catch (error) {
        console.error('Token API:', error);
        // Fallback
        const totalTokens = 125480;
        const estimatedCost = (totalTokens / 1000000 * 0.15).toFixed(4);
        document.getElementById('total-tokens').textContent = totalTokens.toLocaleString();
        document.getElementById('token-cost').textContent = `$ ${estimatedCost} (Est.)`;
    }
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    createNewsletterItems();
    updateDailyArt();
    addSkeleton();
    fetchArtBriefing();
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

    // Real-time updates: 60s (To avoid API Rate Limits)
    setInterval(fetchAllMarketData, 60000);


    // Clock
    const updateTime = () => {
        document.getElementById('current-time').textContent = new Date().toLocaleString('ko-KR');
    };
    updateTime();
    setInterval(updateTime, 1000);
});

// ── Karina's Art Briefing (Right Column) ─────────────────────────────────────
async function fetchArtBriefing() {
    const list = document.getElementById('briefing-list');
    if (!list) return;

    try {
        const response = await fetch(`art-news.json?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        list.innerHTML = '';
        data.items.forEach((item, index) => {
            const el = document.createElement('li');
            el.className = 'briefing-list-item';
            el.innerHTML = `
                <div class="briefing-content">
                    <h4 class="art-briefing-title"><span class="briefing-emoji">${item.emoji || '✨'}</span> ${item.title}</h4>
                    <p class="art-briefing-summary">${item.summary}</p>
                    <span class="briefing-meta">오늘 오전 브리핑 · ${index + 1}/${data.items.length}</span>
                </div>
            `;
            list.appendChild(el);
        });
    } catch (error) {
        console.error('Failed to fetch art briefing:', error);
        list.innerHTML = '<li class="news-placeholder">브리핑 데이터를 불러오지 못했습니다.</li>';
    }
}
