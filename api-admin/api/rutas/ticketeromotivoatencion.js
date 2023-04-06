ticketeromotivoatencionmysql = require("mysql");

express = require('express');
app = express();
server = require('http').Server(app);
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
};

function REST_ROUTER(router, connection, md5) {
  let self = this;
  self.handleRoutes(router, connection, md5);
}


REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

  router.get("/ticketeromotivoatencion/:idsucursal/:idticketero", function(req, res) {

    let query = `
        SELECT
            m.id idmotivoatencion
            , m.nivel
            , m.idPadre
            , m.flagSincronizado flagsincmotivoatencion
            , m.nombre
            , m.tipo
            , ms.id idmotivoatencionsucursal
            , m.cliente_idCliente
            , ms.codigoDespliegue
            , ms.estado
            , ms.flagSincronizado flgasincmotivoatencionsuc
            , ms.solicitaDatosAcceso
            , ms.sucursal_id
            , ms.tiempoMaximoAtencion
            , ms.tiempoMaximoEsperaCola
            , ms.tiempoMinimoEsperaCola
            , ms.tiempoMinimoAtencion
            , tmas.id idticketeromotivoatencionsuc
            , tmas.ticketero_id idticketero
            ,  CASE
                    WHEN (tmas.id) IS NULL THEN false
                    ELSE true
                END asociado
        FROM
            motivoatencion m
            , motivoatencionsucursal ms
            LEFT JOIN ticketeromotivoatencionsucursal tmas ON ms.id = tmas.motivoAtencionSucursal_id 
            AND tmas.ticketero_id = '` + req.params.idticketero + `'
            AND tmas.fecha_elminacion IS NULL
        WHERE
            m.id = ms.motivoAtencion_id
            AND m.tipo = 'D'
            AND ms.estado = '1'
            AND ms.sucursal_id = '` + req.params.idsucursal + `'
           
        `;

    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/ticketeromotivoatencion/diashoras", function(req, res) {

    connection.query(
      `SELECT
                d.id
                , d.descripcion descripciondia
                , h.idhora
                , h.descripcion descripcionhora
                , h.valor
            FROM
                dia d
                , hora h
            ORDER BY
                d.id
                , h.idhora`
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/ticketerohorariomotivoatencion/nodisponible/:ticketeromotivoatencionsucursal", function(req, res) {
    let query = `
            SELECT
                d.id,
                d.descripcion descripciondia,
                h.idhora,
                h.descripcion descripcionhora,
                h.valor,
               (case when (
                    select id from ticketerohorariomotivoatencion
                    where hora_idhora = h.idhora
                    and dia_id = d.id
                    and ticketeroMotivoAtencionSucursal_id = '${req.params.ticketeromotivoatencionsucursal}'
                    AND fecha_elminacion is NULL) then 0 else 1 end ) seleccionado
            FROM
                  dia d
                  ,hora h
            order by d.id, h.idhora
            `;

    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.post("/ticketeromotivoatencion", function(req, res){
    let detalle = req.body.detalle;

    connection.query(
      `INSERT INTO ticketeromotivoatencionsucursal
        (id,
        motivoAtencionSucursal_id,
        ticketero_id,
        flagSincronizado)
      VALUES
        ('${detalle.id}',
         '${detalle.idmotivoatencionsucursal}',
         '${detalle.idticketero}',
         '${detalle.flagSincronizado}')`
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          socket.emit("actualizarTicketeroMotivoAtencion", "");
          res.json(rows);
        }
      });
  });

  router.delete("/ticketeromotivoatencion/:id", function(req, res){

    let query = `UPDATE ticketeromotivoatencionsucursal SET fecha_elminacion = CURRENT_TIMESTAMP WHERE id = ${req.params.id}`;

    connection.query(query, function(err, rows){
      if (err) {
        res.json({"error": err});
      }else{
        socket.emit("actualizarTicketeroMotivoAtencion", "");
        res.json("Usuario eliminado");
      }
    });
  });

  router.get("/ticketeromotivoatencion/count", function(req, res) {

    connection.query(
      `
            SELECT id ultimoregistro
            FROM ticketeromotivoatencionsucursal
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

  router.get("/ticketeromotivoatencionhorarios/count/:idticketeromotivoatencionsucursal", function(req, res) {

    connection.query(
      `
            SELECT id ultimoregistro
            FROM ticketerohorariomotivoatencion
            WHERE
                ticketeroMotivoAtencionSucursal_id = '`+req.params.idticketeromotivoatencionsucursal+`'
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

  router.post("/ticketeromotivoatencionhorarios", function(req, res){
    let detalle = req.body.detalle;

    connection.query(
      `
            INSERT INTO ticketerohorariomotivoatencion
                (id,
                estado,
                hora_idhora,
                dia_id,
                ticketeroMotivoAtencionSucursal_id,
                flagSincronizado)
            VALUES
                ('${detalle.id}',
                 '${detalle.estado}',
                 '${detalle.idhora}',
                 '${detalle.iddia}',
                 '${detalle.idticketeromotivoatencionsucursal}',
                 '${detalle.flagSincronizado}')
            `
      , function(err, rows) {

        if(err) {
          res.json({"error": err});
        } else {
          socket.emit("actualizarHorarios", "");
          res.json(rows);

        }
      });
  });

  router.delete("/ticketeromotivoatencionhorarios/:idticketeromotivoatencionsucursal/:iddia/:idhora", function(req, res){
    let query = `UPDATE ticketerohorariomotivoatencion 
        SET fecha_elminacion = CURRENT_TIMESTAMP 
        WHERE hora_idhora = ${req.params.idhora} AND dia_id = ${req.params.iddia} 
        AND ticketeroMotivoAtencionSucursal_id = ${req.params.idticketeromotivoatencionsucursal}`;

    connection.query(query, function(err, rows){
      if (err) throw res.json({"error": err});

      socket.emit("actualizarHorarios", "");
      res.json("Actualizar Horarios Delete");
    });
  });

  router.get("/ticketeromotivosasociados/:idsucursal", function(req, res) {

    connection.query(
      `
            SELECT
                C.motivoAtencionSucursal_id idmotivoatencionsucursal
                , C.ticketero_id idticketero
            FROM
                ticketero A
                , motivoatencionsucursal B
                , ticketeromotivoatencionsucursal C
            WHERE
                A.id = C.ticketero_id
                AND B.id = C.motivoAtencionSucursal_id
                AND A.sucursal_id = '`+req.params.idsucursal+`'
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.post("/revisaticketerosmotivosasociados", function(req, res){
    var ticketeros = req.body.ticketerosJSON;
    var motivos = req.body.motivosJSON;
    var seleccionados = req.body.seleccionadosJSON;

    var ticketeros2 = []

    for(var i = 0; i < ticketeros.length; i++){
      var motivos2 = []
      for(var j = 0; j < motivos.length; j++){

        for(var x = 0; x < seleccionados.length; x++){
          if(ticketeros[i].id === seleccionados[x].idticketero
            && motivos[j].idmotivoatencionsucursal === seleccionados[x].idmotivoatencionsucursal
          ){
            motivos[j].seleccionado = 1
            break
          }
          motivos[j].seleccionado = 0
        }


        motivos2.push({
            idmotivoatencion: motivos[j].idmotivoatencion
            , nombremotivoatencion:motivos[j].nombremotivoatencion
            , seleccionado: motivos[j].seleccionado
            , idmotivoatencionsucursal: motivos[j].idmotivoatencionsucursal
          }
        )
        motivos[j].seleccionado = 0

      }

      ticketeros2.push(
        {
          id: ticketeros[i].id
          , descripcion: ticketeros[i].descripcion
          , motivos: motivos2
        });
    }
    res.json(ticketeros2);
  });

}

module.exports = REST_ROUTER;
