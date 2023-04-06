'use strict';

const async = require('async');

function REST_ROUTER(router, connection) {
  let self = this;
  self.handleRoutes(router, connection);
}

REST_ROUTER.prototype.handleRoutes = (router, connection) => {

  router.get("/configuracionvisor/count/:idcliente", function(req, res) {
    connection.query(
      `SELECT 
            COUNT(id) as ulitmoregistro
            FROM 
               configuracionvisor 
            WHERE 
                cliente_idCliente = '`+req.params.idcliente+`'`

      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/configuracionvisor/:idcliente", function(req, res) {
    connection.query(
      `SELECT 
                cv.id
                , cv.descripcion
                , cv.cantidadFilas
                , cv.cantidadColumnas
                , cv.posicion
                , cv.cantidadParpadeosLlamado
                , cv.imagenRepresentaConfVisor
                , CASE
                    WHEN (cv.posicion = 'V')THEN 'Vertical'
                    ELSE 'Horizontal'
                END posiciondescripcion

            FROM 
                configuracionvisor cv
            WHERE 
                cv.cliente_idCliente = '`+req.params.idcliente+`'
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.post("/configuracionvisor", function(req, res){
    let detalle = req.body.detalle;

    connection.query(
      `INSERT INTO configuracionvisor
                (id,
                descripcion,
                cantidadFilas,
                cantidadColumnas,
                posicion,
                cantidadParpadeosLlamado,
                imagenRepresentaConfVisor,
                cliente_idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.descripcion+`',
                 '`+detalle.cantidadFilas+`',
                 '`+detalle.cantidadColumnas+`',
                 '`+detalle.posicion+`',
                 '`+detalle.cantidadParpadeosLlamado+`',
                  `+detalle.imagenRepresentaConfVisor+`,
                 '`+detalle.idcliente+`',
                 '`+detalle.flagSincronizado+`')`
      , function(err, rows) {

        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/visor/count/:idsucursal", function(req, res) {
    connection.query(
      `SELECT 
            COUNT(id) as ultimoregistro
            FROM 
               visor 
            WHERE 
                sucursal_id = '`+req.params.idsucursal+`'`

      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/visor/:idsucursal", function(req, res) {
    connection.query(
  `
        SELECT
            v.id id
            , v.codigo
            , v.descripcion
            , v.estado
            , v.ubicacion
            , v.ip
            , v.numeroSerie
            , v.modelo
            , v.tipo
            , v.pulgadas
            , v.sucursal_id
            , v.configuracionVisor_id
            , v.idCliente
            , s.id idsucursal
            , s.nombre nombresucursal
            , cv.id idconfiguracion
            , cv.descripcion descripcionconfiguracion
            , CASE
                WHEN (v.estado = 1)THEN 'Activo'
                ELSE 'De baja'
            END estadodescripcion

        FROM 
            visor v
            , sucursal s
            , configuracionvisor cv
        WHERE
            s.id = '`+req.params.idsucursal+`'
            AND v.sucursal_id = s.id
            AND v.configuracionVisor_id = cv.id
        `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get('/visor/sucursales/:idUsuario/publicidad/:idPublicidad', (req, res) => {
    let usuario = parseInt(req.params.idUsuario, 0);
    let publicidad = req.params.idPublicidad ? parseInt(req.params.idPublicidad, 0) : 0;

    let query = `SELECT DISTINCT a.id, a.nombre,
          CASE
          WHEN (c.publicidad_id) THEN TRUE
          ELSE FALSE END AS activo
        FROM sucursal a `;
    query += (usuario) ? `LEFT JOIN usuariosucursal b ON a.id = b.sucursal_id ` : ``;
    query += `LEFT JOIN publicidadsucursal c ON c.sucursal_id = a.id AND c.publicidad_id =${publicidad} `;
    query += `WHERE c.fecha_elminacion IS NULL `;
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

  router.get('/visor/usuario/:idUsuario/publicidad', (req, res) => {
    let query = `SELECT
        DISTINCT a.*
      FROM
        publicidad a
      LEFT JOIN publicidadsucursal b ON a.id = b.publicidad_id
      LEFT JOIN usuariosucursal c ON b.sucursal_id = c.sucursal_id
      WHERE 
        a.fecha_elminacion IS NULL`;

    query += (parseInt(req.params.idUsuario, 0)) ? ` AND c.usuario_id = ${parseInt(req.params.idUsuario, 0)} ` : ` `;
    query += `ORDER BY a.id`;

    connection.query(query, (err, rows) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(rows);
      }
    })
  });

  router.post('/visor/publicidad', (req, res) => {
    let query = `INSERT INTO publicidad (archivo, descripcion) 
      VALUES ('${req.body.filename}', '${req.body.descripcion}')`;

    connection.query(query, (err, rows) => {
      if (err) {
        res.status(400).json(err);
      } else {
        async.eachSeries(req.body.sucursales, (queryItem, queryCallback) => {
          query = `INSERT INTO publicidadsucursal 
              (sucursal_id, publicidad_id) VALUES (${queryItem}, ${rows.insertId});`;

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

  router.get('/visor/publicidad/:idPublicidad/edit', (req, res) => {
    let query = `SELECT * FROM publicidad where id = ${parseInt(req.params.idPublicidad, 0)}`;
    let publicidad = {};
    connection.query(query, (err, rows) => {
      if (err) {
        res.status(400).json(err);
      } else {
        publicidad = rows[0];
        let query = `SELECT * FROM publicidadsucursal where publicidad_id = ${rows[0].id} AND fecha_elminacion IS NULL`;

        connection.query(query, (err, rows) => {
          if (err) {
            res.status(400).json(err);
          } else {
            publicidad.sucursales = rows;
            res.status(200).json(publicidad);
          }
        });
      }
    });
  });

  router.put('/visor/publicidad/:idPublicidad', (req, res) => {
    let query = `UPDATE publicidad SET descripcion = '${req.body.descripcion}' WHERE id = ${req.params.idPublicidad}`;

    connection.query(query, (err, rows) => {
      if (err) {
        res.status(400).json(err);
      } else {
        query = `UPDATE publicidadsucursal SET fecha_elminacion = CURRENT_TIMESTAMP
          WHERE publicidad_id = ${req.params.idPublicidad}`;

        connection.query(query, (err, rows) => {
          if (err) {
            res.status(400).json(err);
          } else {
            async.eachSeries(req.body.sucursales, (queryItem, queryCallback) => {
              query = `INSERT INTO publicidadsucursal 
                (sucursal_id, publicidad_id) VALUES (${queryItem}, ${req.params.idPublicidad});`;

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

      }
    });
  });

  router.delete('/visor/publicidad/:idPublicidad', (req, res) => {
    let query = `UPDATE publicidad SET fecha_elminacion = CURRENT_TIMESTAMP WHERE id = ${req.params.idPublicidad}`;

    connection.query(query, (err, rows) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(rows);
      }
    });
  });

  router.post("/visor", function(req, res){
    let detalle = req.body.detalle;

    connection.query(`
            INSERT INTO visor
                (id,
                codigo,
                descripcion,
                estado,
                ubicacion,
                ip,
                numeroSerie,
                modelo,
                tipo,
                pulgadas,
                configuracionVisor_id,
                sucursal_id,
                idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.codigo+`',
                 '`+detalle.descripcion+`',
                 '`+detalle.estado+`',
                 '`+detalle.ubicacion+`',
                 '`+detalle.ip+`',
                 '`+detalle.numeroserie+`',
                 '`+detalle.modelo+`',
                 '`+detalle.tipo+`',
                 '`+detalle.pulgadas+`',
                 '`+detalle.idconfiguracionvisor+`',
                 '`+detalle.idsucursal+`',
                 '`+detalle.idcliente+`',
                 '`+detalle.flagSincronizado+`')
            `
      , function(err, rows) {

        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.put("/visor/:id", function(req, res){
    connection.query(
      `
        UPDATE visor 
        SET
            id = '`+req.params.id+`',
            codigo = '`+req.body.codigo+`',
            descripcion = '`+req.body.descripcion+`',                
            estado = '`+req.body.estado+`',
            ubicacion = '`+req.body.ubicacion+`',
            ip = '`+req.body.ip+`',
            numeroSerie = '`+req.body.numeroserie+`',
            modelo = '`+req.body.modelo+`',
            tipo = '`+req.body.tipo+`',
            pulgadas = '`+req.body.pulgadas+`',
            sucursal_id = '`+req.body.idsucursal+`',
            idCliente = '`+req.body.idcliente+`',
            configuracionVisor_id = '`+req.body.idconfiguracionvisor+`',
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

  router.put("/configuracionvisor/:id", function(req, res){
    let detalle = req.body.detalle;

    connection.query(
      `
        UPDATE configuracionvisor 
        SET
        id = '`+detalle.id+`',
        descripcion = '`+detalle.descripcion+`',
        cantidadFilas = '`+detalle.cantidadFilas+`',
        cantidadColumnas = '`+detalle.cantidadColumnas+`',
        posicion = '`+detalle.posicion+`',
        cantidadParpadeosLlamado = '`+detalle.cantidadParpadeosLlamado+`',
        imagenRepresentaConfVisor = '`+detalle.imagenRepresentaConfVisor+`',
        cliente_idCliente = '`+detalle.idcliente+`',
        flagSincronizado = '`+detalle.flagSincronizado+`'
        WHERE  
            id = '`+detalle.id+`'
        `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json("Datos de la configuración visor modificado");
        }
      });
  });

  router.delete("/componentevisor/:idconfiguracionvisor", function(req, res){

    connection.query(
      `
        DELETE FROM 
            componentevisor
        WHERE 
            configuracionVisor_id = '`+req.params.idconfiguracionvisor+`'
        `
      , function(err, rows){
        if(err){
          res.json({"error": err});
        } else {
          res.json("componentes eliminados");
        }
      });
  });

  router.get("/componentevisor/count/:idconfiguracionvisor", function(req, res) {
    connection.query(
      `
        SELECT id ultimoregistro
        FROM componentevisor
        WHERE configuracionVisor_id = '`+req.params.idconfiguracionvisor+`'
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

  router.post("/componentevisor/:ultimoregistro/:idconfiguracionvisor", function(req, res){
    let detalleComponentes = req.body.detalleComponentes;
    let strInsert =
      `INSERT INTO componentevisor(id,alto,ancho,componente_id,flagSincronizado,configuracionVisor_id,posicionX,posicionY) VALUES `
    let ultimoregistroAux = 0
    for(let i = 0; i < detalleComponentes.length;i++){
      ultimoregistroAux = req.params.ultimoregistro + (i+1)
      strInsert+=
        `('`+ultimoregistroAux+`','`+detalleComponentes[i].alto+`','`+detalleComponentes[i].ancho+`','`+detalleComponentes[i].idcomponente+`','`+detalleComponentes[i].flagSincronizado+`','`+req.params.idconfiguracionvisor+`','`+detalleComponentes[i].posicionX+`','`+detalleComponentes[i].posicionY+`')            
            `
      if(i != detalleComponentes.length - 1){
        strInsert += `,`
      }
    }

    connection.query(
      strInsert
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
