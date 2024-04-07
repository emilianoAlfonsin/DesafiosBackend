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
export function generatePaginationLink(page, limit, sort, category, status, pageExists) {
    if (!pageExists) return null;

    let link = `/products?page=${page}&limit=${limit}`;
    if (sort) link += `&sort=${sort}`;
    if (category) link += `&category=${category}`;
    if (status) link += `&status=${status}`;
    return link;
}

