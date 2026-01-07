const fs = require('fs');
const path = require('path');

exports.set = async (data, filename, destination) => {
    const cacheDir = path.join(__dirname, destination);
    if (!fs.existsSync(cacheDir)){
        fs.mkdirSync(cacheDir);
    }

    const filePath = path.join(cacheDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

exports.get = async (filename, destination) => {
    const filePath = path.join(__dirname, destination, filename);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    return null;
}