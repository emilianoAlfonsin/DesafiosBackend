const socket = io()
let user

window.onload = () => {
    Swal.fire({
        title: 'Bienvenido',
        text: 'Ingrese su nombre',
        input: 'text',
        inputValidator: (value) => {
            return !value && 'Ingrese un nombre'
        },
        allowOutsideClick: false,
        confirmButtonText: 'Ingresar'
    }).then(result => {
        user = result.value
        socket.emit('newUser', user)
    })
}

const chatbox = document.getElementById('chatbox')
const log = document.getElementById('log')
chatbox.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        socket.emit('message', { user, message: e.target.value })
        e.target.value = ''
    }
})

socket.on('logs', data => {
    let messages = ''
    data.forEach(message => {
        messages += `${message.user}: ${message.message} <br>`
    })
    log.innerHTML = messages
})