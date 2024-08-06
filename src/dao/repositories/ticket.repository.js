import ticketModel from '../models/ticketModel.js';
import logger from '../../utils/logger.js'; 

class TicketRepository {
    // Crear un nuevo ticket
    async createTicket(ticketData) {
        try {
            const ticket = new ticketModel(ticketData);
            return await ticket.save();
        } catch (error) {
            logger.error("Error al crear el ticket:", error);
            throw error;
        }
    }

    // Encontrar un ticket por ID
    async findTicketById(id) {
        try {
            if (!id) throw new Error("El ID es requerido");
            return await ticketModel.findById(id);
        } catch (error) {
            logger.error(`Error al encontrar el ticket con ID ${id}:`, error);
            throw error;
        }
    }

    // Encontrar todos los tickets
    async findAllTickets() {
        try {
            return await ticketModel.find();
        } catch (error) {
            logger.error("Error al encontrar todos los tickets:", error);
            throw error;
        }
    }

    // Eliminar un ticket por ID
    async deleteTicketById(id) {
        try {
            if (!id) throw new Error("El ID es requerido");
            return await ticketModel.findByIdAndDelete(id);
        } catch (error) {
            logger.error(`Error al eliminar el ticket con ID ${id}:`, error);
            throw error;
        }
    }
}

export default new TicketRepository();
