import ticketModel from '../models/ticketModel.js'
import { isValidObjectId } from "../../utils.js"

class TicketDAO {
    async createTicket(ticketData) {
        const ticket = new ticketModel(ticketData)
        return await ticket.save()
    }

    async findTicketById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del ticket no es válido")
        return await ticketModel.findById(id)
    }

    async findAllTickets() {
        return await ticketModel.find()
    }

    async deleteTicketById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del ticket no es válido")
        return await ticketModel.findByIdAndDelete(id)
    }
}

export default new TicketDAO()
