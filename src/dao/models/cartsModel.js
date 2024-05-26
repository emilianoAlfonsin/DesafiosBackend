import mongoose from "mongoose"
import { Schema } from "mongoose"


const collection = "Carts"

const schema = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Products"
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            },
        },
    ],
}) 

const cartsModel = mongoose.model(collection, schema)
export default cartsModel