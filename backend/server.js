const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/checkout', (req, res) => {
    const { items, total } = req.body;
    const newPurchase = {
        items,
        total,
        date: new Date().toISOString()
    };

    fs.readFile('purchases.json', 'utf8', (err, data) => {
        let purchases = [];
        if (!err && data) {
            purchases = JSON.parse(data);
        }

        purchases.push(newPurchase);

        fs.writeFile('purchases.json', JSON.stringify(purchases, null, 2), err => {
            if (err) {
                return res.status(500).json({ message: 'Error saving purchase' });
            }
            res.status(200).json({ message: 'Purchase saved!' });
        });
    });
});

app.get('/api/purchases', (req, res) => {
    fs.readFile('purchases.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load purchase history' });
        }
        const purchases = JSON.parse(data);
        res.json(purchases);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const purchasesRoute = require('./purchases');
app.use('/api/purchases', purchasesRoute);

