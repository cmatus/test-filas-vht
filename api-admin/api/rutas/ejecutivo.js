'use strict';

const async = require('async');

function REST_ROUTER(router, connection) {
  let self = this;
  self.handleRoutes(router, connection);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection) {

  router.get("/ejecutivo/sucursal/:idUsuario?", function(req, res) {
    let query;
    query = `SELECT a.rol_id FROM usuariorol a WHERE a.usuario_id = ${req.params.idUsuario ? req.params.idUsuario : 0}`;

    connection.query(query, (err, rows) => {

      let typeUser = parseInt(rows[0].rol_id, 0);

      query = `SELECT DISTINCT ej.id, ej.nombres, ej.apellidoPaterno, ej.apellidoMaterno, 
        ej.genero, ej.identificacionAcceso, ej.claveAcceso, ej.mail, ej.telefonos, ej.jornada,
        ej.estado, ej.sucursal_id,
        CASE WHEN (ej.estado = 1) THEN "Activo"
        ELSE "De baja"
        END estadodescripcion `;

      if (typeUser <= 1) {
        query += `FROM
            ejecutivo ej`;
      } else {
        query += ` FROM
            usuario A
          INNER JOIN usuariosucursal B ON A.id = B.usuario_id
          INNER JOIN ejecutivosucursal C ON B.sucursal_id = C.sucursal_id
          INNER JOIN ejecutivo ej ON C.ejecutivo_id = ej.id
          WHERE
            A.id = ${req.params.idUsuario};`;
      }

      connection.query(query, function(err, rows) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(rows);
        }
      });
    });
  });

  router.get("/ejecutivo/acceso/:idsucursal/:identificacionacceso/:claveacceso", function(req, res) {
    let query = `SELECT
          id,
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          genero,
          identificacionAcceso,
          claveAcceso,
          mail,
          telefonos,
          jornada,
          estado,
          sucursal_id,
          idCliente,
          foto
      FROM
          ejecutivo
      WHERE
          sucursal_id = '` + req.params.idsucursal + `'
          AND identificacionAcceso = '` + req.params.identificacionacceso + `'
          AND claveAcceso = '` + req.params.claveacceso + `'`;

    connection.query(query, function(err, rows) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(rows);
      }
    });
  });

  router.post("/ejecutivo", function(req, res){
    let detalle = req.body.detalle;
    let query = `INSERT INTO ejecutivo 
      (id,
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        genero,
        identificacionAcceso,
        claveAcceso,
        mail,
        telefonos,
        jornada,
        estado,
        sucursal_id,
        idCliente,
        flagSincronizado,
        foto)
      VALUES 
      ("${detalle.id}",
        "${detalle.nombres}",
        "${detalle.apellidoPaterno}",
        "${detalle.apellidoMaterno}",
        "${detalle.genero}",
        "${detalle.identificacionAcceso}",
        "${detalle.claveAcceso}",
        "${detalle.mail}",
        "${detalle.telefonos}",
        "${detalle.jornada}",
        "${detalle.estado}",
        "${detalle.idsucursal}",
        "${detalle.idcliente}",
        "${detalle.flagSincronizado}",
        "${detalle.foto}")`;

    connection.query(query, function(err, rows) {
      if (err) {
        res.status(400).json(err);
      } else {
        async.eachSeries(detalle.sucursales, (queryItem, queryCallback) => {
          query = `INSERT INTO ejecutivosucursal 
            (sucursal_id, ejecutivo_id) VALUES (${queryItem}, ${detalle.id});`;

          connection.query(query, (err) => {
            if (err) {
              res.json(err);
            } else {
              queryCallback();
            }
          });
        }, () => {
          res.status(200).json(rows);
        });
      }
    });
  });

  router.put("/ejecutivo/:id", function(req, res) {

    let query = `UPDATE ejecutivo SET nombres = "${req.body.nombres}", 
      apellidoPaterno = "${req.body.apellidoPaterno}", 
      apellidoMaterno = "${req.body.apellidoMaterno}", 
      identificacionAcceso = "${req.body.identificacionAcceso}", 
      claveAcceso = "${req.body.claveAcceso}", 
      mail = "${req.body.mail}", 
      genero = "${req.body.genero}", 
      telefonos = "${req.body.telefonos}",
      jornada = ${req.body.jornada},
      estado = "${req.body.estado}", 
      flagSincronizado = "${req.body.flagSincronizado}", 
      foto = "${req.body.foto}" 
    WHERE 
      id = ${req.params.id};`;

    connection.query(query, function(err) {
      if (err) {
        res.json({"estado": 0});
      } else {
        query = `UPDATE ejecutivosucursal SET fecha_elminacion = CURRENT_TIMESTAMP WHERE ejecutivo_id = ${req.params.id}`;

        connection.query(query, (err) => {
          if (err) {
            res.json({"estado": 0});
          } else {
            async.eachSeries(req.body.sucursales, (queryItem, queryCallback) => {
              query = `INSERT INTO ejecutivosucursal 
                (sucursal_id, ejecutivo_id) VALUES (${queryItem}, ${req.params.id});`;

              connection.query(query, (err) => {
                if (err) {
                  res.json({"estado": 0});
                } else {
                  queryCallback();
                }
              });
            }, () => {
              res.status(200).json({"estado": 1});
            });
          }
        });
      }
    });
  });

  router.get("/ejecutivocount", function(req, res) {

    let ultimoregistro = 0;
    let query = 'SELECT substring(id, 9) AS ultimoregistro FROM ejecutivo ' +
      'ORDER BY cast(substring(id, 9) AS UNSIGNED) DESC LIMIT 1';

    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        if (rows[0]) {
          ultimoregistro = parseInt(rows[0].ultimoregistro, 0);
        }
        res.json(ultimoregistro);
      }
    });
  });
};

module.exports = REST_ROUTER;
