import TicketDAO from "../dao/ticket.mongo.dao.js"
import TicketDTO from "../DTOs/ticket.dto.js"

export default class PurchaseService {
    // Crear un nuevo ticket de compra
    async createTicket(ticketData) {
        const savedTicket = await TicketDAO.createTicket(ticketData)
        return TicketDTO.toDTO(savedTicket)
    }

    // Obtener un ticket de compra por su id
    async getTicketById(id) {
        const ticket = await TicketDAO.findTicketById(id)
        if (!ticket) throw new Error("Ticket no encontrado")
        return TicketDTO.toDTO(ticket)
    }

    // Obtener todos los tickets
    async getAllTickets() {
        const tickets = await TicketDAO.findAllTickets()
        return TicketDTO.toDTOs(tickets)
    }

    // Eliminar un ticket por su id
    async deleteTicketById(id) {
        const deletedTicket = await TicketDAO.deleteTicketById(id)
        if (!deletedTicket) throw new Error("Ticket no encontrado")
        return TicketDTO.toDTO(deletedTicket)
    }
}
