import mongoose from "mongoose";
import { Schema } from "mongoose";

const collection = "Products"
const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true  
    }
})

const productsModel = mongoose.model(collection, schema)
export default productsModel
