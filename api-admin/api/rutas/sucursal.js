'use strict';

function REST_ROUTER(router, connection, md5) {
  const self = this;
  self.handleRoutes(router, connection, md5);
}

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
  15: io.connect('http://localhost:3001')
};

REST_ROUTER.prototype.handleRoutes = function(router, connection) {

  router.get("/sucursal", function(req, res) {
    let query = 'SELECT A.*, ' +
      'false AS asociado, ' +
      '(SELECT B.nombre FROM pais B where A.pais_id = B.id) AS nombrepais,' +
      '(SELECT C.nombre FROM zona C where A.zona_id = C.id) AS nombrezona, ' +
      '(SELECT D.nombre FROM subzona D where A.subzona_id = D.id) AS nombresubzona, ' +
      'CASE WHEN (A.estado = 1)THEN \'Activo\' ELSE \'De baja\' END AS estadodescripcion ' +
      'FROM sucursal A ' +
      'WHERE id <> 11103100 ORDER BY A.NOMBRE';

    connection.query(query, function(err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/nombreSucursal/:id", function(req, res) {
      //console.log("SELECT * FROM sucursal ORDER BY id")
      connection.query("SELECT nombre FROM sucursal where id ="+ req.params.id, function(err, rows) {
          if(err) {
              res.json({"error": err});
          } else {
              res.json(rows);
          }
      });
  });

  router.get("/sucursal/count/:idcliente", function(req, res) {
    let query = `SELECT COUNT(id) AS ultimasucursal FROM sucursal WHERE cliente_idCliente = ${req.params.idcliente}`;

    connection.query(query, function(err, rows) {
      if (err) {
        res.json([]);
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/sucursal/listado/:idcliente/:idusuario?", function(req, res) {
    let query = 'SELECT A.*, ' +
      '(SELECT B.nombre FROM pais B where A.pais_id = B.id) as nombrepais, ' +
      '(SELECT C.nombre FROM zona C where A.zona_id = C.id) as nombrezona, ' +
      '(SELECT D.nombre FROM subzona D where A.subzona_id = D.id) as nombresubzona, ' +
      'CASE WHEN (A.estado = 1) THEN "Activo" ELSE "De baja" END estadodescripcion, ' +
      'false asociado ' +
      'FROM sucursal A ';
    query += (req.params.idusuario) ? 'INNER JOIN usuariosucursal E ON A.id = E.sucursal_id ' : '';
    query += ' WHERE A.id <> 11103100 ' +
      'AND A.cliente_idCliente = ' + req.params.idcliente + ' ';
    query += (req.params.idusuario) ? 'AND E.usuario_id = ' + req.params.idusuario : ' ';
    query += ' ORDER BY A.nombre';

    connection.query(query, function(err, rows) {
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  });

  router.get('/sucursal/usuarios/:idUsuario/ejecutivos/:idEjecutivo', (req, res) => {
    let usuario = parseInt(req.params.idUsuario, 0);
    let query = `SELECT a.id, a.nombre,
          CASE
          WHEN (c.ejecutivo_id) THEN TRUE
          ELSE FALSE END AS activo
        FROM sucursal a `;
    query += (usuario) ? `LEFT JOIN usuariosucursal b ON a.id = b.sucursal_id ` : ``;
    query += `LEFT JOIN ejecutivosucursal c ON c.sucursal_id = a.id AND c.ejecutivo_id = ${req.params.idEjecutivo} `;
    query += `WHERE c.fecha_elminacion is null `;
    query += (usuario) ? `AND b.usuario_id = ${usuario} ` : ``;
    query += `GROUP BY a.id ORDER BY a.nombre`;

    connection.query(query, (err, rows) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(rows);
      }
    });
  });

  router.post("/sucursal", function(req, res){
    let detalle = req.body.detalle;
    let query = `INSERT INTO sucursal (
      id,
      nombre,
      codigo,
      telefonos,
      correoContacto1,
      correoContacto2,
      logo,
      estado,
      direccion,
      direccion2,
      cliente_idCliente,
      pais_id,
      zona_id,
      subzona_id,
      flagSincronizado
    ) VALUES (
      '${detalle.idsucursal}',
      '${detalle.nombre}',
      '${detalle.codigo}',
      '${detalle.telefonos}',
      '${detalle.correo1}',
      '${detalle.correo2}',
      '${detalle.logo}',
      '${detalle.estado}',
      '${detalle.direccion}',
      '${detalle.direccion2}',
      '${detalle.idcliente}',
      '${detalle.idpais}',
      '${detalle.idzona}',
      '${detalle.idsubzona}',
      '${detalle.flagsincronizar}'
    )`;

    connection.query(query, function(err, rows) {
      if (err) {
        res.status(404).json(err);
      }

      query = `SELECT COUNT(*) sucursales, id  FROM sucursal LIMIT 1`;
      connection.query(query, function(err, rows) {
        if (err) {
          res.status(404).json(err);
        }

        if (rows[0].sucursales === 1 ) {
          query = `INSERT INTO configuracionsucursalactivo (sucursal_id) VALUE (${rows[0].id})`;
          connection.query(query, function(err, rows) {
            if (err) {
              res.status(404).json(err);
            }
            res.status(200).json(rows);
          });
        } else {
          res.status(200).json(rows);
        }
      });
    });
  });

  router.get("/sucursal", function(req, res) {
    connection.query('SELECT * FROM sucursal ORDER BY nombre', function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        //console.log(rows[0])
        res.json(rows);
      }
    });
  });

  router.get("/sucursal/configuracion/:idsucursal", function(req, res) {
    connection.query(`SELECT * FROM configuracionsucursal WHERE sucursal_id = ${req.params.idsucursal}`, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/sucursal/configuracion/contar/:idsucursal", function(req, res) {
    connection.query("SELECT COUNT(id) as ultimaconfigsucursal FROM configuracionsucursal WHERE sucursal_id ="+ req.params.idsucursal, function(err, rows) {
      if(err) {
        res.json([]);
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/sucursal/serversecundarios/:idsucursal", function(req, res) {
    connection.query(`SELECT * FROM servidorsecundariosucursal WHERE sucursal_id = ${req.params.idsucursal}`, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.post("/configuracionsucursal", function(req, res){
    let detalle = req.body.detalle;
    let query = `INSERT INTO configuracionsucursal
        (id
        , ipServidorCentral
        , hostServidorCentral
        , portServidorCentral
        , ipServidorLocal
        , hostServidorLocal
        , portServidorLocal
        , cantidadExtraLlamados
        , reproducirAudioLlamado
        , tiempoPausaSgteLlamado
        , solicitaDatosAcceso
        , accesoAutomaticoIP
        , accesoAutomaticoHost
        , accesoAutomaticoPort
        , volverLlamar
        , sucursal_id
        , flagSincronizado
        , tiempoMaximoLlamado
        , desborde
        , tiempoRellamadoSegundos
        , llamadoIntercalado
        )
      VALUES
        (
          '${detalle.id}',
          '${detalle.ipServidorCentral}',
          '${detalle.hostServidorCentral}',
          '${detalle.portServidorCentral}',
          '${detalle.ipServidorLocal}',
          '${detalle.hostServidorLocal}',
          '${detalle.portServidorLocal}',
          '${detalle.cantidadExtraLlamados}',
          '${detalle.reproducirAudioLlamado}',
          '${detalle.tiempoPausaSgteLlamado}',
          '${detalle.solicitaDatosAcceso}',
          '${detalle.accesoAutomaticoIP}',
          '${detalle.accesoAutomaticoHost}',
          '${detalle.accesoAutomaticoPort}',
          '${detalle.volverLlamar}',
          '${detalle.sucursal_id}',
          '${detalle.flagSincronizado}',
          '${detalle.tiempoMaximoLlamado}',
          '${detalle.desborde}',
          '${detalle.tiempoRellamadoSegundos}',
          '${detalle.llamadoIntercalado}'
        )`;

    connection.query(query, function(err, rows) {
      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  });

  router.put("/sucursal/:id", function(req, res){

    connection.query(
      `
        UPDATE sucursal
        SET
            id = '`+req.params.id+`',
            nombre = '`+req.body.nombre+`',
            codigo = '`+req.body.codigo+`',
            telefonos = '`+req.body.telefonos+`',
            correoContacto1 = '`+req.body.correo1+`',
            correoContacto2 = '`+req.body.correo2+`',
            logo = `+req.body.logo+`,
            estado = '`+req.body.estado+`',
            direccion = '`+req.body.direccion+`',
            direccion2 = '`+req.body.direccion2+`',
            cliente_idCliente = '`+req.body.idcliente+`',
            pais_id = '`+req.body.idpais+`',
            zona_id = '`+req.body.idzona+`',
            subzona_id = '`+req.body.idsubzona+`',
            flagSincronizado = '`+req.body.flagsincronizar+`'
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

  router.get("/sucursal/:id", function(req, res) {
    connection.query("SELECT nombre FROM sucursal where id ="+ req.params.id, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.put("/configuracionsucursal/:id/:sucursal_id", function(req, res){
    let query = `UPDATE configuracionsucursal SET
      id = '${req.params.id}',
      ipServidorCentral = '${req.body.ipServidorCentral}',
      hostServidorCentral = '${req.body.hostServidorCentral}',
      portServidorCentral = '${req.body.portServidorCentral}',
      ipServidorLocal = '${req.body.ipServidorLocal}',
      hostServidorLocal = '${req.body.hostServidorLocal}',
      portServidorLocal = '${req.body.portServidorLocal}',
      cantidadExtraLlamados = '${req.body.cantidadExtraLlamados}',
      reproducirAudioLlamado = '${req.body.reproducirAudioLlamado}',
      tiempoPausaSgteLlamado = '${req.body.tiempoPausaSgteLlamado}',
      solicitaDatosAcceso = '${req.body.solicitaDatosAcceso}',
      accesoAutomaticoIP = '${req.body.accesoAutomaticoIP}',
      accesoAutomaticoHost = '${req.body.accesoAutomaticoHost}',
      accesoAutomaticoPort = '${req.body.accesoAutomaticoPort}',
      volverLlamar = '${req.body.volverLlamar}',
      sucursal_id = '${req.params.sucursal_id}',
      flagSincronizado = '${req.body.flagSincronizado}',
      tiempoRellamadoSegundos = '${req.body.tiempoRellamadoSegundos}',
      tiempoMaximoLlamado = '${req.body.tiempoMaximoLlamado}',
      desborde = '${req.body.desborde}',
      llamadoIntercalado = '${req.body.llamadoIntercalado}'
    WHERE
      id = '${req.params.id}' AND  sucursal_id = '${req.params.sucursal_id}'`;

    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json("Datos del cliente modificado");
      }
    });
  });

  router.get("/limpiarsucursal/:sucursal_id", function (req, res) {
    try{
      for (let i in sucursal) {
        sucursal[i].emit("cerrarJornada", {'sucursal': req.params.sucursal_id});
      }
      res.json("OK");
    }catch (error){
      res.json(error);
    }
  });

};

module.exports = REST_ROUTER;
