// ── Newsletter Data (매주 수요일 GitHub Actions로 자동 업데이트) ──────────────
const newsletters = [
    {
        title: '[런던] 서른 둘에 세상을 떠난 천재 화가의 회고전 😿',
        date: '2025. 2. 25.',
        thumbnail: 'https://img2.stibee.com/115188_2661167_1740057366624657831.png',
        link: 'https://museumexpress.stibee.com/p/27/'
    },
    {
        title: '[런던] 피카소 초상화에 숨은 미지의 여인은 누굴까 👩‍🦰',
        date: '2025. 2. 18.',
        thumbnail: 'https://img2.stibee.com/115188_2653974_1739896760210215074.jpg',
        link: 'https://museumexpress.stibee.com/p/26/'
    },
    {
        title: '[마드리드] 풍경화, 인물화로 가득한 취향의 미술관 🏞️',
        date: '2025. 2. 11.',
        thumbnail: 'https://img.stibee.com/115188_2646085_1739203861694706889.jpg',
        link: 'https://museumexpress.stibee.com/p/25/'
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

// ── Ticker Helpers ───────────────────────────────────────────────────────────
function updateTicker(id, price, changeValue, changePercent) {
    const card = document.getElementById('card-' + id);
    if (!card) return;

    const num = Number(changeValue);
    const isUp   = num > 0;
    const isDown  = num < 0;

    card.querySelector('.ticker-value').textContent = price;

    const changeEl = card.querySelector('.ticker-change');
    changeEl.textContent = (isUp ? '▲ ' : isDown ? '▼ ' : '') + changePercent;
    changeEl.className = 'ticker-change ' +
        (isUp ? 'ticker-change--up' : isDown ? 'ticker-change--down' : 'ticker-change--neutral');
}

function setTickerError(id) {
    const card = document.getElementById('card-' + id);
    if (!card) return;
    card.querySelector('.ticker-value').textContent = 'N/A';
    const el = card.querySelector('.ticker-change');
    el.textContent = '연결 실패';
    el.className = 'ticker-change ticker-change--neutral';
}

// ── CORS Proxy (browser→외부 API 차단 우회) ──────────────────────────────────
const proxyFetch = (url) =>
    fetch('https://corsproxy.io/?url=' + encodeURIComponent(url));

// ── Korean Market (corsproxy → Naver Finance Polling API) ────────────────────
async function fetchKoreanMarket() {
    const targets = {
        'kospi':         'https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI',
        'kosdaq':        'https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSDAQ',
        'seoul-auction': 'https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:063170',
        'k-auction':     'https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:102370',
    };

    await Promise.allSettled(
        Object.entries(targets).map(async ([id, url]) => {
            try {
                const res  = await proxyFetch(url);
                const data = await res.json();
                const item = data.result.areas[0].data[0];
                // nm = formatted current value, cv = change amount, cvp = change percent
                updateTicker(id, item.nm, Number(item.cv), item.cvp + '%');
            } catch {
                setTickerError(id);
            }
        })
    );
}

// ── NVDA (corsproxy → Naver Finance) ─────────────────────────────────────────
async function fetchNVDA() {
    try {
        const res  = await proxyFetch('https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:NAS:NVDA');
        const data = await res.json();
        const item = data.result.areas[0].data[0];
        updateTicker('nvda', item.nm, Number(item.cv), item.cvp + '%');
    } catch {
        setTickerError('nvda');
    }
}

// ── US Indices (corsproxy → Yahoo Finance) ───────────────────────────────────
async function fetchUSIndices() {
    const symbols = {
        'sp500':  '%5EGSPC',
        'nasdaq': '%5EIXIC',
        'dow':    '%5EDJI',
    };

    await Promise.allSettled(
        Object.entries(symbols).map(async ([id, sym]) => {
            try {
                const res  = await proxyFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=1d&interval=1d`);
                const data = await res.json();
                const meta = data.chart.result[0].meta;
                const price    = meta.regularMarketPrice;
                const prev     = meta.previousClose;
                const change   = price - prev;
                const changePct = ((change / prev) * 100).toFixed(2) + '%';
                updateTicker(id, price.toLocaleString('en-US', { maximumFractionDigits: 2 }), change, changePct);
            } catch {
                setTickerError(id);
            }
        })
    );
}

// ── Bitcoin (CoinGecko public API) ───────────────────────────────────────────
async function fetchBTC() {
    try {
        const res  = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        const price     = data.bitcoin.usd;
        const changePct = data.bitcoin.usd_24h_change;  // numeric, signed
        updateTicker(
            'btc',
            '$' + price.toLocaleString('en-US'),
            changePct,
            changePct.toFixed(2) + '%'
        );
    } catch {
        setTickerError('btc');
    }
}

// ── Gold & Silver (goldprice.org – CORS 허용, 등락률 포함) ───────────────────
async function fetchMetals() {
    try {
        const res  = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
        const data = await res.json();
        const item = data.items[0];

        if (item.xauPrice != null) {
            updateTicker('gold',
                '$' + item.xauPrice.toLocaleString('en-US', { maximumFractionDigits: 2 }),
                item.chgXau,
                item.pcXau.toFixed(2) + '%');
        } else {
            setTickerError('gold');
        }

        if (item.xagPrice != null) {
            updateTicker('silver',
                '$' + item.xagPrice.toLocaleString('en-US', { maximumFractionDigits: 2 }),
                item.chgXag,
                item.pcXag.toFixed(2) + '%');
        } else {
            setTickerError('silver');
        }
    } catch {
        setTickerError('gold');
        setTickerError('silver');
    }
}

// ── Naver Finance News (via RSS → JSON) ─────────────────────────────────────
async function fetchNaverNews() {
    const list = document.getElementById('news-list');
    try {
        const rssUrl = encodeURIComponent('https://rss.naver.com/finance/index.xml');
        const res    = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=5`);
        const data   = await res.json();

        if (!data.items || data.items.length === 0) throw new Error('No items');

        list.innerHTML = '';
        data.items.slice(0, 5).forEach(item => {
            const li   = document.createElement('li');
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

// ── Orchestrate all market fetches ───────────────────────────────────────────
async function fetchAllMarketData() {
    await Promise.allSettled([
        fetchKoreanMarket(),
        fetchUSIndices(),
        fetchNVDA(),
        fetchBTC(),
        fetchMetals(),
    ]);
}

// ── Art of the Day ───────────────────────────────────────────────────────────
function updateDailyArt() {
    const art = dailyArts[Math.floor(Math.random() * dailyArts.length)];
    const img = document.getElementById('art-image');
    if (img) img.src = art.url;
    const titleEl = document.querySelector('.art-title');
    const artistEl = document.querySelector('.art-artist');
    if (titleEl) titleEl.textContent = art.title;
    if (artistEl) artistEl.textContent = art.artist;
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
                <img src="${n.thumbnail}" alt="썸네일">
                <h3>${n.title}</h3>
            </a>`;
        grid.appendChild(item);
    });
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    createNewsletterItems();
    updateDailyArt();

    // Initial data load
    fetchAllMarketData();
    fetchNaverNews();

    // Refresh market data every 30 seconds
    setInterval(fetchAllMarketData, 30000);

    // Refresh news every 5 minutes
    setInterval(fetchNaverNews, 5 * 60 * 1000);

    // Clock
    const updateTime = () => {
        const el = document.getElementById('current-time');
        if (el) el.textContent = new Date().toLocaleString('ko-KR');
    };
    updateTime();
    setInterval(updateTime, 1000);
});
