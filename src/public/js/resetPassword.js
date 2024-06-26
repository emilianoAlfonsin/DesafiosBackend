const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
        e.preventDefault()
        const password = e.target.password.value
        try {
            const response = await fetch(`/api/session/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })
            const result = await response.json()
            alert(result.message)
        } catch (error) {
            alert('Error al restablecer la contraseña')
        }
    })