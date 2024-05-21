export function auth (...allowedRoles) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/')
        }

        const user = req.session.user

        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Acceso denegado' })
        }

        next()
    }
}

