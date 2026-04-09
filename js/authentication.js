function showAlert(message) {
    document.querySelector("#custom-alert").style.display = 'flex'
        document.querySelector(".alert-box p").innerText = message
        document.querySelector("#close-btn").onclick = function() {
            document.querySelector("#custom-alert").style.display = 'none'
        }    
}

async function handleLogin() {
    const name = document.getElementById('login-name').value
    const result = await loginUser(name)
    if(result.Message) {
        showAlert('User not found.')
        return  
    }
    localStorage.setItem('loggedinUser', JSON.stringify(result[0]))
    document.querySelector('.login-section').style.display = 'none'
    document.querySelector('.main-section').style.display = 'flex'
    document.querySelector('.menu-box').style.display = 'flex'
    loadActivities()
}

async function handleRegister() {
    const name = document.getElementById('register-user-name').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    if(password.length < 8) {
        showAlert('Password must be at least 8 characters.')
        return
    }
    if(password.length > 23) {
        showAlert('Password must be less than 23 characters.')
        return
    }
    if(password.includes(name)) {
        showAlert('Password cannot contain username.')
        return
    }
    if(!/[A-Z]/.test(password)) {
        showAlert('Password must contain at least one uppercase letter')
        return
    }
    if(!/[0-9]/.test(password)) {
        showAlert('Password must contain at least one number')
        return
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert('Email must contain correct format.')
        return
    }
    const result = await registerUser(name, email, password)
    if(result.Message === "User created successfully!") {
        document.querySelector('.register-section').style.display = 'none'
        document.querySelector('.login-section').style.display = 'flex'
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-login').onclick = handleLogin
    document.getElementById('btn-register').onclick = handleRegister
    document.getElementById('go-to-register').onclick = function() {
        document.querySelector('.login-section').style.display = 'none'
        document.querySelector('.register-section').style.display = 'flex'
    }
})