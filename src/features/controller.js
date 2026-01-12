const router = require('express').Router();
const cache = require('../utils/cache');

router.get('/', async (req, res) => {
    try {
        const youtube = await cache.get('youtube.json');
        const domadoo = await cache.get('domadoo.json');
        const amazon = await cache.get('amazon.json');
        const instagram = await cache.get('instagram.json');

        res.json({ youtube, domadoo, amazon, instagram });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des données globales.' 
        });
    }
});

module.exports = router;