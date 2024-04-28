import mongoose from "mongoose"
import { Schema } from "mongoose"


const collection = "Carts"

const schema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Products"
            },
            quantity: {
                type: Number,
                default: 1
            },
        },
    ],
}) 

const cartsModel = mongoose.model(collection, schema)
export default cartsModel