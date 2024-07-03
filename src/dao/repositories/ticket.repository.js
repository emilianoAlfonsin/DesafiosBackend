import ticketModel from '../models/ticketModel.js'

class TicketRepository {
    async createTicket(ticketData) {
        const ticket = new ticketModel(ticketData)
        return await ticket.save()
    }

    async findTicketById(id) {
        return await ticketModel.findById(id)
    }

    async findAllTickets() {
        return await ticketModel.find()
    }

    async deleteTicketById(id) {
        return await ticketModel.findByIdAndDelete(id)
    }
}

export default new TicketRepository()
