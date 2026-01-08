require('dotenv').config();

const express = require('express');
const initCrons = require('./src/crons/crons');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour lire le JSON
app.use(express.json());

// --- ROUTES API ---
app.use('/api/', require('./src/features/controller'));
app.use('/api/amazon', require('./src/features/amazon/controller'));
app.use('/api/domadoo', require('./src/features/domadoo/controller'));
app.use('/api/youtube', require('./src/features/youtube/controller'));


// --- DÉMARRAGE ---
app.listen(PORT, () => {
    console.log(`🚀 Serveur API lancé sur http://localhost:${PORT}`);
    
    // Lancement des crons une fois que le serveur est prêt
    initCrons();
});