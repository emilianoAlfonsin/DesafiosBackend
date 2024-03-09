const socket = io()
const productList = document.getElementById("productList")
const productForm = document.getElementById("productForm")


// Escuchar el evento "productList" del servidor
socket.on("initialProductList", (products) => {
    console.log("Lista de productos recibida:", products)
    renderProducts(products)
})

// Manejar el envío del formulario
productForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(productForm)
    const product = {}
    formData.forEach((value, key) => {
        product[key] = value
    })

    // Emitir el nuevo producto al servidor para almacenarlo en products.json
    socket.emit("newProduct", product)
    console.log("Cliente/evento newProduct", product)
})

//Recibir el evento desde el servidor
socket.on("productList", (products) => {
    console.log("Lista de productos actualizada: ", products)
    renderProducts(products)
})

// Función para renderizar la lista de productos en la página
const renderProducts = (productsArray) => {
    productList.innerHTML = ""
    productsArray.forEach((product) => {
        const productElement = document.createElement("div")
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>Descripción: ${product.description}</p>
            <p>Precio: $${product.price}</p>
            <img src=${product.thumbnail} alt=${product.thumbnail}>
            <p>Codigo: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
        `
        productList.appendChild(productElement)
    })
}
