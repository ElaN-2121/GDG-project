// Run once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Find all buttons with class 'add-to-cart-btn'
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
});document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items");
    const summary = document.createElement("div");
    summary.className = "cart-summary";

    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty 🛒</p>";
        return;
    }

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
        <h3>Total: ${total} birr</h3>
        <button class="checkout-btn">Checkout</button>
    `;
    container.appendChild(summary);
});
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload(); // Refresh to update view
}
