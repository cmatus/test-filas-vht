mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {


    router.get("/usuariorol/count/:idusuario", function(req, res) {
        /*console.log(
            `
            SELECT 
                COUNT(id) ultimoregistro
            FROM
                gestionfila.usuariorol
                
            WHERE 
                rol_id = '`+req.params.idrol+`'
            `
        )
        connection.query(
            `
            SELECT 
                COUNT(id) ultimoregistro
            FROM
                usuariorol
            WHERE 
                rol_id = '`+req.params.idrol+`'
            `
            , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });*/

        console.log(
            `
            SELECT id ultimoregistro
            FROM gestionfila.usuariorol
            WHERE 
                usuario_id = '`+req.params.idusuario+`'
            ORDER BY id DESC
            LIMIT 1
            `
        )
        connection.query(
            `
            SELECT id ultimoregistro
            FROM usuariorol
            WHERE 
                usuario_id = '`+req.params.idusuario+`'
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

    
    // Insertar usuario
    router.post("/usuariorol", function(req, res){
    	var detalle = req.body.detalle;
        console.log(
            `
            INSERT INTO gestionfila.usuariorol
            (id,
            usuario_id,
            rol_id,
            flagSincronizado,
            idCliente
            )
            VALUES
            ('`+detalle.id+`',
                '`+detalle.idusuario+`',
                '`+detalle.idrol+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idCliente+`'
            )
            `
        )
        
		connection.query(
            `
            INSERT INTO usuariorol
            (id,
            usuario_id,
            rol_id,
            flagSincronizado,
            idCliente
            )
            VALUES
            ('`+detalle.id+`',
                '`+detalle.idusuario+`',
                '`+detalle.idrol+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idCliente+`'
            )
            `
            , function(err, rows) {
			if(err){
				res.json({"error": err});
			}else{
				res.json("Usuario registrado");
			}
		});
    });


    // Eliminar usuario
    router.delete("/usuariorol/:idusuario/:idrol", function(req, res){
    	console.log(
        `
        DELETE FROM 
            gestionfila.usuariorol
        WHERE
            usuario_id = '`+req.params.idusuario+`'
            AND rol_id = '`+req.params.idrol+`'
        `
        )
        connection.query(
            `
            DELETE FROM 
                usuariorol
            WHERE
                usuario_id = '`+req.params.idusuario+`'
                AND rol_id = '`+req.params.idrol+`'
            `
            , function(err, rows){
    		if(err){
    			res.json({"error": err});
    		} else {
    			res.json("Usuario eliminado");
    		}
    	});
    });

    router.delete("/usuariorol/:idusuario", function(req, res){
        console.log(
        `
        DELETE FROM 
            gestionfila.usuariorol
        WHERE
            usuario_id = '`+req.params.idusuario+`'
        `
        )
        connection.query(
            `
            DELETE FROM 
                usuariorol
            WHERE
                usuario_id = '`+req.params.idusuario+`'
            `
            , function(err, rows){
            if(err){
                res.json({"error": err});
            } else {
                res.json("Usuario eliminado");
            }
        });
    });


}
module.exports = REST_ROUTER;
