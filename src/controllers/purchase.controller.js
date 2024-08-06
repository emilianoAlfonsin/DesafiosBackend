import PurchaseService from '../services/purchase.service.js'
import logger from '../utils/logger.js'
import { handleSuccess, handleError } from '../utils/responseHandler.js'

const purchaseService = new PurchaseService()

export default class PurchaseController {

    // Crear un nuevo ticket
    async createTicket(req, res) {
        try {
            logger.info("Iniciando la creación de un nuevo ticket");
            const ticketData = req.body;
            // Validar datos del ticket
            if (!ticketData || Object.keys(ticketData).length === 0) {
                return handleError(res, 400, "BAD_REQUEST", "Datos del ticket no proporcionados", new Error("Datos del ticket no proporcionados"));
            }
            const ticket = await purchaseService.createTicket(ticketData);
            logger.info("Ticket creado exitosamente");
            return handleSuccess(res, 201, "Ticket creado exitosamente", ticket);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al crear el ticket", error);
        }
    }

    // Obtener un ticket por su id
    async getTicketById(req, res) {
        try {
            logger.info(`Iniciando la obtención del ticket con id: ${req.params.id}`);
            const ticketId = req.params.id;
            const ticket = await purchaseService.getTicketById(ticketId);
            if (!ticket) {
                return handleError(res, 404, "NOT_FOUND", `Ticket no encontrado con id: ${ticketId}`, new Error("Ticket no encontrado"));
            }
            logger.info(`Ticket con id ${ticketId} obtenido exitosamente`);
            return handleSuccess(res, 200, `Ticket con id ${ticketId} obtenido exitosamente`, ticket);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener el ticket", error);
        }
    }

    // Obtener todos los tickets
    async getAllTickets(req, res) {
        try {
            logger.info("Iniciando la obtención de todos los tickets");
            const tickets = await purchaseService.getAllTickets();
            logger.info("Todos los tickets obtenidos exitosamente");
            return handleSuccess(res, 200, "Todos los tickets obtenidos exitosamente", tickets);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener todos los tickets", error);
        }
    }

    // Eliminar un ticket por su id
    async deleteTicketById(req, res) {
        try {
            logger.info(`Iniciando la eliminación del ticket con id: ${req.params.id}`);
            const ticketId = req.params.id;
            const ticket = await purchaseService.deleteTicketById(ticketId);
            if (!ticket) {
                return handleError(res, 404, "NOT_FOUND", `Ticket no encontrado con id: ${ticketId}`, new Error("Ticket no encontrado"));
            }
            logger.info(`Ticket con id ${ticketId} eliminado exitosamente`);
            return handleSuccess(res, 200, `Ticket con id ${ticketId} eliminado exitosamente`, ticket);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al eliminar el ticket", error);
        }
    }
}
