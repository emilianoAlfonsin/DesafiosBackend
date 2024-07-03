document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log('Formulario enviado')
    const form = e.target
    const data = new FormData(form)
    const token = window.location.pathname.split('/').pop() // Obtener el token de la ruta
    console.log('Token:', token)

    if (!token) {
        alert('Token no válido')
        return
    }

    const response = await fetch(`/api/session/reset-password/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: data.get('password')
        })
    })

    const result = await response.json()
    console.log('Respuesta:', result)

    if (response.ok) {
        alert('Contraseña restablecida correctamente')
        window.location.href = '/' // Redirigir al login o a otra página
    } else {
        alert(result.message || 'Error al restablecer la contraseña')
    }
})
