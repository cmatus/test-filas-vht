mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    router.get("/motivopausa/count/:idcliente", function(req, res) {
        /*console.log(
            `SELECT 
                COUNT(id) as ultimomotivopausa
            FROM 
                motivopausa 
            WHERE 
                idCliente = '`+req.params.idcliente+`'`
            )
        */

        connection.query(
            `SELECT 
                COUNT(id) as ultimomotivopausa
            FROM 
                motivopausa 
            WHERE 
                idCliente = '`+req.params.idcliente+`'`

        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/motivopausa/:idcliente/:idsucursal", function(req, res) {
        /*console.log(
            `SELECT
                mp.id idmotivopausa
                , mp.codigo
                , mp.descripcion
                , mps.id idmotivopausasucursal    
                , mps.estado
                , mps.tiempoMinutosAsignado
                , CASE
                    WHEN (mps.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion
            FROM
                motivopausa mp
                , motivopausasucursal mps
            WHERE
                 mp.idCliente = '`+req.params.idcliente+`'
                AND mps.sucursal_id = '`+req.params.idsucursal+`'
                AND mps.motivoPausa_id = mp.id`
            )
        */
        connection.query(
            `SELECT
                mp.id idmotivopausa
                , mp.codigo
                , mp.descripcion
                , mps.id idmotivopausasucursal    
                , mps.estado
                , mps.tiempoMinutosAsignado
                , CASE
                    WHEN (mps.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion
            FROM
                motivopausa mp
                , motivopausasucursal mps
            WHERE
                mp.idCliente = '`+req.params.idcliente+`'
                AND mps.sucursal_id = '`+req.params.idsucursal+`'
                AND mps.motivoPausa_id = mp.id`
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/motivopausasucursal/count/:idsucursal", function(req, res) {
        connection.query(`
            SELECT 
                COUNT(id) ultimomotivopausasucursal 
            FROM 
                motivopausasucursal 
            WHERE 
                sucursal_id = '`+req.params.idsucursal+`'
            `
            , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });
	
     router.post("/motivopausa", function(req, res){
        var detalle = req.body.detalle;
        /*console.log(
            `INSERT INTO motivopausa
                (id,
                codigo,
                descripcion,
                idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.codigo+`',
                 '`+detalle.descripcion+`',
                 '`+detalle.idCliente+`',
                 '`+detalle.flagSincronizado+`')`
            )*/
        
        connection.query(
            `INSERT INTO motivopausa
                (id,
                codigo,
                descripcion,
                idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.codigo+`',
                 '`+detalle.descripcion+`',
                 '`+detalle.idCliente+`',
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

    router.post("/motivopausa/sucursal", function(req, res){
        var detalle = req.body.detalle2;
        /*console.log(`
            INSERT INTO motivopausasucursal
                (id,
                estado,
                tiempoMinutosAsignado,
                motivoPausa_id,
                sucursal_id,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.estado+`',
                 '`+detalle.tiempoMinutosAsignado+`',
                 '`+detalle.motivoPausa_id+`',
                 '`+detalle.sucursal_id+`',
                 '`+detalle.flagSincronizado+`')
            `)
        */
        connection.query(`
            INSERT INTO motivopausasucursal
                (id,
                estado,
                tiempoMinutosAsignado,
                motivoPausa_id,
                sucursal_id,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.estado+`',
                 '`+detalle.tiempoMinutosAsignado+`',
                 '`+detalle.motivoPausa_id+`',
                 '`+detalle.sucursal_id+`',
                 '`+detalle.flagSincronizado+`')
                `
            , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.put("/motivopausa/:id", function(req, res){
        console.log('motivopausa',
            `
            UPDATE gestionfila.motivopausa 
            SET
                id = '`+req.params.id+`',
                codigo = '`+req.body.codigo+`',
                descripcion = '`+req.body.descripcion+`',
                idCliente = '`+req.body.idCliente+`',
                flagSincronizado = '`+req.body.flagSincronizado+`'
            WHERE  
                id = '`+req.params.id+`'
            `
        )

        connection.query(
            `
            UPDATE motivopausa 
            SET
                id = '`+req.params.id+`',
                codigo = '`+req.body.codigo+`',
                descripcion = '`+req.body.descripcion+`',
                idCliente = '`+req.body.idCliente+`',
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

    router.put("/motivopausasucursal/:id", function(req, res){
        console.log('motivopausasucursal',
            `
            UPDATE gestionfila.motivopausasucursal 
            SET
                id = '`+req.params.id+`',
                estado = '`+req.body.estado+`',
                tiempoMinutosAsignado = '`+req.body.tiempoMinutosAsignado+`',
                motivoPausa_id = '`+req.body.motivoPausa_id+`',
                sucursal_id = '`+req.body.sucursal_id+`',
                flagSincronizado = '`+req.body.flagSincronizado+`'
            WHERE  
                id = '`+req.params.id+`'
            `
        )

        connection.query(
            `
            UPDATE motivopausasucursal 
            SET
                id = '`+req.params.id+`',
                estado = '`+req.body.estado+`',
                tiempoMinutosAsignado = '`+req.body.tiempoMinutosAsignado+`',
                motivoPausa_id = '`+req.body.motivoPausa_id+`',
                sucursal_id = '`+req.body.sucursal_id+`',
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


}
module.exports = REST_ROUTER;
