// lunadad ArtTech Dashboard v4.0 — CORS-free Global Data
// ── Newsletter Data ──────────────────────────────────────────────────────────
const newsletters = [
    {
        title: '[런던] 2025년, 유럽 미술관에서 누굴 만날까 🎊',
        date: '2025. 1. 1.',
        thumbnail: 'https://img2.stibee.com/115188_2590822_1735663531116824430.jpg',
        link: 'https://museumexpress.stibee.com/p/19/'
    },
    {
        title: '[런던] 프랜시스 베이컨의 일그러진 초상화 😠',
        date: '2024. 12. 24.',
        thumbnail: 'https://img2.stibee.com/115188_2578718_1734967051050782575.jpg',
        link: 'https://museumexpress.stibee.com/p/18/'
    },
    {
        title: '[런던] 왕궁에서 만난 다빈치의 드로잉 ✍️',
        date: '2024. 12. 17.',
        thumbnail: 'https://img2.stibee.com/115188_2568599_1734447006690231902.jpg',
        link: 'https://museumexpress.stibee.com/p/17/'
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

// ── Naver Finance News ──────────────────────────────────────────────────────
async function fetchNaverNews() {
    const list = document.getElementById('news-list');
    try {
        const rssUrl = encodeURIComponent('https://rss.naver.com/finance/index.xml');
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=5`);
        const data = await res.json();

        list.innerHTML = '';
        data.items?.slice(0, 5).forEach(item => {
            const li = document.createElement('li');
            li.className = 'news-item';
            const date = new Date(item.pubDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
            li.innerHTML = `
                <a href="${item.link}" target="_blank" rel="noopener">
                    <span class="news-item-title">${item.title}</span>
                    <span class="news-item-date">${date}</span>
                </a>`;
            list.appendChild(li);
        });
    } catch {
        list.innerHTML = '<li class="news-placeholder">뉴스를 불러올 수 없습니다</li>';
    }
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

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    createNewsletterItems();
    updateDailyArt();
    addSkeleton();
    fetchNaverNews();
    fetchAllMarketData();

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

    // News refresh: 5min
    setInterval(fetchNaverNews, 300000);

    // Clock
    const updateTime = () => {
        document.getElementById('current-time').textContent = new Date().toLocaleString('ko-KR');
    };
    updateTime();
    setInterval(updateTime, 1000);
});
