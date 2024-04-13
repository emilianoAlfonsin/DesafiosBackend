const form = document.getElementById('register-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}
    console.log(data)
    console.log(obj)

    data.forEach((value, key) => obj[key] = value)

    fetch('/api/session/register/', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((result) => result.json())
    .then((json) => {
        console.log(json)
    })
})