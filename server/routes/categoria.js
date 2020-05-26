const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// 5 servicios

// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaBD) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments((err, count) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Categoria no encontrado'
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    count,
                    categoria: categoriaBD
                });
            });
        });
});


// Mostrar esa categoria por ID
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body; // parseado por el body-parser

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

// Modificar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']); // parseado por el body-parser

    Categoria.findOneAndUpdate([usuario = id], body, { new: true, runValidators: true, context: 'query' }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

// Borrar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaBD
        });
    });

});


module.exports = app;