
const https = require('https');

function getUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': 'HealthScan-Test' },
            timeout: 5000
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error("Parse error"));
                }
            });
        }).on('error', reject);
    });
}

async function testLib() {
    const barcode = '3017620422003';
    const urls = [
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    ];

    for (const url of urls) {
        console.log(`Testing: ${url}`);
        try {
            const start = Date.now();
            const data = await getUrl(url);
            console.log(`Found: ${data.status}`);
            console.log(`Duration: ${Date.now() - start}ms`);
        } catch (err) {
            console.error(`Error: ${err.message}`);
        }
    }
}

testLib();
