var socketID = null;
var socket = io.connect('http://localhost:3001');

function identifica() {
	socketID = document.getElementById("txtNombre").value;
	h1.innerHTML = socketID;
	document.getElementById("txtNombre").value = "";
	document.getElementById("txtNombre").focus;
	socket.on(socketID, function(data) {
		document.getElementById("msg01").innerHTML = data;
	});
}

function listarUsuarios() {
	axios.get("http://localhost:3000/api/usuario").then(response => {
		var jsonData = response.data;
		for(x = 0; x < jsonData.length; x++) {
			document.getElementById("divUsuario").innerHTML = document.getElementById("divUsuario").innerHTML + "<br>" + jsonData[x].nombre;
		}
	});
}