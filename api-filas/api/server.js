require("dotenv/config");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const md5 = require("md5");
const axios = require("axios");
const cors = require("cors");

const app = express();

const proxyRouter = require("./rutas/proxyRouter");
const toolsRouter = require("./rutas/toolsRouter");
const usuario = require("./rutas/usuario.js");

function REST() {
    const self = this;
    self.connectMysql();
}

REST.prototype.connectMysql = function () {
    const self = this;
    const pool = mysql.createPool({
        connectionLimit: 100,
        waitForConnections: true,
        queueLimit: 0,
        host: "localhost",
        user: "root",
        password: "W3nj1t0_", // V1g4t3c.,
        database: "gestionfila",
        debug: false,
        wait_timeout: 28800,
        connect_timeout: 10,
    });
    self.configureExpress(pool);
};

REST.prototype.configureExpress = function (connection) {
    const self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: "10 mb" }));
    app.use(cors());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );
        next();
    });
    const router = express.Router();
    app.use([toolsRouter]);
    app.use("/api", router);
    // Proxy conecta el front con nuestra api, para luego conectarse a la api del hospital
    app.use(proxyRouter);

    const rest_usuario = new usuario(router, connection, md5);

    self.startServer();
};

REST.prototype.startServer = function () {
    app.listen(3002, function () {
        console.log("Corriendo por el puerto: 3002");
    });
};

REST.prototype.stop = function (err) {
    console.log(err);
    process.exit(1);
};

new REST();
