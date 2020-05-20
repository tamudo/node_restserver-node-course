// verificacion token

const jwt = require('jsonwebtoken');

// next es necesario para continuar
let verificaToken = (req, res, next) => {
    // req.get obtiene headers
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            }); //no autorizado
        }

        req.usuario = decoded.usuario; //propiedad usuario en request
        // continua
        next();
    });
};

// verifica ADMIN_ROLE

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};


module.exports = {
    verificaToken,
    verificaAdmin_Role
}