var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('md5');
var app = express();
const toolsRouter = require('./rutas/toolsRouter');

var usuario = require("./rutas/usuario.js");

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit: 100,
        waitForConnections: true,
        queueLimit :0,
        host: '127.0.0.1',
        user: 'root',
        password: 'W3nj1t0_', // V1g4t3c.,
        database: 'gestionfila',
        debug: false,
        wait_timeout: 28800,
        connect_timeout: 10
    });
    self.configureExpress(pool);
}

REST.prototype.configureExpress = function(connection) {

	var self = this;
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({limit: '10 mb'}));
	app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
    });
	var router = express.Router();
    app.use([toolsRouter]);
	app.use('/api', router);


	var rest_usuario = new usuario(router, connection, md5);
	self.startServer();

}

REST.prototype.startServer = function() {
	app.listen(3002, function(){
		console.log("Corriendo por el puerto: 3002");
	});
}

REST.prototype.stop = function(err) {
    console.log(err);
    process.exit(1);
}

new REST();
