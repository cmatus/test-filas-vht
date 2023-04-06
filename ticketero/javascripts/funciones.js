var ip = location.hostname;
var socket = io.connect('http://'+ip+':3001',{'forceNew':true});
var menu = [];
var socket_id = "";
var mensajeImpresionTicket = "";
var idEquipo = "";
var ticketActual = "";
var conexionServidor = 0;
var solicitarRut = false;
var columnsNumber = 0;
var styleColumnsNumber = 0;

var iconWidth = ""; 
var iconHeight = "";
var companyLogo = false;
var backgroundColor = "white"

$.getJSON("./configuracion.json", function(datos) {
  iconWidth = datos["layout"]["iconWidth"];
  iconHeight = datos["layout"]["iconHeight"];
  companyLogo = datos["layout"]["companyLogo"];
  solicitarRut = datos["userData"]["status"];
  backgroundColor = datos["layout"]["backgroundColor"];

  $(".panel-extra").css("background-color",backgroundColor);
  $(".panel-extra-services").css("background-color",backgroundColor);

  $("body").css("background-color",backgroundColor);
  $(".panel-extra-services-sub").css("border-color",backgroundColor);
  $(".panel-extra-services").css("border-color",backgroundColor);

  if(datos["layout"]["backgroundImage"]) $("body").css('background-image', 'url("images/fondo.jpg")');
  if(JSON.stringify(datos["layout"]["columnsNumber"]) != 0){
    styleColumnsNumber = 12/JSON.stringify(datos["layout"]["columnsNumber"]);
  }
});

if(localStorage.getItem("tipoEquipo")){
  console.log(localStorage.getItem("tipoEquipo"));
  console.log(localStorage.getItem("idEquipo"));
  socket.emit('idTicketero', localStorage.getItem("idEquipo"));
  socket.emit('tipoEquipo', {tipoEquipo:"ticketero", id:localStorage.getItem("idEquipo")});
  $("#contenedorImpresion").css("display", "none");
}

socket.on('inicializarEquipo', function(data){
  idEquipo = data.id;
  socket_id = data.socket_id;
  socket.emit('tipoEquipo', {tipoEquipo:"ticketero", id:idEquipo});
  $("#contenedorImpresion").css("display", "none");
});


socket.on('socket_id', function(data){
  socket_id = data;
  socket.emit('tipoEquipo', "visor");
  $("#contenedorImpresion").css("display", "none");
});


var mensaje = "nuevoTicket";
socket.emit('nuevoTicket', mensaje);

socket.on('confirmacionNuevoTicket', function(data){
socket.emit('accion', mensaje);
});

socket.on('configuracionTicketero', function(configuracionTicketero){
  mensajeImpresionTicket = configuracionTicketero.mensajeImpresionTicket;
  document.getElementById("mensajeTicketero").innerHTML = mensajeImpresionTicket;
  console.log(JSON.stringify(configuracionTicketero));
  if(companyLogo) document.getElementById("contenedorLogoTotem").innerHTML = `<img class="contenedor_100_50" src="images/${configuracionTicketero.logoTotem}" style="width:35%" alt="Logo Empresa"/>`;
  document.getElementById("contenedorLogoTicket").innerHTML = `<img class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4" src="images/${configuracionTicketero.logoTicket}" alt="Logo Empresa"/>`;
  document.getElementById("contenedorLogoImpresion").innerHTML = `<img src="images/${configuracionTicketero.logoTicket}" class="logo">`;
  if(configuracionTicketero.ticketsPorDelante){
    $("#labelTicketsFila").css("display", "block");
  }else{
    $("#labelTicketsFila").css("display", "none");
  }
});

socket.on('menu', function(data){
  console.log(JSON.stringify(data));
  conexionServidor = 1;
  menu = data;
  if(solicitarRut){
    mostrarTeclado();
  }else{
    mostrarMenu(0);
  }
});

socket.on('confirmacionImpresion', function(data){
  console.log(data);
  document.getElementById("labelTicketActualImpresion").innerHTML = data.numeroMostrar.motivo+("000" + data.numeroMostrar.numeroCorrelativoTicket).substr(-3,3);
  document.getElementById("labelTicketActual").innerHTML = data.numeroMostrar.motivo+("000" + data.numeroMostrar.numeroCorrelativoTicket).substr(-3,3);
  document.getElementById("labelTicketsFila").innerHTML = `Tickets por delante: ${data.ticketsFila}`;
  ticketActual = data.numeroMostrar.motivo+("000" + data.numeroMostrar.numeroCorrelativoTicket).substr(-3,3);

  socket.emit('nuevoTicket', mensaje);
  imprimirTicket(ticketActual);
});

function verificarRut(){
  let rut = "";
  rut = document.getElementById("rut-container").value;
  if(checkRut(rut)){
     //$("#barcode").barcode(
      //rut, // Valor del codigo de barras
      //"code39" ,// tipo (cadena)
      //{barWidth:2, barHeight:60, showHRI:true}
      //);
    mostrarMenu(0);
  }else{
    $("#modalErrorRut").modal("show");
  }
}

function impresion(idMotivo, nombre){
  rut2 = document.getElementById("rut-container").value;
  socket.emit('impresion', {idMotivo:idMotivo, rut:rut2});
  document.getElementById("labelNombreMotivoActualImpresion").innerHTML = nombre;
  document.getElementById("labelNombreMotivoActual").innerHTML = nombre;
  $("#contenedorMenu").css("display", "none");
  $("#contenedorImpresion").css("display", "block");
}

function mostrarTeclado(){
  $("#rut-container").css("display", "block");
  $("#motivos-container").css("display", "none");
  $("#contenedorVolverInicio").css("display", "none");
}

function ocultarModalErrorRut(){
  $("#modalErrorRut").modal("hide");
}

function mostrarMenu(idMotivo){
  ticketActual = "";
  $("#rut-container").css("display", "none");
  $("#motivos-container").css("display", "block");
  $("#contenedorMenu").css("display", "block");
  $("#contenedorImpresion").css("display", "none");
  var hijos = [];
  var htmlMotivos = "";
  for(var x in menu){
    if(menu[x].id == idMotivo){
          hijos = menu[x].hijos;
    }
  }
  if(idMotivo == 0){
    $("#contenedorVolverInicio").css("display", "none");
  }else{
    $("#contenedorVolverInicio").css("display", "block");
  }
  //console.log(JSON.stringify(menu));
  for(var x in hijos) {
    if(hijos[x].tipo == 'A')
    {
      htmlMotivos = htmlMotivos + `<div class="contenedor_40 contenedor_100 col-xs-${styleColumnsNumber} col-md-${styleColumnsNumber}"><div align='center' class="contenedor_100"><a class='contenedor_100' style="text-decoration:none;" onclick="mostrarMenu(${hijos[x].id});"><div class="contenedor_80_80 panel-extra-services" style="width:${iconWidth}; height:${iconHeight};"><div class="contenedor_10" style="font-size:large"></div><img style="width: 90%; height:initial;" src="images/${hijos[x].icono}" alt="" class="contenedor_80_0"><div class="contenedor_10" style="font-size:large"></div></div></a></div></div>`;
      //htmlMotivos = htmlMotivos + `<div class="col-xs-6 col-md-6"><div class="panel panel-default panel-extra-services"><a class='service-item-button' onclick="mostrarMenu(${hijos[x].id});"><div class="panel-extra-services panel-body"><img src="images/${hijos[x].icono}" alt="" class="service-logo"></div></a></div></div>`;
    }else{
      htmlMotivos = htmlMotivos + `<div class="contenedor_40 contenedor_100 col-xs-${styleColumnsNumber} col-md-${styleColumnsNumber}"><div align='center' class="contenedor_100"><a class='contenedor_100' style="text-decoration:none;" onclick="impresion(${hijos[x].id},'${hijos[x].nombre}');"><div class="contenedor_80_80 panel-extra-services" style="width:${iconWidth}; height:${iconHeight};"><div class="contenedor_10" style="font-size:large"></div><img style="width: 90%; height:initial;" src="images/${hijos[x].icono}" alt="" class="contenedor_80_0"><div class="contenedor_10" style="font-size:large"></div></div></a></div></div>`;
          //htmlMotivos = htmlMotivos + `<div class="col-xs-6 col-md-6"><div class="panel panel-default panel-extra-services"><a class='service-item-button' onclick="impresion(${hijos[x].id},'${hijos[x].nombre}');"><div class="panel-extra-services panel-body"><img src="images/${hijos[x].icono}" alt="" class="service-logo"></div></a></div></div>`;
    }
    }
    document.getElementById("panelMotivos").innerHTML = htmlMotivos;
    $(".panel-extra-services").css("background-color",backgroundColor);



}

function fechaTicket(){
  var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
  var f=new Date();
  var hora = (f.getHours()==0)?23:f.getHours()-1;
  document.getElementById("fechaTicket").innerHTML = (f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()+"<br>"+f.getHours() + ":" + ((f.getMinutes()<=9)?"0"+f.getMinutes():f.getMinutes()));
  //document.write(f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());
  //document.write("<br>");
  //document.write(f.getHours() + ":" + ((f.getMinutes()<=9)?"0"+f.getMinutes():f.getMinutes()));
}

function imprimirTicket(ticketActualTemp){
  fechaTicket();
  var delay = 4000; //Your delay in milliseconds
  setTimeout(function(){
    if(ticketActualTemp == ticketActual){
      if(solicitarRut){
        $('#rut-container').val('');
        $('#rut-container2').val('');
        mostrarTeclado();
      }else{
        mostrarMenu(0);
      }
      
      document.getElementById("labelNombreMotivoActualImpresion").innerHTML = "";
      document.getElementById("labelNombreMotivoActual").innerHTML = "";
      document.getElementById("labelTicketActualImpresion").innerHTML = "";
      document.getElementById("labelTicketActual").innerHTML = "";
      $("#contenedorMenu").css("display", "block");
      $("#contenedorImpresion").css("display", "none");
    }
  }, delay, ticketActualTemp);
  jsPrintSetup.setSilentPrint(true);
  jsPrintSetup.setShowPrintProgress(false);   
  jsPrintSetup.setOption('paperWidth',76);
  jsPrintSetup.setOption('paperHeight',297);

  jsPrintSetup.setOption('headerStrLeft', '');
  jsPrintSetup.setOption('headerStrCenter', '');
  jsPrintSetup.setOption('headerStrRight', '');
  // set empty page footer
  jsPrintSetup.setOption('footerStrLeft', '');
  jsPrintSetup.setOption('footerStrCenter', '');
  jsPrintSetup.setOption('footerStrRight', '');
  jsPrintSetup.print();
}

socket.on('procesoReiniciar', function(data){
  console.log("Servidor en proceso de reinicio");
  conexionServidor = 0;
  setTimeout(function(){
    volverConectar();
  }, 3000);
});


function volverConectar(){
  console.log("volverConectar");
  socket.emit('idTicketero', localStorage.getItem("idEquipo"));
  socket.emit('tipoEquipo', {tipoEquipo:"ticketero", id:localStorage.getItem("idEquipo")});
  if(conexionServidor == 0){
    setTimeout(function(){
      volverConectar();
    }, 3000);
  }
}



