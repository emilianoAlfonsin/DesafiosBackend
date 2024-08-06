import TicketRepository from "../dao/repositories/ticket.repository.js"
import TicketDTO from "../dao/DTOs/ticket.dto.js"
import { isValidObjectId } from "../utils/utils.js"
import logger from "../utils/logger.js"

export default class PurchaseService {
    // Crear un nuevo ticket
    async createTicket(ticketData) {
        logger.info("Creando un nuevo ticket")
        // Validaciones de datos del ticket
        if (!ticketData || typeof ticketData !== 'object') {
            logger.error("Datos del ticket no válidos")
            throw new Error("Datos del ticket no válidos")
        }
        const savedTicket = await TicketRepository.createTicket(ticketData)
        logger.info("Ticket creado exitosamente")
        return TicketDTO.toDTO(savedTicket)
    }

    // Obtener ticket por ID
    async getTicketById(id) {
        logger.info(`Obteniendo ticket con ID: ${id}`)
        if (!isValidObjectId(id)) {
            logger.error("El ID del ticket no es válido")
            throw new Error("El ID del ticket no es válido")
        }

        const ticket = await TicketRepository.findTicketById(id)
        if (!ticket) {
            logger.error("Ticket no encontrado")
            throw new Error("Ticket no encontrado")
        }
        logger.info(`Ticket con ID: ${id} obtenido exitosamente`)
        return TicketDTO.toDTO(ticket)
    }

    // Obtener todos los tickets
    async getAllTickets() {
        logger.info("Obteniendo todos los tickets")
        const tickets = await TicketRepository.findAllTickets()
        logger.info("Todos los tickets obtenidos exitosamente")
        return TicketDTO.toDTOs(tickets)
    }

    // Eliminar ticket por ID
    async deleteTicketById(id) {
        logger.info(`Eliminando ticket con ID: ${id}`)
        if (!isValidObjectId(id)) {
            logger.error("El ID del ticket no es válido")
            throw new Error("El ID del ticket no es válido")
        }

        const deletedTicket = await TicketRepository.deleteTicketById(id)
        if (!deletedTicket) {
            logger.error("Ticket no encontrado")
            throw new Error("Ticket no encontrado")
        }
        logger.info(`Ticket con ID: ${id} eliminado exitosamente`)
        return TicketDTO.toDTO(deletedTicket)
    }
}
