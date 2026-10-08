const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 啟動時可以先在背景預先登入蝦皮或保留瀏覽器個體以加快速度
let browserInstance = null;

async function getShopeeShortLink(targetUrl) {
    if (!browserInstance) {
        // 啟動無頭瀏覽器
        browserInstance = await chromium.launch({ headless: true });
    }
    
    const context = await browserInstance.newContext();
    const page = await context.newPage();

    try {
        // 1. 這裡可以帶入你的蝦皮聯盟後台 Cookie 或自動登入邏輯
        // （第一次使用時建議先手動把登入後的 Cookie 存下來，或是直接導向聯盟後台）
        await page.goto('https://affiliate.shopee.tw/', { waitUntil: 'networkidle' });

        // 2. 模擬在後台輸入網址並點擊產生短網址的動作（需對應蝦皮聯盟後台的輸入框與按鈕結構）
        // 假設後台有一個專門輸入推廣連結的 input
        // await page.fill('#target-input-selector', targetUrl);
        // await page.click('#generate-btn-selector');

        // 3. 抓取產生的 s.shopee.tw 短網址
        // const shortLink = await page.$eval('#result-link-selector', el => el.value);

        // 模擬抓取成功回傳
        let mockShortLink = "https://s.shopee.tw/4B0XNYD2L8";

        await context.close();
        return mockShortLink;

    } catch (error) {
        await context.close();
        throw error;
    }
}

app.post('/api/convert', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: '請提供網址' });
    }

    try {
        const shortUrl = await getShopeeShortLink(url);
        res.json({ status: 'success', shortUrl });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.toString() });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器運行在 port ${PORT}`);
});