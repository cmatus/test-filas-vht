mysql = require("mysql");

express = require('express');
app = express();
server = require('http').Server(app);
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3001');

function REST_ROUTER(router, connection, md5) {
	let self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    router.get("/visormotivoatencion/:idsucursal/:idvisor", function(req, res) {
        let query = `
            SELECT 
                m.id idmotivoatencion,
                m.nivel,
                m.idPadre,
                m.flagSincronizado flagsincmotivoatencion,
                m.nombre,
                m.tipo,
                ms.id idmotivoatencionsucursal,
                m.cliente_idCliente,
                ms.codigoDespliegue,
                ms.estado,
                ms.flagSincronizado flgasincmotivoatencionsuc,
                ms.solicitaDatosAcceso,
                ms.sucursal_id,
                ms.tiempoMaximoAtencion,
                ms.tiempoMaximoEsperaCola,
                ms.tiempoMinimoEsperaCola,
                ms.tiempoMinimoAtencion,
                vmas.id idvisormotivoatencionsuc,
	           CASE
                       WHEN (vmas.id) IS NULL THEN false
                       ELSE true
                   END asociado
            FROM 
                motivoatencion m
                , motivoatencionsucursal ms 
                LEFT JOIN visormotivoatenciosucursal vmas ON ms.id = vmas.motivoAtencionSucursal_id 
                AND vmas.visor_id = '` + req.params.idvisor + `'
                AND vmas.fecha_elminacion IS NULL
            WHERE 
                m.id = ms.motivoAtencion_id 
                AND m.tipo = 'D'
                AND ms.estado = '1'
                AND ms.sucursal_id = '` + req.params.idsucursal + `'
            `;

        connection.query(query, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/visormotivoatencion/count", function(req, res) {

        console.log(
            `
            SELECT id ultimoregistro
            FROM gestionfila.visormotivoatenciosucursal
            ORDER BY id DESC
            LIMIT 1
            `
        )
        
        connection.query(
            `
            SELECT id ultimoregistro
            FROM visormotivoatenciosucursal
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

    router.post("/visormotivoatencion", function(req, res){
        var detalle = req.body.detalle;

        connection.query(
            `
            INSERT INTO visormotivoatenciosucursal
                (id,
                visor_id,
                motivoAtencionSucursal_id,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.idvisor+`',
                 '`+detalle.idmotivoatencionsucursal+`',
                 '`+detalle.flagSincronizado+`')
            `
        , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                socket.emit("actualizarVisorMotivoAtencion", "");
                res.json(rows);
            }
        });
    });

    router.delete("/visormotivoatencion/:idvisor/:idmotivoatencionsucursal", function(req, res){
        let query = 'UPDATE visormotivoatenciosucursal SET ' +
            'fecha_elminacion = CURRENT_TIMESTAMP WHERE ' +
            'visor_id = ' + req.params.idvisor + ' ' +
            'AND motivoAtencionSucursal_id = ' + req.params.idmotivoatencionsucursal;

        connection.query(query, function(err, rows){
                if(err){
                    res.json({"error": err});
                } else {
                    socket.emit("actualizarVisorMotivoAtencion", "");
                    res.json("Eliminado");
                }
        });
    });

    router.get("/visormotivosasociados/:idsucursal", function(req, res) {
        let query = `
            SELECT 
                  C.id
                , C.motivoAtencionSucursal_id idmotivoatencionsucursal
                , C.visor_id idvisor
            FROM
                visor A    
                , motivoatencionsucursal B
                , visormotivoatenciosucursal C
            WHERE
                A.id = C.visor_id
                AND B.id = C.motivoAtencionSucursal_id
                AND A.sucursal_id = '${ req.params.idsucursal }'
                AND C.fecha_elminacion IS NULL
            `;

        connection.query(query, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.post("/revisavisoresmotivosasociados", function(req, res){
        var visores = req.body.visoresJSON;
        var motivos = req.body.motivosJSON;
        var seleccionados = req.body.seleccionadosJSON;
        
        var visores2 = []
        
        for(var i = 0; i < visores.length; i++){
            var motivos2 = []
            for(var j = 0; j < motivos.length; j++){
                
                for(var x = 0; x < seleccionados.length; x++){
                    if(visores[i].id === seleccionados[x].idvisor
                        && motivos[j].idmotivoatencionsucursal === seleccionados[x].idmotivoatencionsucursal
                    ){
                        motivos[j].seleccionado = 1
                        break
                    }
                    motivos[j].seleccionado = 0  
                }


                motivos2.push({
                    idmotivoatencion: motivos[j].idmotivoatencion 
                    , nombremotivoatencion:motivos[j].nombremotivoatencion
                    , seleccionado: motivos[j].seleccionado
                    , idmotivoatencionsucursal: motivos[j].idmotivoatencionsucursal
                }
                )
                motivos[j].seleccionado = 0
                
            }

            visores2.push(
            {
                 id: visores[i].id
                , descripcion: visores[i].descripcion
                , motivos: motivos2
            });
        }
        

        //console.log(JSON.stringify(visores2))
        res.json(visores2);        

    });
}

module.exports = REST_ROUTER;
