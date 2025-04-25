const express = require("express");
const router = express.Router();

let cart = [];

router.get("/", (req, res) => {
    res.json(cart);
});

router.post("/add", (req, res) => {
    const item = req.body;
    cart.push(item);
    res.json({ message: "Item added to cart", cart });
});

router.post("/checkout", (req, res) => {
    const purchase = [...cart];
    cart = []; 
    res.json({ message: "Checkout successful", purchase });
});

module.exports = router;
