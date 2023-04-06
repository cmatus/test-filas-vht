mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

	// Listar las zonas del pais seleccionado
	router.get("/zona/:id", function(req, res) {
		connection.query("SELECT * FROM zona WHERE pais_id = "+req.params.id+" ORDER BY id", function(err, rows) {
			if(err) {
				//console.log({"error": err});
				res.json([]);// indicamos que la respuesta esta vacía
			} else {
				res.json(rows);
			}
		});
	});
}
module.exports = REST_ROUTER;

