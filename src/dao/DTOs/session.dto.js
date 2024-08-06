// Objetivo: Definir la estructura de un objeto de transferencia de datos (DTO) para una sesión de usuario.
class SessionDTO {
    constructor(user) {
        if (!user || typeof user !== 'object') {
            throw new Error('Objeto de usuario inválido');
        }

        this.first_name = user.first_name || '';
        this.last_name = user.last_name || '';
        this.email = user.email || '';
        this.role = user.role || '';
    }

    // Método para convertir un DTO a un objeto de usuario
    static fromUserDTO(userDTO) {
        return new SessionDTO(userDTO);
    }
}

export default SessionDTO;
