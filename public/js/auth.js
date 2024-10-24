// Utility function to make API requests
async function sendRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return { success: response.ok, data: result };
    } catch (error) {
        console.error(`${method} request to ${url} failed:`, error);
        return { success: false, data: { message: 'Request failed. Please try again.' } };
    }
}

// Handle the login form submission
document.querySelector('#login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.querySelector('#login-email').value.trim(); // Updated ID
    const password = document.querySelector('#login-password').value.trim(); // Updated ID

    const { success, data } = await sendRequest('/auth/login', 'POST', { email, password });
    console.log("Response from login API:", data);

    if (success) {
        // Redirect to the appropriate URL based on the response
        window.location.href = data.redirectUrl || '/'; // Redirect to redirectUrl or homepage
    } else {
        alert(data.message || 'Login failed. Please check your credentials.');
    }
});


// Handle the logout button click
document.querySelector('#logout-button')?.addEventListener('click', async () => {
    const { success, data } = await sendRequest('/auth/logout', 'POST');

    if (success) {
        window.location.href = '/login'; // Redirect to login page after logout
    } else {
        alert(data.message || 'An error occurred during logout. Please try again.');
    }
});

// Handle the registration form submission
document.querySelector('#register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#register-email').value; // Updated ID
    const password = document.querySelector('#register-password').value.trim(); // Updated ID
    const confirmPassword = document.querySelector('#register-confirm-password').value.trim(); // Updated ID

    // Log the passwords for debugging
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    // Check if the passwords match before submitting the form
    if (password !== confirmPassword) {
        alert('Passwords do not match! Please try again.');
        return; // Stop form submission if passwords don't match
    }

    const { success, data } = await sendRequest('/auth/register', 'POST', { name, email, password, confirmPassword });

    if (success) {
        alert('Registration successful! Redirecting to homepage...');
        window.location.href = '/'; // Redirect after successful registration
    } else {
        alert(data.message || 'Registration failed. Please try again.');
    }
});

// Check the current login status and update the UI accordingly
async function checkLoginStatus() {
    const { success, data } = await sendRequest('/auth/check-session');

    if (success && data.isLoggedIn) {
        document.querySelector('#reservations-tab').style.display = 'block'; // Show reservations tab
        document.querySelector('#login-link').style.display = 'none'; // Hide login link
        document.querySelector('#logout-button').style.display = 'block'; // Show logout button
    } else {
        document.querySelector('#reservations-tab').style.display = 'none'; // Hide reservations tab
        document.querySelector('#login-link').style.display = 'block'; // Show login link
        document.querySelector('#logout-button').style.display = 'none'; // Hide logout button
    }
}

// Check login status once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', checkLoginStatus);
