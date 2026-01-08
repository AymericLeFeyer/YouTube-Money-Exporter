const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = '../cache';

exports.set = async (data, filename) => {
    const cacheDir = path.join(__dirname, CACHE_FOLDER);
    if (!fs.existsSync(cacheDir)){
        fs.mkdirSync(cacheDir);
    }

    const filePath = path.join(cacheDir, filename);
    console.log(`⬇️ Saving cache to ${filePath}`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

exports.get = async (filename) => {
    const filePath = path.join(__dirname, CACHE_FOLDER, filename);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    return null;
}