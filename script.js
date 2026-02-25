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

// 오늘의 명화 리스트
const dailyArts = [
    {
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000",
        title: "Floral Arrangement",
        artist: "Jan van Huysum, 1724"
    },
    {
        url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2000",
        title: "The Birth of Venus",
        artist: "Sandro Botticelli, 1485"
    }
];

// 실시간 주식 데이터 업데이트 함수
async function fetchStockData() {
    try {
        // 네이버증권 KOSPI 실시간 데이터 (공개 API)
        const kospiResponse = await fetch('https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI');
        const kospiData = await kospiResponse.json();
        const kospi = kospiData.result.areas[0].data[0];
        updateTicker('kospi', kospi.nm, kospi.cv, kospi.cvp);

        // 서울옥션 (063170) 데이터
        const seoulAuctionResponse = await fetch('https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:063170');
        const seoulData = await seoulAuctionResponse.json();
        const seoul = seoulData.result.areas[0].data[0];
        updateTicker('seoul-auction', seoul.nm, seoul.cv, seoul.cvp);

        // 케이옥션 (102370) 데이터
        const kAuctionResponse = await fetch('https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:102370');
        const kData = await kAuctionResponse.json();
        const kAuction = kData.result.areas[0].data[0];
        updateTicker('k-auction', kAuction.nm, kAuction.cv, kAuction.cvp);

        // 엔비디아 (NVDA, NASDAQ) 데이터
        const nvdaResponse = await fetch('https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:NAS:NVDA');
        const nvdaData = await nvdaResponse.json();
        const nvda = nvdaData.result.areas[0].data[0];
        updateTicker('nvda', nvda.nm, nvda.cv, nvda.cvp);

        // 크리스티는 비상장 경매 하우스 — 실시간 데이터 없음, 정적 표시
        updateChristiesStatus();
    } catch (error) {
        console.log('실시간 데이터 업데이트 실패:', error);
        // fallback to simulated data
        updateMarketDataFallback();
    }
}

function updateTicker(id, price, changeValue, changePercent) {
    const card = document.getElementById('card-' + id);
    if (card) {
        const valueEl = card.querySelector('.value');
        const changeEl = card.querySelector('.change');
        
        valueEl.textContent = price;
        changeEl.textContent = (changeValue > 0 ? '▲ ' : '▼ ') + changePercent;
        changeEl.className = `change ${changeValue > 0 ? 'up' : 'down'}`;
    }
}

function updateChristiesStatus() {
    // 크리스티는 비상장 경매 하우스로 실시간 API 없음 — 정적 안내 표시
    document.querySelector('#card-christies .value').textContent = 'Non-Listed';
    document.querySelector('#card-christies .change').textContent = 'No market data';
    document.querySelector('#card-christies .change').className = 'change info';
}

function updateDailyArt() {
    const randomArt = dailyArts[Math.floor(Math.random() * dailyArts.length)];
    document.getElementById('daily-art-bg').style.backgroundImage = `url('${randomArt.url}')`;
    document.querySelector('.art-title').textContent = randomArt.title;
    document.querySelector('.art-artist').textContent = randomArt.artist;
}

function createNewsletterItems() {
    const grid = document.getElementById('newsletterGrid');
    if(!grid) return;
    
    newsletters.forEach(newsletter => {
        const item = document.createElement('div');
        item.className = 'newsletter-item';
        item.innerHTML = `
            <a href="${newsletter.link}" target="_blank" style="text-decoration:none;">
                <img src="${newsletter.thumbnail}" alt="썸네일 이미지">
                <h3>${newsletter.title}</h3>
            </a>
        `;
        grid.appendChild(item);
    });
}

function updateMarketDataFallback() {
    // 시뮬레이션 데이터 (API 실패시)
    // changeValue: 양수=상승(▲), 음수=하락(▼)
    const stockData = {
        kospi: { price: "6,012.45", changeValue: 1, changePercent: "+2.1%" },
        'seoul-auction': { price: "12,450", changeValue: 1, changePercent: "+4.2%" },
        'k-auction': { price: "5,120", changeValue: -1, changePercent: "-1.5%" },
        'nvda': { price: "134.25", changeValue: 1, changePercent: "+1.8%" }
    };

    Object.keys(stockData).forEach(key => {
        const d = stockData[key];
        updateTicker(key, d.price, d.changeValue, d.changePercent);
    });
    updateChristiesStatus();
}

document.addEventListener('DOMContentLoaded', () => {
    createNewsletterItems();
    updateDailyArt();
    
    // 초기 데이터 로드
    fetchStockData();
    
    // 30초마다 실시간 업데이트
    setInterval(fetchStockData, 30000);
    
    // 시간 업데이트
    setInterval(() => {
        const now = new Date();
        document.getElementById('current-time').textContent = now.toLocaleString('ko-KR');
    }, 1000);
});
