document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.menu-box').style.display = 'none'
    const user = JSON.parse(localStorage.getItem('loggedinUser'))
    if(user) {
        
        document.querySelector('.main-section').style.display = 'flex'
        document.querySelector('.menu-box').style.display = 'flex'
        loadActivities()
        
    } else {
        document.querySelector('.login-section').style.display = 'flex'
    }
    document.querySelector('#settings').onclick = function() {
        const user = JSON.parse(localStorage.getItem('loggedinUser'))
        document.querySelector('.modal-user-settings').style.display = 'flex'
        document.querySelector('#settings-user').innerText = user.nomeUsu
        document.querySelector('#settings-email').innerText = user.email
    }
    document.querySelector('.btn-logout-acc').onclick =  function() {
        const user = JSON.parse(localStorage.getItem('loggedinUser'))
        localStorage.removeItem(user.usuId)
        document.querySelector('.modal-user-settings').style.display = 'none'
        document.querySelector('.menu-box').style.display = 'none'
        document.querySelector('.main-section').style.display = 'none'
        document.querySelector('.login-section').style.display = 'flex'
    }
    document.querySelector('.btn-delete-acc').onclick = async function() {
        const user = JSON.parse(localStorage.getItem('loggedinUser'))
        const result = await deleteUser(user.usuId)
        if(result.Message == 'User deleted successfully.') {
            localStorage.removeItem('loggedinUser')
            document.querySelector('.modal-user-settings').style.display = 'none'
            document.querySelector('.menu-box').style.display = 'none'
            document.querySelector('.main-section').style.display = 'none'
            document.querySelector('.login-section').style.display = 'flex'
        }
        // learn how to delete activities + the schedules when you delete an account.
    }
    document.querySelector('#btn-close-settings').onclick = function() {
        document.querySelector('.modal-user-settings').style.display = 'none'
    }
})

