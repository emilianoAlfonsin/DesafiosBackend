import ticketModel from '../models/ticketModel.js'
import TicketDTO from '../DTOs/ticket.dto.js'

export default class PurchaseService {
    constructor() {
        this.model = ticketModel
    }

    // Crear un nuevo ticket de compra
    async createTicket(ticketData) {
        const ticket = new this.model(ticketData)
        const savedTicket = await ticket.save()
        return TicketDTO.toDTO(savedTicket)
    }

    // Obtener un ticket de compra por su id
    async getTicketById(id) {
        const ticket = await this.model.findById(id)
        if (!ticket) throw new Error("Ticket no encontrado")
        return TicketDTO.toDTO(ticket)
    }

    // Obtener todos los tickets
    async getAllTickets() {
        const tickets = await this.model.find()
        return TicketDTO.toDTOs(tickets)
    }

    // Eliminar un ticket por su id
    async deleteTicketById(id) {
        const deletedTicket = await this.model.findByIdAndDelete(id)
        if (!deletedTicket) throw new Error("Ticket no encontrado")
        return TicketDTO.toDTO(deletedTicket)
    }
}