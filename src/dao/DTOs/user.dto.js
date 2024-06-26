
class UserDTO {
    constructor({ _id, first_name, last_name, email, age, role, cart, token, resetToken }) {
        this._id = _id
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.age = age
        this.role = role
        this.cart = cart
        this.resetPasswordToken = this.resetPasswordToken
        this.resetPasswordExpires = this.resetPasswordExpires
    }

    static fromUser(user) {
        return new UserDTO(user)
    }
}

export default UserDTO
