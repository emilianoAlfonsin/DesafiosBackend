const form = document.getElementById('register-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}
    
    data.forEach((value, key) => obj[key] = value)
    console.log(data)
    console.log(obj)

    fetch('/api/session/register/', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((result) => {
        if (!result.ok) throw new Error('Error en la solicitud de registro')
        return result.json()
    })
    .then((json) => {
        console.log(json)
        // Verificar si el registro fue exitoso
        if (json.status === "success") {
            window.location.replace('/')
        } else {
            console.log(json.message)
            alert('Error en el registro', json.message)
        }
    })
    .catch((error) => {
        console.error('Error en la solicitud de registro:', error)
        alert('Error en el registro', error.message)
    })
})