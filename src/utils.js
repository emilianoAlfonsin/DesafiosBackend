import {fileURLToPath} from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

// Validación en mongoose de id 
import mongoose from "mongoose"

export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}


// Función para generar el enlace de paginación
export function generatePaginationLink(page, limit, sort, category, status) {

    let link = `/products?page=${page}&limit=${limit}`
    sort && (link += `&sort=${sort}`)
    category && (link += `&category=${category}`)
    status && (link += `&status=${status}`)
    return link;
}

