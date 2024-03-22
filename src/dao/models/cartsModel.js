import mongoose from "mongoose"
import { Schema } from "mongoose"

const collection = "Carts"

const schema = new Schema({

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
}) 

const cartsModel = mongoose.model(collection, schema)
export default cartsModel