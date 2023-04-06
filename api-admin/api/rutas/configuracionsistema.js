const mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
  let self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

  router.get("/configuracionsistema", function(req, res) {
    connection.query("SELECT * FROM configuracionsistema LIMIT 1", function(err, rows) {
      if (err) {
        throw res.json([]);
      } else {
        res.json(rows);
      }
    });
  });

  router.put("/configuracionsistema/:id/:idconfiguracion", function(req, res){
    let query = `UPDATE configuracionsistema SET
			id = '${req.params.id}',
			ultimoGeneraTicketAtencionSuc = '0',
			ultimoIdAsociaTicketAtencionSuc = '0',
			ultimoIdHistorialAtencionEjecutivoSuc = '0',
			ultimoGeneraTicketDerivadoSuc = '0',
			flagSincronizado = '0',
			ultimoIdComentarioDerivado = '0',
			ultimoIdComentario = '0',
			idTipoSistema = '${req.params.idconfiguracion}'`;

    connection.query(query, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json("Datos del cliente modificado");
      }
    });
  });
};

module.exports = REST_ROUTER;
