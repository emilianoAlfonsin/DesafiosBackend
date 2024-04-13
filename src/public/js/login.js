const form =  document.getElementById('login-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value))
    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        if(result.status === 200) {
            window.location.replace('/products')
        } else {
            console.error('Error en el inicio de sesión')
            //Mostrar mensaje de error al usuario
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de inicio de sesión:', error)
        //Mostrar mensaje de error al usuario
    })
})