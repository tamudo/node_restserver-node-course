const express = require('express');
const app = express();

// obtenemos rutas de usuario, login y las usamos
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;