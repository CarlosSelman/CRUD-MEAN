'use strict'

// Importaciones
const express = require("express");
const usuarioControlador = require("../controladores/usuario.controlador");

// MIDDLEWARE
var authenticated = require("../middlewares/authenticated");

// RUTES
var api = express.Router();
    api.post('/Login', usuarioControlador.Login);
    api.get('/obtenerUsuarios', usuarioControlador.obtenerUsuarios);
    api.get('/obtenerUsuariosD', usuarioControlador.obtenerUsuariosD);
    api.post('/crearUsuario', usuarioControlador.crearUsuario);
    api.get('/obtenerUsuario/:idUsuario', usuarioControlador.obtenerUsuario);
    api.put('/editarUsuario/:idUsuario', authenticated.ensureAuth, usuarioControlador.editarUsuario);
    api.put('/activarUsuario/:idUsuario', usuarioControlador.activarUsuario);
    api.put('/desactivarUsuario/:idUsuario', usuarioControlador.desactivarUsuario);
    api.delete('/eliminarUsuario/:idUsuario', authenticated.ensureAuth, usuarioControlador.eliminarUsuario);
module.exports = api;


