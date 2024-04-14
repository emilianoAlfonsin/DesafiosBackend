const logout = document.getElementById('logout-btn')

logout.addEventListener('click', () => {
    window.location.href = '/api/session/logout'
})