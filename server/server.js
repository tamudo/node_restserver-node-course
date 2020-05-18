require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// app.use: Midleware...cada vez que hay una peticion se ejecuta
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// conseguir
app.get('/usuario', function(req, res) {
    res.json('get Usuario')
})

// crear
app.post('/usuario', function(req, res) {
    let body = req.body; // parseado por el body-parser
    if (body.nombre === undefined) {
        res.status(400).json({ // 400: falta info
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {
        res.json({
            persona: body
        });
    }
})

// actualizar user
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

//borrar
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario')
})

app.listen(process.env.PORT, () => { console.log(`Escuchando puerto ${process.env.PORT}`); })