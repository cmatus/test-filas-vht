mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    /**
     * @api {get} /componente
     * @apiVersion 1.0.0
     * @apiName Componente
     * @apiGroup Componente
     * @apiDescription Información de los componentes.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     [
              {
                  "id": 1,
                  "descripcion": "Publicidad",
                  "urlDisponibleRecurso": "publicidad",
                  "infoAdicional": ""
              },
              {
                  "id": 2,
                  "descripcion": "Banner",
                  "urlDisponibleRecurso": "visor/banner",
                  "infoAdicional": ""
              },
              {
                  "id": 3,
                  "descripcion": "Despliegue Llamados",
                  "urlDisponibleRecurso": "ticketActual",
                  "infoAdicional": ""
              },
              {
                  "id": 4,
                  "descripcion": "Ultimos llamados (4)",
                  "urlDisponibleRecurso": "historialtickets",
                  "infoAdicional": ""
              }
          ]
     */
    router.get("/componente", function(req, res) {
        console.log(`
        SELECT
            *
        FROM
            gestionfila.componente
        `)


        connection.query(`
        SELECT
            *
        FROM
            componente
        `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    /**
     * @api {get} /componente/:id
     * @apiVersion 1.0.0
     * @apiName Componente Individual
     * @apiGroup Componente
     * @apiDescription Información de un componente específico.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     [
              {
                  "id": 1,
                  "descripcion": "Publicidad",
                  "urlDisponibleRecurso": "publicidad",
                  "infoAdicional": ""
              }
          ]
     */
    router.get("/componente/:id", function(req, res) {
        console.log(
        `
            SELECT
                *
            FROM
                gestionfila.componente
            WHERE
                id = '`+req.params.id+`'
        `)

        connection.query(
        `
            SELECT
                *
            FROM
                componente
            WHERE
                id = '`+req.params.id+`'
        `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    /**
     * @api {get} /componentevisor/:idconfiguracionvisor
     * @apiVersion 1.0.0
     * @apiName Componentevisor
     * @apiGroup Componente
     * @apiDescription Información de un componente específico.
     *
     * @apiParam {Number} idconfiguracionvisor ID de la configuración del visor.
     *
     */
    router.get("/componentevisor/:idconfiguracionvisor", function(req, res) {
        console.log(
        `
            SELECT
                A.id idcomponentevisor
                , A.alto
                , A.ancho
                , A.configuracionVisor_id idconfiguracionvisor
                , A.posicionX
                , A.posicionY
                , B.id idcomponente
                , B.descripcion
                , B.urlDisponibleRecurso
                , B.infoAdicional
            FROM
                componentevisor A
                , componente B
            WHERE
                A.configuracionVisor_id = '`+req.params.idconfiguracionvisor+`'
                AND A.componente_id = B.id
            ORDER BY A.id
        `)

        connection.query(
        `
            SELECT
                A.id idcomponentevisor
                , A.alto
                , A.ancho
                , A.configuracionVisor_id idconfiguracionvisor
                , A.posicionX
                , A.posicionY
                , B.id idcomponente
                , B.descripcion
                , B.urlDisponibleRecurso
                , B.infoAdicional
            FROM
                componentevisor A
                , componente B
            WHERE
                A.configuracionVisor_id = '`+req.params.idconfiguracionvisor+`'
                AND A.componente_id = B.id
            ORDER BY A.id
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
