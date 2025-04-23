document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const target = button.getAttribute('onclick').split("'")[1];
        window.location.href = target;  
    });
});

const cartCountElement = document.querySelector('#cart-count'); 
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; 

function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cartItems.length; 
    }
}

function addToCart(productId) {
    cartItems.push(productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
    updateCartCount(); 
}

updateCartCount();
