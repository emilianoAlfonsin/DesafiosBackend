const form =  document.getElementById('restore-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value))
    fetch('/api/session/restorePassword', {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        if(result.status === 200) {
            console.log('Contraseña restaurada correctamente') 
        }else{
            console.log('Error al restaurar contraseña') 
        }
    })
})