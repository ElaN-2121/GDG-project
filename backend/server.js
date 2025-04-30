const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());  
app.use(express.json()); 


app.post('/checkout', (req, res) => {
    const { email, items, total } = req.body;

    if (!email || !items || !total) {
        return res.status(400).json({ error: 'Missing required fields' });
    }


    const purchaseData = {
        date: new Date().toISOString(),
        email,
        items,
        total
    };


    fs.readFile(path.join(__dirname, 'purchase.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read purchase file' });
        }

        const purchases = JSON.parse(data || '[]');
        purchases.push(purchaseData);

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
