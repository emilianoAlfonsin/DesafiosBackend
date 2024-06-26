document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    try {
        const response = await fetch('/api/session/forgotpassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email})
        })
        const result = await response.json()
        alert(result.message)
    } catch (error) {
        console.log(error)
        alert('Error al solicitar restauración de contraseña')
    }
})