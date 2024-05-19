class UserDTO {
    constructor({ first_name, last_name, email, age, role, cart }) {
        this.firstName = first_name
        this.lastName = last_name
        this.email = email
        this.age = age
        this.role = role
        this.cart = cart
    }

    static fromUser(user) {
        return new UserDTO(user)
    }
}

export default UserDTO
