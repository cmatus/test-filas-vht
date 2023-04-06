mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

	// Listar todos los usuarios
	router.get("/pais", function(req, res) {
		connection.query("SELECT * FROM pais ORDER BY nombre", function(err, rows) {
			if(err) {
				//console.log({"error": err});
				res.json([]);// indicamos que la respuesta esta vacía
			} else {
				res.json(rows);
			}
		});
	});

	router.get("/pais/cliente/:idcliente", function(req, res) {
        connection.query("select p.id idpais from cliente c, pais p where c.idCliente = "+req.params.idcliente+" and c.pais_id = p.id", function(err, rows) {
            if(err) {
                res.json([]);
            } else {
                res.json(rows);
            }
        });
    });
    
}
module.exports = REST_ROUTER;

