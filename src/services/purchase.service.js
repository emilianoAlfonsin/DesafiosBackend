import TicketRepository from "../dao/repositories/ticket.repository.js"
import TicketDTO from "../dao/DTOs/ticket.dto.js"
import { isValidObjectId } from "../utils/utils.js"

export default class PurchaseService {
    async createTicket(ticketData) {
        // Validaciones de datos del ticket
        if (!ticketData || typeof ticketData !== 'object') {
            throw new Error("Datos del ticket no válidos")
        }
        const savedTicket = await TicketRepository.createTicket(ticketData)
        return TicketDTO.toDTO(savedTicket)
    }

    async getTicketById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del ticket no es válido")

        const ticket = await TicketRepository.findTicketById(id)
        if (!ticket) throw new Error("Ticket no encontrado")
        return TicketDTO.toDTO(ticket)
    }

    async getAllTickets() {
        const tickets = await TicketRepository.findAllTickets()
        return TicketDTO.toDTOs(tickets)
    }

    async deleteTicketById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del ticket no es válido")

        const deletedTicket = await TicketRepository.deleteTicketById(id)
        if (!deletedTicket) throw new Error("Ticket no encontrado")
        return TicketDTO.toDTO(deletedTicket)
    }
}
