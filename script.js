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

// 아트테크 주가 데이터 (시뮬레이션 - 실제 API 연동 가능)
const stockData = {
    seoulAuction: { price: "12,450", change: "+4.2%", status: "up" },
    kAuction: { price: "5,120", change: "-1.5%", status: "down" },
    kospi: { price: "6,012.45", change: "+2.1%", status: "up" }
};

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

function updateMarketData() {
    document.querySelector('#card-seoul-auction .value').innerText = stockData.seoulAuction.price;
    document.querySelector('#card-seoul-auction .change').innerText = `▲ ${stockData.seoulAuction.change}`;
    document.querySelector('#card-seoul-auction .change').className = `change ${stockData.seoulAuction.status}`;

    document.querySelector('#card-k-auction .value').innerText = stockData.kAuction.price;
    document.querySelector('#card-k-auction .change').innerText = `▼ ${stockData.kAuction.change}`;
    document.querySelector('#card-k-auction .change').className = `change ${stockData.kAuction.status}`;
}

function updateDailyArt() {
    const randomArt = dailyArts[Math.floor(Math.random() * dailyArts.length)];
    document.getElementById('daily-art-bg').style.backgroundImage = `url('${randomArt.url}')`;
    document.querySelector('.art-title').innerText = randomArt.title;
    document.querySelector('.art-artist').innerText = randomArt.artist;
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

document.addEventListener('DOMContentLoaded', () => {
    createNewsletterItems();
    updateMarketData();
    updateDailyArt();
    
    // 시간 업데이트
    setInterval(() => {
        const now = new Date();
        document.getElementById('current-time').innerText = now.toLocaleString();
    }, 1000);
});
