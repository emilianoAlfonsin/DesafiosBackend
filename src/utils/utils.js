import {fileURLToPath} from 'url'
import { dirname } from 'path'
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import { fakerES as faker } from '@faker-js/faker'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

// Validación en mongoose de id 
export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}


//Hasheo de contraseñas
export function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

//Validación de contraseñas
export function isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

// export function createRandomUser() {
//     let numberOfProducts = parseInt(faker.string.numeric())
//     let products = []
//     for (let i = 0  i < numberOfProducts  i++) {
//         products.push(createRandomProduct())
//     }
//     return {
//         id: faker.database.mongodbObjectId(),
//         firstName: faker.person.firstName(),
//         lastName: faker.person.lastName(),
//         email: faker.internet.email(),
//         password: faker.internet.password(),
//         age: parseInt(faker.string.numeric()),
//         cart: products,
//         role: 'user'
//     }
// }

export function createRandomProduct() {
    return {
        id: faker.database.mongodbObjectId(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.string.numeric()),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        thumbnail: faker.image.urlLoremFlickr({width:240}),
        code: faker.string.numeric(),
        status: faker.datatype.boolean()
    }
}