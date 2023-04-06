var ip = location.hostname;
var socket = io.connect('http://'+ip+':3001',{'forceNew':true});
var equipos = [];
socket.emit('listarEquipos', "listarEquipos");


$(document).ready(function(){
		$("#selectTipoEquipo").change(function(){
			refrescarEquipos();
        });
});

socket.on('equipos', function(data){
	console.log(JSON.stringify(data));
	equipos = data;
	refrescarEquipos();
});


function refrescarEquipos(){
	document.getElementById("selectIdEquipo").innerHTML = "";
	for(var x in equipos){
		if(equipos[x].tipoEquipo == document.getElementById("selectTipoEquipo").value){
			document.getElementById("selectIdEquipo").innerHTML = document.getElementById("selectIdEquipo").innerHTML + `<option value=${equipos[x].id}>${equipos[x].descripcion}</option>`;
		}
	}
}


function seleccionarEquipo(){
	tipoEquipo = document.getElementById("selectTipoEquipo").value;
	idEquipo = document.getElementById("selectIdEquipo").value;


	// Check browser support
	if (typeof(Storage) !== "undefined") {
	    // Store
	    localStorage.setItem("tipoEquipo", tipoEquipo);
	    localStorage.setItem("idEquipo", idEquipo);

	}else{
	    alert("Your browser does not support Web Storage...");
	}
}




