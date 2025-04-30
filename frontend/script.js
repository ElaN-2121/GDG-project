document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "http://localhost:5000/api";
  const cartContainer = document.getElementById("cartContainer");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.getElementById("checkout");
  const logoutBtn = document.getElementById("logoutBtn");
  const modal = document.getElementById("modal");

  const isLoggedIn = localStorage.getItem("loggedIn");
  const registeredEmail = localStorage.getItem("registeredEmail");

  // Redirect if not logged in
  if (!registeredEmail || isLoggedIn !== "true") {
      if (window.location.pathname.includes("cart.html") || window.location.pathname.includes("history.html")) {
          alert("You need to log in first!");
          window.location.href = "login.html";
          return;
      }
  }

  // Logout functionality
  if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.addEventListener("click", () => {
          localStorage.setItem("loggedIn", "false");
          alert("Logged out successfully!");
          window.location.href = "login.html";
      });
  }

  // Add to Cart logic
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  if (addToCartButtons.length) {
      addToCartButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const item = {
                  name: button.dataset.name,
                  price: button.dataset.price,
                  image: button.dataset.image
              };

              let cart = JSON.parse(localStorage.getItem("cart")) || [];
              cart.push(item);
              localStorage.setItem("cart", JSON.stringify(cart));
              alert(`${item.name} added to cart!`);
          });
      });
  }

  // Render Cart (cart.html only)
  function renderCart() {
      if (!cartContainer || !totalElement) return;

      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartContainer.innerHTML = "";
      let total = 0;

      if (cartItems.length === 0) {
          cartContainer.innerHTML = "<p>Your cart is empty.</p>";
          totalElement.textContent = "Total: 0 Birr";
          return;
      }

      cartItems.forEach((item, index) => {
          const itemElement = document.createElement("div");
          itemElement.innerHTML = `
              <div class="cart-item">
                  <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                  <div class="cart-item-details">
                      <h4>${item.name}</h4>
                      <p>${item.price} Birr</p>
                      <button class="remove-btn" data-index="${index}">Remove</button>
                  </div>
              </div>
          `;
          cartContainer.appendChild(itemElement);
          total += parseFloat(item.price);
      });

      totalElement.textContent = `Total: ${total.toFixed(2)} Birr`;

      document.querySelectorAll(".remove-btn").forEach((button) => {
          button.addEventListener("click", () => {
              const index = parseInt(button.dataset.index);
              removeItem(index);
          });
      });
  }



  checkoutButton.addEventListener("click", () => {
    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

    // Get the user's email (you could replace this with actual user login data)
    const registeredEmail = "test@example.com";  // Example email

    // Prepare purchase data
    const purchaseData = {
        email: registeredEmail,
        items: cartItems,
        total: total.toFixed(2),
    };

    // Send purchase data to the backend
    fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(purchaseData)
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.message === "Purchase saved!") {
            alert("Purchase successful!");
            localStorage.removeItem("cart");  // Clear the cart after successful purchase
            window.location.href = "history.html";  // Redirect to purchase history page
        } else {
            alert("Error saving purchase");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Error during checkout");
    });
});






  // Show modal after purchase
  function showModal() {
      if (!modal) return;
      modal.style.display = "block";
      setTimeout(() => {
          modal.style.display = "none";
      }, 3000);
  }

  // Load purchase history (history.html)
  if (window.location.pathname.includes("history.html")) {
      fetch(`${API_BASE_URL}/purchases`)
          .then((response) => response.json())
          .then((purchases) => {
              const historyItems = document.querySelector(".history-items");
              historyItems.innerHTML = "";
              if (purchases.length === 0) {
                  historyItems.innerHTML = "<p>No purchases yet.</p>";
              } else {
                  purchases.forEach((purchase) => {
                      const purchaseElement = document.createElement("div");
                      purchaseElement.innerHTML = `
                          <div class="purchase-item">
                              <p>Date: ${new Date(purchase.date).toLocaleDateString()}</p>
                              <p>Total: ${purchase.total} Birr</p>
                              <ul>
                                  ${purchase.items.map(item => `<li>${item.name} - ${item.price} Birr</li>`).join('')}
                              </ul>
                          </div>
                      `;
                      historyItems.appendChild(purchaseElement);
                  });
              }
          })
          .catch((error) => {
              console.error("Error loading purchase history:", error);
              alert("Failed to load purchase history. Please try again.");
          });
  }

  // Render Cart on cart page load
  if (window.location.pathname.includes("cart.html")) {
      renderCart();
  }
});
