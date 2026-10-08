const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 轉換邏輯核心
function generateShopeeLink(originalUrl) {
    try {
        // 確保網址解碼
        let decodedUrl = decodeURIComponent(originalUrl);
        
        // 移除原有的多餘參數，保留乾淨路徑
        let cleanUrl = decodedUrl.split('?')[0];
        
        // 🌟 請把這裡換成你在蝦皮聯盟獲得的你的專屬分潤代碼 (Affiliate ID)
        let myAffId = "16376320025"; 
        
        // 組合出帶有你完整分潤追蹤的網址
        let finalUrl = cleanUrl + "?utm_source=affiliate&aff_id=" + myAffId;
        
        return finalUrl;
    } catch (e) {
        return originalUrl;
    }
}

app.post('/api/convert', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: '請提供網址' });
    }

    const shortUrl = generateShopeeLink(url);
    res.json({ status: 'success', shortUrl });
});

app.get('/', (req, res) => {
    res.send('Shopee Link Converter API is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器運行在 port ${PORT}`);
});