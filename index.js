require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware pour lire le JSON
app.use(express.json());

// --- ROUTES API ---
// You can remove the providers you don't need
app.use('/api/', require('./src/features/controller'));
if (process.env.AMAZON_LOGIN && process.env.AMAZON_PASSWORD) {
    app.use('/api/amazon', require('./src/features/amazon/controller'));
}
if (process.env.DOMADOO_LOGIN && process.env.DOMADOO_PASSWORD) {
    app.use('/api/domadoo', require('./src/features/domadoo/controller'));
}
if (process.env.GCP_CLIENT_ID && process.env.GCP_CLIENT_SECRET && process.env.GCP_REFRESH_TOKEN) {
    app.use('/api/youtube', require('./src/features/youtube/controller'));
}



// --- DÉMARRAGE ---
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});