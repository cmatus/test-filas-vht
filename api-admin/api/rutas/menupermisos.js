mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

	// Listar todos los usuarios
	router.get("/menupermisos/:idCliente/:idRol", function(req, res) {
		connection.query("SELECT rc.id as idRolCliente, mm.id as idMenuModulo, mm.codigo as codigoMenuModulo, mm.descripcion as descMenuModulo, mm.nivel as nivelMenuModulo, mm.idPadre, mm.muestraOpcPermiso, p.codigo permisoCodigo, p.descripcion permisoDesc FROM rolcliente rc, rolpermiso rp, menumodulo mm, permiso p WHERE rc.cliente_idCliente = "+req.params.idCliente+" AND rc.rol_id = "+req.params.idRol+" AND rp.menuModulo_id = mm.id AND p.id = rp.permiso_id", function(err, rows) {
			if(err) {
				res.json([]);
			} else {
				res.json(rows);
			}
		});
	});
	

    router.get("/permisosEnModulo/:idRol/:idMenuModulo", function(req, res) {
        console.log(
        `
            select
                A.id idpermiso
                , A.descripcion descripcionpermiso
                , CASE
                    WHEN (B.id is null) THEN false
                    ELSE true
                END seleccionado
            from
                permiso A
                left join rolpermiso B on B.permiso_id = A.id and B.rolCliente_id = '`+req.params.idRol+`' and B.menuModulo_id = '`+req.params.idMenuModulo+`'
            order by A.id
        `)        
        connection.query(
            `
            select
                A.id idpermiso
                , A.descripcion descripcionpermiso
                , CASE
                    WHEN (B.id is null) THEN false
                    ELSE true
                END seleccionado
            from
                permiso A
                left join rolpermiso B on B.permiso_id = A.id and B.rolCliente_id = '`+req.params.idRol+`' and B.menuModulo_id = '`+req.params.idMenuModulo+`'
            order by A.id
            `
        , function(err, rows) {
            if(err) {
                res.json([]);
            } else {
                res.json(rows);
            }
        });
    });
    


}
module.exports = REST_ROUTER;
