// Objetivo: Definir la estructura de un DTO para un usuario.
class UserDTO {
    constructor({ _id, first_name, last_name, email, age, role, cart, token, resetToken }) {
        this._id = _id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = age;
        this.role = role;
        this.cart = cart;
        this.token = token;
        this.resetPasswordToken = resetToken;
        this.resetPasswordExpires = null; // Asumiendo que este campo debe ser inicializado
    }

    // Método para convertir un documento de usuario a un DTO
    static fromUser(user) {
        return new UserDTO(user);
    }
}

export default UserDTO;