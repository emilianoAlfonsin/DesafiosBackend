const logout = document.getElementById('logout-btn')

logout.addEventListener('click', () => {
    fetch('/api/session/logout', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            window.location.href = "/"  // Redirige a la página de inicio
        } else {
            console.error("Error:", data.description)
            alert("Error al cerrar sesión: " + data.description)
        }
    })
    .catch(error => {
        console.error("Error:", error)
        alert("Error al cerrar sesión. Por favor, inténtelo de nuevo.")
    })
})
