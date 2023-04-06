'use strict';

const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const md5 = require('md5');
const axios = require("axios");
const multer = require("multer");
const router = express.Router();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const roles = require("./rutas/roles.js");
const usuario = require("./rutas/usuario.js");
const tiposistema = require("./rutas/tiposistema.js");
const menumodulos = require("./rutas/menumodulos.js");
const menupermisos = require("./rutas/menupermisos.js");
const pais = require("./rutas/pais.js");
const zona = require("./rutas/zona.js");
const subzona = require("./rutas/subzona.js");
const cliente = require("./rutas/cliente.js");
const configuracionsistema = require("./rutas/configuracionsistema.js");
const sucursal = require("./rutas/sucursal.js");
const motivoatencion = require("./rutas/motivoatencion.js");
const categoria = require("./rutas/categoria.js");
const motivopausa = require("./rutas/motivopausa.js");
const ticketero = require("./rutas/ticketero.js");
const visor = require("./rutas/visor.js");
const moduloatencion = require("./rutas/moduloatencion.js");
const permiso = require("./rutas/permiso.js");
const usuariorol = require("./rutas/usuariorol.js");
const ticketeromotivoatencion = require("./rutas/ticketeromotivoatencion.js");
const modulomotivoatencion = require("./rutas/modulomotivoatencion.js");
const visormotivoatencion = require("./rutas/visormotivoatencion.js");
const ejecutivo = require("./rutas/ejecutivo.js");
const reportes = require("./rutas/reportes.js");
const archivos = require("./rutas/archivos.js");
const componente = require("./rutas/componente.js");

function REST() {
  let self = this;
  self.connectMysql();
}

REST.prototype.connectMysql = function() {
  let self = this;
  let pool = mysql.createPool({
    connectionLimit: 100,
    waitForConnections: true,
    queueLimit :0,
    host: '127.0.0.1',
    user: 'root',
    password: 'V1g4t3c.,',
    database: 'gestionfila',
    debug: false,
    wait_timeout: 28800,
    connect_timeout: 10
  });
  self.configureExpress(pool);
};

REST.prototype.configureExpress = function(connection) {

  let self = this;
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

  app.use('/api', router);

  let rest_usuario = new usuario(router, connection, md5);
  let rest_tiposistema = new tiposistema(router, connection, md5);
  let rest_menumodulos = new menumodulos(router, connection, md5);
  let rest_menupermisos = new menupermisos(router, connection, md5);
  let rest_pais = new pais(router, connection, md5);
  let rest_zona = new zona(router, connection, md5);
  let rest_subzona = new subzona(router, connection, md5);
  let rest_cliente = new cliente(router, connection, md5);
  let rest_configuracionsistema = new configuracionsistema(router, connection, md5);
  let rest_sucursal = new sucursal(router, connection, md5);
  let rest_motivoatencion = new motivoatencion(router, connection, md5);
  let rest_categoria = new categoria(router, connection, md5);
  let rest_motivopausa = new motivopausa(router, connection, md5);
  let rest_ticketero = new ticketero(router, connection, md5);
  let rest_visor = new visor(router, connection, md5);
  let rest_moduloatencion = new moduloatencion(router, connection, md5);
  let rest_roles = new roles(router, connection, md5);
  let rest_permiso = new permiso(router, connection, md5);
  let rest_usuariorol = new usuariorol(router, connection, md5);
  let rest_ticketeromotivoatencion = new ticketeromotivoatencion(router, connection, md5);
  let rest_modulomotivoatencion = new modulomotivoatencion(router, connection, md5);
  let rest_visormotivoatencion = new visormotivoatencion(router, connection, md5);
  let rest_ejecutivo = new ejecutivo(router, connection, md5);
  let rest_reportes = new reportes(router, connection, md5);
  let rest_archivos = new archivos(router, connection, md5);
  let rest_componente = new componente(router, connection, md5);

  self.startServer();
};

REST.prototype.startServer = function() {
  /*test_prod*/
  app.listen(3000, function(){
    console.log("Corriendo por el puerto 3000");
  });
};

REST.prototype.stop = function(err) {
  console.log(err);
  process.exit(1);
};

new REST();
