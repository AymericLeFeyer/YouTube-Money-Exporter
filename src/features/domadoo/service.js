const datasource = require('./datasource');
const cache = require('../../utils/cache');

exports.fetchDomadooAffiliation = async () => {
    console.log("🌐 Fetching Domadoo data...");

    const data = await datasource.openDomadooAffiliationPageAndFindData();
    const sales = await cache.get('domadoo-sales.json');
    let waitingSalesTotal = 0;

    if (sales !== null) {
        waitingSalesTotal = sales.reduce((total, sale) => total + parseFloat(sale.commission.replace('€', '').replace(',', '.')), 0).toFixed(2);
    }

    data.last30days.waitingSalesTotal = `${waitingSalesTotal} €`.replace('.', ',');

    const result = {
        ...data,
        lastUpdate: new Date().toISOString(),
    };

    cache.set(result, 'domadoo.json');

    return result;
};

exports.fetchDomadooSales = async () => {
    console.log("🌐 Fetching Domadoo sales data...");

    try {
        const data = await datasource.openDomadooAffiliationPageAndGetSales();
        cache.set(data, 'domadoo-sales.json');
    } catch (error) {
        console.error(error);
    }
};