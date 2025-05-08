const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());  
app.use(express.json()); 

// Purchase endpoint (GET) to return purchase history
app.get('/purchase', (req, res) => {
    fs.readFile(path.join(__dirname, 'purchase.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load purchase history' });
        }

        try {
            const purchases = JSON.parse(data || '[]');
            res.status(200).json(purchases);
        } catch (error) {
            res.status(500).json({ error: 'Failed to parse purchase history' });
        }
    });
});

// Checkout endpoint (POST) to save purchase
app.post('/checkout', (req, res) => {
    const { email, items, total } = req.body;
    const newPurchase = {
        email,
        items,
        total,
        date: new Date().toISOString()
    };

    fs.readFile(path.join(__dirname, 'purchase.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save purchase' });
        }

        let purchases = [];
        try {
            purchases = JSON.parse(data || '[]');
        } catch (error) {
            console.log("No previous purchases found, starting fresh.");
        }

        purchases.push(newPurchase);

        fs.writeFile(path.join(__dirname, 'purchase.json'), JSON.stringify(purchases, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save purchase' });
            }
            res.status(200).json({ message: 'Purchase saved!' });
        });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

