class SessionDTO {
    constructor(user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.role = user.role
    }

    static fromUserDTO(userDTO) {
        return new SessionDTO(userDTO)
    }
}

export default SessionDTO
