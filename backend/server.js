const express = require('express');
const cors = require('cors');  // Import cors package
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors());  // This allows requests from any origin

app.use(bodyParser.json());

// Ensure the data folder and file exist
const ensureDataFile = () => {
    const dataFilePath = path.join(__dirname, 'data', 'purchases.json');
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

// Handle POST request for checkout
app.post('/api/checkout', (req, res) => {
    const { items, total } = req.body;
    const newPurchase = {
        items,
        total,
        date: new Date().toISOString()
    };

    const dataFilePath = path.join(__dirname, 'data', 'purchases.json');
    ensureDataFile();

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading purchase data' });

        const purchases = JSON.parse(data);
        purchases.push(newPurchase);

        fs.writeFile(dataFilePath, JSON.stringify(purchases, null, 2), err => {
            if (err) return res.status(500).json({ message: 'Error saving purchase' });
            res.status(200).json({ message: 'Purchase saved!' });
        });
    });
});

// Handle GET request for purchase history
app.get('/api/purchases', (req, res) => {
    const dataFilePath = path.join(__dirname, 'data', 'purchases.json');
    ensureDataFile();

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to load purchase history' });

        const purchases = JSON.parse(data);
        res.json(purchases);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
