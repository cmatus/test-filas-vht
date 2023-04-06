var ip = location.hostname;
var socket = io.connect('http://'+ip+':3001',{'forceNew':true});
var idVisor = 0;
var llamados = 0;
var estado = "";
var ultimo_motivo = "A";
var ultimo_numero_ticket = 0;
var ticketDesplegado = "";
var segundos = 0;
var habilitacion_reloj = 1;
var socket_id = "";
var estado = "0";
var registroHistorialTickets = [];
var audio = new Audio('alarma.mp3');
var conexionServidor = 0;



//console.log(localStorage.getItem("tipoEquipo"));
if(localStorage.getItem("tipoEquipo")){
	console.log(localStorage.getItem("tipoEquipo"));
	socket.emit('idVisor', localStorage.getItem("idEquipo"));
	socket.emit('accion', {accion:"visorDisponible", id:idVisor});
}
  

socket.on('inicializarEquipo', function(data){
	conexionServidor = 1;
	console.log("inicializarEquipo");
	if(data.tipoEquipo == "visor"){
		idVisor = data.id;
		socket_id = data.socket_id;
		socket.emit('tipoEquipo', {tipoEquipo:"visor", id:idVisor});
		socket.emit('accion', {accion:"visorDisponible", id:idVisor});
	}
});


socket.on('configuracionVisor', function(configuracionVisor){
	conexionServidor = 1;
	console.log(JSON.stringify(configuracionVisor));
});

socket.on('socket_id', function(data){
  socket_id = data.id;
});

socket.on('confirmarAccion', function(data){
	console.log(data);
	if(estado == 0){

		socket.emit('accion', {accion:"visorDisponible", id:idVisor});
	}
});

socket.on('cambiarVisorTicketActual', function(data){
	console.log(data);
	audio.play();
	estado = 1;
	document.getElementById("labelTicketActual").innerHTML = data.numeroTicket;
 	document.getElementById("labelModuloActual").innerHTML = data.modulo;

 	document.getElementById('labelModuloActual').className ='animacion';
 	document.getElementById('labelTicketActual').className ='animacion';
 	setTimeout(function(){
 		document.getElementById('labelModuloActual').className ='';
 		document.getElementById('labelTicketActual').className ='';
 	}, 5000);
 	ticketDesplegado = data.numeroTicket;
	socket.emit('ticketDesplegado', ticketDesplegado);
	for(x in registroHistorialTickets){
		if(data.numeroTicket == registroHistorialTickets[x].numero){
			registroHistorialTickets.splice(x, 1);
		}
	}

	registroHistorialTickets.push({numero:data.numeroTicket, modulo:data.modulo});
	//esperar X segundos y enviar socket de disponible
	setTimeout(function(){
		estado = 0;
		listarHistorial();
		socket.emit('accion', {accion:"visorDisponible", id:idVisor});
	}, 5000);

});

socket.on('disconnect', function(data){
	console.log("Servidor desconectado");
	conexionServidor = 0;
	setTimeout(function(){
 		volverConectar();
 	}, 3000);
});

socket.on('procesoReiniciar', function(data){
	console.log("Servidor en proceso de reinicio");
	conexionServidor = 0;
	setTimeout(function(){
 		volverConectar();
 	}, 3000);
});

socket.on('limpiarVisor', function(data){
	var registroHistorialTickets = [];
	document.getElementById("labelTicketActual").innerHTML = "";
 	document.getElementById("labelModuloActual").innerHTML = "";
 	document.getElementById("tablaHistorialTickets").innerHTML = `<tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr>`;
});

function volverConectar(){
	console.log("volverConectar");
	socket.emit('idVisor', localStorage.getItem("idEquipo"));
	socket.emit('accion', {accion:"visorDisponible", id:idVisor});
	if(conexionServidor == 0){
		setTimeout(function(){
	 		volverConectar();
	 	}, 3000);
	}
}

function visorLogin(){
	console.log("Volver a conectar servidor");
  idVisor = document.getElementById("selectIdVisor").value;
  socket.emit('idVisor', idVisor);
  socket.emit('accion', {accion:"visorDisponible", id:idVisor});
}

function listarHistorial(){
	console.log(JSON.stringify(registroHistorialTickets));
	document.getElementById("tablaHistorialTickets").innerHTML = "";
	for (i = 0; i < 4; i++) {
		if(registroHistorialTickets[registroHistorialTickets.length-1-i]){
    		document.getElementById("tablaHistorialTickets").innerHTML = document.getElementById("tablaHistorialTickets").innerHTML + `<tr><td>${registroHistorialTickets[registroHistorialTickets.length-1-i].numero}</td><td>${registroHistorialTickets[registroHistorialTickets.length-1-i].modulo}</td></tr>`;
    	}else{
    		document.getElementById("tablaHistorialTickets").innerHTML = document.getElementById("tablaHistorialTickets").innerHTML + `<tr><td></td><td></td></tr>`;
    	}
	}
}




function construirVista(){

}