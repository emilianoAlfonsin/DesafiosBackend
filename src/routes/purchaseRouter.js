import { Router } from "express"
import PurchaseController from "../controllers/purchase.controller.js"
import { auth } from "../middlewares/auth.js"

const purchaseRouter = Router()
const purchaseController = new PurchaseController()

// Crear un nuevo ticket (solo para usuarios autenticados)
purchaseRouter.post('/', auth('user', 'admin'), purchaseController.createTicket.bind(purchaseController))

// Obtener un ticket por su id (solo para usuarios autenticados)
purchaseRouter.get('/:id', auth('user', 'admin'), purchaseController.getTicketById.bind(purchaseController))

// Obtener todos los tickets (solo para administradores)
purchaseRouter.get('/', auth('admin'), purchaseController.getAllTickets.bind(purchaseController))

// Eliminar un ticket por su id (solo para administradores)
purchaseRouter.delete('/:id', auth('admin'), purchaseController.deleteTicketById.bind(purchaseController))

export default purchaseRouter
