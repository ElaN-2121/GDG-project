const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, 'data', 'purchases.json');

// Ensure the data folder and file exist
const ensureDataFile = () => {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, '[]');
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
