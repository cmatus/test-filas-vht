mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
  var self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

  router.get("/cliente", function(req, res) {
    let query = `SELECT *,
			(SELECT B.nombre FROM pais B where A.pais_id = B.id) as nombrepais,
			(SELECT C.nombre FROM zona C where A.zona_id = C.id) as nombrezona,
			(SELECT D.nombre FROM subzona D where A.subzona_id = D.id) as nombresubzona,
			CASE WHEN (A.estado = 1)THEN 'Activo' ELSE 'De baja' END estadodescripcion
		FROM
			cliente A
		ORDER BY
			A.idCliente`;

  	connection.query(query, function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/cliente/:id", function(req, res) {
    connection.query("SELECT *,(SELECT B.nombre FROM pais B where A.pais_id = B.id) as nombrepais, (SELECT C.nombre FROM zona C where A.zona_id = C.id) as nombrezona, (SELECT D.nombre FROM subzona D where A.subzona_id = D.id) as nombresubzona , CASE WHEN (A.estado = 1)THEN 'Activo' ELSE 'De baja' END estadodescripcion FROM cliente A WHERE A.idCliente = "+req.params.id+" OR "+req.params.id+" = 0 ORDER BY A.idCliente", function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/cliente/pais/:idpais", function(req, res) {
  	let query = `SELECT COUNT(idCliente) as ultimocliente FROM cliente WHERE pais_id =${req.params.idpais}`;

    connection.query(query , function(err, rows) {
      if(err) {
        res.json([]);
      } else {
        res.json(rows);
      }
    });
  });

  router.post("/cliente", function(req, res){
    let detalle = req.body.detalle;
    let query = `INSERT INTO cliente 
    (idCliente, identificador, verificadorIdentificador, razonSocial, nombreFantasia, estado, direccion, direccion2, telefonos, correoContacto1, correoContacto2, logo, pais_id, zona_id, subzona_id, flagSincronizado, tiposistema_id)
    VALUES
    (${detalle.idCliente}, '${detalle.rut}', '${detalle.dv}','${detalle.razonsocial}','${detalle.nomfantasia}','${detalle.estado}','${detalle.direccion}','${detalle.direccion2}','${detalle.telefonos}','${detalle.correo1}','${detalle.correo2}',${detalle.logo},${detalle.idpais},${detalle.idzona},${detalle.idsubzona},'${detalle.flagsincronizar}',${detalle.idtiposistema})`;

    connection.query(query, function(err, rows) {
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  });

  router.put("/cliente/:id", function(req, res) {
  	let query = `UPDATE cliente SET identificador = '${req.body.rut}', verificadorIdentificador = '${req.body.dv}', razonSocial = '${req.body.razonsocial}', nombreFantasia = '${req.body.nomfantasia}', estado = '${req.body.estado}', direccion = '${req.body.direccion}', direccion2 = '${req.body.direccion2}', telefonos = '${req.body.telefonos}', correoContacto1 = '${req.body.correo1}', correoContacto2 = '${req.body.correo2}', logo = '${req.body.logo}', pais_id = ${req.body.idpais}, zona_id = ${req.body.idzona}, subzona_id = ${req.body.idsubzona}, flagSincronizado = '${req.body.flagsincronizar}', tiposistema_id = ${req.body.idtiposistema} WHERE idCliente = ${req.params.id}`;

    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json("Datos del cliente modificado");
      }
    });
  });
};

module.exports = REST_ROUTER;
