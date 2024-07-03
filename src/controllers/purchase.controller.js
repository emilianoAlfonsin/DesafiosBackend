import PurchaseService from '../services/purchase.service.js'

const purchaseService = new PurchaseService()

export default class PurchaseController {
    
    // Crear un nuevo ticket
    async createTicket(req, res) {
        try {
            const ticketData = req.body
            const ticket = await purchaseService.createTicket(ticketData)
            res.status(201).json({
                status: "success",
                payload: ticket
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al crear el ticket"
            })
        }
    }

    // Obtener un ticket por su id
    async getTicketById(req, res) {
        try {
            const ticketId = req.params.id
            const ticket = await purchaseService.getTicketById(ticketId)
            res.status(200).json({
                status: "success",
                payload: ticket
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener el ticket"
            })
        }
    }

    // Obtener todos los tickets
    async getAllTickets(req, res) {
        try {
            const tickets = await purchaseService.getAllTickets()
            res.status(200).json({
                status: "success",
                payload: tickets
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener los tickets"
            })
        }
    }

    // Eliminar un ticket por su id
    async deleteTicketById(req, res) {
        try {
            const ticketId = req.params.id 
            const ticket = await purchaseService.deleteTicketById(ticketId) 
            res.status(200).json({
                status: "success",
                payload: ticket
            }) 
        } catch (error) {
            console.error(error) 
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al eliminar el ticket"
            }) 
        }
    }
}
