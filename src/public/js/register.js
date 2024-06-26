const form = document.getElementById('register-form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}
    
    data.forEach((value, key) => obj[key] = value)
    console.log(data)
    console.log(obj)

    // Validaciones básicas
    if (!obj.first_name || !obj.last_name || !obj.email || !obj.password || !obj.age) {
        alert('Todos los campos son obligatorios.')
        return
    }

    try {
        const response = await fetch('/api/session/register/', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) {
            const errorData = await response.json()
            console.error('Error en la solicitud de registro:', errorData)
            throw new Error(errorData.message || 'Error en la solicitud de registro')
        }

        const json = await response.json()
        console.log(json)

        if (json.status === "success") {
            window.location.replace('/')
        } else {
            console.log(json.message)
            alert('Error en el registro: ' + json.message)
        }
    } catch (error) {
        console.error('Error en la solicitud de registro:', error)
        alert('Error en el registro: ' + error.message)
    }
})
