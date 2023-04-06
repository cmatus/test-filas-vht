var ip = location.hostname;
var socket = io.connect('http://'+ip+':3001',{'forceNew':true});
var idEjecutivo = 0;

var llamados = 0;
var estado = "";
var ultimo_motivo = "";
var ultimo_numero_ticket = 0;
var ultimoNumeroDespliegue = "";
var segundos = 0;
var habilitacion_reloj = 1;
var socket_id = "";
var idPausa = 0;
var categorias = [];
var motivosAtencion = [];

var volverLlamar = 0;
var tiempoPausaSgteLlamado = 0;

var horaInicioAtencion = new Date();
var flagCategorias = 0;
var ocultarReloj = 1;
var accionReloj = 0;

  if(localStorage.getItem("$key")){
    console.log(localStorage.getItem("$key"));
    socket.emit('moduloListo', localStorage.getItem("$key"));
  }else{
    location.href ="http://"+ip+":80/login";
  }

socket.on('socket_id', function(data){
  console.log(data);
  socket_id = data;
});


socket.on('sinLogear', function(data){
  console.log("sinLogear");
  location.href ="http://"+ip+":80/login";
});



socket.on('confirmacionFinalizacionSesion', function(data){
  console.log(data);
  location.href ="http://"+ip+":80/login";
});


socket.on('motivosPausa', function(data){
  document.getElementById("selectMotivosPausa").innerHTML = "<option value='0'>-</option>";
  console.log(JSON.stringify(data));
  for(var x in data){
    
    document.getElementById("selectMotivosPausa").innerHTML = document.getElementById("selectMotivosPausa").innerHTML + `<option value="${data[x].id}">${data[x].descripcion}</option>`;
    //document.getElementById("selectMotivosPausa").innerHTML = document.getElementById("selectMotivosPausa").innerHTML + `<div class="radio"><label><input type="radio" value="${data[x].id}" name="motivosPausa">${data[x].descripcion}</label></div>`;
  }
});



socket.on('motivosAtencion', function(data){
  motivosAtencion = data;
  //document.getElementById("selectMotivosAtencion").innerHTML = "";
  console.log(JSON.stringify(data));
  /*
  for(var x in data){
    document.getElementById("selectMotivosAtencion").innerHTML = document.getElementById("selectMotivosAtencion").innerHTML + `<div class="radio"><label><input type="radio" value="${data[x].id}" name="motivosAtencion">${data[x].nombre}</label></div>`;
  }*/
});

socket.on('motivosAtencionEjecutivo', function(data){
  document.getElementById("labelMotivosAtencion").innerHTML = "";
  //console.log(JSON.stringify(data));
  var contTemp = 0;
  for(var x in data){
    for(var y in motivosAtencion){
      if(motivosAtencion[y].codigo == data[x].codigo){
        if(contTemp == 0){
          document.getElementById("labelMotivosAtencion").innerHTML = motivosAtencion[y].nombre;
          contTemp = 1;
        }else{
          document.getElementById("labelMotivosAtencion").innerHTML = " "+document.getElementById("labelMotivosAtencion").innerHTML+", "+motivosAtencion[y].nombre;
        }
        
      }
    }
  }
});


socket.on('configuracionEjecutivo', function(data){
  console.log(data);
  volverLlamar = data.volverLlamar;
  tiempoPausaSgteLlamado = data.tiempoPausaSgteLlamado;
});

/*{"volverLlamar":volverLlamar, "tiempoPausaSgteLlamado":tiempoPausaSgteLlamado}*/

socket.on('categorias', function(data){
  categorias = data;
  console.log(JSON.stringify(categorias));
});

socket.on('numeroModulo', function(numeroModulo){
  document.getElementById("labelNumeroModulo").innerHTML = numeroModulo;
});

socket.on('nombreEjecutivo', function(nombreEjecutivo){
  //document.getElementById("labelNombreEjecutivo").innerHTML = nombreEjecutivo;
});

function moduloLogin(){
  var idModulo = document.getElementById("selectIdModulo").value;
  socket.emit('idModulo', idModulo);
}

function ejecutivoLogin(){
  idEjecutivo = document.getElementById("selectIdEjecutivo").value;
  socket.emit('idEjecutivo', idEjecutivo);
}


socket.on('ticketAsignado', function(data){
  console.log("numero:"+data.numeroTicket);
  ultimoNumeroDespliegue = data.numeroTicket;
  document.getElementById("label_numero_ticket").innerHTML = ultimoNumeroDespliegue;
  mostrarCodigoMotivo(data.codigo);
  if(data.codigoDerivado.length >= 1){
    MostrarCategorias(data.codigoDerivado);
  }else{
    MostrarCategorias(data.codigo);
  }
  $('#boton_pausa').attr("disabled", true);
  ticketAsignado();
});



socket.on('ticketDesplegado', function(data){
  console.log("numero:"+data.numeroTicket+"código: "+data.codigo);
  ultimoNumeroDespliegue = data.numeroTicket;
  document.getElementById("label_numero_ticket").innerHTML = ultimoNumeroDespliegue;
  mostrarCodigoMotivo(data.codigo);
  $('#boton_descartar').attr("disabled", false);
  if(volverLlamar == 0){
    $('#boton_volver_llamar').attr("disabled", false);
  }
  if(data.comentario.length > 1){
    $("#p_estado").html("Comentario: "+data.comentario);
  }else{
    $("#p_estado").html("");
  }
  if(data.codigoDerivado.length >= 1){
    MostrarCategorias(data.codigoDerivado);
  }else{
    MostrarCategorias(data.codigo);
  }
  ticketDesplegado();
});


socket.on('restablecerTicket', function(data){
  console.log(data);
  switch(data.estado) {
    case 3:
      ultimoNumeroDespliegue = data.numeroTicket;
      document.getElementById("label_numero_ticket").innerHTML = ultimoNumeroDespliegue;
      mostrarCodigoMotivo(data.codigo);
      if(data.codigoDerivado.length >= 1){
        MostrarCategorias(data.codigoDerivado);
      }else{
        MostrarCategorias(data.codigo);
      }
      $('#texto_boton_empezar_atencion').html("Finalizar atención");
      $('#boton_empezar_atencion').css("background-color", "#ed4c48");
      $('#boton_empezar_atencion').attr("disabled", false);
      $('#boton_volver_llamar').attr("disabled", true);
      $('#boton_descartar').attr("disabled", true);
      $('#boton_iniciar').attr("disabled", true);
      //$('#boton_no_atendidos').attr("disabled", true);
      $('#boton_pausa').attr("disabled", true);
      if(data.comentario.length > 1){
        $("#p_estado").html("Comentario: "+data.comentario);
      }else{
        $("#p_estado").html("");
      }
      estado = "en atencion";
      break;
    case 4:
      ultimoNumeroDespliegue = data.numeroTicket;
      document.getElementById("label_numero_ticket").innerHTML = ultimoNumeroDespliegue;
      mostrarCodigoMotivo(data.codigo);
      if(data.codigoDerivado.length >= 1){
        MostrarCategorias(data.codigoDerivado);
      }else{
        MostrarCategorias(data.codigo);
      }
      $('#boton_empezar_atencion').attr("disabled", true);
      $('#boton_volver_llamar').attr("disabled", true);
      $('#boton_descartar').attr("disabled", true);
      $('#boton_iniciar').attr("disabled", true);
      $('#boton_no_atendidos').attr("disabled", false);
      $('#boton_pausa').attr("disabled", true);
      ticketAsignado();
      break;
    case 5:
      $('#boton_iniciar').attr("disabled", true);
      $('#boton_pausa').attr("disabled", true);
      ultimoNumeroDespliegue = data.numeroTicket;
      document.getElementById("label_numero_ticket").innerHTML = ultimoNumeroDespliegue;
      mostrarCodigoMotivo(data.codigo);
      if(data.codigoDerivado.length >= 1){
        MostrarCategorias(data.codigoDerivado);
      }else{
        MostrarCategorias(data.codigo);
      }
      ticketDesplegado();
      $("#p_estado").html("");
      break;
  }
  ocultarReloj = 0;
  accionReloj = 2;
  incrementarSegundo(0);
});

socket.on('confirmacionFinalizacionAtencion', function(data){
  console.log("finaliza ticket:"+data);
  console.log("------- "+estado);
  document.getElementById("labelTiempoAtencion").innerHTML = "";
  ocultarReloj = 1;
  incrementarSegundo(0);
  document.getElementById("comentarioTicket").value = "";
  $("#p_estado").html("");
  idPausa = $('input[name="motivosPausa"]:checked').val();
  if(estado == "en pausa"){
    socket.emit('solicitarPausa', idPausa);
  }else{
    if(estado == "cerrando sesion"){
      finalizarSesion();
    }else{
      estado = "";
      solicitar_ticket();
    }
  }
});

socket.on('pausaConfirmada', function(data){
  ocultar_modal_motivos_pausa();
  $('#myModal').modal('hide');
  mostar_modal_pausa();
  $("#p_estado").html("");
  $('#texto_boton_empezar_atencion').html("Empezar atención");
  $('#boton_empezar_atencion').css("background-color", "#27b875");
  $('#boton_volver_llamar').attr("disabled", true);
  $('#boton_descartar').attr("disabled", true);
  $('#boton_iniciar').attr("disabled", false);
  $('#boton_empezar_atencion').attr("disabled", true);
  document.getElementById("label_numero_ticket").innerHTML = "-";
  mostrarCodigoMotivo("");
});

//AL INICIAR SESIÓN DESDE UN ESTADO DE PAUSA ANTERIOR
socket.on('restablecerPausa', function(data){
  ocultar_modal_motivos_pausa();
  $('#myModal').modal('hide');
  mostar_modal_pausa();
  $("#p_estado").html("");
  $('#texto_boton_empezar_atencion').html("Empezar atención");
  $('#boton_empezar_atencion').css("background-color", "#27b875");
  $('#boton_volver_llamar').attr("disabled", true);
  $('#boton_descartar').attr("disabled", true);
  $('#boton_iniciar').attr("disabled", false);
  $('#boton_empezar_atencion').attr("disabled", true);
  document.getElementById("label_numero_ticket").innerHTML = "-";
  mostrarCodigoMotivo("");
  $('#boton_pausa').attr("disabled", true);
});

socket.on('ticketDistraido', function(data){

  $("#myModal").modal({backdrop: 'static', keyboard: false});
  if(data == "0"){
    segundos = 0;
  }else{
    segundos = tiempoPausaSgteLlamado;
  }
  habilitacion_reloj = 1;
  //segundos = tiempoPausaSgteLlamado;
  reloj();
  $('#botonDerivar').attr("disabled", true);
  $('#botonRetomar').attr("disabled", true);
  estado = "en distraido";
  /*
  console.log("Ticket distraido:"+data);
  $("#p_estado").html("El ticket: "+data+" ha cambiado su estado a distraido");
  ocultarReloj = 1;
  incrementarSegundo(0);
  solicitar_ticket();*/
});

socket.on('confirmacionVolverLlamar', function(llamados){
  console.log(llamados);
  $('#texto_boton_volver_llamar').html(llamados);
});

socket.on('confirmarListarDistraidos', function(ticketsDistraidos){
  console.log(JSON.stringify(ticketsDistraidos));
  var codigosDistraidos = [];
  $('#panelTicketsDistraidos').html("");
  for(var x in ticketsDistraidos){
    var enCodigos = 0;
    for(var y in codigosDistraidos)
    {
      if(codigosDistraidos[y].codigo == ticketsDistraidos[x].codigo){
        enCodigos = 1;
      }
    }
    if(enCodigos == 0){
      for(var v in motivosAtencion){
        if(motivosAtencion[v].codigo == ticketsDistraidos[x].codigo){
          codigosDistraidos.push({codigo: ticketsDistraidos[x].codigo, nombre:motivosAtencion[v].nombre});
        }
      }
    }
  }
  var htmlDistraidos = "";
  for(x in codigosDistraidos)
  {
    var htmlCodigos = "";
    for(var y in ticketsDistraidos){
      if(ticketsDistraidos[y].codigo == codigosDistraidos[x].codigo){
        htmlCodigos = htmlCodigos + `<div class="radio"><label><input type="radio" name="radioTicketsDistraidos" value="${ticketsDistraidos[y].id}">${ticketsDistraidos[y].numeroMostrar}</label></div>`;
      }
    }
    htmlDistraidos = htmlDistraidos + `<div class="col-md-2" align="center"><label>${codigosDistraidos[x].nombre}</label><br><label>${codigosDistraidos[x].codigo}</label><br>${htmlCodigos}</div>`;
  }
  $('#panelTicketsDistraidos').html(htmlDistraidos);
  mostar_modal_distraidos()
});




socket.on('confirmarlistarTicketsFila', function(ticketsDistraidos){
  console.log(JSON.stringify(ticketsDistraidos));
  var codigosDistraidos = [];
  $('#panelTicketsCola').html("");
  for(var x in ticketsDistraidos){
    var enCodigos = 0;
    for(var y in codigosDistraidos)
    {
      if(codigosDistraidos[y].codigo == ticketsDistraidos[x].codigo){
        enCodigos = 1;
      }
    }
    if(enCodigos == 0){
      for(var v in motivosAtencion){
        if(motivosAtencion[v].codigo == ticketsDistraidos[x].codigo){
          codigosDistraidos.push({codigo: ticketsDistraidos[x].codigo, nombre:motivosAtencion[v].nombre, largoCola:ticketsDistraidos[x].largoCola});
        }
      }
    }
  }
  var htmlDistraidos = "";
  for(x in codigosDistraidos)
  {
    /*
    var htmlCodigos = "";
    for(var y in ticketsDistraidos){
      if(ticketsDistraidos[y].codigo == codigosDistraidos[x].codigo){
        htmlCodigos = htmlCodigos + `<div class="radio"><label><input type="radio" name="radioTicketsDistraidos" value="${ticketsDistraidos[y].id}">${ticketsDistraidos[y].numeroMostrar}</label></div>`;
      }
    }*/
    htmlDistraidos = htmlDistraidos + `<div class="col-md-2" align="center"><label>${codigosDistraidos[x].nombre}</label><br><label>${codigosDistraidos[x].codigo}</label><br><label>${codigosDistraidos[x].largoCola}</label></div>`;
  }
  $('#panelTicketsCola').html(htmlDistraidos);
  mostar_modal_tickets_fila();
});

function accion(){
  //var idEjecutivo = document.getElementById("selectIdEjecutivo").value;
  //socket.emit('accion', {accion:"ejecutivoDisponible", id:idEjecutivo});
  socket.emit('actualizarHorarios', "");
}


function boton_iniciar(){
  $('#texto_boton_empezar_atencion').html("Empezar atención");
  $('#boton_empezar_atencion').css("background-color", "#27b875");
  solicitar_ticket();
}



function iniciar_atencion(){
  

}

function siguiente_atencion(){
  document.getElementById("labelTiempoAtencion").innerHTML = "";
  ocultarReloj = 1;
  incrementarSegundo(0);
  if(estado == 'en distraido'){
    solicitar_ticket();
  }else{
    if(estado == 'en atencion'){
      finalizacionAtencion();
    }
  }
  llamados=0;
  segundos =0;
  habilitacion_reloj = 0;
  $('#myModal').modal('hide');
  $('#texto_boton_empezar_atencion').html("Empezar atención");
  $('#boton_empezar_atencion').css("background-color", "#27b875");
  $('#boton_volver_llamar').attr("disabled", true);
  $('#boton_descartar').attr("disabled", true);
  $('#boton_iniciar').attr("disabled", true);
  //$('#boton_no_atendidos').attr("disabled", true);
  $('#boton_pausa').attr("disabled", false);
  //solicitar_ticket();
  //aqui ajusta los botones según la pantalla
  //aqui solicita el siguiente ticket

}



function finalizacionAtencion(){
  var categoriaTemp = 0;
  var comentarioTemp = "";
  if(document.getElementById("comentarioTicket").value.length >= 1000){
    alert("El comentario es demadiado largo");
  }else{
    if( $('input[name="radioCategorias"]:checked').val()){
      categoriaTemp = $('input[name="radioCategorias"]:checked').val();
    }
    comentarioTemp = document.getElementById("comentarioTicket").value;
    socket.emit('finalizacionAtencion', {numeroMostrar: ultimoNumeroDespliegue, categoria: categoriaTemp, comentario:comentarioTemp});
  }
}

function solicitar_ticket(){
  //aqui solicita ticket al servidor central
  $('#texto_boton_volver_llamar').html("0");
  socket.emit('accion', {accion:"ejecutivoDisponible", id:idEjecutivo});
  $("#label_numero_ticket").html("-");
  mostrarCodigoMotivo("");
  $('#boton_empezar_atencion').attr("disabled", true);
  $('#boton_volver_llamar').attr("disabled", true);
  $('#boton_descartar').attr("disabled", true);
  $('#boton_iniciar').attr("disabled", true);
  $('#boton_no_atendidos').attr("disabled", false);
  $('#boton_pausa').attr("disabled", false);

}

function ticketAsignado(){
  $("#p_estado").html("Desplegando ticket de atención en el visor");

}

function ticketDesplegado(){
  $('#boton_empezar_atencion').attr("disabled", false);
  $('#boton_descartar').attr("disabled", false);
  if(volverLlamar == 0){
    $('#boton_volver_llamar').attr("disabled", false);
  }
  if(document.getElementById("labelTiempoAtencion").innerHTML == ""){
    horaInicioAtencion = new Date();
    ocultarReloj = 0;
    accionReloj = 1;
    incrementarSegundo(1);
  }

}

function empezar_atencion(){
  if(estado=="en atencion"){
    if(flagCategorias == 1 && false){
      alert("Debe seleccionar una categoria de atención");
    }else{
      $('#botonDerivar').attr("disabled", false);
      $('#botonRetomar').attr("disabled", false);
      $("#myModal").modal({backdrop: 'static', keyboard: false});
      habilitacion_reloj = 1;
      segundos = tiempoPausaSgteLlamado;
      reloj();
    }
  }else{
    horaInicioAtencion = new Date();
    socket.emit('empezarAtencion', ultimoNumeroDespliegue);
    $('#boton_empezar_atencion').attr("disabled", true);
    setTimeout(function(){
      $('#boton_empezar_atencion').attr("disabled", false);
    }, 3000);
    $('#texto_boton_empezar_atencion').html("Finalizar atención");
    $('#boton_empezar_atencion').css("background-color", "#ed4c48");
    $('#boton_volver_llamar').attr("disabled", true);
    $('#boton_descartar').attr("disabled", true);
    $('#boton_iniciar').attr("disabled", true);
   //$('#boton_no_atendidos').attr("disabled", true);
    $('#boton_pausa').attr("disabled", true);
    estado = "en atencion";
    ocultarReloj = 0;
    accionReloj = 2;
    incrementarSegundo(0);
  }
}

function pausar(){
  var idPausaTemp = document.getElementById("selectMotivosPausa").value;
  if(idPausaTemp == 0)
  {
    alert("Debe seleccionar una opción");
  }else{
    $('#boton_pausa').attr("disabled", true);
    if(estado == "en atencion"){
      estado = "en pausa";
      habilitacion_reloj = 0;
      finalizacionAtencion();
    }else{

      estado = "en pausa";
      socket.emit('solicitarPausa', idPausaTemp);
    }
  }
}

function derivar(){
  var idMotivoAtencionTemp = 0;
  var comentarioTemp = "";
  var categoriaTemp = 0;
  habilitacion_reloj = 0;
  if(document.getElementById("comentarioDerivado").value.length >= 1000){
    alert("El comentario es demasiado largo");
  }else{
    if( $('input[name="radioCategorias"]:checked').val()){
      categoriaTemp = $('input[name="radioCategorias"]:checked').val();
    }
    if(true)
    {
      idMotivoAtencionTemp = $('input[name="motivosAtencion"]:checked').val();
      comentarioTemp = document.getElementById("comentarioDerivado").value;
       document.getElementById("comentarioDerivado").value = "";
      estado = "";
      socket.emit('derivar', {numeroMostrar: ultimoNumeroDespliegue, idMotivoDestino: idMotivoAtencionTemp, comentario: comentarioTemp, categoria:categoriaTemp});
      ocultar_modal_derivar();
      $('#myModal').modal('hide');
      $('#texto_boton_empezar_atencion').html("Empezar atención");
      $('#boton_empezar_atencion').css("background-color", "#27b875");
      $('#boton_volver_llamar').attr("disabled", true);
      $('#boton_descartar').attr("disabled", true);
      $('#boton_iniciar').attr("disabled", true);
      //$('#boton_no_atendidos').attr("disabled", true);
      $('#boton_pausa').attr("disabled", true);
      solicitar_ticket();
      //finalizacionAtencion();
    }else{
      alert("Debe seleccionar una opción");
    }
  }
}




function volver_llamar(){
  //llamados++;
  //
  //socket.emit('accion', "mensaje");
  socket.emit('volverLlamar', ultimoNumeroDespliegue);
  $('#boton_volver_llamar').attr("disabled", true);
  $('#boton_descartar').attr("disabled", true);
}

function descartarTicket(){
  socket.emit('descartarTicket', {numeroMostrar: ultimoNumeroDespliegue});
  ocultarReloj = 1;
  incrementarSegundo(0);
}

function listarDistraidos(){
  socket.emit('listarDistraidos', "listarDistraidos");
}

function listarTicketsFila(){
  socket.emit('listarTicketsFila', "listarTicketsFila");
}

function retomarDistraido(){
  if( $('input[name="radioTicketsDistraidos"]:checked').val())
  {
    idTicketDistraido = $('input[name="radioTicketsDistraidos"]:checked').val();
    socket.emit('retomarDistraido', idTicketDistraido);
    $('#modal_distraidos').modal('hide');
  }else{
    alert("Debe seleccionar una opción");
  }
}


function limpiarCategorias(){
  $('#selectCategorias').html("<option value='0'></option>");
}

function MostrarCategorias(numeroMostrar){
  console.log("MostrarCategorias - codigo"+numeroMostrar);
  $('#selectCategorias').html("<option value='0'></option>");
  var htmlCategorias = "";
  flagCategorias = 0;
  for(x in categorias)
  {
    if(numeroMostrar.indexOf(categorias[x].codigo) >= 0){
      flagCategorias = 1;
      htmlCategorias = htmlCategorias + `<option value='${categorias[x].idCategoria}'>${categorias[x].descripcion}</option>`;
      //htmlCategorias = htmlCategorias + `<div class="radio"><label><input type="radio" value="${categorias[x].idCategoria}" name="radioCategorias">${categorias[x].descripcion}</label></div><br>`;
    }
  }
  $('#selectCategorias').html(htmlCategorias);
}

function incrementarSegundo(accionTemp){
  if(accionReloj == 1){
      var estadoTiempo = "Tiempo de llamado: ";
    }else{
      var estadoTiempo = "Tiempo de atención: ";
    }
  if(ocultarReloj == 0){
    var tiempoAtencion = new Date();
    var tiempoActual = new Date();
    tiempoAtencion.setHours(tiempoActual.getHours() - horaInicioAtencion.getHours(), tiempoActual.getMinutes() - horaInicioAtencion.getMinutes(), tiempoActual.getSeconds() - horaInicioAtencion.getSeconds());
    document.getElementById("labelTiempoAtencion").innerHTML = estadoTiempo + tiempoAtencion.getHours() + ":" + ((tiempoAtencion.getMinutes()<=9)?"0"+tiempoAtencion.getMinutes():tiempoAtencion.getMinutes()) + ":" + ((tiempoAtencion.getSeconds()<=9)?"0"+tiempoAtencion.getSeconds():tiempoAtencion.getSeconds());
    //console.log(tiempoAtencion);
    setTimeout(function(){
      incrementarSegundo(1);
    }, 1000);
  }else{
    document.getElementById("labelTiempoAtencion").innerHTML = "";
  }
}

function mostrarCodigoMotivo(codigo){
  document.getElementById("labelCodigoAtencion").innerHTML = "-";
  document.getElementById("selectMotivosAtencion").innerHTML = "";
  for(var x in motivosAtencion){
    if(motivosAtencion[x].codigo == codigo){
      document.getElementById("labelCodigoAtencion").innerHTML = motivosAtencion[x].nombre;
      for(var y in motivosAtencion[x].derivaciones){
        document.getElementById("selectMotivosAtencion").innerHTML = document.getElementById("selectMotivosAtencion").innerHTML + `<option value="${motivosAtencion[x].derivaciones[y].id}">${motivosAtencion[x].derivaciones[y].nombre}</option>`;
        //document.getElementById("selectMotivosAtencion").innerHTML = document.getElementById("selectMotivosAtencion").innerHTML + `<div class="radio"><label><input type="radio" value="${motivosAtencion[x].derivaciones[y].id}" name="motivosAtencion">${motivosAtencion[x].derivaciones[y].nombre}</label></div>`;
      }
    }
  }
}


function mostar_modal_motivos_pausa(){
  habilitacion_reloj = 1;
  $('#modal_motivos_pausa').modal({backdrop: 'static', keyboard: false});
}
function ocultar_modal_motivos_pausa(){
  //segundos =tiempoPausaSgteLlamado;
  habilitacion_reloj = 1;
  $('#modal_motivos_pausa').modal('hide');
}

function mostar_modal_distraidos(){
  habilitacion_reloj = 1;
  $("#modal_distraidos").modal({backdrop: 'static', keyboard: false});
}
function ocultar_modal_distraidos(){
  //segundos =tiempoPausaSgteLlamado;
  habilitacion_reloj = 1;
  $('#modal_distraidos').modal('hide');
}
function mostar_modal_derivar(){
  habilitacion_reloj = 1;
  $("#modal_derivar").modal({backdrop: 'static', keyboard: false});
}
function ocultar_modal_derivar(){
  //segundos =tiempoPausaSgteLlamado;
  habilitacion_reloj = 1;
  $('#modal_derivar').modal('hide');
}
function mostar_modal_tickets_fila(){
  $("#modal_tickets_fila").modal({backdrop: 'static', keyboard: false});
}
function ocultar_modal_tickets_fila(){
  $('#modal_tickets_fila').modal('hide');
}
function mostar_modal_pausa(){
  $("#modal_pausa").modal({backdrop: 'static', keyboard: false});
}
function ocultar_modal_pausa(){
  boton_iniciar();
  $('#modal_pausa').modal('hide');
}
function mostrar_comentario(){
  //segundos =tiempoPausaSgteLlamado;
  document.getElementById("contenedorComentario").style.display = "block";
}
function ocultar_comentario(){
  //segundos =tiempoPausaSgteLlamado;
  document.getElementById("contenedorComentario").style.display = "none";
}

function retomar(){
  $('#myModal').modal('hide');
  estado = "en atencion";
  habilitacion_reloj = 0;
  segundos =100;
}
      
function cerrarSesion(){
  var r = confirm("¿Está seguro que desea cerrar la sesión actual?");
  if (r == true) {
    if(estado == "en atencion"){
      estado = "cerrando sesion";
      finalizacionAtencion();
    }else {
      finalizarSesion();
    }
  } 
}

function reloj(){
  $("#label_tiempo_accion").html(segundos);
    setTimeout(function(){
      if(segundos <= 0){
        if(habilitacion_reloj == 1){
          siguiente_atencion();
        }
      }else{
          if(habilitacion_reloj == 1){
          segundos--;
          $("#label_tiempo_accion").html(segundos);
          reloj();
        }
      }
    }, 1000);
}

function finalizarSesion(){
  console.log("finalizarSesion");
  localStorage.setItem("$key", '0');
  socket.emit('finalizarSesion', "finalizarSesion");
}