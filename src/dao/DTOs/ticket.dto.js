export default class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code
        this.purchase_datetime = ticket.purchase_datetime
        this.amount = ticket.amount
        this.purchaser = ticket.purchaser
    }

    static toDTO(ticket) {
        if (Array.isArray(ticket)) return ticket.map(t => new TicketDTO(t))
        else return new TicketDTO(ticket)
    }

    static toDTOs(tickets) {
        return tickets.map(t => new TicketDTO(t))
    }
}