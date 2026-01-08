const cron = require('node-cron');
const youtubeService = require('../features/youtube/service');
const domadooService = require('../features/domadoo/service');
const amazonService = require('../features/amazon/service');

const initCrons = () => {
    // Each hour
    cron.schedule('0 * * * *', () => {
        console.log("🔄 Exécution des tâches planifiées...");
        youtubeService.fetchYouTubeReporting();
        domadooService.fetchDomadooAffiliation();
    });
    // Each day at midnight
    cron.schedule('0 0 * * *', () => {
        console.log("🔄 Exécution des tâches planifiées...");
        amazonService.fetchAmazonAffiliation();
    });
   
    console.log("✅ Gestionnaire de tâches planifiées activé.");
};

module.exports = initCrons;