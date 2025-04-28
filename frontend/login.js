document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const enteredEmail = document.getElementById('loginEmail').value;
    const enteredPassword = document.getElementById('loginPassword').value;

    const storedEmail = localStorage.getItem('registeredEmail');
    const storedPassword = localStorage.getItem('registeredPassword');
    if (enteredEmail === storedEmail && enteredPassword === storedPassword) {
        alert('Login successful!');
        window.location.href = 'index.html'; 
    } else {
        alert('Invalid credentials');
    }
});
