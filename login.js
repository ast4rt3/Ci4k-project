// login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate the credentials
    if (username === 'c' && password === 'cl') {
        // If valid, store login state (optional)
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to the client page
        window.location.href = window.location.href = 'client/main.js';  // Make sure client.html exists
    } else {
        alert('Invalid username or password');
    }
});
