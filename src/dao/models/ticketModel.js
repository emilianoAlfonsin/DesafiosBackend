import mongoos from "mongoose"
import { Schema } from "mongoose"

const ticketCollection = 'tickets'

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

const ticketModel = mongoos.model(ticketCollection, ticketSchema)
export default ticketModel