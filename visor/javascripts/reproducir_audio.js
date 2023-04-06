function playAudio(strTramaAudio){
	// solo de pruebas
	// strTramaAudio = 'alerta;ticket;A;257;modulo;99'
	var strTiempoPausa = '0;500;1000;1400;2000;2700'
	var arrTramaAudio = strTramaAudio.split(";");
	var arrTiempoPausa = strTiempoPausa.split(";");

	var numeroTicket = arrTramaAudio[3]
	var validanumero = arrTramaAudio[3].substring(1, 3);

	if(validanumero.trim() !== "00" && numeroTicket > 100){
		strTiempoPausa = '0;1000;1500;1900;2300;3000;3700'
		arrTiempoPausa = strTiempoPausa.split(";");
		//console.log("modulo: "+arrTramaAudio[5])
		strTramaAudio = 'alerta;ticket;'+arrTramaAudio[2]+';_'+arrTramaAudio[3].substring(0, 1)+'00'+'_;'+validanumero+';modulo;'+arrTramaAudio[5]
		arrTramaAudio = strTramaAudio.split(";");
	}

	for (var i in arrTramaAudio) {
		if(numeroTicket  < 101 || validanumero.trim() === "00")
    		reproducir(arrTramaAudio[i], i, parseInt(arrTiempoPausa[i]))
		else
			reproducir2(arrTramaAudio[i], i, parseInt(arrTiempoPausa[i]))
	}	
}

function reproducir(arrTramaAudio, i, tiempoTimeOut){
	setTimeout(function(){
		if(i == 3 || i == 5){
			//alert(arrTramaAudio)
			var strAudioTicket = ""
			if(arrTramaAudio.length == 1){
				strAudioTicket = "0"+arrTramaAudio.toString();
			}else{
				strAudioTicket = arrTramaAudio.toString();
			}
			arrTramaAudio = strAudioTicket;
			//alert(strAudioTicket)	
		}
		console.log("sonidoA: "+i+" "+arrTramaAudio)
		var audio = new Audio("audio/"+arrTramaAudio+'.mp3');
		audio.play();
	}
	, tiempoTimeOut);
}

function reproducir2(arrTramaAudio, i, tiempoTimeOut){
	setTimeout(function(){
		if(i == 6){
			//alert(arrTramaAudio)
			var strAudioTicket = ""
			if(arrTramaAudio.length == 1){
				strAudioTicket = "0"+arrTramaAudio.toString();
			}else{
				strAudioTicket = arrTramaAudio.toString();
			}
			arrTramaAudio = strAudioTicket;
		}

		console.log("sonidoB: "+i+" "+arrTramaAudio)
		
		var audio = new Audio("audio/"+arrTramaAudio+'.mp3');
		audio.play();
	}
	, tiempoTimeOut);
}