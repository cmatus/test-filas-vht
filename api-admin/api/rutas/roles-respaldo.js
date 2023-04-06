mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    router.get("/rol/count/:idcliente", function(req, res) {
        /*console.log(
            `
            SELECT 
                COUNT(r.id) ultimoregistro 
            FROM 
                rol r
            WHERE
                r.idcliente = '`+req.params.idcliente+`'
            `
            )
        */
        connection.query(
            `
            SELECT 
                COUNT(r.id) ultimoregistro 
            FROM 
                rol r
            WHERE
                r.idcliente = '`+req.params.idcliente+`'
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.post("/rol", function(req, res){
        var detalle = req.body.detalle;
        /*console.log(`
            INSERT INTO rol
                (id,
                codigo,
                descripcion,
                flagSincronizado,
                idcliente)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.codigo+`',
                '`+detalle.descripcion+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idcliente+`')
                `
            )
        */
        connection.query(`
            INSERT INTO rol
                (id,
                codigo,
                descripcion,
                flagSincronizado,
                idcliente)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.codigo+`',
                '`+detalle.descripcion+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idcliente+`')
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

    router.get("/rolcliente/count/:idcliente", function(req, res) {
        /*console.log(
            `
            SELECT 
                COUNT(rc.id) ultimoregistro 
            FROM 
                rolcliente rc
            WHERE
                rc.cliente_idCliente = '`+req.params.idcliente+`'
            `
            )
        */
        connection.query(
            `
            SELECT 
                COUNT(rc.id) ultimoregistro 
            FROM 
                rolcliente rc
            WHERE
                rc.cliente_idCliente = '`+req.params.idcliente+`'
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    router.post("/rolcliente", function(req, res){
        var detalle = req.body.detalle2;
        /*console.log(`
            INSERT INTO rolcliente
                (id,
                rol_id,
                cliente_idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.idrol+`',
                '`+detalle.idcliente+`',
                '`+detalle.flagSincronizado+`')
                `
            )
        */
        connection.query(`
            INSERT INTO rolcliente
                (id,
                rol_id,
                cliente_idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.idrol+`',
                '`+detalle.idcliente+`',
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

	// Listar todos los usuarios
	router.get("/rol", function(req, res) {
		connection.query(`SELECT * FROM rol WHERE id != 0 ORDER BY descripcion`, function(err, rows) {
			if(err) {
				res.json({"error": err});
			} else {
				res.json(rows);
			}
		});
	});
	
	// Búsqueda usuario por ID
	router.get("/rol/cliente/:idcliente", function(req, res) {
		connection.query(
            `
            SELECT 
                r.id
                , r.codigo
                , r.descripcion
                , rc.cliente_idCliente idcliente
                , c.nombreFantasia
                , c.razonSocial
            FROM
                rolcliente rc
                , rol r
                , cliente c
            WHERE
                rc.cliente_idCliente = '`+req.params.idcliente+`'
                AND rc.rol_id = r.id
                AND c.idCliente = rc.cliente_idCliente
            `
            , function(err, rows) {
			if(err) {
				res.json([]);
			} else {
				res.json(rows);
			}
		});
	});

    router.get("/rol/permiso/:idrol", function(req, res) {
        console.log(
            `
                SELECT distinct
                    p.id idpermiso
                  , p.codigo codigopermiso
                  , p.descripcion descpermiso
                  , mm.id idmenumodulo
                  , mm.codigo codigomenumodulo
                  , mm.descripcion descmenumodulo
                  , mm.muestraOpcPermiso
                  , mm.nivel
                  , mm.idPadre
                  , r.id idrol
                  , r.codigo codigorol
                  , r.descripcion descrol
                  , rp2.id idrolpermiso
                  , CASE
                        WHEN (rp2.rolCliente_id AND rp1.rolCliente_id AND r.id AND rc.rol_id) IS NULL THEN false
                        ELSE true
                    END AS activo
                FROM
                    gestionfila.menumodulo mm LEFT JOIN gestionfila.rolpermiso rp1 ON mm.id = rp1.menuModulo_id
                    , gestionfila.permiso p LEFT JOIN gestionfila.rolpermiso rp2 ON p.id = rp2.permiso_id
                    LEFT JOIN gestionfila.rolcliente rc ON rc.id = rp2.rolCliente_id AND rc.rol_id = '`+req.params.idrol+`'
                    LEFT JOIN gestionfila.rol r ON r.id = rc.rol_id AND rc.rol_id = '`+req.params.idrol+`'
                ORDER BY mm.id
                `
        )

        connection.query(
            `
                SELECT distinct
                    p.id idpermiso
                  , p.codigo codigopermiso
                  , p.descripcion descpermiso
                  , mm.id idmenumodulo
                  , mm.codigo codigomenumodulo
                  , mm.descripcion descmenumodulo
                  , mm.muestraOpcPermiso
                  , mm.nivel
                  , mm.idPadre
                  , r.id idrol
                  , r.codigo codigorol
                  , r.descripcion descrol
                  , rp2.id idrolpermiso
                  , CASE
                        /* SIN PERMISO */  WHEN (rp2.rolCliente_id AND rp1.rolCliente_id AND r.id AND rc.rol_id) IS NULL THEN false
                        /* CON PERMISO */  ELSE true
                    END AS activo
                FROM
                    menumodulo mm LEFT JOIN rolpermiso rp1 ON mm.id = rp1.menuModulo_id
                    , permiso p LEFT JOIN rolpermiso rp2 ON p.id = rp2.permiso_id
                    LEFT JOIN rolcliente rc ON rc.id = rp2.rolCliente_id AND rc.rol_id = '`+req.params.idrol+`'
                    LEFT JOIN rol r ON r.id = rc.rol_id AND rc.rol_id = '`+req.params.idrol+`'
                ORDER BY mm.id, p.id
            `
        
        , function(err, rows) {
        if(err) {
            res.json({"error": err});
        } else {
            res.json(rows);
        }
        });
    });


    router.post("/rol/permiso", function(req, res){
        var detalle = req.body.detalle;
        /*console.log(`
            INSERT INTO rolpermiso
                (id,
                menuModulo_id,
                permiso_id,
                flagSincronizado,
                rolCliente_id)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.idmenumodulo+`',
                '`+detalle.idpermiso+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idrolcliente+`')
            `
            )
        */
        connection.query(`
            INSERT INTO rolpermiso
                (id,
                menuModulo_id,
                permiso_id,
                flagSincronizado,
                rolCliente_id)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.idmenumodulo+`',
                '`+detalle.idpermiso+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idrolcliente+`')
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

    router.delete("/rolpermiso/:idpermiso", function(req, res){
        /*console.log(
                `
            DELETE FROM 
                gestionfila.rolpermiso
            WHERE 
                id = '`+req.params.idpermiso+`'
            `
            )
        */
        connection.query(
            `
            DELETE FROM 
                rolpermiso
            WHERE 
                id = '`+req.params.idpermiso+`'
            `
            , function(err, rows){
            if(err){
                res.json({"error": err});
            } else {
                res.json("Usuario eliminado");
            }
        });
    });
    
    router.get("/rol/permiso/count/:idcliente", function(req, res) {
        /*console.log(
            `
            SELECT 
                COUNT(rp.id) ultimoregistro 
                , rc.id idrolcliente
            FROM 
                gestionfila.rolpermiso rp RIGHT JOIN 
                gestionfila.rolcliente rc on rp.rolCliente_id = rc.id
            WHERE 
                rc.cliente_idCliente = '`+req.params.idcliente+`'
            `
            )
        */
        connection.query(
            `
            SELECT 
                COUNT(rp.id) ultimoregistro 
                , rc.id idrolcliente
            FROM 
                rolpermiso rp RIGHT JOIN 
                rolcliente rc on rp.rolCliente_id = rc.id
            WHERE 
                rc.cliente_idCliente = '`+req.params.idcliente+`'            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/rol/usuario/:idcliente/:idusuario", function(req, res) {
        /*console.log(
            `
            SELECT 
                r.id idrol
                , r.descripcion
                , r.codigo
                , rc.id idrolcliente
                
                ,  CASE
                        WHEN (u.id) IS NULL THEN false
                        ELSE true
                    END asociado
            FROM
                gestionfila.rol r
                LEFT JOIN gestionfila.usuariorol ur ON r.id = ur.rol_id
                LEFT JOIN gestionfila.usuario u ON u.id = ur.usuario_id AND u.id = '`+req.params.idusuario+`'
                LEFT JOIN gestionfila.rolcliente rc ON rc.rol_id = r.id
            WHERE r.idcliente = '`+req.params.idcliente+`'
            `
            )*/
        
        connection.query(
            `
            SELECT 
                 r.id idrol
                , r.descripcion
                , r.codigo
                , rc.id idrolcliente
                
                ,  CASE
                        WHEN (u.id) IS NULL THEN false
                        ELSE true
                    END asociado
            FROM
                gestionfila.rol r
                LEFT JOIN usuariorol ur ON r.id = ur.rol_id
                LEFT JOIN usuario u ON u.id = ur.usuario_id AND u.id = '`+req.params.idusuario+`'
                LEFT JOIN rolcliente rc ON rc.rol_id = r.id
            WHERE r.idcliente = '`+req.params.idcliente+`'

            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });
}



module.exports = REST_ROUTER;
