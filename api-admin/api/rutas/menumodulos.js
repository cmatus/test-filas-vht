'use strict';

mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    router.get("/menu", function(req, res) {
        connection.query("SELECT * FROM menumodulo", function(err, rows) {
            if(err) {
                res.json([]);
            } else {
                //alert(rows)
                res.json(rows);
            }
        });
    });

    // Listar todos los usuarios
    router.get("/menumodulos", function(req, res) {
        connection.query("SELECT mm.id as idMenuModulo, mm.codigo as codigoMenuModulo, mm.descripcion as descMenuModulo, mm.nivel as nivelMenuModulo, mm.idPadre, mm.muestraOpcPermiso, mm.nombreIcono, false seleccionado FROM menumodulo mm", function(err, rows) {
            if(err) {
                res.json([]);
            } else {
                //alert(rows)
                res.json(rows);
            }
        });
    });


  router.get("/menumodulos/reportes", function(req, res) {
    connection.query("SELECT *, false seleccionado FROM menumodulo mm where sistemaExterno = 1", function(err, rows) {
            if(err) {
        res.json([]);
      } else {
                //alert(rows)
        res.json(rows);
      }
    });
  });


  // Listar todos los usuarios
  router.get("/menumodulospermiso", function(req, res) {
    connection.query(
      `
      select
        A.id idmenumodulo,
          A.descripcion,
          A.nivel,
          A.idPadre,
          A.muestraOpcPermiso,
          A.nombreIcono,
          B.id idpermiso,
          B.descripcion descripcionpermiso,
          false seleccionado,
          '[]' permisos,
          '[]' modulos
      from
        menumodulo A, permiso B
      order by A.id, B.id
      `
    , function(err, rows) {
      if(err) {
        res.json([]);
      } else {
                //alert(rows)
        res.json(rows);
      }
    });
  });

    router.get("/menumodulos/permisos", function(req, res) {
        console.log(
            `
            SELECT
                  p.id idpermiso
                  , p.codigo codigopermiso
                  , p.descripcion descpermiso
                  , mm.id idmenumodulo
                  , mm.codigo codigomenumodulo
                  , mm.descripcion descmenumodulo
                  , mm.muestraOpcPermiso
                  , mm.nivel
                  , mm.idPadre
                  , false seleccionado
                --  , rc.rol_id idrol
                --  , rc.id idrolcliente
            FROM
                gestionfila.menumodulo mm
                , gestionfila.permiso p
            --   , gestionfila.rolcliente rc
            -- WHERE rc.cliente_idCliente = '`+req.params.idcliente+`'
            -- AND rc.rol_id = '`+req.params.idrol+`'
            ORDER BY
                mm.id
                , p.id
            `
        )

        connection.query(
            `
             SELECT
                  p.id idpermiso
                  , p.codigo codigopermiso
                  , p.descripcion descpermiso
                  , mm.id idmenumodulo
                  , mm.codigo codigomenumodulo
                  , mm.descripcion descmenumodulo
                  , mm.muestraOpcPermiso
                  , mm.nivel
                  , mm.idPadre
                  , false seleccionado
                --  , rc.rol_id idrol
                --  , rc.id idrolcliente
            FROM
                menumodulo mm
                , permiso p
            --    , rolcliente rc
            -- WHERE rc.cliente_idCliente = '`+req.params.idcliente+`'
            -- AND rc.rol_id = '`+req.params.idrol+`'
            ORDER BY
                mm.id
                , p.id
            `

        , function(err, rows) {
        if(err) {
            res.json({"error": err});
        } else {
            res.json(rows);
        }
        });
  });

    router.get("/menumodulos/permisos/rolcliente/:idpermiso/:idmenumodulo/:idrolcliente", function(req, res) {
        console.log(
            `
            SELECT
                *
            FROM
                gestionfila.rolpermiso
            WHERE
                permiso_id = '`+req.params.idpermiso+`'
                AND menuModulo_id = '`+req.params.idmenumodulo+`'
                AND rolCliente_id = '`+req.params.idrolcliente+`'
            `
        )

        connection.query(
            `
             SELECT
                *
            FROM
                rolpermiso
            WHERE
                permiso_id = '`+req.params.idpermiso+`'
                AND menuModulo_id = '`+req.params.idmenumodulo+`'
                AND rolCliente_id = '`+req.params.idrolcliente+`'
            `

        , function(err, rows) {
        if(err) {
            res.json({"error": err});
        } else {
            res.json(rows);
        }
        });
    });


  router.get("/menumodulosasociados/:idusuario/:idrol", function(req, res) {
        console.log(
            `
            SELECT DISTINCT
              rp.menuModulo_id
              ,rc.id idrolcliente
            FROM
              gestionfila.usuario u
                , gestionfila.usuariorol ur
                , gestionfila.rolcliente rc
                , gestionfila.rolpermiso rp
            WHERE u.id = '`+req.params.idusuario+`'
            AND rc.rol_id = '`+req.params.idrol+`'
            AND u.id = ur.usuario_id
            AND rc.rol_id = ur.rol_id
            AND rp.rolCliente_id = rc.id
            `
        )

        connection.query(
            `
            SELECT DISTINCT
              rp.menuModulo_id
              ,rc.id idrolcliente
            FROM
              usuario u
                , usuariorol ur
                , rolcliente rc
                , rolpermiso rp
            WHERE u.id = '`+req.params.idusuario+`'
            AND rc.rol_id = '`+req.params.idrol+`'
            AND u.id = ur.usuario_id
            AND rc.rol_id = ur.rol_id
            AND rp.rolCliente_id = rc.id
            ORDER BY rp.id
            `

        , function(err, rows) {
        if(err) {
            res.json({"error": err});
        } else {
            res.json(rows);
        }
        });
    });
}




module.exports = REST_ROUTER;

