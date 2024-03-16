import mongoose from "mongoose"
import { Schema } from "mongoose"

const collection = "Carts"


const cartsSchema = new Schema({

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

const cartsModel = mongoose.model(collectionName, cartsSchema)
export default cartsModel