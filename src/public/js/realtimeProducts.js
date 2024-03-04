const socket = io()
const productList = document.getElementById("productList")
const productForm = document.getElementById("productForm")

// Renderizar la lista de productos cuando se carga la página
window.onload = async () => {
    const response = await fetch("/api/products/")
    const products = await response.json()
    renderProducts(products)
}

// Manejar el envío del formulario
productForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(productForm)
    const product = {}
    formData.forEach((value, key) => {
        product[key] = value
    })

    // Agregar el nuevo producto a la lista existente en la página
    renderProduct(product)

    // Emitir el nuevo producto al servidor
    socket.emit("newProduct", product)
})

// Actualizar la lista de productos cuando se recibe un nuevo producto
socket.on("productAdded", (product) => {
    renderProduct(product)
})

// Función para renderizar la lista de productos en la página
const renderProducts = (products) => {
    productList.innerHTML = ""
    products.forEach(product => renderProduct(product))
}

// Función para renderizar un producto en la lista
const renderProduct = (product) => {
    const li = document.createElement("li")
    li.textContent = `${product.title}: ${product.description}, Precio: ${product.price}, Stock: ${product.stock}`

    // Agregar el estado del producto al elemento li
    const estado = document.createElement("span")
    estado.textContent = product.status ? ", Estado: Activo" : ", Estado: Inactivo"
    li.appendChild(estado)

    productList.appendChild(li)
}



