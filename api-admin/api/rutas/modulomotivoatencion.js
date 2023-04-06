mysql = require("mysql");

express = require('express');
app = express();
server = require('http').Server(app);
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3001');

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    router.get("/modulomotivoatencion/:idsucursal/:idmodulo", function(req, res) {
        connection.query(
            `
            SELECT 
                m.id idmotivoatencion
                , m.nivel
                , m.idPadre
                , m.flagSincronizado flagsincmotivoatencion
                , m.nombre
                , m.tipo
                , ms.id idmotivoatencionsucursal
                , m.cliente_idCliente
                , ms.codigoDespliegue
                , ms.estado
                , ms.flagSincronizado flgasincmotivoatencionsuc
                , ms.solicitaDatosAcceso
                , ms.sucursal_id
                , ms.tiempoMaximoAtencion
                , ms.tiempoMaximoEsperaCola
                , ms.tiempoMinimoEsperaCola
                , ms.tiempoMinimoAtencion
                , mmas.id idmodulomotivoatencionsuc
                , mmas.prioridad
                ,  CASE
                       WHEN (mmas.id) IS NULL THEN false
                       ELSE true
                   END asociado
            FROM 
                motivoatencion m
                , motivoatencionsucursal ms 
                LEFT JOIN modulomotivoatencionsucursal mmas ON ms.id = mmas.motivoAtencionSucursal_id AND mmas.modulo_id = '`+req.params.idmodulo+`'
            WHERE 
                m.id = ms.motivoAtencion_id 
                AND m.tipo = 'D'
                AND ms.estado = '1'
                AND ms.sucursal_id = '`+req.params.idsucursal+`'
            `
            , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/modulomotivoatencion/count", function(req, res) {
        
        connection.query(
            `
            SELECT id ultimoregistro
            FROM modulomotivoatencionsucursal
            ORDER BY id DESC
            LIMIT 1
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });

    });

    router.post("/modulomotivoatencion", function(req, res){
        var detalle = req.body.detalle ? req.body.detalle : req.body;
        
        var intDesborde = 0
        if(detalle.atiendeDesborde === true)
            intDesborde = 1
        
        connection.query(
            `
            INSERT INTO modulomotivoatencionsucursal
                (id,
                prioridad,
                modulo_id,
                flagSincronizado,
                motivoAtencionSucursal_id,
                atiendeDesborde)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.prioridad+`',
                 '`+detalle.idmodulo+`',
                 '`+detalle.flagSincronizado+`',
                 '`+detalle.idmotivoatencionsucursal+`',
                 '`+detalle.atiendeDesborde+`')
            `
        , function(err, rows) {
            
        if(err) {
                res.json({"error": err});
            } else {
                socket.emit("actualizarModuloMotivoAtencion", "");
                res.json(rows);
            }
        });
    });

    router.delete("/modulomotivoatencion/:id", function(req, res){
        let query = 'UPDATE modulomotivoatencionsucursal SET ';
        query += 'fecha_eliminacion = CURRENT_TIMESTAMP WHERE id =' + req.params.id;
    
        connection.query(query, function(err, rows){
                if(err){
                    res.json({"error": err});
                } else {
                    socket.emit("actualizarModuloMotivoAtencion", "");
                    res.json("Eliminado");
                }
        });
    });

    router.get("/modulomotivoatencionsucursal/exist/:idmodulo/:idmotivoatencionsucursal", function(req, res) {
        let query = 'SELECT * FROM modulomotivoatencionsucursal ';
        query += 'WHERE modulo_id = ' + req.params.idmodulo + ' ';
        query += 'AND motivoAtencionSucursal_id = "' + req.params.idmotivoatencionsucursal +'"' 
        query += 'AND fecha_elminacion IS NULL' 
        
        connection.query(query, function(err, rows) {
            if (err) throw res.json({"error": err});
            
            res.json(rows);
        });

    });

    router.put("/modulomotivoatencionsucursal/:prioridad/:idmodulo/:idmotivoatencionsucursal", function(req, res){
        let query = 'UPDATE modulomotivoatencionsucursal SET ';
        query += 'prioridad = ' + req.params.prioridad + ' ';
        query += 'WHERE ';
        query += 'modulo_id = ' + req.params.idmodulo + ' ';
        query += 'AND motivoAtencionSucursal_id = ' + req.params.idmotivoatencionsucursal;

        connection.query(query, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json("Datos del cliente modificado");
            }
        });
    });

    router.put("/modulomotivoatencionsucursalDesborde/:atiendeDesborde/:idmodulo/:idmotivoatencionsucursal", function(req, res){
        connection.query(
            `
            UPDATE modulomotivoatencionsucursal 
            SET
                atiendeDesborde = '`+req.params.atiendeDesborde+`'
            WHERE  
                modulo_id = '`+req.params.idmodulo+`'
                AND motivoAtencionSucursal_id = '`+req.params.idmotivoatencionsucursal+`'
            `
            , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json("Datos del cliente modificado");
            }
        });
    });

    router.delete("/modulomotivoatencion/:idmodulo/:idmotivoatencionsucursal", function(req, res){
        let query  = 'UPDATE modulomotivoatencionsucursal SET ';
            query += 'fecha_elminacion = CURRENT_TIMESTAMP WHERE modulo_id =' + req.params.idmodulo + ' ';
            query += 'AND motivoAtencionSucursal_id = ' + req.params.idmotivoatencionsucursal
    
        connection.query(query, function(err, rows){
            if(err){
                res.json({"error": err});
            } else {
                socket.emit("actualizarModuloMotivoAtencion", "");
                res.json("Eliminado");
            }
        });
    });
}

module.exports = REST_ROUTER;
