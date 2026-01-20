const { firefox } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const stealth = StealthPlugin();
stealth.enabledEvasions.delete('user-agent-override');

firefox.use(stealth);

exports.openDomadooAffiliationPageAndFindData = async () => {
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // open url
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto("https://www.domadoo.fr/fr/affiliation");
        await page.fill('#field-email', process.env.DOMADOO_LOGIN);
        await page.fill('#field-password', process.env.DOMADOO_PASSWORD);
        await page.click('#submit-login');
        await page.waitForSelector('#my_affiliate_link', { timeout: 100000 });

        // Get the data 
        const rows = page.locator("#myaffiliateaccount-summary .list-group-hover");

        const last30days = {
            clicks: await rows.locator("div:nth-child(1) span.pull-xs-right").first().innerText(),
            uniquesClicks: await rows.locator("div:nth-child(2) span.pull-xs-right").first().innerText(),
            waitingSales: await rows.locator("div:nth-child(3) span.pull-xs-right").first().innerText(),
            approvedSales: await rows.locator("div:nth-child(4) span.pull-xs-right").first().innerText(),
            earnings: (await rows.locator("div:nth-child(5) span.pull-xs-right").first().innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' '),
        };

        const total = {
            clicks: await rows.locator("div:nth-child(1) span.pull-xs-right").nth(1).innerText(),
            uniquesClicks: await rows.locator("div:nth-child(2) span.pull-xs-right").nth(1).innerText(),
            approvedSales: await rows.locator("div:nth-child(3) span.pull-xs-right").nth(1).innerText(),
            earnings: (await rows.locator("div:nth-child(4) span.pull-xs-right").nth(1).innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' '),
            payments: (await rows.locator("div:nth-child(5) span.pull-xs-right").nth(1).innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' '),
            waitingPayments: (await rows.locator("div:nth-child(6) span.pull-xs-right").first().innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' '),
            balance: (await rows.locator("div:nth-child(7) span.pull-xs-right").first().innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' '),
        };

        const table = page.locator("#myaffiliateaccount-sales-commissions table tbody");
        const lastSales = [];
        const rowCount = await table.locator("tr").count();
        for (let i = 0; i < rowCount; i++) {
            const row = table.locator("tr").nth(i);
            const id = await row.locator("td").nth(0).innerText();
            const date = await row.locator("td").nth(1).innerText();
            const order = (await row.locator("td").nth(2).innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ');
            const commission = (await row.locator("td").nth(3).innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ');
            const status = (await row.locator("td").nth(4).innerText()).replaceAll('\n', ' ').trim();
            const approved = status.toLowerCase().includes('check')

            lastSales.push({ id, date, order, commission, approved });
        }

        await browser.close();

        return {
            last30days,
            total,
            lastSales,
        };

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données d'affiliation Domadoo :", error.message);
        browser.close();
    }
};

exports.openDomadooAffiliationPageAndGetSales = async () => {
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // open url
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto("https://www.domadoo.fr/fr/affiliation");
        await page.fill('#field-email', process.env.DOMADOO_LOGIN);
        await page.fill('#field-password', process.env.DOMADOO_PASSWORD);
        await page.click('#submit-login');
        await page.waitForSelector('#my_affiliate_link', { timeout: 100000 });

        // get the number of waiting sales
        const rows = page.locator("#myaffiliateaccount-summary .list-group-hover");
        const waitingSalesNumber = await rows.locator("div:nth-child(3) span.pull-xs-right").first().innerText();
        console.log("Waiting sales:", waitingSalesNumber);


        // open sales tab
        await page.goto("https://www.domadoo.fr/fr/affiliation?t=sales");
        const table = page.locator("#myaffiliateaccount-sales-commissions table tbody");
        const waitingSales = [];

        // get the last page number
        const pageNumber = page.locator('xpath=/html/body/main/section/div/div/section/div/div/div/div[2]/div/div[5]/div/div[2]/nav/ul/li[5]/a').innerText();
        const lastPageNumber = parseInt(await pageNumber);
        console.log("Maximum number of pages:", lastPageNumber);

        let currentPage = 1;

        while (currentPage <= lastPageNumber && waitingSales.length < parseInt(waitingSalesNumber)) {
            console.log(`Fetching page ${currentPage} of ${lastPageNumber}, currently collected ${waitingSales.length} waiting sales out of ${waitingSalesNumber}...`);

            const rowCount = await table.locator("tr").count();
            for (let i = 0; i < rowCount; i++) {
                const row = table.locator("tr").nth(i);
                const id = await row.locator("td").nth(0).innerText();
                const date = await row.locator("td").nth(1).innerText();
                const order = (await row.locator("td").nth(2).innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ');
                const commission = (await row.locator("td").nth(3).innerText()).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ');
                const status = (await row.locator("td").nth(4).innerText()).replaceAll('\n', ' ').trim();
                const approved = status.toLowerCase().includes('check')

                if (!approved) {
                    waitingSales.push({ id, date, order, commission, approved });
                }
            }
            currentPage++;

            if (currentPage <= lastPageNumber) {
                await page.goto("https://www.domadoo.fr/fr/affiliation?t=sales&p=" + currentPage);
                await page.waitForSelector("#myaffiliateaccount-sales-commissions table tbody");
            }
        }

        await browser.close();

        return waitingSales;

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données de ventes Domadoo :", error.message);
        browser.close();
    }
};

