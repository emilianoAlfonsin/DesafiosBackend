const form =  document.getElementById('login-form')
const errorMessage = document.getElementById('error-message')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value))
    try {
        const response = await fetch('/api/session/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        const json = await response.json()

        if (response.status === 200) {
            window.location.replace('/products')
        } else {
            console.log('Error en la solicitud de inicio de sesión')
            errorMessage.textContent = json.message
            errorMessage.style.display = 'block' // Mostrar el mensaje de error
        }
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error)
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block' // Mostrar el mensaje de error
    }
})
