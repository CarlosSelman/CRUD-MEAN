'use strict'

const usuarioModelo = require("../modelos/usuario.modelo");
const Usuario = require("../modelos/usuario.modelo");
const jwt = require('../servicios/jwt');
const bcrypt = require("bcrypt-nodejs");

//Roles
const user = 'Usuario';
const admin = 'Administrador';
const superAdmin = 'SuperAdministrador';
//Estado del usuario
const activo = 'Activo';
const desactivado = 'Desactivado';

function crearUsuarioSuperAdmin(req,res) {

    var  usuarioModelo = new Usuario(); 
    usuarioModelo.usuario = 'UserAd';
    usuarioModelo.contrasena = 'userpass1234';
    usuarioModelo.rol = superAdmin;
    usuarioModelo.estado = activo;

    Usuario.find({ $or: [
     {usuario: usuarioModelo.usuario}
     ]}).exec((err, usuarioEncontrado)=>{
     if (err) return console.log('Error en la petición')  
     
     if (usuarioEncontrado 
         && usuarioEncontrado.length >=1) {
         return console.log('Todo Listo!!!')
     }else{
         bcrypt.hash('userpass1234',null,null,(err, passwordEncriptada)=>{
            usuarioModelo.contrasena = passwordEncriptada; 
            usuarioModelo.save((err,usuarioGuardado)=>{ 
                 if (err) return console.log('Error al guardar el usuario');
                     
                 if (usuarioGuardado) {
                     return console.log(usuarioGuardado)    
                 }else{
                     return console.log( 'Error al registrar el usuario del SuperAdmin')
                 }
            })
         })
     }
    })
}


function obtenerUsuarios(req,res){
    usuarioModelo.find((err,usuariosEncontrados)=>{
        if(err) return res.status(404).send({report: 'Error al encontrar los usuarios'});
            return res.status(200).send(usuariosEncontrados);
    })
}


function obtenerUsuariosD(req,res){
    usuarioModelo.find({estado: desactivado},(err,usuariosEncontrados)=>{
        if(err) return res.status(404).send({report: 'Error al encontrar los usuarios'});
        return res.status(200).send(usuariosEncontrados);
    })
}

function Login(req,res){
    var params = req.body;
        
    usuarioModelo.findOne({ usuario : params.usuario}, (err, usuarioEncontrado)=>{
        if(err) return res.status(404).send({ report: 'Error  al iniciar sesión'});
        if(!usuarioEncontrado) return res.status(404).send({ report: 'El usuario no existe'});

        if(usuarioEncontrado){
            bcrypt.compare(params.contrasena, usuarioEncontrado.contrasena, (err,Valid)=>{
                if(err) return res.status(404).send({ report : 'Error en la contraseña'});
                if(Valid) {
                    return res.status(200).send({ token: jwt.createToken(usuarioEncontrado), usuarioEncontrado}  );
                }else {
                    return res.status(404).send({ report: 'El usuario no es válido'})   
                }
            })
        }
    })
}

function crearUsuario(req,res){
    var usuarioModel = new Usuario();
    var params = req.body;

    if (params.usuario && params.correo && params.contrasena) {
        usuarioModel.nombres = params.nombres;
        usuarioModel.apellidos = params.apellidos;
        usuarioModel.usuario = params.usuario;
        usuarioModel.correo = params.correo;
        usuarioModel.contrasena = params.contrasena;
        usuarioModel.tel = params.tel;
        usuarioModel.rol = user;
        usuarioModel.estado = activo;
        
        Usuario.find({
            $or: [
                { usuario: usuarioModel.usuario },
                { correo: usuarioModel.correo }
            ]
        }).exec((err, usuariosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario' })

            if (usuariosEncontrados && usuariosEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: 'El usuario ya existe' })
            } else {
                //Encriptando la contraseña
                bcrypt.hash(params.contrasena, null, null, (err, passwordEncriptada) => {
                    usuarioModel.contrasena = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al guardar el Usuario' })

                        //Guardando el usuario
                        if (usuarioGuardado) {
                            res.status(200).send(usuarioGuardado)
                            //Haciendo que no se vea la contraseña en el siguiente console.log
                            delete params.contrasena; 
                            //Mostrando todos los datos del usuario (menos la contraseña)
                            console.log(params); 
                        } else {
                            res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario' })
                        }
                    })
                })
            }
        })
    }
}


function obtenerUsuario(req, res) {
    var idUsuario = req.params.idUsuario
    
    Usuario.findById(idUsuario, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario' })
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error en obtener los datos del Usuario' })
        console.log(usuarioEncontrado.correo);
        return res.status(200).send({ usuarioEncontrado })
    })
}

function editarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    // BORRAR LA PROPIEDAD DE PASSWORD PARA QUE NO SE PUEDA EDITAR
    delete params.contrasena;

    if(req.usuario.rol != superAdmin){
        return res.status(500).send({ mensaje: "Solo el Administrador puede editarlos" })
    }

    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        
        return res.status(200).send({ usuarioActualizado });
    })

    
}

function eliminarUsuario(req, res) {
    const idUsuario = req.params.idUsuario;

    if(req.usuario.rol != superAdmin ){
        return res.status(500).send({mensaje: 'Solo puede eliminar el Administrador.'})
    }

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

        return res.status(200).send({ usuarioEliminado });
    })
}

function activarUsuario(req, res){
    var idUsuario = req.params.idUsuario;
    var estado = req.params.estado;
    var usuarioModel = new Usuario();
    usuarioModel.estado = activo;

    Usuario.findByIdAndUpdate(idUsuario, {estado: activo}, { new: true }, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        
        return res.status(200).send({ usuarioActualizado });
    })
}

function desactivarUsuario(req, res){
    var idUsuario = req.params.idUsuario;
    var estado = req.params.estado;
    var usuarioModel = new Usuario();
    usuarioModel.estado = desactivado;

    Usuario.findByIdAndUpdate(idUsuario, {estado: desactivado}, { new: true }, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        
        return res.status(200).send({ usuarioActualizado });
    })
}

module.exports = {
    crearUsuarioSuperAdmin,
    Login,
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuario,
    editarUsuario,
    eliminarUsuario,
    obtenerUsuariosD,
    activarUsuario,
    desactivarUsuario
}