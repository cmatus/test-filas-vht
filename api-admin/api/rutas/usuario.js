mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
  var self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

  router.get("/usuario", function(req, res) {
    connection.query(
      `
                SELECT u.id,
                    u.nombres,
                    u.apellidoPaterno,
                    u.apellidoMaterno,
                    u.identificacionAcceso,
                    u.claveAcceso,
                    u.mail,
                    u.genero,
                    u.telefonos,
                    u.estado,
                    u.foto,
                    CASE
                        WHEN (u.estado = 1)THEN 'Activo'
                        ELSE 'De baja'
                    END estadodescripcion
                FROM usuario u
                WHERE u.id != '0'
                ORDER BY u.nombres, u.apellidoPaterno
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/usuariocliente/count/:idcliente", function(req, res) {

    connection.query(
      `
            SELECT 
                COUNT(u.id) ultimoregistro
            FROM
                usuario u
                , usuariocliente uc
            WHERE 
                uc.cliente_idCliente = '`+req.params.idcliente+`'
                AND uc.usuario_id = u.id
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/usuariosucursal/count/:idsucursal", function(req, res) {

    connection.query(
      `
            SELECT 
                COUNT(id) ultimoregistro
            FROM
                usuariosucursal
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

  router.get("/usuariocliente2/count/:idcliente", function(req, res) {

    connection.query(
      `
            SELECT 
                COUNT(id) ultimoregistro
            FROM
                
                usuariocliente
            WHERE 
                cliente_idCliente = '`+req.params.idcliente+`'
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/usuario/cliente/:idcliente", function(req, res) {

    connection.query(
      `
            SELECT 
                uc.id,
                u.id usuario_id,
                uc.cliente_idCliente,
                u.nombres,
                u.apellidoPaterno,
                u.apellidoMaterno,
                u.identificacionAcceso,
                u.claveAcceso,
                u.mail,
                u.genero,
                u.telefonos,
                u.estado,
                u.foto,
                CASE
                    WHEN (u.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion
            FROM 
                usuariocliente uc,
                usuario u
            WHERE
                uc.usuario_id = u.id
                AND uc.cliente_idCliente = '`+req.params.idcliente+`'
                OR ('-1' = '`+req.params.idcliente+`' AND u.id != '0')
            group by
                u.nombres,
                u.apellidoPaterno,
                u.apellidoMaterno
            order by
                u.nombres,
                u.apellidoPaterno,
                u.apellidoMaterno
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/usuario/cliente/sucursal/:idsucursal", function(req, res) {

    connection.query(
      `
            SELECT 
                us.id,
                us.sucursal_id,
                us.usuario_id,
                u.id,
                u.nombres,
                u.apellidoPaterno,
                u.apellidoMaterno,
                u.identificacionAcceso,
                u.claveAcceso,
                u.mail,
                u.genero,
                u.telefonos,
                u.estado,
                u.foto,
                CASE
                    WHEN (u.estado = 1)THEN 'Activo'
                    ELSE 'De baja'
                END estadodescripcion
            FROM 
                usuariosucursal us
                , usuario u
            WHERE
                us.usuario_id = u.id
                AND us.sucursal_id = '`+req.params.idsucursal+`'
            order by
                u.nombres,
                u.apellidoPaterno
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/usuario/:identificacionAcceso/:claveAcceso", function(req, res) {

    connection.query(
      `
            SELECT 
                u.id as idusuario
                , CONCAT(u.nombres, " ", u.apellidoPaterno) nombreusuario
                , r.id as rolid
                , r.codigo as rolcodigo
                , r.descripcion
                , rc.cliente_idCliente idCliente 
                , rc.id idrolcliente 
            FROM 
                usuario u
                , usuariorol ur
                , rol r 
                LEFT JOIN rolcliente rc ON rc.rol_id = r.id AND r.id != 0 /*corresponde a su*/
                WHERE 
                    u.id = ur.usuario_id 
                    AND ur.rol_id = r.id 
                    AND u.identificacionAcceso = '`+req.params.identificacionAcceso+`' 
                    AND u.claveAcceso = '`+req.params.claveAcceso+`'
                group by r.id
            `
      , function(err, rows) {
        if(err) {
          res.json([]);
        } else {
          res.json(rows);
        }
      }
    );
  });

  router.post("/usuario", function(req, res){
    var detalle = req.body.detalle;

    connection.query(
      `
            INSERT INTO usuario
            (id,
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            identificacionAcceso,
            claveAcceso,
            mail,
            genero,
            telefonos,
            estado,
            foto,
            flagSincronizado
            )
            VALUES
            ('`+detalle.id+`',
            '`+detalle.nombres+`',
            '`+detalle.apellidoPaterno+`',
            '`+detalle.apellidoMaterno+`',
            '`+detalle.identificacionAcceso+`',
            '`+detalle.claveAcceso+`',
            '`+detalle.mail+`',
            '`+detalle.genero+`',
            '`+detalle.telefonos+`',
            '`+detalle.estado+`',
            `+detalle.foto+`,
            '`+detalle.flagSincronizado+`')
            `
      , function(err, rows) {
        if(err){
          console.log("err: "+err)
          res.json({"estado": 0});
        }else{
          console.log("Usuario registrado")
          res.json({"estado": 1});
        }
      });
  });

  router.post("/usuariocliente", function(req, res){
    var detalle = req.body.detalle2;
    connection.query(
      `
            INSERT INTO usuariocliente
            (
                id,
                usuario_id,
                cliente_idCliente,
                flagSincronizado
            )
            VALUES
            (
                '`+detalle.id+`',
                '`+detalle.idusuario+`',
                '`+detalle.idcliente+`',
                '`+detalle.flagSincronizado+`'
            )
            `
      , function(err, rows) {
        if(err){
          res.json({"error": err});
        }else{
          res.json("Usuario registrado");
        }
      });

  });

  router.post("/usuariosucursal", function(req, res){
    var detalle = req.body.detalle3;
    connection.query(
      `
            INSERT INTO usuariosucursal
            (
                id,
                sucursal_id,
                usuario_id,
                flagSincronizado
            )
            VALUES
            (
                '`+detalle.id+`',
                '`+detalle.idsucursal+`',
                '`+detalle.idusuario+`',
                '`+detalle.flagSincronizado+`'
            )
            `
      , function(err, rows) {
        if(err){
          res.json({"error": err});
        }else{
          res.json("Usuario registrado");
        }
      });

  });

  router.put("/usuario/:id", function(req, res){

    connection.query(
      `
            UPDATE usuario 
            SET
                id = '`+req.params.id+`',
                nombres = '`+req.body.nombres+`',
                apellidoPaterno = '`+req.body.apellidoPaterno+`',
                apellidoMaterno = '`+req.body.apellidoMaterno+`',
                identificacionAcceso = '`+req.body.identificacionAcceso+`',
                claveAcceso = '`+req.body.claveAcceso+`',
                mail = '`+req.body.mail+`',
                genero = '`+req.body.genero+`',
                telefonos = '`+req.body.telefonos+`',
                estado = '`+req.body.estado+`',
                foto = `+req.body.foto+`,
                flagSincronizado = '`+req.body.flagSincronizado+`'
            WHERE  
                id = '`+req.params.id+`'
            `
      , function(err, rows) {
        if(err) {
          res.json({"estado": 0});
        } else {
          res.json({"estado": 1});
        }
      });
  });

  router.delete("/usuario/:id", function(req, res){
    connection.query("DELETE FROM usuario WHERE id = " + req.params.id, function(err, rows){
      if(err){
        res.json({"error": err});
      } else {
        res.json("Usuario eliminado");
      }
    });
  });

  router.get("/usuariosSeleccionadosCliente/:idCliente", function(req, res) {

    connection.query(
      `
                select
                    B.id,
                    A.id usuario_id,
                    B.cliente_idCliente,
                    A.nombres,
                    A.apellidoPaterno,
                    A.apellidoMaterno,
                    A.identificacionAcceso,
                    A.claveAcceso,
                    A.mail,
                    A.genero,
                    A.telefonos,
                    A.estado,
                    A.foto,
                    CASE
                        WHEN (A.estado = 1)THEN 'Activo'
                        ELSE 'De baja'
                    END estadodescripcion,
                    CASE
                        WHEN (B.id is null)THEN false
                        ELSE true
                    END seleccionado
                from
                    usuario A
                    left join usuariocliente B
                    on A.id = B.usuario_id and B.cliente_idCliente = '`+req.params.idCliente+`'
                where A.id != 0
                order by A.nombres, A.apellidoPaterno, A.apellidoMaterno
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/usuarioclientelimit/:idcliente", function(req, res) {

    connection.query(
      `
            SELECT id ultimoregistro
            FROM usuariocliente
            WHERE cliente_idCliente = '`+req.params.idcliente+`'
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

  router.delete("/usuariocliente/:idcliente/:idusuario", function(req, res){

    connection.query(
      `
            DELETE
            FROM usuariocliente
            WHERE cliente_idCliente = '`+req.params.idcliente+`'
            AND usuario_id = '`+req.params.idusuario+`'
        `
      , function(err, rows){
        if(err){
          res.json({"error": err});
        } else {
          res.json("Usuario eliminado");
        }
      });
  });

  router.get("/usuariosSeleccionadosSucursal/:idSucursal", function(req, res) {
    let query = `SELECT
      B.id,
      A.id usuario_id,
      B.sucursal_id,
      A.nombres,
      A.apellidoPaterno,
      A.apellidoMaterno,
      A.identificacionAcceso,
      A.claveAcceso,
      A.mail,
      A.genero,
      A.telefonos,
      A.estado,
      A.foto,
      CASE
        WHEN (A.estado = 1)THEN 'Activo'
        ELSE 'De baja'
      END estadodescripcion,
      CASE
        WHEN (B.id is null)THEN false
        ELSE true
      END seleccionado
      from
        usuario A
        left join usuariosucursal B
        on A.id = B.usuario_id and B.sucursal_id = '${req.params.idSucursal}'
      where A.id != 0
      order by A.nombres, A.apellidoPaterno, A.apellidoMaterno`;

    connection.query(query, function(err, rows) {
      if (err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/usuariosSucSeleccionadas/:idusuario/:idcliente", function(req, res) {
    let query = `select distinct
        A.sucursal_id
      from
        usuariosucursal A,
        sucursal B
      where 
        A.usuario_id = '${req.params.idusuario}'
        and A.sucursal_id = B.id
        and B.cliente_idCliente = '${req.params.idcliente}'
        or 0 = '${req.params.idusuario}'
      order by A.sucursal_id`;

    connection.query(query, function(err, rows) {
      if (err) {
        res.status(400).json({"error": err});
      } else {
        res.status(200).json(rows);
      }
    });
  });

  router.get("/usuariosucursallimit/:idsucursal", function(req, res) {
    let query = `SELECT id ultimoregistro
      FROM usuariosucursal
      WHERE sucursal_id = '${req.params.idsucursal}'
      ORDER BY id DESC
      LIMIT 1`;
    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });

  router.delete("/usuariosucursal/:idsucursal/:idusuario", function(req, res){

    connection.query(
      `
            DELETE
            FROM usuariosucursal
            WHERE sucursal_id = '`+req.params.idsucursal+`'
            AND usuario_id = '`+req.params.idusuario+`'
        `
      , function(err, rows){
        if(err){
          res.json({"error": err});
        } else {
          res.json("Usuario eliminado");
        }
      });
  });
};

module.exports = REST_ROUTER;
