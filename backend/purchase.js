const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, 'data', 'purchases.json');

const ensureDataFile = () => {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("Created data directory");
    }
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '[]');
        console.log("Created empty purchases.json file");
    }
};

router.post('/', (req, res) => {
    ensureDataFile();
    const purchases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    purchases.push({
        ...req.body,
        date: new Date().toISOString()
    });
    fs.writeFileSync(dataFilePath, JSON.stringify(purchases, null, 2));
    res.json({ message: 'Purchase recorded successfully!' });
});

router.get('/', (req, res) => {
    ensureDataFile();
    const purchases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    res.json(purchases);
});

module.exports = router;
