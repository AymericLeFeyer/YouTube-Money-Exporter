const { chromium } = require('playwright');

exports.fetchAmazonReporting = async () => {
    const browser = await chromium.launch({ 
        headless: true, // FORCE le mode headless pour le test
        args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
            '--disable-bluetooth',
            '--mute-audio',
            '--no-sandbox', // Souvent nécessaire dans Docker
            '--disable-setuid-sandbox',
            '--disable-extensions',
        ]
     });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // open url
        await page.goto("https://partenaires.amazon.fr/p/reporting/earnings");
        await page.fill('#ap_email', process.env.AMAZON_LOGIN);
        await page.click('#continue');
        await page.fill('#ap_password', process.env.AMAZON_PASSWORD);
        await page.click('#signInSubmit');

        // Wait 3s
        await page.waitForTimeout(3000);

        // Get the data
        const thisMonth = {
            clicks: await page.textContent("#ac-report-commission-commision-clicks"),
            itemsOrdered: await page.textContent("#ac-report-commission-commision-ordered"),
            earnings: (await page.textContent("#ac-report-commission-commision-total")).replace('€', '').trim() + ' €',
        }

        // Click on history
        await page.goto("https://partenaires.amazon.fr/home/account/paymentHistory");
        const waitingPayments = await page.textContent("#payment-cards-section div div:nth-child(2) a span span");

        await browser.close();
        
        return {
            thisMonth,
            waitingPayments,
        };

    } catch (error) {
        console.error("❌ Erreur lors de la navigation vers la page Amazon Reporting :", error.message);
    }
    return ""
};
