function getInfoConfigSistema() {
	axios.get("http://localhost:3000/api/configsistema").then(response => {
		var jsonData = response.data;
		for(x = 0; x < jsonData.length; x++) {
			document.getElementById("divUsuario").innerHTML = document.getElementById("divUsuario").innerHTML + "<br>" + jsonData[x].nombre;
		}
	});
}