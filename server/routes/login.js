const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ //internal server error
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        token = jwt.sign({
            usuario: usuarioDB, //payload            
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //30 dias 

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});

module.exports = app;