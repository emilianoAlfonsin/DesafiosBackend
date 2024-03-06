const socket = io()
const productList = document.getElementById("productList")
const productForm = document.getElementById("productForm")


//Renderizar la lista de productos cuando se carga la página
window.onload = async () => {
    const response = await fetch("/api/products/")
    const products = await response.json()
    renderProducts(products)
}

// Escuchar el evento "productList" del servidor
socket.on("productList", (products) => {
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

    // Agregar el nuevo producto a la lista existente en la página
    renderProduct(product)

    // Emitir el nuevo producto al servidor para almacenarlo en products.json
    socket.emit("newProduct", product)
    console.log(product)
})

// Actualizar la lista de productos cuando se recibe un nuevo producto
socket.on("productAdded", (product) => {
    // console.log(product)
    renderProduct(product)
})

// Función para renderizar la lista de productos en la página
const renderProducts = (products) => {
    const prodArray = Array.isArray(products) ? products : [products] // Si products es un array, lo asigno a prodArray, sino lo convierto en un array.
    // console.log(prodArray)
    productList.innerHTML = ""
    prodArray.forEach(product => renderProduct(product))
}

// Función para renderizar un producto en la lista (textContent devuelve el contenido en una concatenación de texto)
// -- luego renderizaré los productos en cards --
const renderProduct = (product) => {
    // console.log(product)
    const li = document.createElement("li")
    li.textContent = `${product.title}: ${product.description}, Precio: ${Number(product.price)}, Código: ${product.code}, Stock: ${Number(product.stock)}, Estado: ${product.status}`

    // Agregar el estado del producto al elemento li
    // const estado = document.createElement("span")
    // estado.textContent = !product.status ? ", Estado: Inactivo" : ", Estado: Activo"
    // li.appendChild(estado)

    productList.appendChild(li)
}



