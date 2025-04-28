document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    localStorage.setItem('registeredEmail', email);
    localStorage.setItem('registeredPassword', password);

    alert("Registration successful!");
    window.location.href = 'index.html';  
});
