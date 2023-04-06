'use strict';

function REST_ROUTER(router, connection, md5) {
  let self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
  router.get("/configuracionticketero/count/:idcliente", function(req, res) {
    let query = `SELECT 
          SUM(SUBSTRING(id, 6) + 1) AS ulitmoregistro
        FROM
          configuracionticketero
          WHERE cliente_idCliente = ${req.params.idcliente}
        ORDER BY CAST(SUBSTRING(id, 6) AS UNSIGNED) DESC
        LIMIT 1`;

    connection.query(query, function(err, rows) {
        if (err) {
          res.status(400).json({"error": err});
        } else {
          res.status(200).json(rows);
        }
      });
  });

  router.get("/configuracionticketero/:idcliente", function(req, res) {
    let query = `SELECT 
      ct.id,
      ct.descripcion,
      ct.mensajeImpresionTicket,
      ct.urlImagenFondo,
      ct.urlImagenDescanso,
      ct.minutosDesplegarImagenDescanso,
      ct.colorFondoRGB,
      ct.colorTextoTeclaRGB,
      ct.colorFondoTeclaRGB,
      ct.flagSincronizado,
      ct.mensajeDespliegueTotem,
      ct.colorPrimario,
      ct.colorSecundario,
      ct.logoTotem,
      ct.logoTicket
    FROM 
      configuracionticketero ct
    WHERE 
      ct.cliente_idCliente = '${req.params.idcliente}'`;

    connection.query(query, function(err, rows) {
        if (err) {
          res.status(400).json({"error": err});
        } else {
          res.status(200).json(rows);
        }
      });
  });

  router.post("/configuracionticketero", function(req, res){
    let detalle = req.body.detalle;
    let query = `INSERT INTO configuracionticketero
      (id,
      descripcion,
      mensajeImpresionTicket,
      urlImagenFondo,
      urlImagenDescanso,
      minutosDesplegarImagenDescanso,
      colorFondoRGB,
      colorTextoTeclaRGB,
      colorFondoTeclaRGB,
      cliente_idCliente,
      flagSincronizado,
      mensajeDespliegueTotem,
      colorPrimario,
      colorSecundario,
      logoTotem,
      logoTicket
      )
    VALUES
      ('${detalle.id}',
       '${detalle.descripcion}',
       '${detalle.mensajeImpresionTicket}',
       '${detalle.urlImagenFondo}',
       '${detalle.urlImagenDescanso}',
       '${detalle.minutosDesplegarImagenDescanso}',
       '${detalle.colorFondoRGB}',
       '${detalle.colorTextoTeclaRGB}',
       '${detalle.colorFondoTeclaRGB}',
       '${detalle.cliente_idCliente}',
       '${detalle.flagSincronizado}',
       '${detalle.mensajeDespliegueTotem}',
       '${detalle.colorPrimario}',
       '${detalle.colorSecundario}',
       '${detalle.logoTotem}',
       '${detalle.logoTicket}'
       )`;

      connection.query(query, function(err, rows) {
        if  (err) {
          res.status(400).json({"error": err});
        } else {
          res.status(200).json(rows);
        }
      });
  });

  router.get("/ticketero/count/:idsucursal", function(req, res) {
    connection.query(
      `SELECT 
            COUNT(id) as ulitmoregistro
            FROM 
               ticketero 
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

  router.get("/ticketero/:idsucursal", function(req, res) {

    connection.query(
      `SELECT
                t.id id
                , t.codigo
                , t.descripcion
                , t.estado
                , t.idCliente
                , t.ip
                , t.modelo
                , t.numeroSerie
                , t.sucursal_id
                , t.tipo
                , t.ubicacion
                , s.id idsucursal
                , s.nombre nombresucursal
                , ct.id idconfiguracion
                , ct.descripcion descripcionconfiguracion
                , CASE
                    WHEN (t.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion
                , CASE
                    WHEN (t.tipo = 'PE')THEN 'Pedestal'
                    ELSE 'Pared'                
                END tipodescripcion
            FROM 
                ticketero t
                , sucursal s
                , configuracionticketero ct
            WHERE
                s.id = '`+req.params.idsucursal+`'
                AND t.sucursal_id = s.id
                AND t.configuracionTicketero_id = ct.id
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.post("/ticketero", function(req, res){
    let detalle = req.body.detalle;

    connection.query(`
            INSERT INTO ticketero
                (id,
                codigo,
                descripcion,
                tipo,
                estado,
                ubicacion,
                ip,
                numeroSerie,
                modelo,
                configuracionTicketero_id,
                sucursal_id,
                idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.codigo+`',
                 '`+detalle.descripcion+`',
                 '`+detalle.tipo+`',
                 '`+detalle.estado+`',
                 '`+detalle.ubicacion+`',
                 '`+detalle.ip+`',
                 '`+detalle.numeroserie+`',
                 '`+detalle.modelo+`',
                 '`+detalle.idconfiguracionticketero+`',
                 '`+detalle.idsucursal+`',
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

  router.put("/ticketero/:id", function(req, res) {
    let query = `UPDATE ticketero 
        SET
          id = ${req.params.id},
          codigo = '${req.body.codigo}',
          descripcion = '${req.body.descripcion}',
          tipo = '${req.body.tipo}',
          estado = '${req.body.estado}',
          ubicacion = '${req.body.ubicacion}',
          ip = '${req.body.ip}',
          numeroSerie = '${req.body.numeroserie}',
          modelo = '${req.body.modelo}',
          configuracionTicketero_id = '${req.body.idconfiguracionticketero}',
          sucursal_id = '${req.body.idsucursal}',
          idCliente = '${req.body.idcliente}',
          flagSincronizado = '${req.body.flagSincronizado}'
        WHERE  
          id = ${req.params.id}`;

    connection.query(query, function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json("Datos del cliente modificado");
        }
      });
  });

  router.put("/configuracionticketero/:id", function(req, res){
    connection.query(
      `
            UPDATE configuracionticketero 
            SET
                id = '`+req.params.id+`',
                descripcion = '`+req.body.descripcion+`',
                mensajeImpresionTicket = '`+req.body.mensajeImpresionTicket+`',
                urlImagenFondo = '`+req.body.urlImagenFondo+`',
                urlImagenDescanso = '`+req.body.urlImagenDescanso+`',
                minutosDesplegarImagenDescanso = '`+req.body.minutosDesplegarImagenDescanso+`',
                colorFondoRGB = '`+req.body.colorFondoRGB+`',
                colorTextoTeclaRGB = '`+req.body.colorTextoTeclaRGB+`',
                colorFondoTeclaRGB = '`+req.body.colorFondoTeclaRGB+`',
                cliente_idCliente = '`+req.body.cliente_idCliente+`',
                flagSincronizado = '`+req.body.flagSincronizado+`',
                mensajeDespliegueTotem = '`+req.body.mensajeDespliegueTotem+`',
                colorPrimario = '`+req.body.colorPrimario+`',
                colorSecundario = '`+req.body.colorSecundario+`',
                logoTotem = '`+req.body.logoTotem+`',
                logoTicket = '`+req.body.logoTicket+`'
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
