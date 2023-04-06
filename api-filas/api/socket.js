var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var puerto = 3001;

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
    });

app.post('/ejecutivo', function(req, res) {
	io.sockets.emit(req.body.receptor, req.body.mensaje);
	res.json("Mensaje para: " + req.body.receptor);
});

app.post('/visor', function(req, res) {
	var clients = io.sockets.clients();
	res.json("OK");
	console.log(clients.connected);
});

io.on('connection', function(socket) {
	console.log('Alguien se ha conectado con Sockets');
});

server.listen(puerto, function() {
	console.log("Servidor corriendo en http://localhost:" + puerto);
});
