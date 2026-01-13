const cron = require('../../utils/cron');
const router = require('express').Router();
const cache = require('../../utils/cache');
const service = require('./service');

// Init scheduled task
cron.eachHour(service.fetchDiscordData, 'Discord');

// Launch first fetch immediately
service.fetchDiscordData();

// Routes
router.get('/', async (req, res) => {
    try {
        const data = await service.fetchDiscordData();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des données Discord.' 
        });
    }
});

router.get('/last', async (req, res) => {
    try {
        const cachedData = await cache.get('discord.json', '../features/discord/cache');
        if (cachedData) {
            res.json(cachedData);
        } else {
            res.status(404).json({ error: 'Aucune donnée en cache trouvée.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des données en cache.' 
        });
    }
});

module.exports = router;