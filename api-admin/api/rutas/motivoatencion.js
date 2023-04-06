'use strict';

const async = require('async');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');
const sucursal = {
  1: io.connect('http://172.28.20.85:3001'),
  2: io.connect('http://172.28.20.87:3001'),
  3: io.connect('http://172.28.20.81:3001'),
  4: io.connect('http://9.5.3.253:3001'),
  5: io.connect('http://9.5.4.5:3001'),
  6: io.connect('http://172.28.20.90:3001'),
  7: io.connect('http://172.28.20.92:3001'),
  8: io.connect('http://172.28.20.71:3001'),
  9: io.connect('http://172.28.12.154:3001'),
  10: io.connect('http://172.28.12.157:3001'),
  11: io.connect('http://172.28.12.20:3001'),
  12: io.connect('http://172.28.20.20:3001'),
  13: io.connect('http://172.28.20.15:3001'),
  14: io.connect('http://172.28.20.50:3001'),
  15: io.connect('http://172.28.20.10:3001'),
  16: io.connect('http://localhost:3001')
};
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  //service: 'gmail',
  auth: {
    user: 'abd8932685e91c',
    pass: 'c8b853146940e5'
    //user: 'reblasquez@gmail.com',
    //pass: 'gm1o1lli4ll'
  }
});

function REST_ROUTER(router, connection) {
  let self = this;
  self.handleRoutes(router, connection);
}

REST_ROUTER.prototype.handleRoutes = function (router, connection) {

  router.get("/motivoatencion", function (req, res) {
    connection.query("SELECT * FROM motivoatencion ORDER BY id", function (err, rows) {
      if (err) {
        res.json({'error': err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/motivoatencion/:idCliente", function (req, res) {

    connection.query("SELECT COUNT(id) as ultimomotivoatencioncliente FROM motivoatencion WHERE cliente_idCliente =" + req.params.idCliente, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.post("/motivoatencion", function (req, res) {
    let query = 'SELECT SUBSTRING(id, 6) AS ultimo FROM motivoatencion ORDER BY CAST(SUBSTRING(id,6) AS unsigned) DESC LIMIT 1';

    connection.query(query, function (err, rows, result) {
      if (err) {
        res.json({'error': err});
      }

      let motivoSufijo = rows.length ? parseInt(rows[0].ultimo) + 1 : 1;
      let detalle = req.body.detalle ? req.body.detalle : req.body;
      let idmotivo = detalle.cliente_idCliente + '' + motivoSufijo;


      query = `
            INSERT INTO motivoatencion
            (id, nombre, nivel, idPadre, tipo, icono, cliente_idCliente, flagSincronizado)
            VALUES ('` + idmotivo + `', '` + detalle.nombre + `', '` + detalle.nivel + `', '` + detalle.idPadre + `', '` + detalle.tipo + `', '` + detalle.icono + `', '` + detalle.cliente_idCliente + `', '` + detalle.flagSincronizado + `')
            `;
      connection.query(query, function (err, rows, results) {
        if (err) {
          res.json({'error': err});
        }

        socket.emit("actualizarMenuTicketeros", "");
        res.json(motivoSufijo);
      });
    });

  });

  router.get("/motivoatencion/hijos/:idmotivoatencion", function (req, res) {
    connection.query("SELECT m.id idmotivoatencion, m.nivel, m.idPadre, m.flagSincronizado flagsincmotivoatencion, m.nombre, m.tipo, ms.id idmotivoatencionsucursal, m.cliente_idCliente, ms.id idmotivoatencionsucursal, ms.codigoDespliegue, ms.estado, ms.flagSincronizado flgasincmotivoatencionsuc, ms.solicitaDatosAcceso, ms.sucursal_id, ms.tiempoMaximoAtencion, ms.tiempoMaximoEsperaCola, ms.tiempoMinimoEsperaCola, ms.tiempoMinimoAtencion, ms.cantidadActivarDesborde, ms.cantidadAtencionesDesborde FROM motivoatencion m, motivoatencionsucursal ms WHERE m.id = ms.motivoAtencion_id AND m.idPadre = " + req.params.idmotivoatencion, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/motivoatencionsucursal/count/:idsucursal", function (req, res) {

    let query = `SELECT COUNT(id) as ultimomotivoatencionsucursal
                    FROM motivoatencionsucursal WHERE sucursal_id = '${req.params.idsucursal}'
                    ORDER BY id DESC
                    LIMIT 1`;

    connection.query(query, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/motivoatencionsucursal/:idsucursal", function (req, res) {
    connection.query(
      `SELECT
                m.id idmotivoatencion
                , m.nivel
                , m.idPadre
                , m.nombre
                , m.tipo
                , ms.id idmotivoatencionsucursal
                , m.cliente_idCliente
                , ms.id idmotivoatencionsucursal
                , ms.codigoDespliegue
                , ms.estado
                , ms.solicitaDatosAcceso
                , ms.sucursal_id
                , ms.tiempoMaximoAtencion
                , ms.tiempoMaximoEsperaCola
                , ms.tiempoMinimoEsperaCola
                , ms.tiempoMinimoAtencion
                , ms.cantidadActivarDesborde
                , ms.cantidadAtencionesDesborde
                , m.icono
                , (select nombre from motivoatencion m2 where m2.id = m.idPadre and m2.tipo = 'A' AND m2.idPadre = 0) nombrepadre
                , CASE
                    WHEN (ms.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion
                , CASE
                    WHEN (m.tipo = 'D')THEN 'Despliegue'
                    ELSE 'Agrupador'
                END tipodescripcion
            FROM
                motivoatencion m
                , motivoatencionsucursal ms
            WHERE
                m.id = ms.motivoAtencion_id
                AND ms.sucursal_id = '${req.params.idsucursal}'
            `
      , function (err, rows) {
        if (err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/motivoatencionsucursal/tipodespliegue/:idsucursal", function (req, res) {
    let query = `
            SELECT
                m.id idmotivoatencion,
                m.nombre nombremotivoatencion,
                m.idPadre,
                mas.id idmotivoatencionsucursal,
                mas.codigoDespliegue idcodigo,
                false seleccionado,
                false atiendeDesborde,
                false deshabilitado,
                (select nombre from motivoatencion m2 where m2.id = m.idPadre and m2.tipo = 'A' AND m2.idPadre = 0) nombrepadre
            FROM
                motivoatencion m
                LEFT JOIN motivoatencionsucursal mas ON m.id = mas.motivoAtencion_id
            WHERE
                mas.sucursal_id = '${req.params.idsucursal}'
                AND m.tipo = 'D'
                AND mas.estado = '1'
            `;

    connection.query(query, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.post("/motivoatencionsucursal", function (req, res) {
    var detalle = req.body;

    let query = `
            INSERT INTO motivoatencionsucursal (
                  id
                , codigoDespliegue
                , estado
                , solicitaDatosAcceso
                , tiempoMinimoAtencion
                , tiempoMaximoAtencion
                , tiempoMinimoEsperaCola
                , tiempoMaximoEsperaCola
                , motivoAtencion_id
                , sucursal_id
                , cliente_idCliente
                , flagSincronizado
                , cantidadActivarDesborde
                , cantidadAtencionesDesborde
                )
            VALUES (
                '${detalle.id}'
                , '${detalle.codigoDespliegue}'
                , '${detalle.estado}'
                , '${detalle.solicitaDatosAcceso}'
                , '${detalle.tiempoMinimoAtencion}'
                , '${detalle.tiempoMaximoAtencion}'
                , '${detalle.tiempoMinimoEsperaCola}'
                , '${detalle.tiempoMaximoEsperaCola}'
                , '${detalle.motivoAtencion_id}'
                , '${detalle.sucursal_id}'
                , '${detalle.cliente_idCliente}'
                , '${detalle.flagSincronizado}'
                , '${detalle.cantidadActivarDesborde}'
                , '${detalle.cantidadAtencionesDesborde}'
            )
            `;
    connection.query(query, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.put("/motivoatencion/:id", function (req, res) {
    let query = `
            UPDATE motivoatencion
            SET
                id = '${req.body.id}',
                nombre = '${req.body.nombre}',
                nivel = '${req.body.nivel}',
                idPadre = '${req.body.idPadre}',
                tipo = '${req.body.tipo}',
                icono = '${req.body.icono}',
                cliente_idCliente = '${req.body.cliente_idCliente}',
                -- flagSincronizado = '${req.body.flagSincronizado}'
                flagSincronizado = ''
            WHERE
                id = '${req.params.id}'
            `;
    connection.query(query, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        socket.emit("actualizarMenuTicketeros", "");
        res.json("Datos del cliente modificado");
      }
    });
  });

  router.put("/motivoatencionsucursal/:id", function (req, res) {
    let query = `
            UPDATE motivoatencionsucursal
            SET
                id = '${req.params.id}',
                codigoDespliegue = '${req.body.codigoDespliegue}',
                estado = '${req.body.estado}',
                solicitaDatosAcceso = '${req.body.solicitaDatosAcceso}',
                tiempoMinimoAtencion = '${req.body.tiempoMinimoAtencion}',
                tiempoMaximoAtencion = '${req.body.tiempoMaximoAtencion}',
                tiempoMinimoEsperaCola = '${req.body.tiempoMinimoEsperaCola}',
                tiempoMaximoEsperaCola = '${req.body.tiempoMaximoEsperaCola}',
                motivoAtencion_id = '${req.body.motivoAtencion_id}',
                sucursal_id = '${req.body.sucursal_id}',
                cliente_idCliente = '${req.body.cliente_idCliente}',
                flagSincronizado = '${req.body.flagSincronizado}',
                cantidadActivarDesborde = '${req.body.cantidadActivarDesborde}',
                cantidadAtencionesDesborde = '${req.body.cantidadAtencionesDesborde}'
            WHERE
                id = '${req.params.id}'
            `;
    connection.query(query, function (err, rows) {
      if (err) {
        //socket.emit("actualizarMenuTicketeros", "");
        res.json({"error": err});
      } else {

        res.json("Datos del cliente modificado");
      }
    });
  });

  router.get("/motivoatencionsucursal/restriccionesderivacion/:idsucursal", function (req, res) {
    let query = `SELECT
        *, true seleccionado, false deshabilitado
      FROM
        restriccionderivacion
      WHERE
        idsucursal = '${req.params.idsucursal}'
        AND fecha_elminacion IS NULL`;

    connection.query(query, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/motivoatencionsucursal/restriccion/count/:idsucursal", function (req, res) {
    let query = `
            SELECT id AS ultimoregistro
            FROM restriccionderivacion
            WHERE idsucursal = '${req.params.idsucursal}'
            ORDER BY id DESC
            LIMIT 1
            `;

    connection.query(query, function (err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });

  });

  router.post("/motivoatencionsucursal/restriccion", function (req, res) {
    let detalle = req.body.detalle;
    let query = `
            INSERT INTO restriccionderivacion
            (
                id
                , idmotivoatencionsucursal_o
                , idmotivoatencionsucursal_d
                , idsucursal
                , flagSincronizado)
            VALUES (
                '${detalle.id}'
                , '${detalle.idmotivoatencionsucursal_o}'
                , '${detalle.idmotivoatencionsucursal_d}'
                , '${detalle.idsucursal}'
                , '${detalle.flagSincronizado}')
            `;


    connection.query(query, function (err, rows) {
      if (err) {throw res.json({"error": err});}

      res.json(rows);
    });
  });

  router.delete("/motivoatencionsucursal/restriccion/:idorigen/:iddestino", function (req, res) {

    connection.query(
      `
            UPDATE restriccionderivacion
            SET fecha_elminacion = CURRENT_TIMESTAMP
            WHERE
                idmotivoatencionsucursal_o = '${req.params.idorigen}'
                AND idmotivoatencionsucursal_d = '${req.params.iddestino}'
            `
      , function (err, rows) {
        if (err) {
          res.json({"error": err});
        } else {
          res.json("Usuario eliminado");
        }
      });
  });

  // RUTAS PARA LAS ALARMAS.
  router.route('/alarmas')
    .get(function (req, res) {
      let query = 'SELECT * FROM gestionfila.tbl_alarmas';

      connection.query(query, function (err, rows) {
        if (err) {
          res.status(400).json({"error": err});
        } else {
          res.status(201).json(rows);
        }
      });

    })
    .post(function (req, res) {
      let query = 'INSERT INTO gestionfila.tbl_alarmas ';
      query += '(id, nombre, descripcion) ';
      query += 'VALUES ';
      query += '("' + req.body.id + '",  "' + req.body.nombre + '",  "' + req.body.descripcion + '")';

      connection.query(query, function (err, rows) {
        if (err) {
          res.status(400).json({"error": err});
        } else {
          res.status(200).json(rows[0]);
        }
      });
    });

  router.route('/alarma/:id')
    .get(function (req, res) {
      let query = 'SELECT * FROM gestionfila.tbl_alarmas ';
      query += 'WHERE gestionfila.tbl_alarmas.id = ' + parseInt(req.params.id) + ';';

      connection.query(query, function (err, rows) {
        if (err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
    })
    .put(function (req, res) {

      let query = 'UPDATE gestionfila.tbl_alarmas ';
      query += 'SET nombre = "' + req.body.nombre + '", ';
      query += 'descripcion = "' + req.body.descripcion + '" ';
      query += 'WHERE id = ' + parseInt(req.params.id) + ';';

      connection.query(query, function (err, rows) {
        if (err) {
          res.status(400).json({"error": err});
        } else {
          query = 'SELECT * FROM gestionfila.tbl_alarmas ';
          query += 'WHERE gestionfila.tbl_alarmas.id = ' + parseInt(req.params.idMotivoAtencion) + ';';
          connection.query(query, function (err, rows) {
            if (err) {
              res.json({"error": err});
            } else {
              res.status(200).json(rows[0]);
            }
          });
        }
      });
    });

  router.route('/motivoatencion/:idMotivoAtencion/alarma')
    .get(function (req, res) {
      let query = `SELECT a.*, b.id_usuario FROM gestionfila.tbl_alarma_configuracion a 
            JOIN gestionfila.tbl_usuario_alarma b ON a.id = b.id_alarma 
            WHERE a.id_motivo =${req.params.idMotivoAtencion} LIMIT 1`;

      connection.query(query, function (err, rows) {
        if (err) {
          res.json({"error": err});
        } else {
          res.json(rows[0]);
        }
      });
    })
    .post(function (req, res) {

      let motivo = parseInt(req.params.idMotivoAtencion);
      let data = req.body;

      let query_last_id = 'select concat(' + data.id_sucursal + ', substring(id, 9) + 1) as id_configuracion from tbl_alarma_configuracion ';
      query_last_id += 'Order by cast(substring(id,9) as unsigned) desc Limit 1';

      connection.query(query_last_id, function (err, rows, fields, results) {
        if (err) {
          res.json({"error": err});
        } else {

          let id_configuracion = (rows.length === 0) ? data.id_sucursal + '1' : rows[0].id_configuracion;

          let query = 'INSERT INTO gestionfila.tbl_alarma_configuracion ';
          query += '(id, id_alarma, id_motivo, tiempo_ejecucion) ';
          query += 'VALUES ';
          query += '(' + id_configuracion + ',' + data.id_alarma + ',' + motivo + ',' + data.tiempo_ejecucion + '); ';

          connection.query(query, function (err, rows, results) {
            if (err) {
              res.json({"error": err});
            } else {

              let query = 'INSERT INTO gestionfila.tbl_usuario_alarma ';
              query += '(id_usuario, id_alarma) ';
              query += 'VALUES (' + data.id_usuario + ', ' + id_configuracion + ');';

              connection.query(query, function (err, rows, results) {
                if (err) {
                  res.json({"error": err});
                } else {
                  res.json(results);
                }
              });
            }

          });
        }
      });
    });

  router.put('/motivoatencion/:idMotivoAtencion/alarma/:idAlarma', function (req, res) {
    let motivo = parseInt(req.params.idMotivoAtencion);

    let query = `
            UPDATE tbl_alarma_configuracion 
            SET 
                id_alarma = ${req.body.id_alarma}, 
                id_motivo =  ${motivo}, 
                tiempo_ejecucion =  ${req.body.tiempo_ejecucion} 
            WHERE 
                id = ${req.params.idAlarma};`;

    connection.query(query, function (err, rows, results) {
      if (err) {
        res.json({"error": err});
      } else {

        let query = 'DELETE FROM gestionfila.tbl_usuario_alarma ';
        query += 'WHERE id_alarma = ' + req.params.idAlarma + ' AND id_usuario = ' + req.body.id_usuario;

        connection.query(query, function (err, rows, results) {
          if (err) {
            res.json({"error": err});
          } else {
            let query = 'INSERT INTO gestionfila.tbl_usuario_alarma ';
            query += '(id_usuario, id_alarma) ';
            query += 'VALUES (' + req.body.id_usuario + ', ' + req.params.idAlarma + ');';

            connection.query(query, function (err, rows, results) {
              if (err) {throw res.json({"error": err});}

              res.json(results);
            });
          }
        });
      }
    });
  });

  router.post('/alarmas/notificacion/:idSucursal', (req, res) => {
    let motivoAtencion = parseInt(req.body.idMotivoAtencion, 0) ? parseInt(req.body.idMotivoAtencion, 0) : null;
    let motivoPausa = parseInt(req.body.idMotivoPausa, 0) ? parseInt(req.body.idMotivoPausa, 0) : null;
    let ejecutivo = parseInt(req.body.idEjecutivo, 0) ? parseInt(req.body.idEjecutivo, 0) : null;
    let alarma = parseInt(req.body.idAlarma, 0) ? parseInt(req.body.idAlarma, 0) : null;
    let texto = req.body.text;

    let query = `SELECT
        distinct c.id, c.mail,
        CONCAT(c.nombres, ' ', c.apellidoPaterno, ' ', c.apellidoMaterno) AS nombre,
        CONCAT(a.nombre, ' - ', ma.nombre) AS motivo
      FROM
      sucursal a
      JOIN usuariosucursal b ON a.id = b.sucursal_id
      JOIN usuario c on c.id = b.usuario_id
      JOIN motivoatencionsucursal mas ON a.id = mas.sucursal_id
      JOIN motivoatencion ma ON mas.motivoAtencion_id = ma.id AND mas.motivoAtencion_id = ${motivoAtencion}
      WHERE
        a.id = ${req.params.idSucursal} AND c.mail <> "" AND c.mail IS NOT NULL`;

    connection.query(query, function (err, rows) {
      if (err) {
        res.status(500).json(err);
      } else {
        query = '';
        transport.verify(function (err, success) {
          if (err) {
            res.status(400).json(err);
          } else {
            let mails = rows.map((item) => item.mail);
            let subject = rows.map(item => item.motivo)
              .filter((value, index, self) => {
                return self.indexOf(value) === index;
              });

            transport.sendMail({
              from: 'no-reply@server.com',
              to: mails.join(', ').toString(),
              subject: subject[0],
              html: `<p>${req.body.text}<p/>`
            })
              .then(() => {
                async.eachSeries(rows, (queryItem, queryCallback) => {
                  query = `INSERT INTO tbl_alarma_registro 
                  (id_usuario, id_alarma, id_motivo_atencion, id_motivo_pausa, id_ejecutivo, motivo, texto) 
                  VALUES 
                  (${parseInt(queryItem.id, 0)},
                  ${alarma},
                  ${motivoAtencion},
                  ${motivoPausa},
                  ${ejecutivo},
                  null,
                  "${texto}");`;

                  connection.query(query, function (err, rows, results) {
                    if (!err) {
                      queryCallback();
                    }
                  });
                }, () => {
                  res.status(200).send(true);
                });
              })
              .catch(function (err) {
                res.status(500).json(err);
              });
          }
        });
      }
    });
  });

  router.post('/rangoticketsatencioneliminar/:idsucursal/:idmotivoatencion', function (req, res) {
    try {
      for (let i in sucursal) {
        sucursal[i].emit("descartarTicketsMasivos", {
          'idSucursal': req.params.idsucursal,
          'idMotivo': req.params.idmotivoatencion,
          'desde': req.body.rangeStart,
          'hasta': req.body.rangeEnd
        });
      }
      res.status(200).json("OK");
    } catch (error) {
      res.status(400).json(error);
    }
  });
};

module.exports = REST_ROUTER;
