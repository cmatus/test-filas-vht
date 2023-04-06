'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');

const _172_28_20_85 = io.connect('http://172.28.20.85:3001');
const _172_28_20_87 = io.connect('http://172.28.20.87:3001');
const _172_28_20_81 = io.connect('http://172.28.20.81:3001');
const _9_5_3_253 = io.connect('http://9.5.3.253:3001');
const _9_5_4_5 = io.connect('http://9.5.4.5:3001');
const _172_28_20_90 = io.connect('http://172.28.20.90:3001');
const _172_28_20_92 = io.connect('http://172.28.20.92:3001');
const _172_28_20_71 = io.connect('http://172.28.20.71:3001');
const _172_28_12_154 = io.connect('http://172.28.12.154:3001');
const _172_28_12_157 = io.connect('http://172.28.12.157:3001');
const _172_28_12_20 = io.connect('http://172.28.12.20:3001');
const _172_28_20_20 = io.connect('http://172.28.20.20:3001');
const _172_28_20_15 = io.connect('http://172.28.20.15:3001');
const _172_28_20_50 = io.connect('http://172.28.20.50:3001');
const _172_28_20_10 = io.connect('http://172.28.20.10:3001');

function REST_ROUTER(router, connection, md5) {
  const self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {


  router.get("/grupomodulosucursal/count/:idsucursal", function(req, res) {
    connection.query(
      `SELECT
            COUNT(id) as ultimoregistro
            FROM
               grupomodulosucursal
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

  router.get("/grupomodulosucursal/:idsucursal", function(req, res) {

    connection.query(
      `SELECT
                id
                , codigo
                , ubicacion
            FROM
                grupomodulosucursal
            WHERE
                sucursal_id = '`+req.params.idsucursal+`'
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.post("/grupomodulosucursal", function(req, res){
    let detalle = req.body.detalle;

    connection.query(
      `INSERT INTO grupomodulosucursal
                (id,
                codigo,
                ubicacion,
                flagSincronizado,
                sucursal_id)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.codigo+`',
                 '`+detalle.ubicacion+`',
                 '`+detalle.flagSincronizado+`',
                 '`+detalle.idsucursal+`')`
      , function(err, rows) {

        if(err) {
          console.log("error: "+err)
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/modulo/count/:idsucursal", function(req, res) {
    connection.query(
      `SELECT
            COUNT(id) as ultimoregistro
            FROM
               modulo
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


  router.get("/modulo/:idsucursal", function(req, res) {
    connection.query(
      `
            SELECT
                m.id
                , m.codigo
                , m.ubicacion
                , m.estado
                , m.ip
                , m.sucursal_id idsucursal
                , m.idCliente
                , m.ejecutivo_id idejecutivo
                , m.grupoModuloSucursal_id idgrupomodulosucursal
                , s.nombre nombresucursal
                , gms.codigo codigogrupo
                , gms.ubicacion ubicaciongrupo
                , CASE
                    WHEN (m.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion

            FROM
               modulo m
                , sucursal s
                , grupomodulosucursal gms
            WHERE
                m.sucursal_id = '`+req.params.idsucursal+`'
                AND m.sucursal_id = s.id
                AND m.grupoModuloSucursal_id = gms.id
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.post("/modulo", function(req, res){
    let detalle = req.body.detalle;
    connection.query(`
            INSERT INTO modulo
                (id,
                codigo,
                ubicacion,
                ip,
                estado,
                sucursal_id,
                idCliente,
                grupoModuloSucursal_id,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.codigo+`',
                 '`+detalle.ubicacion+`',
                 '`+detalle.ip+`',
                 '`+detalle.estado+`',
                 '`+detalle.idsucursal+`',
                 '`+detalle.idcliente+`',
                 '`+detalle.idgrupo+`',
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

  router.put("/modulo/:id", function(req, res){
    connection.query(
      `
            UPDATE modulo
            SET
                id = '`+req.params.id+`',
                codigo = '`+req.body.codigo+`',
                ubicacion = '`+req.body.ubicacion+`',
                estado = '`+req.body.estado+`',
                ip = '`+req.body.ip+`',
                sucursal_id = '`+req.body.idsucursal+`',
                idCliente = '`+req.body.idcliente+`',
                grupoModuloSucursal_id = '`+req.body.idgrupo+`',
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

  router.put("/grupomodulosucursal/:id", function(req, res){
    connection.query(
      `
            UPDATE grupomodulosucursal
            SET
                id = '`+req.params.id+`',
                codigo = '`+req.body.codigo+`',
                ubicacion = '`+req.body.ubicacion+`',
                sucursal_id = '`+req.body.idsucursal+`',
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



  router.get("/grupomodulosucursal/origendestino/count/:idsucursal", function(req, res) {

    connection.query(
      `SELECT
            COUNT(id) as ultimoregistro
            FROM
               grupomodulosucursal_od
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

  router.get("/grupomodulosucursal/origendestino/:idsucursal", function(req, res) {
    connection.query(
      `SELECT
                gmsod.id
                , gmsod.tiempoTrayecto
                , gmsod.idGrupoModuloSucursalO idgrupoorigen
                , gmsod.idGrupoModuloSucursalD idgrupodestino
                , gms.ubicacion ubicacionorigen
                , gms2.ubicacion ubicaciondestino
            FROM
                grupomodulosucursal_od gmsod
            LEFT JOIN grupomodulosucursal gms ON gmsod.idGrupoModuloSucursalO=gms.id
            LEFT JOIN grupomodulosucursal gms2 ON gmsod.idGrupoModuloSucursalD=gms2.id
            WHERE
                gmsod.sucursal_id = '`+req.params.idsucursal+`'
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.post("/grupomodulosucursal_od", function(req, res){
    let detalle = req.body.detalle;

    connection.query(
      `
            INSERT INTO grupomodulosucursal_od
            (
                id,
                tiempoTrayecto,
                idGrupoModuloSucursalO,
                idGrupoModuloSucursalD,
                flagSincronizado,
                sucursal_id
            )
            VALUES
            ('`+detalle.id+`',
            '`+detalle.tiempoTrayecto+`',
            '`+detalle.idGrupoModuloSucursalO+`',
            '`+detalle.idGrupoModuloSucursalD+`',
            '`+detalle.flagSincronizado+`',
            '`+detalle.idsucursal+`')
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

  router.put("/grupomodulosucursal_od/:id", function(req, res){
    console.log('grupomodulosucursal_od',
      `
            UPDATE gestionfila.grupomodulosucursal_od
            SET
                id = '`+req.params.id+`',
                tiempoTrayecto = '`+req.body.tiempoTrayecto+`',
                idGrupoModuloSucursalO = '`+req.body.idGrupoModuloSucursalO+`',
                idGrupoModuloSucursalD = '`+req.body.idGrupoModuloSucursalD+`',
                sucursal_id = '`+req.body.idsucursal+`',
                flagSincronizado = '`+req.body.flagSincronizado+`'
            WHERE
                id = '`+req.params.id+`'
            `
    )

    connection.query(
      `
            UPDATE grupomodulosucursal_od
            SET
                id = '`+req.params.id+`',
                tiempoTrayecto = '`+req.body.tiempoTrayecto+`',
                idGrupoModuloSucursalO = '`+req.body.idGrupoModuloSucursalO+`',
                idGrupoModuloSucursalD = '`+req.body.idGrupoModuloSucursalD+`',
                sucursal_id = '`+req.body.idsucursal+`',
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

  router.get("/liberarmodulo/:id", function(req, res){
    try{
      console.log(req.params.id)
      socket.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_85.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_87.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_81.emit("liberarmodulo", {'idmodulo':req.params.id});
      _9_5_3_253.emit("liberarmodulo", {'idmodulo':req.params.id});
      _9_5_4_5.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_90.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_92.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_71.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_12_154.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_12_157.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_12_20.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_20.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_15.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_50.emit("liberarmodulo", {'idmodulo':req.params.id});
      _172_28_20_10.emit("liberarmodulo", {'idmodulo':req.params.id});
      res.json("OK");
    }catch (error){
      console.log("error")
      res.json(error);
    }
  });

  router.get("/modulomotivosasociados/:idsucursal", function(req, res) {
    let query = `
        SELECT
          C.id
        , C.motivoAtencionSucursal_id idmotivoatencionsucursal
        , C.modulo_id idmodulo
        , C.prioridad
        , C.atiendeDesborde
        FROM
            gestionfila.modulo A
            , gestionfila.motivoatencionsucursal B
            , gestionfila.modulomotivoatencionsucursal C
        WHERE
            A.id = C.modulo_id
            AND B.id = C.motivoAtencionSucursal_id
            AND A.sucursal_id = '`+req.params.idsucursal+`'
            AND C.fecha_elminacion IS NULL
        `;

    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.post(
    "/revisamodulosmotivosasociados", function(req, res){
      let modulos = req.body.modulosJSON;
      let motivos = req.body.motivosJSON;
      let seleccionados = req.body.seleccionadosJSON;

      let modulos2 = []

      for(let i = 0; i < modulos.length; i++){
        let motivos2 = []
        for(let j = 0; j < motivos.length; j++){

          for(let x = 0; x < seleccionados.length; x++){
            if(modulos[i].id === seleccionados[x].idmodulo
              && motivos[j].idmotivoatencionsucursal === seleccionados[x].idmotivoatencionsucursal
            ){
              motivos[j].seleccionado = seleccionados[x].prioridad
              break
            }
            motivos[j].seleccionado = 0
          }

          for(let x = 0; x < seleccionados.length; x++){
            if(modulos[i].id === seleccionados[x].idmodulo
              && motivos[j].idmotivoatencionsucursal === seleccionados[x].idmotivoatencionsucursal
              && seleccionados[x].atiendeDesborde == 1
            ){
              motivos[j].atiendeDesborde = true
              break
            }
            motivos[j].atiendeDesborde = false
          }

          motivos2.push({
              idmotivoatencion: motivos[j].idmotivoatencion
              , nombremotivoatencion:motivos[j].nombremotivoatencion
              , seleccionado: motivos[j].seleccionado
              , atiendeDesborde: motivos[j].atiendeDesborde
              , idmotivoatencionsucursal: motivos[j].idmotivoatencionsucursal
            }
          )
          motivos[j].seleccionado = 0
          motivos[j].atiendeDesborde = false

        }

        modulos2.push(
          {
            id: modulos[i].id
            , codigo: modulos[i].codigo
            , motivos: motivos2
          });
      }
      res.json(modulos2);
    });



}
module.exports = REST_ROUTER;
