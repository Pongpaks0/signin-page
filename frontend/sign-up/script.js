const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('password-error');

emailInput.addEventListener('blur', function () {
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email or phone number.';
    } else {
        emailError.textContent = '';
    }
});

passwordInput.addEventListener('blur', function () {
    const password = passwordInput.value.trim();
    if (!validatePassword(password)) {
        passwordError.textContent = 'Password must contain 4 to 60 characters.';
    } else {
        passwordError.textContent = '';
    }
});

document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address or phone number.';
        return;
    } else {
        emailError.textContent = '';
    }

    if (!validatePassword(password)) {
        passwordError.textContent = 'Password must be between 4 to 60 characters long.';
        return;
    } else {
        passwordError.textContent = '';
    }

    try {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.error || 'Failed to sign up');
        }

        const result = await response.json();
        window.location.href = '../index.html';
        alert(result.message);
    } catch (error) {
        console.error('Error:', error.message);
    }
});

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{1,14}$/;
    return emailRegex.test(email) || phoneRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 4 && password.length <= 60;
}