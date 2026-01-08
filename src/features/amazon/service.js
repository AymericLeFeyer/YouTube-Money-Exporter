const cheerio = require('cheerio');
const datasource = require('./datasource');
const cache = require('../../utils/cache');

exports.fetchAmazonAffiliation = async () => {
    const reporting = await datasource.fetchAmazonReporting();
    const history = await datasource.fetchAmazonPaymentHistory();


    const $reporting = cheerio.load(reporting);
    const $history = cheerio.load(history);

    const result = {
        thisMonth: {
            clicks: $reporting("#ac-report-commission-commision-clicks").text().trim(),
            itemsOrdered: $reporting("#ac-report-commission-commision-ordered").text().trim(),
            earnings: $reporting("#ac-report-commission-commision-total").text().trim().replace('€', '').trim() + ' €',
        },
        waitingPayments: $history("#payment-cards-section div div:nth-child(2) a span span").text().trim(),
        lastUpdate: new Date().toISOString(),
    };

    cache.set(result, 'amazon.json');

    return result;
};
