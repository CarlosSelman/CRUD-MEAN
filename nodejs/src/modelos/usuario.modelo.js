'use strict'

const mongoose = require('mongoose'); //COnstante que llame al módulo de mongoose 
var Schema = mongoose.Schema; // Variable sobre cómo se va a llamar mi modelo

var UsuarioSchema = Schema ({

    nombres: String,
    apellidos: String,
    usuario: String,
    correo: String,
    contrasena: String,
    tel: String,
    rol: String,
    estado: String
    
})

//Exportando
module.exports = mongoose.model('Usuario', UsuarioSchema);