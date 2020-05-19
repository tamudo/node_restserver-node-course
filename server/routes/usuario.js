const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const app = express();

// conseguir
app.get('/usuario', function(req, res) {



    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;


    Usuario.find({ estado: true }, 'nombre email') //solo obtiene dos campos        
        .skip(desde) // salta los primeros 5
        .limit(limite) // muestra 5
        .exec((err, usuarios) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, count) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }

                res.status(200).json({
                    ok: true,
                    count,
                    usuarios
                });
            });


        });
});

// crear
app.post('/usuario', function(req, res) {
    let body = req.body; // parseado por el body-parser

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //imagen : body.img
        rol: body.rol
    });

    usuario.save((err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuariodb.password = null;

        res.status(200).json({ //implicito status 200
            ok: true,
            usuario: usuariodb
        });
    });
});

// actualizar user
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    // se usa underscore.js para filtrar solo los campos que queremos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']); // parseado por el body-parser

    //new: true, //devuelve el objeto actualizado
    //runValidators: true, //aplica las validaciones del esquema del modelo
    //context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            OK: true,
            usuarioDB
        });
    })


});

//borrar
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    // para borrarlo por completo
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioModificado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioModificado) { //=== null
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            OK: true,
            usuarioModificado
        });

    })


});

module.exports = app;