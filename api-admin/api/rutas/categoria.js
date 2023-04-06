'use strict';

mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    router.get("/categoria/count/:idcliente", function(req, res) {
        let query =
            'SELECT COUNT(id) as ultimacategoria FROM categoria WHERE cliente_idCliente = ' + req.params.idcliente;

        connection.query(query, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/categoriamotivoatencionsucursal/count/:idsucursal", function(req, res) {
        let query = 'SELECT COUNT(id) as ultimacategoriamotivoatencionsuc FROM categoriamotivoatencionsucursal ' +
            'WHERE idsucursal = ' + req.params.idsucursal;

        connection.query(query, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/categoria/motivoatencion/:idsucursal", function(req, res) {
        let query = `
            SELECT
                c.id idcategoria
                , c.codigo codigocategoria
                , c.descripcion descripcioncategoria
                , m.id idmotivoatencion
                , m.nombre nombremotivoatencion
                , cmas.motivoAtencionSucursal_id idmotivoatencionsucursal
                , cmas.id idcategoriamotivoatencionsucursal
                , cmas.estado
                , CASE
                    WHEN (cmas.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion
            FROM
               categoria c
                , categoriamotivoatencionsucursal cmas
                , motivoatencion m
                , motivoatencionsucursal ms
            WHERE
                m.tipo = 'D'
                AND ms.sucursal_id = '`+ req.params.idsucursal +`'
                AND cmas.categoria_id = c.id
                AND ms.motivoAtencion_id = m.id
                AND ms.id = cmas.motivoAtencionSucursal_id
            `;
        
        connection.query(query , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.post("/categoria", function(req, res){
        var detalle = req.body.detalle;

        connection.query(
        `INSERT INTO categoria
            (id,
            codigo,
            descripcion,
            cliente_idCliente,
            flagSincronizado)
        VALUES
            ('`+detalle.id+`',
             '`+detalle.codigo+`',
             '`+detalle.descripcion+`',
             '`+detalle.cliente_idCliente+`',
             '`+detalle.flagSincronizado+`')`
        , function(err, rows) {
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.post("/categoriamotivoatencionsucursal", function(req, res){
        let detalle = req.body.detalle2;
        let query = `INSERT INTO categoriamotivoatencionsucursal
                (id,
                categoria_id,
                motivoAtencionSucursal_id,
                flagSincronizado,
                estado,
                idsucursal)
            VALUES
                (${detalle.id},
                 ${detalle.idcategoria},
                 ${detalle.idmotivoatencionsucursal},
                 '${detalle.flagSincronizado}',
                  ${detalle.estado},
                 '${detalle.idsucursal}')`;

        connection.query(query, function(err, rows) {
            if (err) throw  res.json({"error": err});
            res.json(rows);
        });
    });

    router.put("/categoria/:id", function(req, res){

        connection.query(
        `
        UPDATE categoria
        SET
            id = '`+req.params.id+`',
            codigo = '`+req.body.codigo+`',
            descripcion = '`+req.body.descripcion+`',
            cliente_idCliente = '`+req.body.cliente_idCliente+`',
            flagSincronizado = '`+req.body.flagSincronizado+`'
        WHERE
            id = '`+req.params.id+`'
        `
        , function(err, rows) {
        if(err) {
                res.json({"error": err});
            } else {
                res.json("Datos del cliente modificado");
            }
        });
    });

    router.put("/categoriamotivoatencionsucursal/:id", function(req, res){

        connection.query(
        `
        UPDATE categoriamotivoatencionsucursal
        SET
            id = '`+req.params.id+`',
            categoria_id = '`+req.body.idcategoria+`',
            motivoAtencionSucursal_id = '`+req.body.idmotivoatencionsucursal+`',
            flagSincronizado = '`+req.body.flagSincronizado+`',
            estado = '`+req.body.estado+`',
            idSucursal = '`+req.body.idsucursal+`'
        WHERE
            id = '`+req.params.id+`'
        `
        , function(err, rows) {
        if(err) {
                res.json({"error": err});
            } else {
                res.json("Datos del cliente modificado");
            }
        });
    });
};

module.exports = REST_ROUTER;
