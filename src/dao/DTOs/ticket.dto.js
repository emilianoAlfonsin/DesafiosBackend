// Objetivo: Definir la estructura de los objetos de transferencia de datos (DTO) de los tickets.
export default class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
    }

    // Método para convertir un ticket a un DTO
    static toDTO(ticket) {
        if (Array.isArray(ticket)) return ticket.map(t => new TicketDTO(t));
        else return new TicketDTO(ticket);
    }

    // Método para convertir un array de tickets a DTOs
    static toDTOs(tickets) {
        return tickets.map(t => new TicketDTO(t));
    }
}