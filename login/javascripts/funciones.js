var ip = location.hostname;
var socket = io.connect('http://'+ip+':3001',{'forceNew':true});

// Check browser support
if (typeof(Storage) !== "undefined") {
    // Store
    if(localStorage.getItem("$key")){
		console.log(localStorage.getItem("$key"));
		socket.emit('tipoEquipo', {tipoEquipo:"modulo", key:localStorage.getItem("$key")});
	}else{
		socket.emit('tipoEquipo', {tipoEquipo:"modulo", key:'0'});
	}
}else{
    alert("Your browser does not support Web Storage...");
}


socket.emit('login', "login");
socket.emit('tipoEquipo', "modulo");

socket.on('sesionIniciada', function(data){
	localStorage.setItem("$key", data);
	location.href ="http://"+ip+":80/ejecutivo";
});

socket.on('autenticacionFallida', function(data){
	if(data == '0'){
		alert("usuario o contraseña invalida");
	}else{
		alert("Este usuario tiene una sesión activa en algún modulo");
	}
});

socket.on('logo', function(data){
	document.getElementById("logo").innerHTML = `<img id="profile-img" style="height:96px;" class="" src="../ticketero/images/`+data+`" />`;
});

socket.on('modulos', function(data){
	console.log(JSON.stringify(data));
	document.getElementById("selectIdModulo").innerHTML = "<option value='0'></option>";
	for(var x in data){
		document.getElementById("selectIdModulo").innerHTML = document.getElementById("selectIdModulo").innerHTML + "<option value='"+data[x].modulo+"'>"+data[x].modulo+"</option>";
	}
});

function iniciarSesion(){
	idModulo = document.getElementById("selectIdModulo").value;
	if(idModulo == 0)
	{
		alert("Debe seleccionar el número de modulo de atención");
	}else{
		pass = $("#inputPassword").val();
		usuario = $("#inputEmail").val();
		if(usuario != "" && pass != ""){
			socket.emit('autenticacion', {user:usuario, pass:pass, idModulo:idModulo});
		}
	}
}




