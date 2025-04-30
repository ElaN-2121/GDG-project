document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "http://localhost:5000/api";
  const cartContainer = document.getElementById("cartContainer");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.getElementById("checkout");
  const logoutBtn = document.getElementById("logoutBtn");
  const modal = document.getElementById("modal");

  const isLoggedIn = localStorage.getItem("loggedIn");
  const registeredEmail = localStorage.getItem("registeredEmail");

  if (!registeredEmail || isLoggedIn !== "true") {
      if (window.location.pathname.includes("cart.html") || window.location.pathname.includes("history.html")) {
          alert("You need to log in first!");
          window.location.href = "login.html";
          return;
      }
  }

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
                      <p>${item.price} </p>
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
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

    const registeredEmail = "test@example.com";  

    const purchaseData = {
        email: registeredEmail,
        items: cartItems,
        total: total.toFixed(2),
    };

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
            localStorage.removeItem("cart");
            window.location.href = "history.html";  
        } else {
            alert("Error saving purchase");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Error during checkout");
    });
});

  function showModal() {
      if (!modal) return;
      modal.style.display = "block";
      setTimeout(() => {
          modal.style.display = "none";
      }, 3000);
  }

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

  if (window.location.pathname.includes("cart.html")) {
      renderCart();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "http://localhost:5000/api";
  const cartContainer = document.getElementById("cartContainer");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.getElementById("checkout");
  const logoutBtn = document.getElementById("logoutBtn");
  const modal = document.getElementById("modal");

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const registeredEmail = localStorage.getItem("registeredEmail");

  if (!registeredEmail || !isLoggedIn) {
      alert("You need to log in first!");
      window.location.href = "login.html";
      return;
  }

  if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.addEventListener("click", () => {
          localStorage.setItem("loggedIn", "false");
          alert("Logged out successfully!");
          window.location.href = "login.html";
      });
  }

  function renderCart() {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartContainer.innerHTML = "";
      let total = 0;

      if (cartItems.length === 0) {
          cartContainer.innerHTML = "<p>Your cart is empty.</p>";
          totalElement.textContent = "Total: 0 ";
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

  function removeItem(index) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
  }

  if (checkoutButton) {
      checkoutButton.addEventListener("click", () => {
          console.log("Checkout button clicked!");
          handleCheckout();
      });
  }

  renderCart();
});