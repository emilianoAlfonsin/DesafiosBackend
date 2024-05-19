class SessionDTO {
    constructor({ first_name, last_name, email, role }) {
        this.firstName = first_name
        this.lastName = last_name
        this.email = email
        this.role = role
    }

    static fromUserDTO(userDTO) {
        return new SessionDTO(userDTO)
    }
}

export default SessionDTO
