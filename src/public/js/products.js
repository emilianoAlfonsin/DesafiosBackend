const catalog = document.getElementById('catalog')

const renderCatalog = (data) => {
    data.forEach(item => {
        const card = document.createElement('div')
        card.classList.add('list-group-item')
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>${item.price} $</p>
            <button class="btn">Add to cart</button>
        `
        catalog.appendChild(card)
    })
}
