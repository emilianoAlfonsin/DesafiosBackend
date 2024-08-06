import logger from '../utils/logger.js';

export function auth(...allowedRoles) {
    return (req, res, next) => {
        try {
            // Verificar si la sesión y el usuario existen
            if (!req.session || !req.session.user) {
                logger.warn('Intento de acceso sin sesión');
                return res.redirect('/');
            }

            const user = req.session.user;

            // Verificar si el rol del usuario está en la lista de roles permitidos
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                logger.warn(`Acceso denegado para el usuario con rol ${user.role}`);
                return res.status(403).json({ error: 'Acceso denegado' });
            }

            // Continuar al siguiente middleware
            next();
        } catch (error) {
            logger.error('Error en la autenticación:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
