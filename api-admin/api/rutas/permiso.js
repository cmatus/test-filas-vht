'use strict';

function REST_ROUTER(router, connection, md5) {
  let self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

  router.get("/permisos", function(req, res) {
    connection.query(
      `
			SELECT id,
			    codigo,
			    descripcion,
			    false seleccionado
			FROM permiso
			ORDER BY id
			`, function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/permiso/rolcliente/:idrolcliente", function(req, res) {
    connection.query(
      `
			SELECT
				  *
			FROM 
				rolpermiso rp
			WHERE 
			    rp.rolCliente_id = '`+req.params.idrolcliente+`'

			`
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });


  router.get("/permiso/rol/:idrol", function(req, res) {
    connection.query(
      `
			SELECT
				  *
			FROM 
				rolpermiso
			WHERE 
			    rol_id = '`+req.params.idrol+`'

			`
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });
};

module.exports = REST_ROUTER;
