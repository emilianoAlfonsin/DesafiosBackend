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
        if (user) socket.emit('newUser', user)
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

socket.on('error', (error) =>
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error'
    })
)

socket.on('messageLogs', data => {
    const lastMessage = data[data.length - 1]
    const messageElement = document.createElement('div')
    messageElement.classList.add('alert', 'alert-primary', 'mb-2')
    messageElement.textContent = `${lastMessage.user}: ${lastMessage.message}`
    log.appendChild(messageElement)
})
