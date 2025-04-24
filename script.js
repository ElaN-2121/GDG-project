document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));
            const image = this.getAttribute("data-image");

            const item = { name, price, image };
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(item);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`Item added to cart! 🛒`);
        });
    });
    const container = document.getElementById("cart-items");
    if (container) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const summary = document.createElement("div");
        summary.className = "cart-summary";

        let total = 0;

        if (cart.length === 0) {
            container.innerHTML += "<p>Your cart is empty 🛒</p>";
        } else {
            cart.forEach((item, index) => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "cart-item";

                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: ${item.price} birr</p>
                        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                    </div>
                `;

                container.appendChild(itemDiv);
                total += item.price;
            });

            summary.innerHTML = `
                <h3>Total: <strong>${total} birr</strong></h3>
                <button class="checkout-btn">Checkout</button>
            `;
            container.appendChild(summary);

            document.querySelector(".checkout-btn").addEventListener("click", function () {
                const cart = JSON.parse(localStorage.getItem("cart")) || [];

                if (cart.length > 0) {
                    const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
                    const now = new Date();
                    history.push({
                        items: cart,
                        date: now.toLocaleString(),
                        total: cart.reduce((sum, item) => sum + item.price, 0)
                    });
                    localStorage.setItem("purchaseHistory", JSON.stringify(history));
                }

                const modal = document.getElementById("checkout-modal");
                if (modal) modal.style.display = "flex";

                const audio = document.getElementById("checkout-sound");
                if (audio) audio.play();

                localStorage.removeItem("cart");
            });
        }
    }

    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            document.getElementById("checkout-modal").style.display = "none";
            location.reload();
        });
    }

    const historyContainer = document.querySelector(".history-items");
    if (historyContainer) {
        const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];

        if (history.length === 0) {
            historyContainer.innerHTML = "<p>No past purchases yet 🕰️</p>";
        } else {
            history.forEach((record) => {
                const entry = document.createElement("div");
                entry.className = "history-record";

                const itemsList = record.items
                    .map(item => `🛍️ ${item.name} - ${item.price} birr`)
                    .join("<br>");

                entry.innerHTML = `
                    <p><strong>Date:</strong> ${record.date}</p>
                    <p><strong>Total:</strong> ${record.total} birr</p>
                    <div class="history-items-list">${itemsList}</div>
                    <hr>
                `;
                historyContainer.appendChild(entry);
            });
        }
    }
});

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}
