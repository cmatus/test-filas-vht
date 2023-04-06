//modificación de sistema de rebalse - atención de rebalse solo para motivos configurados como rebalse para el módulo


var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var CryptoJS = require('crypto-js');
var configuracion = require("./configuracion");


var ultimoIdTicket = 0;
var idCliente = 0;
var idSucursal = 0;
var cantidadExtraLlamados = 0;
var reproducirAudioLlamado = 0;
var tiempoPausaSgteLlamado = 0;
var volverLlamar = 0;
var tiempoRellamadoSegundos = 0;
var mensajeImpresionTicket = "";
var ocupado1 = 0;
var ocupado2 = 0;
var ocupado3 = 0;
var ocupado4 = 0;

var ticketOcupado = 0;
var horaActual = -1;
var modulosLogin = [];
var contadorTickets = 0;
var tiempoMaximoLlamado = 0;
var reinicio = 0;
var llamadoIntercalado = 0;


// VARIABLES DE SISTEMA MAESTRO ESCLAVO
var ipServidorLocal = configuracion.ip;
var idServidorLocal = configuracion.id;
var cambioMaestro = 0; //Indica si hay cambio de sevidor maestro
var configMaestroEsclavo = configuracion.configuracionMaestroEsclavo; //Variables desde archivo configuración que indica si el sistema funciona con sistema de respaldo maestro esclavo
var servidorMaestro = 0; //indica si este servidor es el maestro actual
var maestroAsignado = 0; // indica si ya existe un maestro activo

//VARIABLES DE SISTEMA DE REBALSE
var rebalse = 0;
var rebalseActivado = 0;




// variables DASHBOARD
var porcentajeAtencionDentroTiempoObjetivo = "100";
var usuariosDashboard = [];



var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

var options = {
    url     : 'http://localhost:3002/api/usuario',
    method  : 'GET',
    jar     : true,
    headers : headers
}


var menu = [];
var equipos = []; //AQUI SE REGISTA LA IP Y EL SOCKET_ID Y EL TIPO (EJECUTIVO, VISOR, TICKETERO, ADMINISTRADOR) 
var ticketeros = [];
var ejecutivos = [];
var personalEjecutivo = []; //datos de acceso de los ejecutivos

var filaVisor = [];
var filaEjecutivos = []; //Establece el orden para la asignación de tickets a los ejecutivos

var visores = [];
var servidores = [];


var tickets_fila = [];
var motivosPausa = [];
var categorias = [];
var motivosAtencion = [];
var configuracionesTicketeros = [];
var horariosMotivosAtencion = [];
var configuracionesVisores = [];
var gruposOrigenDestino = [];

var logo = '';

actualizarDashboard(1);
  setTimeout(function(){
    //console.log("configMaestroEsclavo: "+configMaestroEsclavo);
    if (configMaestroEsclavo == 1){
      listarServidoresSecundarios();
    }else{
      configuracionInicial();
    }

    /*
    if(servidores[y].estado == 1 && nuevoMaestro == 0){
      nuevoMaestro = 1;
      cambioMaestro = 1;
      if(servidores[y].idTicketero == idServidorLocal){
        console.log('Servidor local - nuevo maestro');
        // ENVIAR COMANDO PARA PRESENTARSE COMO NUEVO MAESTRO
        // ACTIVAR SERVICIOS COMO SERVIDOR
        configuracionInicial();
        for(var z in servidores){
          if(servidores[z].local == 0 && servidores[z].estado == 1){
            servidores[z].maestro = 1;
            servidores[z].socket.emit('maestro',{servidor:idServidorLocal});
          }
        }
      }
    }

    if(configMaestroEsclavo == 1 && maestroAsignado == 0){
      if(servidores[y].estado == 1 && nuevoMaestro == 0){
        nuevoMaestro = 1;
        cambioMaestro = 1;
        if(servidores[y].idTicketero == idServidorLocal){
          console.log('Servidor local - nuevo maestro');
          // ENVIAR COMANDO PARA PRESENTARSE COMO NUEVO MAESTRO
          // ACTIVAR SERVICIOS COMO SERVIDOR
          configuracionInicial();
          for(var z in servidores){
            if(servidores[z].local == 0 && servidores[z].estado == 1){
              servidores[z].maestro = 1;
              servidores[z].socket.emit('maestro',{servidor:idServidorLocal});
            }
          }
        }
      }
    }*/

    /*
    setTimeout(function(){
      for(var x in servidores){
        if(servidores[x].id != idServidorLocal){
          servidores[x].socket = require("socket.io-client")('http://'+servidores[x].ip+':3001');
        }
        if(servidores[x].idTicketero == idServidorLocal){
          servidores[x].estado = 1;
        }
        /*
        if(servidores[x].local == 1){
          servidores[x].estado = 1;
          ipServidorLocal = servidores[x].ip;
          idServidorLocal = servidores[x].idTicketero;
        }
      }
      // ENVIA MENSAJE ESTADO A TODOS LOS SERVIDORES REGISTRADOS EN LA BASE DE DATOS PARA INDICAR QUE ESTÁ ACTIVO
      for(var x in servidores){
        if(servidores[x].idTicketero != idServidorLocal){
          //console.log('enviar estado:'+servidores[x].idTicketero);
          servidores[x].socket.emit('estado',{estado:'1', servidor:idServidorLocal});
        }
      }
      actualizarListaServidores();
    }, 3000);*/
  }, 600);
//configuracionInicial();


function listarServidoresSecundarios(){
  servidores = [];
  options.url = "http://localhost:3002/api/listarServidoresSecundarios";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        servidores = [];
        for(var x in proj){
          servidores.push({
          idServidor : proj[x].id,
          estado: 0,
          ip : proj[x].ip,
          maestro : 0,
          socket : '',
          socketId : ""
        });
        }
        console.log("///////////////////////// SERVIDORES SECUNDARIOS //////////////////////////////");
        console.log(JSON.stringify(servidores));

        //crea las variables para los servidores configurados en BBDD
        setTimeout(function(){
        for(var x in servidores){
          if(servidores[x].idServidor != idServidorLocal){
            servidores[x].socket = require("socket.io-client")('http://'+servidores[x].ip+':3001');
          }
          if(servidores[x].idServidor == idServidorLocal){
            servidores[x].estado = 1;
          }
        }
        // ENVIA MENSAJE ESTADO A TODOS LOS SERVIDORES REGISTRADOS EN LA BASE DE DATOS PARA INDICAR QUE ESTÁ ACTIVO
        for(var x in servidores){
          if(servidores[x].idServidor != idServidorLocal){
            //console.log('enviar estado:'+servidores[x].idTicketero);
            servidores[x].socket.emit('estado',{estado:'1', idServidor:idServidorLocal, servidorMaestro : servidorMaestro});
          }
        }
        //actualizarListaServidores();
        //dependiendo respuesta de los servidores decide si es tomar control
        setTimeout(function(){
          for(var y in servidores){
            if(servidores[y].estado == 1 && maestroAsignado == 0){
              maestroAsignado = 1;
              if(servidores[y].idServidor == idServidorLocal){
                console.log('Servidor local - nuevo maestro');
                servidorMaestro = 1;
                // ENVIAR COMANDO PARA PRESENTARSE COMO NUEVO MAESTRO
                // ACTIVAR SERVICIOS COMO SERVIDOR
                configuracionInicial();
                for(var z in servidores){
                  if(servidores[z].local == 0 && servidores[z].estado == 1){
                    servidores[z].maestro = 1;
                    servidores[z].socket.emit('maestro',{idServidor:idServidorLocal});
                  }
                }
              }
            }
          }
        }, 6000);
      }, 2000);
      }
  });         
}


//ENIVAR A SERVIDORES ESCLAVOS LA INFORMACIÓN ACTUALIZADA DE TODOS LOS SERVIDORES
function actualizarListaServidores(){
  var servidoresTemp = [];
  console.log(servidores);
  for(var x in servidores){
    servidoresTemp.push({
      idTicketero : servidores[x].idTicketero,
      ip : servidores[x].ip,
      estado : servidores[x].estado,
      maestro : servidores[x].maestro
    });
  }
  for(var x in visores){
    console.log(servidoresTemp);
    io.sockets.to(visores[x].socket_id).emit('actualizarListaServidores', servidoresTemp);
  }
}

//CONFIGURACIÓN INICIAL DEL SISTEMA
function configuracionInicial(){
  options.url = "http://localhost:3002/api/configuracionInicial";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      var proj = JSON.parse(body);
      for(var x in proj[0]){
        idCliente = proj[0][x].idCliente;
        idSucursal = proj[0][x].idSucursal;
        rebalse = proj[0][x].rebalse;
        cantidadExtraLlamados = proj[0][x].cantidadExtraLlamados;
        if(cantidadExtraLlamados == 0){
          cantidadExtraLlamados = 1000000;
        }
        reproducirAudioLlamado = proj[0][x].reproducirAudioLlamado;
        tiempoPausaSgteLlamado = proj[0][x].tiempoPausaSgteLlamado;
        //volverLlamar = proj[0][x].volverLlamar;
        tiempoRellamadoSegundos = proj[0][x].tiempoRellamadoSegundos;
        if(tiempoRellamadoSegundos == 0){
          volverLlamar = 0;
          tiempoMaximoLlamado = proj[0][x].tiempoMaximoLlamado;
        }else{
          volverLlamar = 1;
          tiempoMaximoLlamado = proj[0][x].tiempoMaximoLlamado;
        }
        console.log("tiempoMaximoLlamado: "+tiempoMaximoLlamado);
        mensajeImpresionTicket = proj[0][x].mensajeImpresionTicket;
        llamadoIntercalado = proj[0][x].llamadoIntercalado;
        console.log("Configuración del sistema: id cliente:"+idCliente+" ,id sucursal:"+idSucursal+", tiempoRellamadoSegundos:"+tiempoRellamadoSegundos+", volverLlamar:"+volverLlamar+", Mensaje Impresión:"+mensajeImpresionTicket+', rebalse: '+rebalse);
        listarMotivosPausa();
        listarCategorias();
        listarMenu();
        if(cambioMaestro == 0){
          ListarTicketeros();
        }
        listarMotivosAtencion();
        listarModulos();
        listarEjecutivos();
        listarVisores();
        listarGruposOrigenDestino();
        cambioMaestro = 0;
      }
      }
  });
}


//ACTUALIZACIÓN LOS TICKETS EN FILA
options.url = "http://localhost:3002/api/restaurarTickets";
console.log("tickets en fila:");
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var proj = JSON.parse(body);
    //console.log(proj[0]);
      tickets_fila = [];
      console.log("///////////////////////// TICKETS EN FILA //////////////////////////////");
      for(var x in proj[0]){
        var numero_mostrar = proj[0][x].codigo+("000" + proj[0][x].numeroCorrelativo).substr(-3,3);
        console.log("Ticket número:"+numero_mostrar+" Estado:"+proj[0][x].estado);
        if(ultimoIdTicket < proj[0][x].id)
        {
          ultimoIdTicket = proj[0][x].id;
        }
        tickets_fila.push(
        {
          id : proj[0][x].id,
          estado: proj[0][x].estado,
          codigo : proj[0][x].codigo,
          numeroCorrelativo : proj[0][x].numeroCorrelativo,
          numeroMostrar : numero_mostrar,
          modulo : proj[0][x].modulo,
          llamados: 0,
          comentario : proj[0][x].comentario,
          codigoDerivado : proj[0][x].codigoDerivado,
          fechaGenerado : "0",
          idMotivoSucursal : proj[0][x].idMotivoSucursal,
          idMotivoSucursalDerivado : proj[0][x].idMotivoSucursalDerivado
        });
        if(proj[0][x].estado == 4){
          filaVisor.push({id:tickets_fila[x].id});
        }
      }
      //console.log(JSON.stringify(tickets_fila));
    }
});



//ACTUALIZACIÓN DE LOS MOTIVOS DE PAUSA
function listarMotivosPausa(){
  options.url = "http://localhost:3002/api/listarMotivosPausa/"+idSucursal;
  //console.log("Motivos de pausa sucursal:"+idSucursal);
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        motivosPausa = [];
        console.log("///////////////////////// MOTIVOS DE PAUSA //////////////////////////////");
        for(var x in proj){
          console.log("Motivo de pausa: "+ proj[x].descripcion);
          motivosPausa.push(
          {
            id : proj[x].id,
            codigo: proj[x].codigo,
            descripcion : proj[x].descripcion,
            tiempoMinutosAsignado : proj[x].tiempoMinutosAsignado
          });
        }
      }
  });
}

function listarCategorias(){
  options.url = "http://localhost:3002/api/listarCategorias/"+idSucursal;
  //console.log("Categorias sucursal:"+idSucursal);
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        categorias = [];
        console.log("///////////////////////// CATEGORIAS //////////////////////////////");
        for(var x in proj){
          console.log("Categorias: "+ proj[x].descripcion + " motivo:"+proj[x].codigo + " idMotivoSucursal:"+proj[x].idMotivoSucursal);
          categorias.push(
          {
            idCategoria : proj[x].id,
            codigo: proj[x].codigo,
            descripcion : proj[x].descripcion,
            idMotivoSucursal : proj[x].idMotivoSucursal
          });
        }
      }
  });
}

function listarMenu(){
  options.url = "http://localhost:3002/api/listarMenu";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        menu = [];
        for(var x in proj){
          menu.push(
          {
            idMotivo : proj[x].id,
            nombre: proj[x].nombre,
            nivel : proj[x].nivel,
            idPadre : proj[x].idPadre,
            tipo : proj[x].tipo,
            codigo : proj[x].codigo,
            icono : proj[x].icono
          });
        }
        console.log("///////////////////////// MENU //////////////////////////////");
        console.log(JSON.stringify(menu));
      }
  });
}

function ListarTicketeros(){
  options.url = "http://localhost:3002/api/listarTicketeros/"+idSucursal;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        listarTicketeroMotivoAtencion();
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        ticketeros = [];
        //servidores = [];
        for(var x in proj){
          ticketeros.push(
          {
            idTicketero : proj[x].id,
            estado: proj[x].estado,
            ip : proj[x].ip,//ip:"",//ip : proj[x].ip,
            motivos : [],
            socket_id : "",
            descripcion : proj[x].descripcion,
            idConfiguracion : proj[x].configuracionTicketero_id,
            local : proj[x].local,
            maestro : proj[x].maestro
            //socket : ''
          });
          /* CAMBIO DE A FUNCION LISTAR SERVIDORES SECUNDARIOS
          servidores.push({
            idTicketero : proj[x].id,
            estado: 0,
            ip : proj[x].ip,
            local : proj[x].local,
            maestro : proj[x].maestro,
            socket : ''
            });*/
          //equipos.push({ip:proj[x].ip, tipo:"ticketero"});
        }
      }
  });
}

function listarTicketeroMotivoAtencion(){
  options.url = "http://localhost:3002/api/listarTicketeroMotivoAtencion";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        for(var x in ticketeros)
        {
          ticketeros[x].motivos = [];
        }
        for(var x in proj){
          for(var y in ticketeros){
            if(ticketeros[y].idTicketero == proj[x].ticketero_id){
              ticketeros[y].motivos.push({idMotivo:proj[x].motivoAtencion_id, estado:1});
            }
          }
        }
        listarConfiguracionesTicketeros();
        console.log("///////////////////////// TICKETEROS //////////////////////////////");
      console.log(JSON.stringify(ticketeros));
      }
  });
}

function listarConfiguracionesTicketeros(){
  options.url = "http://localhost:3002/api/listarConfiguracionesTicketeros/"+idCliente;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        configuracionesTicketeros = [];
        for(var x in proj){
          logo = proj[x].logoTotem;
          configuracionesTicketeros.push(
          {
            id : proj[x].id,
            mensajeImpresionTicket: proj[x].mensajeImpresionTicket,
            urlImagenFondo : proj[x].urlImagenFondo,
            urlImagenDescanso : proj[x].urlImagenFondo,
            minutosDesplegarImagenDescanso : proj[x].minutosDesplegarImagenDescanso,
            colorFondoRGB : proj[x].colorFondoRGB,
            colorTextoTeclaRGB : proj[x].colorTextoTeclaRGB,
            colorFondoTeclaRGB : proj[x].colorFondoTeclaRGB,
            logoTotem : proj[x].logoTotem,
            logoTicket : proj[x].logoTicket,
            mensajeDespliegueTotem : proj[x].mensajeDespliegueTotem,
            ticketsPorDelante : configuracion.ticket.ticketsPorDelante
          });
        }
        listarHorariosMotivosAtencion();
        console.log("///////////////////////// CONFIGURACIONES TICKETEROS //////////////////////////////");
      console.log(JSON.stringify(configuracionesTicketeros));
      }
  });
}

function listarHorariosMotivosAtencion(){
  options.url = "http://localhost:3002/api/listarHorariosMotivosAtencion";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        horariosMotivosAtencion = [];
        for(var x in proj){
          horariosMotivosAtencion.push(
          {
            hora : proj[x].hora,
            dia: proj[x].dia,
            idTicketero : proj[x].idTicketero,
            idMotivo : proj[x].idMotivo
          });
        }
        console.log("///////////////////////// HORARIOS MOTIVOS DE ATENCIÓN //////////////////////////////");
      console.log(JSON.stringify(horariosMotivosAtencion));
      horaActual = -1;
      cambioHora();
      }
  });
}




function listarMotivosAtencion(){
  options.url = "http://localhost:3002/api/listarMotivosAtencion/"+idSucursal;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        motivosAtencion = [];
        for(var x in proj){
          motivosAtencion.push(
          {
            id : proj[x].id,
            idMotivoSucursal : proj[x].idMotivoSucursal,
            codigo: proj[x].codigo,
            nombre : proj[x].nombre,
            tiempoMaximoAtencion:proj[x].tiempoMaximoAtencion,
            tiempoMaximoEsperaCola:proj[x].tiempoMaximoEsperaCola,
            atencionesHoy : 0,
            distraidos : 0,
            esperaColaActualSegundos : "0",
            esperaColaPromedio : "",
            atencionPromedio : "",
            modulosHabilitados : 0,
            atencionesDentroTiempoObjetivo: "",
            largoCola : 0,
            tiempoEsperaActual:"",
            numeroActual:"",
            modulosAtendiendo:0,
            derivaciones:[],
            rebalse : 0,
            cantidadActivarRebalse : proj[x].cantidadActivarDesborde,
            cantidadAtencionesRebalse : proj[x].cantidadAtencionesDesborde,
            cantidadAtencionesActualesRebalse : 0,
            esperaColaPromedioMinutos : 0,
            porActivarAlaramaEsperaCOla : 0,
            alarmaEsperaCola : 0
          });
        }
        options.url = "http://localhost:3002/api/listarRestriccionesDerivacion/"+idSucursal;
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          for(var y in motivosAtencion){
            for(var z in motivosAtencion){
              if(motivosAtencion[y].idMotivoSucursal != motivosAtencion[z].idMotivoSucursal){
                motivosAtencion[y].derivaciones.push({id: motivosAtencion[z].id, nombre : motivosAtencion[z].nombre, idMotivoSucursal:motivosAtencion[z].idMotivoSucursal, codigo:motivosAtencion[z].codigo});
              }
            }
          }
          var proj2 = JSON.parse(body);
          //console.log(JSON.stringify(proj2));
          for(var y in proj2){
            for(var z in motivosAtencion){
              for(var w in motivosAtencion[z].derivaciones){
                //console.log(motivosAtencion[z].derivaciones[w].id);
                if(motivosAtencion[z].derivaciones[w].idMotivoSucursal == proj2[y].idmotivoatencionsucursal_d && motivosAtencion[z].idMotivoSucursal == proj2[y].idmotivoatencionsucursal_o){
                  console.log("eliminar"+proj2[y].idmotivoatencionsucursal_d);
                  motivosAtencion[z].derivaciones.splice(w, 1);
                }
              }

            }
          }
          console.log("///////////////////////// MOTIVOS DE ATENCIÓN //////////////////////////////");
          console.log(JSON.stringify(motivosAtencion));
        }
        });


        //ACTUALIZACIÓN LOS TICKETS EN FILA
      options.url = "http://localhost:3002/api/restaurarInformacionTickets";
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var proj = JSON.parse(body);
          //console.log(proj[0]);
            console.log("///////////////////////// INFORMACION TICKETS //////////////////////////////");
            for(var v in proj){
              for(var y in motivosAtencion){
                //console.log(""+motivosAtencion[y].codigo+" - "+proj[0][v].codigo);
                if(motivosAtencion[y].idMotivoSucursal == proj[v].idMotivoSucursal){
                  motivosAtencion[y].atencionesHoy = proj[v].atencionesHoy;
                  //console.log("atencionesHoy: "+motivosAtencion[y].atencionesHoy);
                }
              }
            }
            console.log(proj);
          }
      });
      }
  });
}




function listarVisores(){
  options.url = "http://localhost:3002/api/ListarVisores/"+idSucursal;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        //console.log("///////////////////////// VISORES //////////////////////////////");
        visores = [];
        for(var x in proj){
          visores.push(
          {
            id : proj[x].id,
            socket_id : "",
            estado: 0,
            nombre: proj[x].descripcion,
            ip:"",//ip : proj[x].ip,
            motivos : [],
            idConfiguracion: proj[x].idConfiguracion
          });
          //equipos.push({ip:proj[x].ip, tipo:"visor"});
        }
        //console.log(JSON.stringify(visores));
      listarVisoresMotivoAtencion();
      listarConfiguracionesVisores();
      }
  });
}

function listarVisoresMotivoAtencion(){
  options.url = "http://localhost:3002/api/listarVisoresMotivoAtencion";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(ejecutivos));
        console.log("///////////////////////// VISORES //////////////////////////////");
        for(var x in visores){
          visores[x].motivos = [];
        }
        for(var x in proj){
          for(var y in visores){
            //console.log(ejecutivos[y].idModulo);
            if(proj[x].id == visores[y].id){
              visores[y].motivos.push({codigo : proj[x].codigo, idMotivoSucursal : proj[x].idMotivoSucursal});
            }
          }
        }
        console.log(JSON.stringify(visores));
      }
  });
}

function listarConfiguracionesVisores(){
  options.url = "http://localhost:3002/api/listarConfiguracionesVisores/"+idCliente;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        configuracionesVisores = [];
        for(var x in proj){
          configuracionesVisores.push(
          {
            id : proj[x].id,
            cantidadFilas : proj[x].cantidadFilas,
            cantidadColumnas : proj[x].cantidadColumnas,
            cantidadParpadeosLlamado : proj[x].cantidadParpadeosLlamado,
            imagenRepresentaConfVisor : proj[x].imagenRepresentaConfVisor,
            componentes:[],
            reproducirAudioLlamado : reproducirAudioLlamado
          });
        }
        listarComponentesVisores();
        //console.log("///////////////////////// CONFIGURACIONES VISORES //////////////////////////////");
      //console.log(JSON.stringify(configuracionesVisores));
      }
  });
}

function listarComponentesVisores(){
  options.url = "http://localhost:3002/api/listarComponentesVisores";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        for(var x in proj){
          for(var y in configuracionesVisores){
            if(configuracionesVisores[y].id == proj[x].id){
              configuracionesVisores[y].componentes.push({
                alto : proj[x].alto,
                ancho : proj[x].ancho,
                posicionX : proj[x].posicionX,
                posicionY : proj[x].posicionY,
                urlDisponibleRecurso : proj[x].urlDisponibleRecurso,
                X1 : 0,
                Y1 : 0
              });
            }
          }
        }
        for(var v in configuracionesVisores){
        for(var w in configuracionesVisores[v].componentes){
          if(configuracionesVisores[v].componentes[w].posicionX == 1 && configuracionesVisores[v].componentes[w].posicionY != 1){
            configuracionesVisores[v].componentes[w].X1 = 0;
            for(var z in configuracionesVisores[v].componentes){
              //console.log(configuracionesVisores[v].componentes[w].posicionY+' - '+(configuracionesVisores[v].componentes[z].posicionY +1));
              //console.log(configuracionesVisores[v].componentes[w].posicionX +' - '+ configuracionesVisores[v].componentes[z].posicionX);
              //console.log('---------------------');
              if( (configuracionesVisores[v].componentes[w].posicionY == (configuracionesVisores[v].componentes[z].posicionY +1)) && configuracionesVisores[v].componentes[w].posicionX == configuracionesVisores[v].componentes[z].posicionX){
                //console.log('---------------------- Y ---------------------------');
                configuracionesVisores[v].componentes[w].Y1 = configuracionesVisores[v].componentes[z].Y1 + configuracionesVisores[v].componentes[z].ancho;
              }
            }
          }
          if(configuracionesVisores[v].componentes[w].posicionX == 1 && configuracionesVisores[v].componentes[w].posicionY == 1){
            configuracionesVisores[v].componentes[w].X1 = 0;
            configuracionesVisores[v].componentes[w].Y1 = 0;
          }
          if(configuracionesVisores[v].componentes[w].posicionX != 1 && configuracionesVisores[v].componentes[w].posicionY == 1){
            configuracionesVisores[v].componentes[w].X1 = 0;
            for(var z in configuracionesVisores[v].componentes){
              if( (configuracionesVisores[v].componentes[w].posicionX == (configuracionesVisores[v].componentes[z].posicionX +1)) && configuracionesVisores[v].componentes[w].posicionY == configuracionesVisores[v].componentes[z].posicionY){
                configuracionesVisores[v].componentes[w].X1 = configuracionesVisores[v].componentes[z].X1 + configuracionesVisores[v].componentes[z].alto;
              }
            }
          }
          if(configuracionesVisores[v].componentes[w].posicionX != 1 && configuracionesVisores[v].componentes[w].posicionY != 1){
            for(var z in configuracionesVisores[v].componentes){
              if( (configuracionesVisores[v].componentes[w].posicionX == (configuracionesVisores[v].componentes[z].posicionX +1)) && (configuracionesVisores[v].componentes[w].posicionY == (configuracionesVisores[v].componentes[z].posicionY))){
                configuracionesVisores[v].componentes[w].X1 = configuracionesVisores[v].componentes[z].X1 + configuracionesVisores[v].componentes[z].alto;
              }
            }
            for(var m in configuracionesVisores[v].componentes){
              if( (configuracionesVisores[v].componentes[w].posicionX == (configuracionesVisores[v].componentes[m].posicionX)) && (configuracionesVisores[v].componentes[w].posicionY == (configuracionesVisores[v].componentes[m].posicionY+1))){
                configuracionesVisores[v].componentes[w].Y1 = configuracionesVisores[v].componentes[m].Y1 + configuracionesVisores[v].componentes[m].ancho;
              }
            }
          }
        }
      }
        console.log("///////////////////////// CONFIGURACIONES VISORES //////////////////////////////");
      console.log(JSON.stringify(configuracionesVisores));
      }
  });
}



function listarModulos(){
  options.url = "http://localhost:3002/api/listarModulos/"+idSucursal;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(proj));
        //console.log("///////////////////////// MODULOS //////////////////////////////");
        for(var x in proj){
          ejecutivos.push({
            socket_id:"",
            id:proj[x].id,
            modulo: proj[x].codigo,
            descripcion:"",
            estado: 0,
            ip:"",
            motivos:[],
            idPersonalEjecutivo: 0,
            nombreEjecutivo:"",
            grupo: proj[x].grupoModuloSucursal_id,
            cantidadAtenciones:0,
            key:0,
            atencionNoRebalse : 0,
            keyPausa : 0,
            idAtencionActual : 0
          });
          filaEjecutivos.push({
            id:proj[x].id,
            cantidadAtenciones:0
          });
          //equipos.push({ip:proj[x].ip, tipo:"modulo"});
        }
        //console.log(JSON.stringify(ejecutivos));
        listarMotivosModulos();
      }
  });
}

function restaurarEstadoEjecutivo(idModulo){
  console.log("restaurarEstadoEjecutivo:"+idModulo);
  options.url = "http://localhost:3002/api/restaurarEstadosEjecutivos2/"+idModulo;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj2 = JSON.parse(body);
        //console.log(proj2);

        //console.log("///////////////////////// MODULOS //////////////////////////////");
        for(var y in proj2){
          for(var v in ejecutivos)
          {
            if(proj2[y].modulo_id == ejecutivos[v].id){
              var estadoTemp = parseInt(proj2[y].estado);
              console.log("estado 2:"+estadoTemp);
              switch(estadoTemp) {
              case 3:
                ejecutivos[v].estado = 3;
              break;
              case 5:
                ejecutivos[v].estado = 2;
              break;
              case 6:
                ejecutivos[v].estado = 2;
              break;
              case 7:
                ejecutivos[v].estado = 2;
              break;
              default:
                ejecutivos[v].estado = 0;

            } 
            }
          }
          
        }
        //console.log(ejecutivos);
      }

  });
}

function listarMotivosModulos(){
  options.url = "http://localhost:3002/api/listarMotivosModulos";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(ejecutivos));
        console.log("///////////////////////// MODULOS //////////////////////////////");
        var ejecutivosTemp = ejecutivos;
        for(var y in ejecutivos){
          ejecutivos[y].motivos = [];
        }
        for(var x in proj){
          for(var y in ejecutivos){
            //console.log(ejecutivos[y].idModulo);
            if(proj[x].idModulo == ejecutivos[y].id){
            ejecutivos[y].motivos.push({
              codigo:proj[x].codigo, 
              idMotivoSucursal : proj[x].idMotivoSucursal, 
              cantidadAtenciones : 0, 
              prioridad : proj[x].prioridad,
              atiendeRebalse : proj[x].atiendeRebalse
            });
            }
          }
        }

        for(var y in ejecutivos){
          for(var z in ejecutivosTemp){
            if(ejecutivos[y].id == ejecutivosTemp[z].id){
              for(var v in ejecutivos[y].motivos){
                for(var w in ejecutivosTemp[z].motivos){
                  if(ejecutivos[y].motivos[v].idMotivoSucursal == ejecutivosTemp[z].motivos[w].idMotivoSucursal){
                    ejecutivos[y].motivos[v].cantidadAtenciones = ejecutivos[z].motivos[w].cantidadAtenciones;
                  }
                }
              }
            }
          }
        }
        for(var y in motivosAtencion){
          for(var v in ejecutivos){
          for(var w in ejecutivos[v].motivos){
            if(ejecutivos[v].motivos[w].idMotivoSucursal == motivosAtencion[y].idMotivoSucursal){
              motivosAtencion[y].modulosHabilitados = motivosAtencion[y].modulosHabilitados + 1;
            }
          }
        }
      }
        console.log(JSON.stringify(ejecutivos));
      }
  });
}

function listarGruposOrigenDestino(){
  options.url = "http://localhost:3002/api/listarGruposOrigenDestino";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(ejecutivos));
        console.log("///////////////////////// GRUPOS ORIGEN - DESTINO  //////////////////////////////");
        for(var x in proj){
        gruposOrigenDestino.push({
          id:proj[x].id,
          tiempoTrayecto:proj[x].tiempoTrayecto,
          idModuloOrigen:proj[x].idGrupoModuloSucursalO,
          idModuloDestino:proj[x].idGrupoModuloSucursalD 
        });
        }
        console.log(JSON.stringify(gruposOrigenDestino));
      }
  });
}

function listarEjecutivos(){
  options.url = "http://localhost:3002/api/listarEjecutivos/"+idSucursal;
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var proj = JSON.parse(body);
        //console.log(JSON.stringify(ejecutivos));
        console.log("///////////////////////// EJECUTIVOS //////////////////////////////");
        for(var x in proj){
          personalEjecutivo.push({
            id:proj[x].id,
            nombres:proj[x].nombres,
            apellidoPaterno:proj[x].apellidoPaterno,
            apellidoMaterno:proj[x].apellidoMaterno,
            nombre:"",
            horaIngreso:"",
            atencionesHoy:0,
            pausasTomadas:0,
            totalPausas:"",
            atencionPromedio:"",
            atencionesDentroTiempoObjetivo:"",
            moduloActual:"",
            motivosAtencion:"",
            numeroActual:""
          });
        }
        console.log(JSON.stringify(personalEjecutivo));
      }
  });
}

function cambioHora(){
  var f=new Date();
  var horaActualTemp = 0;
  var diaActual = f.getDay();
  horaActualTemp = f.getHours();
  if(horaActualTemp != horaActual){
    horaActual = horaActualTemp;
    habilitarMotivosAtencionHorario(horaActual, diaActual);
  }
  if(reinicio == 0 && (horaActualTemp >= 0 && horaActualTemp <= 4)){
    cerrarJornada();
  }
  if(reinicio == 1 && (horaActualTemp > 5 && horaActualTemp <= 6)){
    reinicio = 0;
  }
  setTimeout(function(){
    cambioHora();
  }, 60000);
}

function habilitarMotivosAtencionHorario(horaActual, diaActual){
  console.log("Hora: "+horaActual+"Día: "+diaActual);
  var actualizarMenuTicketero = 0;
  for(var x in ticketeros){
    var habilitacionNueva = 0;
    var deshabilitacionNueva = 0;
    for(var y in ticketeros[x].motivos){
      if(ticketeros[x].motivos[y].estado == 0){
        var habilitarTemp = 1;
        for(var v in horariosMotivosAtencion){
          //console.log(horariosMotivosAtencion[v].idMotivo +" - "+ ticketeros[x].motivos[y].idMotivo +" - "+ horariosMotivosAtencion[v].hora +" - "+ horaActual +" - "+ horariosMotivosAtencion[v].dia +" - "+ diaActual);
          if(horariosMotivosAtencion[v].idMotivo == ticketeros[x].motivos[y].idMotivo && horariosMotivosAtencion[v].hora == horaActual && horariosMotivosAtencion[v].dia == diaActual){
            //console.log("entro");
            habilitarTemp = 0;
          }
        }
        if(habilitarTemp == 1){
          ticketeros[x].motivos[y].estado = 1;
          habilitacionNueva = 1;
        }
      }else{
        for(var v in horariosMotivosAtencion){
          //console.log(horariosMotivosAtencion[v].hora+" - "+horariosMotivosAtencion[v].dia);
          //console.log(horariosMotivosAtencion[v].idMotivo +" - "+ ticketeros[x].motivos[y].idMotivo +" - "+ horariosMotivosAtencion[v].hora +" - "+ horaActual +" - "+ horariosMotivosAtencion[v].dia +" - "+ diaActual);
          if(horariosMotivosAtencion[v].idMotivo == ticketeros[x].motivos[y].idMotivo && horariosMotivosAtencion[v].hora == horaActual && horariosMotivosAtencion[v].dia == diaActual){
            ticketeros[x].motivos[y].estado = 0;
            deshabilitacionNueva = 1;
            console.log("idMotivo: "+horariosMotivosAtencion[v].idMotivo+" ticketeros: "+ticketeros[x].idTicketero);
          }
        }
      }
    }

    if(deshabilitacionNueva == 1 || habilitacionNueva == 1){
      construirMenu(ticketeros[x].idTicketero);
        var menuTicketeroTemp = construirMenu(ticketeros[x].idTicketero);
        io.sockets.to(ticketeros[x].socket_id).emit('menu', menuTicketeroTemp);
      console.log("Cambio de menú en ticketero: "+ticketeros[x].idTicketero);
    }
  }
}


function construirMenu(idTicketero){
  var motivosTicketeroTemp = [];
  var motivosHijosTemp = [];
  var menuTicketeroTemp = [];
  var menuPrincipalHijos = []
  for(var x in ticketeros)
  {
    if(ticketeros[x].idTicketero == idTicketero){
      motivosTicketeroTemp = ticketeros[x].motivos;
    }
  }
  console.log(motivosTicketeroTemp);
  for(var x in menu){
    if(menu[x].tipo == 'A')
    {
      motivosHijosTemp = [];
      for(var y in menu){
        var incluirHijoTemp = 0;
        //console.log(menu[x].idMotivo+" -- "+ menu[y].idPadre+" -- "+menu[y].idMotivo);
        if(menu[y].idPadre == menu[x].idMotivo)
        {
          for(var w in ticketeros){
            if(ticketeros[w].idTicketero == idTicketero)
            {
              for(var m in ticketeros[w].motivos){
                if(ticketeros[w].motivos[m].idMotivo == menu[y].idMotivo && ticketeros[w].motivos[m].estado == 1){
                  incluirHijoTemp = 1;
                  //console.log(ticketeros[w].motivos[m].idMotivo+ " == " +menu[y].idMotivo+ " && "+ ticketeros[w].motivos[m].estado);
                }
              }
            }
            
          }
          if(incluirHijoTemp == 1){
            motivosHijosTemp.push({id:menu[y].idMotivo, nombre: menu[y].nombre, tipo: menu[y].tipo, icono:menu[y].icono})
          }
        }
      }
      console.log(motivosHijosTemp);
      var enMenu = 0;
      for(var y in motivosHijosTemp){
        for(var v in motivosTicketeroTemp){
          if(motivosTicketeroTemp[v].idMotivo == motivosHijosTemp[y].id && motivosTicketeroTemp[v].estado == 1){
            enMenu = 1;
          }
        }
      }
      if(enMenu == 1){
        menuTicketeroTemp.push({id:menu[x].idMotivo, nombre: menu[x].nombre, hijos:motivosHijosTemp, icono:menu[x].icono});
      }
    }else{
      for(var y in motivosTicketeroTemp){
        if(motivosTicketeroTemp[y].idMotivo == menu[x].idMotivo && motivosTicketeroTemp[y].estado == 1){
          menuTicketeroTemp.push({id:menu[x].idMotivo, nombre: menu[x].nombre, codigo:menu[x].codigo, icono:menu[x].icono});
        }
      }
    }
  }
  for(var x in menu){
    if(menu[x].idPadre == 0)
    {
      for(var y in menuTicketeroTemp){
        if(menuTicketeroTemp[y].id == menu[x].idMotivo){

          menuPrincipalHijos.push({id:menu[x].idMotivo, nombre: menu[x].nombre, tipo:menu[x].tipo, icono:menu[x].icono});
        }
      }
    }
  }
  menuTicketeroTemp.push({id:0, nombre: "MENU PRINCIPAL", hijos: menuPrincipalHijos});
  return menuTicketeroTemp;
}


app.use(express.static('public'));
app.get('/', function(req, res){
  //res.status(200).send("hola");
});



io.sockets.on('connection', function(socket){

  //cambioHora();
  io.sockets.to(socket.id).emit('socket_id', socket.id);
  //AQUI HACEMOS LA ASIGNACIÓN DE LA IP CON LOS EQUIPOS SI HAY UNA NUEVA CONEXIÓN DE UN EQUIPO YA CONECTADO SE ACTUALIZA EL SOCKET_ID
  var clientIp = socket.request.connection.remoteAddress;
  console.log(clientIp);
  var ip2 = clientIp.split(":");
  var ip = ip2[ip2.length-1];
  if(ip == "1"){
    ip = "127.0.0.1";
  }
  console.log(ip);


  //REPORTE DESDE UN SERVIDOR PARA INDICAR QUE ESTÁ ACTIVO
    socket.on("estado",function(data){
        console.log("------------------------- pruebaMaestro--------------------------------------------------");
        console.log("Reporte de estado: "+data.idServidor);
        console.log(servidores);
        for(var x in servidores){
          console.log("servidor: "+servidores[x].idServidor);
      if(servidores[x].idServidor == data.idServidor){
        console.log("Reporte de estado: "+data.idServidor);
        servidores[x].estado = 1;
        servidores[x].socketId = socket.id;
        servidores[x].socket.emit('reportarEstado',{estado:'1', idServidor:idServidorLocal, servidorMaestro : servidorMaestro});
      }
    }
    //io.sockets.to(socket.id).emit('reportarEstado', {'servidor':'1'});
    //console.log(servidores);
    });

    socket.on("reportarEstado",function(data){
      console.log(data);
      for(var x in servidores){
        if(servidores[x].idServidor == data.idServidor){
          servidores[x].socketId = socket.id;
        if(data.servidorMaestro == 1){
          maestroAsignado = 1;
          servidores[x].maestro = 1;
          console.log("------------------------- Servidor Maestro Asignado --------------------------------------------------");
        }
        }
    }
        console.log("------------------------- Reporte de estado --------------------------------------------------");
    });


    socket.on('conexionDashboard', function(data) {
      console.log("conexionDashboard");
      informacionDashboardTemp = [];
      usuariosDashboard.push({socket_id:socket.id});
      informacionDashboardTemp = actualizarDashboard(0);
      io.sockets.to(socket.id).emit('actualizarDashboard', informacionDashboardTemp);
    }); 


    // ACCIÓN ENVIADA DESDE SISTEMA DE ADMINISTRACIÓN PARA LIBERAR UN MODULO CON UNA SESIÓN ACTIVA
  socket.on('liberarmodulo', function(data) {
      console.log("liberarmodulo");
    for(var x in ejecutivos){
      if(ejecutivos[x].id == data.idmodulo){
        io.sockets.to(socket.id).emit('liberarSesionModulo', "liberarSesionModulo");
        cambioEstadoEjecutivo(ejecutivos[x].idPersonalEjecutivo, ejecutivos[x].id, 2, 0, 0);
        ejecutivos[x].socket_id = "";
        ejecutivos[x].ip = 0;
        ejecutivos[x].nombreEjecutivo = "";
        ejecutivos[x].idPersonalEjecutivo = 0;
        ejecutivos[x].estado = 0;
        ejecutivos[x].key = "";
        for(var y in ejecutivos[x].motivos){
          for(var v in motivosAtencion){
            if(ejecutivos[x].motivos[y].idMotivoSucursal == motivosAtencion[v].idMotivoSucursal){
              motivosAtencion[v].modulosAtendiendo = motivosAtencion[v].modulosAtendiendo - 1;
              console.log("Motivo: "+motivosAtencion[v].codigo+" - modulos habilitados: "+motivosAtencion[v].modulosAtendiendo);
              actualizarDashboard(0);
            }
          }
        }

      }
    }
    });


  socket.on('actualizarHorarios', function(data) {
      console.log("actualizarHorarios");
    listarHorariosMotivosAtencion();
    });

    socket.on('actualizarModuloMotivoAtencion', function(data) {
      console.log("actualizarModuloMotivoAtencion");
      listarMotivosModulos();
      setTimeout(function(){
        for(var x in ejecutivos){
        io.sockets.to(ejecutivos[x].socket_id).emit('motivosPausa', motivosPausa);
        io.sockets.to(ejecutivos[x].socket_id).emit('categorias', categorias);
        io.sockets.to(ejecutivos[x].socket_id).emit('motivosAtencion', motivosAtencion);
        io.sockets.to(ejecutivos[x].socket_id).emit('motivosAtencionEjecutivo', ejecutivos[x].motivos);
        }
        for(var x in visores){
          io.sockets.to(visores[x].socket_id).emit('confirmarAccion', "confirmar");
        }
    }, 4000);
    });

    socket.on('actualizarVisorMotivoAtencion', function(data) {
      console.log("actualizarVisorMotivoAtencion");
      listarVisoresMotivoAtencion();
      setTimeout(function(){
        for(var x in visores){
          io.sockets.to(visores[x].socket_id).emit('confirmarAccion', "confirmar");
        }
    }, 4000);
    });

    socket.on('actualizarTicketeroMotivoAtencion', function(data) {
      console.log("actualizarTicketeroMotivoAtencion");
    listarTicketeroMotivoAtencion();
    setTimeout(function(){
      listarMenu();
    }, 4000);
    setTimeout(function(){
      for(var x in ticketeros){
        //construirMenu(ticketeros[x].idTicketero);
          var menuTicketeroTemp = construirMenu(ticketeros[x].idTicketero);
          for(var y in configuracionesTicketeros){
            if(configuracionesTicketeros[y].id == ticketeros[x].idConfiguracion){
              io.sockets.to(ticketeros[x].socket_id).emit('configuracionTicketero', configuracionesTicketeros[y]);
              io.sockets.to(ticketeros[x].socket_id).emit('menu', menuTicketeroTemp);
            }
          }
      }
    }, 7000);
    });
  socket.on('actualizarMenuTicketeros', function(data) {
      console.log("actualizarMenuTicketeros");
    listarMenu();
    setTimeout(function(){
      for(var x in ticketeros){
        //construirMenu(ticketeros[x].idTicketero);
          var menuTicketeroTemp = construirMenu(ticketeros[x].idTicketero);
          for(var y in configuracionesTicketeros){
            if(configuracionesTicketeros[y].id == ticketeros[x].idConfiguracion){
              io.sockets.to(ticketeros[x].socket_id).emit('configuracionTicketero', configuracionesTicketeros[y]);
              io.sockets.to(ticketeros[x].socket_id).emit('menu', menuTicketeroTemp);
            }
          }
      }
    }, 5000);
    
    });


    socket.on('moduloListo', function(data) {
      var logeadoTemp = 0;
      var posicionTemp = 0;
      console.log(data);
      for(var y in ejecutivos){
      if(ejecutivos[y].key == data && data != '0'){
        ejecutivos[y].socket_id = socket.id;
        logeadoTemp = 1;
        posicionTemp = y;
        setTimeout(function(idTicket){
          loginModulo(ejecutivos[posicionTemp].id, socket.id);
          loginEjecutivo(ejecutivos[posicionTemp].idPersonalEjecutivo, socket.id);
        }, 1000);

        actualizarDashboard(0);
      }
    }
    if(logeadoTemp == 0){
      io.sockets.to(socket.id).emit('sinLogear', "");
    }
    console.log(ejecutivos);
    });


  socket.on('autenticacion', function(data) {

        ipTemp = ip;

      console.log(ipTemp);
      var passTemp = CryptoJS.MD5(data.pass).toString();
      //console.log(passTemp);
    options.url = "http://localhost:3002/api/autenticacion/"+data.user+"/"+passTemp;
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var proj = JSON.parse(body);
          var flag1 = 0;
          var idPersonalEjecutivoTemp = "";
          for(var x in proj){
            flag1 = 1;
            idPersonalEjecutivoTemp = proj[x].id
          }
          if(flag1 == 0){
            //USUARIO NO ENCONTRADO
            io.sockets.to(socket.id).emit('autenticacionFallida', "0");
          }else{
            var flag3 = 0;
            for(var y in ejecutivos){
              if(ejecutivos[y].idPersonalEjecutivo == idPersonalEjecutivoTemp){
                flag3 = 1;
              }
            }
            var flag2 = 0;
            if(flag3 == 0){
              for(var y in ejecutivos){
                //console.log(ejecutivos[y].ip);
                if(ejecutivos[y].modulo == data.idModulo){
                  flag2 = 1;
                  ejecutivos[y].ip = 0;
                  ejecutivos[y].key = socket.id;
                  ejecutivos[y].idPersonalEjecutivo = idPersonalEjecutivoTemp;
                ejecutivos[y].nombreEjecutivo = "";
                io.sockets.to(socket.id).emit('sesionIniciada', socket.id);
                equipos.push({ip:ipTemp, tipo:"modulo"});
                restaurarEstadoEjecutivo(ejecutivos[y].id);
                }
              }
              if(flag2 == 0){
                io.sockets.to(socket.id).emit('autenticacionFallida', "0");
              }else{
                var modulosTemp=[];
              modulosTemp = listarModulosDisponibles(socket.id);
              for(var x in modulosLogin){
                io.sockets.to(modulosLogin[x].socket_id).emit('logo', logo);
                io.sockets.to(modulosLogin[x].socket_id).emit('modulos', modulosTemp);
              }
              }
            }else{
              io.sockets.to(socket.id).emit('autenticacionFallida', "1");
            }
          }
        }
    });
    });

  socket.on('login', function(data) {
    var modulosTemp=[];
    modulosTemp = listarModulosDisponibles(socket.id);
    for(var x in modulosLogin){
      io.sockets.to(modulosLogin[x].socket_id).emit('logo', logo);
      io.sockets.to(modulosLogin[x].socket_id).emit('modulos', modulosTemp);
    }
    //io.sockets.to(socket.id).emit('modulos', modulosTemp);
  });

  socket.on('listarEquipos', function(data) {
    var equiposTemp=[];
    console.log("listarEquipos");
    for(var x in visores){
      equiposTemp.push({tipoEquipo:"visor", id:visores[x].id, descripcion:visores[x].nombre});
    }
    for(var x in ticketeros){
      equiposTemp.push({tipoEquipo:"ticketero", id:ticketeros[x].idTicketero, descripcion:ticketeros[x].descripcion});
    }
    io.sockets.to(socket.id).emit('equipos', equiposTemp);
  });

    socket.on('tipoEquipo', function(data) {
      
      if(data.tipoEquipo == "ticketero"){
        console.log(data);
        var menuTicketeroTemp = [];
        var configuracionTemp = [];
        menuTicketeroTemp = construirMenu(data.id);
        //console.log(JSON.stringify(menuTicketeroTemp));
        for(var x in ticketeros){
          if(ticketeros[x].idTicketero == data.id){
            for(var y in configuracionesTicketeros){
              if(configuracionesTicketeros[y].id == ticketeros[x].idConfiguracion){
                configuracionTemp = configuracionesTicketeros[y];
              }
            }
          }
        }
        
        io.sockets.to(socket.id).emit('menu', menuTicketeroTemp);
        io.sockets.to(socket.id).emit('configuracionTicketero', configuracionTemp);
      }
      if(data.tipoEquipo == "visor"){
        for(var x in visores){
          if(visores[x].id == data.id){

            for(var y in configuracionesVisores){

              if(visores[x].idConfiguracion == configuracionesVisores[y].id){
                console.log("Visor:"+ data.id +" logeado");
                io.sockets.to(visores[x].socket_id).emit('configuracionVisor', configuracionesVisores[y]);

              }
            }
          }
        }
        actualizarListaServidores();
      }
      if(data.tipoEquipo == "modulo" && data.key != '0'){
        for(var x in ejecutivos){
          if(ejecutivos[x].key == data.key){
            io.sockets.to(socket.id).emit('sesionIniciada', data.key);
          }
        }
      }
    });


    socket.on('idModulo', function(idModulo) {
      //loginModulo(idModulo, socket.id);
  });

  socket.on('idEjecutivo', function(idEjecutivo) {
    loginEjecutivo(idEjecutivo, socket.id);
  });



  socket.on('idVisor', function(idVisor) {
      for(var x in visores){
        if(visores[x].id == idVisor)
        {

            for(var y in configuracionesVisores){

              if(visores[x].idConfiguracion == configuracionesVisores[y].id){
                console.log("Visor:"+ visores[x].id +" logeado");
                visores[x].socket_id = socket.id;
                io.sockets.to(visores[x].socket_id).emit('configuracionVisor', configuracionesVisores[y]);
                
              }
            }



          //console.log("Visor:"+visores[x].id+" logeado");
          actualizarListaServidores();
        }
      }
  });

  socket.on('idTicketero', function(idTicketero) {
      for(var x in ticketeros){
        if(ticketeros[x].idTicketero == idTicketero)
        {
          ticketeros[x].socket_id = socket.id;
          console.log("Ticketero:"+ticketeros[x].idTicketero+" logeado");
        }
      }
  });


  socket.on('solicitarPausa', function(idPausa) {
    var idMotivoPausa = 0;
    var descripcionMotivoPausa = "";
    var keyPausaTemp = 0;
    var tiempoPausaTemp = 0;
    var idModuloTemp = 0;
    for(var x in ejecutivos){

        if(ejecutivos[x].socket_id == socket.id){
        ejecutivos[x].estado = 3;
        idModuloTemp = ejecutivos[x].id;
        ejecutivos[x].keyPausa = Math.floor((Math.random() * 100000000) + 1);


        for(var y in motivosPausa){
          if(motivosPausa[y].id == idPausa){
            idMotivoPausa = motivosPausa[y].id;
            descripcionMotivoPausa = motivosPausa[y].descripcion;
            tiempoPausaTemp = motivosPausa[y].tiempoMinutosAsignado;
            cambioEstadoEjecutivo(ejecutivos[x].idPersonalEjecutivo, ejecutivos[x].id, 3, 0, idPausa);
          }
        }
        console.log("Ejecutivo:"+ejecutivos[x].id+" ha solicitado pausa: "+descripcionMotivoPausa+" tiempo de pausa asignado: "+tiempoPausaTemp);
        io.sockets.to(socket.id).emit('pausaConfirmada', "confirmación");
        //DEBO ALMACENAR EL CAMBIO DE ESTADO EN BBDD
        setTimeout(function(idModulo, keyPausa, idEjecutivo, idPausa, modulo, descripcionPausa){
            var textoAlarma = 'El ejecutivo ha excedido el tiempo de pausa configurado modulo:'+idModulo+" key "+keyPausa;
            for(var z in ejecutivos){
              if(ejecutivos[z].id == idModulo && ejecutivos[z].keyPausa == keyPausa){
                var textoAlarma = `El ejecutivo ${ejecutivos[z].nombreEjecutivo} en el módulo ${modulo} ha excedido el tiempo de pausa: ${descripcionPausa}`;
                activarAlarmas(111031073,0,idEjecutivo,idPausa,textoAlarma)
              }
            }
          }, (tiempoPausaTemp*60*1000), idModuloTemp, ejecutivos[x].keyPausa, ejecutivos[x].idPersonalEjecutivo, idMotivoPausa, ejecutivos[x].modulo, descripcionMotivoPausa);
        }
      
    }
  });

  socket.on('derivar', function(data) {
    var idMotivoOrigen = 0;
    var comentarioTemp = "";
    var idGrupoModuloOrigen = 0;
    var idGrupoModuloDestino = 0;
    var codigoMotivoDestino = "A";
    var idTicket = 0;
    if(data.comentario.length >0){
        comentarioTemp = data.comentario;
      }else{
      comentarioTemp = "";
      }
      for(var x in menu){
        if(menu[x].idMotivo == data.idMotivoDestino){
          codigoMotivoDestino = menu[x].codigo;
        }
      }
    console.log("Derivación de ticket:"+data.numeroMostrar+" con id motivo destino: "+data.idMotivoDestino+" con comentario: "+data.comentario);
    for(var x in tickets_fila){
      if(tickets_fila[x].numeroMostrar == data.numeroMostrar){
        tickets_fila[x].estado = 9;
        tickets_fila[x].llamados = 0;
        tickets_fila[x].comentario = data.comentario;
        for(var y in motivosAtencion){
          if(motivosAtencion[y].id == data.idMotivoDestino){
            tickets_fila[x].codigoDerivado = motivosAtencion[y].codigo;
            tickets_fila[x].idMotivoSucursalDerivado = motivosAtencion[y].idMotivoSucursal;
          }
        }
        idTicket = tickets_fila[x].id;
        for(var y in ejecutivos){
          for(var v in ejecutivos[y].motivos){
            if(ejecutivos[y].motivos[v].idMotivoSucursal == data.idMotivoDestino){
              idGrupoModuloDestino = ejecutivos[y].grupo;
            }
          }
            if(ejecutivos[y].modulo == tickets_fila[x].modulo){
              idGrupoModuloOrigen = ejecutivos[y].grupo;
              idSocketEjecutivo = ejecutivos[y].socket_id;
              cambioEstadoEjecutivo(ejecutivos[y].idPersonalEjecutivo, ejecutivos[y].id, 8, tickets_fila[x].id, 0);
            }
          }
        options.url = "http://localhost:3002/api/derivarTicket/"+idTicket+"/"+data.idMotivoDestino+"/'"+comentarioTemp+"'";
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200){
              cambioEstadoTicket(7, ejecutivos[y].id, idTicket, data.categoria, data.categoria, data.comentario, ejecutivos[y].idPersonalEjecutivo);
            }
        });
      }
    }
    console.log("idGrupoModuloOrigen "+idGrupoModuloOrigen+" idGrupoModuloDestino"+idGrupoModuloDestino);
    var tiempoTrayectoTemp = 0;
    for(var x in gruposOrigenDestino){
      if(gruposOrigenDestino[x].idModuloOrigen == idGrupoModuloOrigen && gruposOrigenDestino[x].idModuloDestino == idGrupoModuloDestino){
        tiempoTrayectoTemp = gruposOrigenDestino[x].tiempoTrayecto;
        console.log("grupoModuloSucursalO: "+idGrupoModuloOrigen+"grupoModuloSucursalD"+idGrupoModuloDestino+"tiempo: "+tiempoTrayectoTemp);
      }
    }
    setTimeout(function(idTicket){
      //console.log("cambio a derivado: "+idTicket);
      for(var x in tickets_fila){
        if(tickets_fila[x].id == idTicket){
          tickets_fila[x].estado = 7;
          console.log("cambio a derivado: "+idTicket);
          for(var w in visores){
            for(var z in visores[w].motivos){
              if(visores[w].motivos[z].idMotivoSucursal == tickets_fila[x].idMotivoSucursal)
              {
                console.log("visor");
                io.sockets.to(visores[w].socket_id).emit('confirmarAccion', "confirmar");
                asignarTicketEjecutivo();
              }
            }
          }
        }
      }
      //console.log(tickets_fila);
    }, ((tiempoTrayectoTemp*60*1000)+500), idTicket);
  });


  socket.on('retomarDistraido', function(idTicketDistraido) {
    console.log(idTicketDistraido);
    for(var x in tickets_fila){
        if(tickets_fila[x].id == idTicketDistraido){
          if(tickets_fila[x].codigoDerivado == "" && tickets_fila[x].estado == 8){
            tickets_fila[x].estado = 1;
          }else{
            tickets_fila[x].estado = 7;
          }
        
        tickets_fila[x].llamados = 0;
        options.url = "http://localhost:3002/api/cambioEstadoTicket/"+idTicketDistraido+"/1";
        console.log("El ticket distraido:"+tickets_fila[x].numeroMostrar+" será retomado");
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            }
        });
        }
      }
      //CONFORMACIÓN DE SEGURIDAD PARA RETOMAR TICKET
      var salir = 0;
      for(var w in visores){
      if(visores[w].estado == 1 && salir == 0)
      {
        io.sockets.to(visores[w].socket_id).emit('confirmarAccion', "confirmar");
        salir = 1;
      }
    }
  });

  socket.on('solicitarAtencionUrgencia', function(data) {
    console.log(data);
    var idModuloTemp = '';
    var estadoTicketTemp = 0;
    for(var x in ejecutivos){
          if(ejecutivos[x].socket_id == socket.id){
            idModuloTemp = ejecutivos[x].modulo;
          }
        }
    if(data.opcion == '0'){
      for(var x in motivosAtencion){
        if(motivosAtencion[x].codigo == 'Z' || motivosAtencion[x].codigo == 'z'){
          //console.log(motivosAtencion[x].idMotivoSucursal);
          console.log("Solicitud de ticket con id motivo:"+motivosAtencion[x].id);
          options.url = "http://localhost:3002/api/generaNuevoTicket/"+motivosAtencion[x].id+"/0";
          request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var proj = JSON.parse(body);
                console.log(JSON.stringify(proj[0][0]));
                  var numero_mostrar = proj[0][0].motivo+("000" + proj[0][0].numeroCorrelativoTicket).substr(-3,3);
                for(var y in tickets_fila){
                  if(tickets_fila[y].numeroMostrar == numero_mostrar){
                    tickets_fila.splice(y, 1);
                  }
                }
            ultimoIdTicket = proj[0][0].id;
                tickets_fila.push(
                {
                  id : proj[0][0].id,
                  estado: '10',
                  codigo : proj[0][0].motivo,
                  numeroCorrelativo : proj[0][0].numeroCorrelativoTicket,
                  numeroMostrar : numero_mostrar,
                  modulo : idModuloTemp,
                  llamados: 0,
                  comentario: "",
                  codigoDerivado:"",
                  fechaGenerado:new Date(),
                  idMotivoSucursal : proj[0][0].idMotivoSucursal,
                  idMotivoSucursalDerivado : ""
                });
                cambioEstadoTicket(1, 0, proj[0][0].id, 0, 0, "0",0);
              }
          });
          console.log(tickets_fila);
        }
      }
      io.sockets.to(socket.id).emit('confirmacionAtencionUrgencia', {respuesta:'1'});
      setTimeout(function(){
        asignarTicketEjecutivo();
      }, 1000);
    }
    var ticketValido = 0;
    if(data.opcion == '1'){
      for(var x in tickets_fila){
        if(tickets_fila[x].codigo == data.codigo && tickets_fila[x].numeroCorrelativo == data.numero){
          ticketValido = 1;
          estadoTicketTemp = tickets_fila[x].estado;
        }
      }
      if(ticketValido == 1 && (estadoTicketTemp == 6 || estadoTicketTemp == 1 || estadoTicketTemp == 8)){
        console.log('Ticket valido');
        for(var x in tickets_fila){
          if(tickets_fila[x].codigo == data.codigo && tickets_fila[x].numeroCorrelativo == data.numero){
            tickets_fila[x].estado = 10;
            tickets_fila[x].modulo = idModuloTemp;
            cambioEstadoTicket(10, 0, tickets_fila[x].id, 0, 0, "0",0);
          }
        }
        io.sockets.to(socket.id).emit('confirmacionAtencionUrgencia', {respuesta:'1'});
        setTimeout(function(){
          asignarTicketEjecutivo();
        }, 500);
        
      }else{
        console.log('Ticket no valido');
        io.sockets.to(socket.id).emit('confirmacionAtencionUrgencia', {respuesta:'0'});
      }
    }
  });


  socket.on('solicitarDescartarTicket', function(data) {
    console.log(data);
    var idModuloTemp = '';
    var ModuloTemp = '';
    var idEjecutivotemp = '';
    var estadoTicketTemp = 0;
    var ticketValido = 0;
    for(var x in ejecutivos){
        if(ejecutivos[x].socket_id == socket.id){
          idModuloTemp = ejecutivos[x].id;
          ModuloTemp = ejecutivos[x].modulo;
          idEjecutivotemp = ejecutivos[x].idPersonalEjecutivo;
        }
      }
      for(var x in tickets_fila){
      if(tickets_fila[x].codigo == data.codigo && tickets_fila[x].numeroCorrelativo == data.numero && tickets_fila[x].estado == 1){
        ticketValido = 1;
        estadoTicketTemp = 1;
        tickets_fila[x].estado = 8;
        cambioEstadoTicket(8, idModuloTemp, tickets_fila[x].id, 0, 0, "0", idEjecutivotemp);
      }
      if(tickets_fila[x].codigo == data.codigo && tickets_fila[x].numeroCorrelativo == data.numero && (tickets_fila[x].estado != 1 && estadoTicketTemp == 0)){
        ticketValido = 2;
      }
    }
    io.sockets.to(socket.id).emit('confirmacionDescartarTicket', {respuesta : ticketValido});

  });


  socket.on('impresion', function(idMotivo) {
    impresion(idMotivo);
  });

  function impresion(data){
    if(ticketOcupado == 0){
      ticketOcupado = 1;
      var ticketsFila = 0;
      for(var x in motivosAtencion){
        if(motivosAtencion[x].id == data.idMotivo){
          ticketsFila = motivosAtencion[x].largoCola;
        }
      }
      console.log("Solicitud de ticket con id motivo:"+data.idMotivo);
      options.url = "http://localhost:3002/api/generaNuevoTicket/"+data.idMotivo+"/'"+data.rut+"'";
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var proj = JSON.parse(body);
            console.log(JSON.stringify(proj[0][0]));
            var numeroMostrar = proj[0][0];
            io.sockets.to(socket.id).emit('confirmacionImpresion', {numeroMostrar,ticketsFila});
          }
          ticketOcupado = 0;
      });
    }else{
      setTimeout(function(){
        console.log('Generación de tickets ocupado');
        impresion(data.idMotivo);
      }, 200);
    }
  }

    socket.on('nuevoTicket', function(data) {
      console.log("Nuevo ticket generado");
    options.url = "http://localhost:3002/api/listarTickets/"+ultimoIdTicket;
    console.log("tickets en fila:");
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          contadorTickets++;
          var proj = JSON.parse(body);
          for(var x in proj){
            if(ultimoIdTicket < proj[x].id)
            {
              ultimoIdTicket = proj[x].id;
            }
            var numero_mostrar = proj[x].codigoDespliegue+("000" + proj[x].numeroCorrelativoTicket).substr(-3,3);
            for(var y in tickets_fila){
              if(tickets_fila[y].numeroMostrar == numero_mostrar){
                tickets_fila.splice(y, 1);
              }
            }
            tickets_fila.push(
            {
              id : proj[x].id,
              estado: proj[x].estado,
              codigo : proj[x].codigoDespliegue,
              numeroCorrelativo : proj[x].numeroCorrelativoTicket,
              numeroMostrar : numero_mostrar,
              modulo : proj[x].modulo,
              llamados: 0,
              comentario: "",
              codigoDerivado:"",
              fechaGenerado:new Date(),
              idMotivoSucursal : proj[x].idMotivoSucursal,
              idMotivoSucursalDerivado : ""
            });
            rebalseActivado = 0;
            if(rebalse == 1){
              for(var y in motivosAtencion){
                if(motivosAtencion[y].largoCola >= motivosAtencion[y].cantidadActivarRebalse){
                  motivosAtencion[y].rebalse = 1;
                  rebalseActivado = 1;
                  console.log("Activado rebalse para motivo: "+motivosAtencion[y].id);
                }else{
                  motivosAtencion[y].rebalse = 0;
                }
              }
            }

            /*
            for(var y in motivosAtencion){
              if(motivosAtencion[y].codigo == proj[x].codigoDespliegue){
                motivosAtencion[y].atencionesHoy = motivosAtencion[y].atencionesHoy + 1;
              }
            }*/
            console.log("Ticket número:"+numero_mostrar+" Estado:"+proj[x].estado);
            console.log(motivosAtencion);
            //console.log(tickets_fila);
            cambioEstadoTicket(1, 0, proj[x].id, 0, 0, "0",0);
          }
          io.sockets.to(socket.id).emit('confirmacionNuevoTicket', "confirmación");
      asignarTicketEjecutivo();
          actualizarDashboard(0);
        }
    });
  });


  socket.on('ticketDesplegado', function(data) {
      console.log("Visor desplegó ticket:"+data);
      //aqui enviar al ejecutivo conformación de que ticket se desplegó
      //cambiar estado a ticket a desplegado en visor
      var idTicket = 0;
      var idSocketEjecutivo = "";
      var modulo = 0;
      var comentarioTemp = "";
      var codigoMotivoTemp = "";
      var codigoDerivadoTemp = "";
      var idMotivoSucursalDerivadoTemp = "";
      var idMotivoSucursalTemp = "";
      for(var x in tickets_fila){
        if(tickets_fila[x].numeroMostrar == data){
          comentarioTemp = tickets_fila[x].comentario;
          codigoMotivoTemp = tickets_fila[x].codigo;
          codigoDerivadoTemp = tickets_fila[x].codigoDerivado;
          idMotivoSucursalDerivadoTemp = tickets_fila[x].idMotivoSucursalDerivado;
          idMotivoSucursalTemp = tickets_fila[x].idMotivoSucursal;
          idTicket = tickets_fila[x].id;
          if(tickets_fila[x].estado == 4){
            tickets_fila[x].estado = 5;
          }
          for(var y in ejecutivos){
            if(ejecutivos[y].modulo == tickets_fila[x].modulo){
              idSocketEjecutivo = ejecutivos[y].socket_id;
            }
          }
          for(var y in filaVisor){
            if(filaVisor[y].id == tickets_fila[x].id){
              filaVisor.splice(y, 1);
            }
          }
        }
      }
      options.url = "http://localhost:3002/api/cambioEstadoTicket/"+idTicket+"/5";
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //aqui debo enviar ticket a ejecutivo
          // aqui debo consultar si el ticket no ha sido atendido por ejecutico se debe rellamar
          console.log("Ticket:"+data+" enviado a ejecutivo:"+idSocketEjecutivo);
          io.sockets.to(idSocketEjecutivo).emit('ticketDesplegado', {numeroTicket : data, comentario : comentarioTemp, codigo:codigoMotivoTemp, codigoDerivado:codigoDerivadoTemp, idMotivoSucursal : idMotivoSucursalTemp, idMotivoSucursalDerivado : idMotivoSucursalDerivadoTemp});
        }
    });
  });

  socket.on('tiempoDespliegueFinalizado', function(data) {
      console.log("A pasado el tiempo de despliegue para el ticket:"+data);
      //aqui enviar al ejecutivo conformación de que ticket se desplegó
      //cambiar estado a ticket a desplegado en visor
  });


  //Finalizar la atención del ejecutivo
  socket.on('finalizarSesion', function(data) {
    console.log("finalizando sesión");
    for(var x in ejecutivos){
      if(ejecutivos[x].socket_id == socket.id){
        cambioEstadoEjecutivo(ejecutivos[x].idPersonalEjecutivo, ejecutivos[x].id, 2, 0, 0);
        io.sockets.to(socket.id).emit('confirmacionFinalizacionSesion', "confirmacionFinalizacionSesion");
        ejecutivos[x].socket_id = "";
        ejecutivos[x].ip = 0;
        ejecutivos[x].nombreEjecutivo = "";
        ejecutivos[x].idPersonalEjecutivo = 0;
        ejecutivos[x].estado = 0;
        for(var y in ejecutivos[x].motivos){
          for(var v in motivosAtencion){
            if(ejecutivos[x].motivos[y].idMotivoSucursal == motivosAtencion[v].idMotivoSucursal){
              motivosAtencion[v].modulosAtendiendo = motivosAtencion[v].modulosAtendiendo - 1;
              console.log("Motivo: "+motivosAtencion[v].codigo+" - modulos habilitados: "+motivosAtencion[v].modulosAtendiendo);
              actualizarDashboard(0);
            }
          }
        }
      }
    }
  });



  //Comienza la atención del ejecutivo
  socket.on('empezarAtencion', function(data) {
    console.log("Ejecutivo: comienza atención del ticket:"+data);
      var idTicket = 0;
      var idSocketEjecutivo = "";
      var modulo = 0;
  var tiempoMaximoAtencionTemp = 0;
      var idMotivoTemp = 0;
      var nombreMotivoTemp = '';
      actualizarDashboard(0);
      for(var x in tickets_fila){
        if(tickets_fila[x].numeroMostrar == data){
          idTicket = tickets_fila[x].id;
          tickets_fila[x].estado = 3;
          options.url = "http://localhost:3002/api/cambioEstadoTicket/"+idTicket+"/3";
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            }
        });
        for(var y in filaVisor){
            if(filaVisor[y].id == tickets_fila[x].id){
              filaVisor.splice(y, 1);
            }
          }
        for(var y in motivosAtencion){
            if(motivosAtencion[y].idMotivoSucursal == tickets_fila[x].idMotivoSucursal){
              idMotivoTemp = motivosAtencion[y].id;
              nombreMotivoTemp = motivosAtencion[y].nombre;
              tiempoMaximoAtencionTemp = motivosAtencion[y].tiempoMaximoAtencion;
            }
          }
          for(var y in ejecutivos){
            if(ejecutivos[y].modulo == tickets_fila[x].modulo){
            var textoAlarma = '';
              ejecutivos[y].idAtencionActual = idTicket
              setTimeout(function(modulo, idTicket, idMotivo, nombreMotivo){
                console.log('EL EJECUTIVO HA EXCEDIDO EL TIEMPO DE ATENCIÓN');
                for(var z in ejecutivos){
                  if(ejecutivos[z].modulo == modulo && ejecutivos[z].idAtencionActual == idTicket){
                    console.log('EL EJECUTIVO HA EXCEDIDO EL TIEMPO DE ATENCIÓN CONFIGURADO MODULO:'+modulo+" KEY "+idTicket);
                    textoAlarma = `El ejecutivo ${ejecutivos[z].nombreEjecutivo} en el módulo ${modulo} ha excedido el tiempo de atención para el motivo: ${nombreMotivo}`;
                    activarAlarmas(111031071,idMotivo, ejecutivos[z].idPersonalEjecutivo, 0, textoAlarma, nombreMotivoTemp)
                  }
                }
              }, (tiempoMaximoAtencionTemp*60*1000), ejecutivos[y].modulo, idTicket, idMotivoTemp, nombreMotivoTemp);
              cambioEstadoEjecutivo(ejecutivos[y].idPersonalEjecutivo, ejecutivos[y].id, 7, tickets_fila[x].id, 0);
              cambioEstadoTicket(3, ejecutivos[y].id, tickets_fila[x].id, 0, 0, "0",  ejecutivos[y].idPersonalEjecutivo);
            }
          }

        }
      }
  });


  //Finaliza la atención el ejecutivo
  socket.on('finalizacionAtencion', function(data) {
      console.log("Ejecutivo: finaliza atención del ticket:"+JSON.stringify(data));
      var idTicket = 0;
      var idSocketEjecutivo = "";
      var comentarioTemp = "";
      var modulo = 0;
      actualizarDashboard(0);
      for(var x in tickets_fila){
        if(tickets_fila[x].numeroMostrar == data.numeroMostrar && tickets_fila[x].estado != 6){
          idTicket = tickets_fila[x].id;
          tickets_fila[x].estado = 6;
          for(var y in ejecutivos){
            if(ejecutivos[y].modulo == tickets_fila[x].modulo){
          ejecutivos[y].idAtencionActual = 0;
              idSocketEjecutivo = ejecutivos[y].socket_id;
              cambioEstadoEjecutivo(ejecutivos[y].idPersonalEjecutivo, ejecutivos[y].id, 8, tickets_fila[x].id, 0);
              cambioEstadoTicket(6, ejecutivos[y].id, tickets_fila[x].id, 0, data.categoria, data.comentario, ejecutivos[y].id);
            }
          }
        }
      }
      if(data.comentario.length >0){
        comentarioTemp = data.comentario;
      }else{
      comentarioTemp = "NuLL"
      }
      console.log(idTicket+"/"+data.categoria+"/"+data.comentario);
    options.url = "http://localhost:3002/api/finalizacionAtencion/"+idTicket+"/"+data.categoria+"/'"+comentarioTemp+"'";
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          io.sockets.to(idSocketEjecutivo).emit('confirmacionFinalizacionAtencion', {numeroTicket : data});
        }
    });
  });
  socket.on('volverLlamar', function(numeroMostrar) {
    for(var x in ejecutivos){
      if(ejecutivos[x].socket_id == socket.id){
        console.log("El ejecutivo:"+ejecutivos[x].id+" solicitó volver a llamar al ticket:"+numeroMostrar);
      }
    }
    for(var x in tickets_fila){
      if(tickets_fila[x].numeroMostrar == numeroMostrar){
        volver_llamar(tickets_fila[x].id,1,tickets_fila[x].modulo);
      }
    }
  });
  socket.on('descartarTicket', function(data) {
    for(var x in ejecutivos){
      if(ejecutivos[x].socket_id == socket.id){
        console.log("El ejecutivo:"+ejecutivos[x].id+" solicitó descartar al ticket:"+data.numeroMostrar);
      }
    }
    for(var x in tickets_fila){
      if(tickets_fila[x].numeroMostrar == data.numeroMostrar && tickets_fila[x].estado == 5){
        volver_llamar(tickets_fila[x].id,2);
      }
    }
  });
  socket.on('listarDistraidos', function(data) {
    var ticketsDistraidosTemp = [];
    var idEjecutivoTemp = 0;
    //console.log(tickets_fila);
    for(var x in ejecutivos){
      if(ejecutivos[x].socket_id == socket.id){
        idEjecutivoTemp = ejecutivos[x].idPersonalEjecutivo;
      }
    }
    for(var x in tickets_fila){
      if(tickets_fila[x].estado == 8){
        for(var y in ejecutivos){
          for(var v in ejecutivos[y].motivos){
            if((ejecutivos[y].motivos[v].idMotivoSucursal == tickets_fila[x].idMotivoSucursal || ejecutivos[y].motivos[v].idMotivoSucursal == tickets_fila[x].idMotivoSucursalDerivado) && idEjecutivoTemp == ejecutivos[y].idPersonalEjecutivo){
              console.log("numeroMostrar: " + tickets_fila[x].numeroMostrar + " idEjecutivo: "+idEjecutivoTemp+" codigo: "+tickets_fila[x].codigo+" veces: "+ v);
              var flag1 = 0;
              for(var z in ticketsDistraidosTemp){
                if(ticketsDistraidosTemp[z].id == tickets_fila[x].id){
                  flag1 = 1;
                }
              }
              if(flag1 == 0){
                ticketsDistraidosTemp.push({id:tickets_fila[x].id, codigo:tickets_fila[x].codigo, numeroMostrar:tickets_fila[x].numeroMostrar, idMotivoSucursal : tickets_fila[x].idMotivoSucursal});
              }
            }
          }
        }
      }
    }
    io.sockets.to(socket.id).emit('confirmarListarDistraidos', ticketsDistraidosTemp);
  });

  socket.on('listarTicketsFila', function(data) {
    var listarTicketsFilaTemp = [];
    var idEjecutivoTemp = 0;
    //console.log(tickets_fila);
    for(var x in ejecutivos){
      if(ejecutivos[x].socket_id == socket.id){
        idEjecutivoTemp = ejecutivos[x].idPersonalEjecutivo;
      }
    }
    for(var x in ejecutivos){
      if(ejecutivos[x].idPersonalEjecutivo == idEjecutivoTemp){
        for(var y in ejecutivos[x].motivos){
          for(var z in motivosAtencion){
            if(motivosAtencion[z].idMotivoSucursal == ejecutivos[x].motivos[y].idMotivoSucursal){
              listarTicketsFilaTemp.push({codigo:motivosAtencion[z].codigo, nombre:motivosAtencion[z].nombre, largoCola:motivosAtencion[z].largoCola, idMotivoSucursal : motivosAtencion[z].idMotivoSucursal});
            }
          }
        }
      }
    }
    io.sockets.to(socket.id).emit('confirmarlistarTicketsFila', listarTicketsFilaTemp);
  });






  socket.on('accion', function(data) {

    //VISOR DISPONIBLE
    if(data.accion == "visorDisponible"){
      for(var x in visores){
        if(visores[x].socket_id == socket.id){
          visores[x].estado = 1;
          //console.log(socket.id);
          console.log("Visor:"+visores[x].id+" disponible");
        }
      }
      asignarTicketVisor();
    }

    //EJECUTIVO DISPONIBLE
    if(data.accion == "ejecutivoDisponible"){
      for(var x in ejecutivos){
        if(ejecutivos[x].socket_id == socket.id){
          if(ejecutivos[x].estado == 3){
            cambioEstadoEjecutivo(ejecutivos[x].idPersonalEjecutivo, ejecutivos[x].id, 4, 0, 0);
            ejecutivos[x].keyPausa = 0;
            console.log("Ejecutivo: " +ejecutivos[x].id+" ha finalizado la pausa");
          }
          ejecutivos[x].estado = 1;
          cambioEstadoEjecutivo(ejecutivos[x].idPersonalEjecutivo, ejecutivos[x].id, 5, 0, 0);
          console.log("Ejecutivo:"+ejecutivos[x].id+" disponible");
        }
      }
      asignarTicketEjecutivo();
    }
  });

  socket.on('cerrarJornada', function(data) {
    console.log("cerrarJornada");
    console.log(JSON.stringify(data));
    console.log(idSucursal);
    if(data.sucursal == idSucursal){
      cerrarJornada();
    }
  });

  socket.on('descartarTicketsMasivos', function(data) {
    var idTicketDesde = 0;
    var idTicketHasta = 0;
    var idMotivoSucursalTemp = 0;

    console.log("descartarTicketsMasivos");
    console.log(JSON.stringify(data));

    if(data.idSucursal == idSucursal){
      //console.log(tickets_fila);
      for(var x in motivosAtencion){
        console.log(motivosAtencion[x].id+' - '+data.idMotivo);
        if(motivosAtencion[x].id == data.idMotivo){
          idMotivoSucursalTemp = motivosAtencion[x].idMotivoSucursal;
        }
      }
      for(var x in tickets_fila){
        if(idMotivoSucursalTemp == tickets_fila[x].idMotivoSucursal && data.desde == tickets_fila[x].numeroCorrelativo){
          idTicketDesde = tickets_fila[x].id;
        }
        if(idMotivoSucursalTemp == tickets_fila[x].idMotivoSucursal && data.hasta == tickets_fila[x].numeroCorrelativo){
          idTicketHasta = tickets_fila[x].id;
        }
        if(idMotivoSucursalTemp == tickets_fila[x].idMotivoSucursal && tickets_fila[x].numeroCorrelativo >= data.desde && tickets_fila[x].numeroCorrelativo <= data.hasta && tickets_fila[x].estado == 1){
          tickets_fila[x].estado = 8;
        }
      }
      //console.log(tickets_fila);
      options.url = "http://localhost:3002/api/descartarTicketsMasivos/"+idMotivoSucursalTemp+"/"+idTicketDesde+"/"+idTicketHasta;
      console.log(options.url);
      request(options, function (error, response, body) {
        /*
          if (!error && response.statusCode == 200) {
            io.sockets.to(socket.id).emit('mensajeOk', {mensaje:'ok'});
          }
          */
      });
    }
  });


  socket.on('disconnect', function() {
      for(var x in ejecutivos){
        if(ejecutivos[x].socket_id == socket.id){
        console.log('El ejecutivo:'+ejecutivos[x].id+"ha salido del sistema");
          for(var w in ejecutivos[x].motivos){
          for(var v in motivosAtencion){
            if(ejecutivos[x].motivos[w].idMotivoSucursal == motivosAtencion[v].idMotivoSucursal){
              motivosAtencion[v].modulosAtendiendo = parseInt(motivosAtencion[v].modulosAtendiendo) - 1;
              console.log("Motivo: "+motivosAtencion[v].codigo+" - modulos atendiendo: "+motivosAtencion[v].modulosAtendiendo);
              actualizarDashboard(0);
            }
          }
        }
          if(ejecutivos[x].estado == 1){
            ejecutivos[x].estado = 0;
          }
        }
      }
      for(var x in visores){
        if(visores[x].socket_id == socket.id){
        console.log("El visor:"+visores[x].id+"ha salido del sistema");
          visores[x].estado = 0;
        }
      }
      //CONFORMACIÓN DE SEGURIDAD PARA QUE OTRO VISOR TOME EL MANDO
      var salir = 0;
      for(var w in visores){
      if(visores[w].estado == 1 && salir == 0)
      {
        io.sockets.to(visores[w].socket_id).emit('confirmarAccion', "confirmar");
        salir = 1;
      }
    }

    //EVENTO QUE CONTROLA LA DESCONEXIÓN DE LOS SERVIDORES
      var nuevoMaestro = 0;
      for(var x in servidores){
        if(servidores[x].socketId == socket.id){
        console.log("desconexión servidor:"+servidores[x].idServidor);
        servidores[x].estado = 0;
        if(servidores[x].maestro == 1){
          servidores[x].maestro = 0;
          for(var y in servidores){
            if(servidores[y].estado == 1 && nuevoMaestro == 0){
              nuevoMaestro = 1;
              cambioMaestro = 1;
              if(servidores[y].idServidor == idServidorLocal){
                console.log('Servidor local - nuevo maestro');
                servidorMaestro = 1;
                // ENVIAR COMANDO PARA PRESENTARSE COMO NUEVO MAESTRO
                // ACTIVAR SERVICIOS COMO SERVIDOR
                configuracionInicial();
                for(var z in servidores){
                  if(servidores[z].local == 0 && servidores[z].estado == 1){
                    servidores[z].maestro = 1;
                    servidores[z].socket.emit('maestro',{servidor:idServidorLocal});
                  }
                }
              }
            }
          }
        }
        }
      }
  });


});

function asignarTicketEjecutivo(){

  if(ocupado3 == 0){
    if(llamadoIntercalado == 1){
      var filaEjecutivosTemp = filaEjecutivos;
      filaEjecutivosTemp.sort(function(a, b){
        return a.cantidadAtenciones - b.cantidadAtenciones;
      });
      //console.log(ejecutivosTemp);
      filaEjecutivos = filaEjecutivosTemp;
    }
    console.log("asignarTicketEjecutivo");
    ocupado3 = 1;
    for(var l in filaEjecutivos){
      for(var w in ejecutivos){
        if(filaEjecutivos[l].id == ejecutivos[w].id){
          var ticket_asignado = 0;
          var idEjecutivoTemp = 0;
          var idPersonalEjecutivoTemp = 0;
          var puedeAtenderRebalse = 1;
          var moduloMotivoRebalse = 0;
          var ticketsNoRebalse = 0;
            //console.log(equipos[x].ip);

          if(ejecutivos[w].estado == 1){

            //SISTEMA DE REBALSE
            rebalseActivado = 0;
            if(rebalse == 1){
                for(var y in motivosAtencion){
                  if(motivosAtencion[y].largoCola >= motivosAtencion[y].cantidadActivarRebalse){
                    motivosAtencion[y].rebalse = 1;
                    rebalseActivado = 1;
                    console.log("Activado rebalse para motivo: "+motivosAtencion[y].id);
                  }else{
                    motivosAtencion[y].rebalse = 0;
                  }
                }
            }

            if(rebalse == 1 && rebalseActivado == 1){
              for(var x in ejecutivos[w].motivos){
                for(var y in motivosAtencion){
                  if(motivosAtencion[y].idMotivoSucursal == ejecutivos[w].motivos[x].idMotivoSucursal){
                    if((motivosAtencion[y].tiempoMaximoEsperaCola * 60) <= motivosAtencion[y].esperaColaActualSegundos && motivosAtencion[y].rebalse == 0){
                      puedeAtenderRebalse = 0;
                      console.log("Modulo: "+ejecutivos[w].id+" no puede atender rebalse"+motivosAtencion[y].tiempoMaximoEsperaCola);
                    }
                    if(motivosAtencion[y].rebalse == 1 && ejecutivos[w].motivos[x].atiendeRebalse == 1){
                      moduloMotivoRebalse = 1;
                    }
                    if(motivosAtencion[y].largoCola >= 1 &&  motivosAtencion[y].rebalse == 0 && ejecutivos[w].motivos[x].atiendeRebalse == 0){
                      ticketsNoRebalse = 1;
                    }
                  }
                }
              }
            }


              //SISTEMA DE PRIORIDAD
              var maximaPrioridadTemp = 10;
              for(var y in motivosAtencion){
                if(motivosAtencion[y].largoCola > 0){
                  for(var x in ejecutivos[w].motivos){
                    if(motivosAtencion[y].idMotivoSucursal == ejecutivos[w].motivos[x].idMotivoSucursal){
                      if(ejecutivos[w].motivos[x].prioridad < maximaPrioridadTemp){
                        maximaPrioridadTemp = ejecutivos[w].motivos[x].prioridad;
                      }
                      console.log('motivosAtencion[y].idMotivoSucursal: '+motivosAtencion[y].idMotivoSucursal+' motivosAtencion[y].prioridad: '+ejecutivos[w].motivos[x].prioridad +'maximaPrioridadTemp: '+ maximaPrioridadTemp);
                    }
                  }
                }
              }
            


            for(var x in tickets_fila){
              if(tickets_fila[x].estado == 10 && ticket_asignado == 0 && tickets_fila[x].modulo == ejecutivos[w].modulo && ejecutivos[w].estado == 1){
                for(var z in ejecutivos[w].motivos){
                  if(ejecutivos[w].motivos[z].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && ticket_asignado == 0){
                  ejecutivos[w].motivos[z].cantidadAtenciones++;
                  ejecutivos[w].cantidadAtenciones++;
                  filaEjecutivos[l].cantidadAtenciones++;

                  var idEjecutivoTemp2 = filaEjecutivos[l].id;
                  var cantidadAtencionesTemp2 = filaEjecutivos[l].cantidadAtenciones;
                  filaEjecutivos.splice(l, 1);
                  filaEjecutivos.push({
                    id:idEjecutivoTemp2,
                    cantidadAtenciones:cantidadAtencionesTemp2
                  });
                  for(var m in personalEjecutivo){
                    if(ejecutivos[w].idPersonalEjecutivo == personalEjecutivo[m].id){
                      personalEjecutivo[m].numeroActual = tickets_fila[x].numeroMostrar;
                    }
                  }
                  for(var m in motivosAtencion){
                    if(tickets_fila[x].idMotivoSucursal == motivosAtencion[m].idMotivoSucursal){
                      motivosAtencion[m].numeroActual = tickets_fila[x].numeroMostrar;
                    }
                  }
                  ticket_asignado = 1;
                  idEjecutivoTemp = ejecutivos[w].id;
                  idPersonalEjecutivoTemp = ejecutivos[w].idPersonalEjecutivo;
                  tickets_fila[x].estado = 4;
                    filaVisor.push({id:tickets_fila[x].id});
                  ejecutivos[w].estado = 2;
                  cambioEstadoEjecutivo(ejecutivos[w].idPersonalEjecutivo, idEjecutivoTemp, 6, tickets_fila[x].id, 0);
                  //AQUI DEBO SETEAR LOS ESTADOS EN LOS EJECUTIVOS Y EN LOS TICKETS
                  //PARA RELACIONAR EL TICKET CON EL USUARIO EL ALG. ME EL TICKET
                  console.log("Se asignó a el ejecutivo:"+idEjecutivoTemp+" el ticket:"+tickets_fila[x].numeroMostrar);
                  cambioEstadoTicket(2, idEjecutivoTemp, tickets_fila[x].id, 0, 0, "0", idPersonalEjecutivoTemp);
                  io.sockets.to(ejecutivos[w].socket_id).emit('ticketAsignado', {codigo: tickets_fila[x].codigo, numeroTicket : tickets_fila[x].numeroMostrar, codigoDerivado: tickets_fila[x].codigoDerivado, idMotivoSucursal : tickets_fila[x].idMotivoSucursal, idMotivoSucursalDerivado : tickets_fila[x].idMotivoSucursalDerivado});
                }
              }
            }


              if((tickets_fila[x].estado == 7)&& ticket_asignado == 0){
                for(var z in ejecutivos[w].motivos){
                  //console.log(tickets_fila);
                  if(((ejecutivos[w].motivos[z].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && tickets_fila[x].estado == 1)|| (ejecutivos[w].motivos[z].idMotivoSucursal == tickets_fila[x].idMotivoSucursalDerivado && tickets_fila[x].estado == 7)) && ticket_asignado === 0)
                  {
                    ejecutivos[w].motivos[z].cantidadAtenciones++;
                    ejecutivos[w].cantidadAtenciones++;
                    filaEjecutivos[l].cantidadAtenciones++;

                    var idEjecutivoTemp2 = filaEjecutivos[l].id;
                    var cantidadAtencionesTemp2 = filaEjecutivos[l].cantidadAtenciones;
                    filaEjecutivos.splice(l, 1);
                    filaEjecutivos.push({
                      id:idEjecutivoTemp2,
                      cantidadAtenciones:cantidadAtencionesTemp2
                    });

                    for(var m in personalEjecutivo){
                      if(ejecutivos[w].idPersonalEjecutivo == personalEjecutivo[m].id){
                        personalEjecutivo[m].numeroActual = tickets_fila[x].numeroMostrar;
                      }
                    }
                    for(var m in motivosAtencion){
                      if(tickets_fila[x].idMotivoSucursal == motivosAtencion[m].idMotivoSucursal){
                        motivosAtencion[m].numeroActual = tickets_fila[x].numeroMostrar;
                      }
                    }
                    //console.log(JSON.stringify(ejecutivos));
                    ticket_asignado = 1;
                    idEjecutivoTemp = ejecutivos[w].id;
                    idPersonalEjecutivoTemp = ejecutivos[w].idPersonalEjecutivo;
                    tickets_fila[x].estado = 4;
                      filaVisor.push({id:tickets_fila[x].id});
                    ejecutivos[w].estado = 2;
                    tickets_fila[x].modulo = ejecutivos[w].modulo;
                    cambioEstadoEjecutivo(ejecutivos[w].idPersonalEjecutivo, idEjecutivoTemp, 6, tickets_fila[x].id, 0);
                    //AQUI DEBO SETEAR LOS ESTADOS EN LOS EJECUTIVOS Y EN LOS TICKETS
                    //PARA RELACIONAR EL TICKET CON EL USUARIO EL ALG. ME EL TICKET
                    console.log("Se asignó a el ejecutivo:"+idEjecutivoTemp+" el ticket:"+tickets_fila[x].numeroMostrar);
                    cambioEstadoTicket(2, idEjecutivoTemp, tickets_fila[x].id, 0, 0, "0", idPersonalEjecutivoTemp);
                    io.sockets.to(ejecutivos[w].socket_id).emit('ticketAsignado', {codigo: tickets_fila[x].codigo, numeroTicket : tickets_fila[x].numeroMostrar, codigoDerivado: tickets_fila[x].codigoDerivado, idMotivoSucursal : tickets_fila[x].idMotivoSucursal, idMotivoSucursalDerivado : tickets_fila[x].idMotivoSucursalDerivado});
                  }
                }
              }
            }
            //TICKET NUEVO POR ATENDER
            for(var x in tickets_fila){
              var motivoRebalseTemp = 0;
              if(rebalse == 1){
                for(var y in motivosAtencion){
                  if(tickets_fila[x].idMotivoSucursal == motivosAtencion[y].idMotivoSucursal){
                    if(motivosAtencion[y].rebalse == 1){
                      motivoRebalseTemp = 1;
                    }
                  }
                }
              }
              
              if((tickets_fila[x].estado == 1)&& ticket_asignado == 0){
                for(var z in ejecutivos[w].motivos){
                  console.log(rebalse +'&&'+ puedeAtenderRebalse  +'&&'+ motivoRebalseTemp+'&&'+rebalseActivado +'&&'+ ticketsNoRebalse +'&&'+ ejecutivos[w].motivos[z].prioridad +'&&'+ maximaPrioridadTemp);
                  if(((ejecutivos[w].motivos[z].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && tickets_fila[x].estado == 1)) && ticket_asignado == 0 && (ejecutivos[w].motivos[z].prioridad <= maximaPrioridadTemp) && ((rebalse == 0 && ejecutivos[w].motivos[z].atiendeRebalse == 0)|| (rebalseActivado == 0 && ejecutivos[w].motivos[z].atiendeRebalse == 0)|| (puedeAtenderRebalse == 0 && ejecutivos[w].motivos[z].atiendeRebalse == 0)|| (rebalse == 1 &&  motivoRebalseTemp == 0 && ejecutivos[w].atencionNoRebalse == 0 && ejecutivos[w].motivos[z].atiendeRebalse == 0) || (rebalse == 1 && puedeAtenderRebalse == 1 && motivoRebalseTemp == 1 && (ticketsNoRebalse == 0 || ejecutivos[w].atencionNoRebalse == 1 && ejecutivos[w].motivos[z].atiendeRebalse == 1) )))
                  {
                    
                    if(rebalse == 1 && motivoRebalseTemp == 0 && moduloMotivoRebalse == 1){
                      ejecutivos[w].atencionNoRebalse = 1;
                    }
                    if(rebalse == 1 && rebalseActivado == 1){
                      for(var y in motivosAtencion){
                        //INCREMENTA LA CANTIDAD DE TICKETS EN REBALSE ATENDIDOS
                        if(tickets_fila[x].idMotivoSucursal == motivosAtencion[y].idMotivoSucursal ){
                          if(motivosAtencion[y].rebalse == 1){
                            motivosAtencion[y].cantidadAtencionesActualesRebalse = motivosAtencion[y].cantidadAtencionesActualesRebalse + 1;
                          }
                        }
                        //SI SUPERA LA CANTIDAD A ATENDER EN REBALSE REINICIA LOS CONTADORES
                        if(motivosAtencion[y].cantidadAtencionesActualesRebalse >= motivosAtencion[y].cantidadAtencionesRebalse){
                          motivosAtencion[y].cantidadAtencionesActualesRebalse = 0;
                          for(var r in ejecutivos){
                            ejecutivos[r].atencionNoRebalse = 0;
                          }
                        }
                      }
                    }
                    ejecutivos[w].motivos[z].cantidadAtenciones++;
                    ejecutivos[w].cantidadAtenciones++;
                    filaEjecutivos[l].cantidadAtenciones++;
                    var idEjecutivoTemp2 = filaEjecutivos[l].id;
                    var cantidadAtencionesTemp2 = filaEjecutivos[l].cantidadAtenciones;
                    filaEjecutivos.splice(l, 1);
                    filaEjecutivos.push({
                      id:idEjecutivoTemp2,
                      cantidadAtenciones:cantidadAtencionesTemp2
                    });



                    for(var m in personalEjecutivo){
                      if(ejecutivos[w].idPersonalEjecutivo == personalEjecutivo[m].id){
                        personalEjecutivo[m].numeroActual = tickets_fila[x].numeroMostrar;
                      }
                    }
                    for(var m in motivosAtencion){
                      if(tickets_fila[x].idMotivoSucursal == motivosAtencion[m].idMotivoSucursal){
                        motivosAtencion[m].numeroActual = tickets_fila[x].numeroMostrar;
                        
                      }
                    }
                    //console.log(JSON.stringify(ejecutivos));
                    ticket_asignado = 1;
                    idEjecutivoTemp = ejecutivos[w].id;
                    idPersonalEjecutivoTemp = ejecutivos[w].idPersonalEjecutivo;
                    tickets_fila[x].estado = 4;
                      filaVisor.push({id:tickets_fila[x].id});
                    ejecutivos[w].estado = 2;
                    tickets_fila[x].modulo = ejecutivos[w].modulo;
                    cambioEstadoEjecutivo(ejecutivos[w].idPersonalEjecutivo, idEjecutivoTemp, 6, tickets_fila[x].id, 0);
                    //AQUI DEBO SETEAR LOS ESTADOS EN LOS EJECUTIVOS Y EN LOS TICKETS
                    //PARA RELACIONAR EL TICKET CON EL USUARIO EL ALG. ME EL TICKET
                    console.log("Se asignó a el ejecutivo:"+idEjecutivoTemp+" el ticket:"+tickets_fila[x].numeroMostrar);
                    cambioEstadoTicket(2, idEjecutivoTemp, tickets_fila[x].id, 0, 0, "0", idPersonalEjecutivoTemp);
                    io.sockets.to(ejecutivos[w].socket_id).emit('ticketAsignado', {codigo: tickets_fila[x].codigo, numeroTicket : tickets_fila[x].numeroMostrar, codigoDerivado: tickets_fila[x].codigoDerivado, idMotivoSucursal : tickets_fila[x].idMotivoSucursal, idMotivoSucursalDerivado : tickets_fila[x].idMotivoSucursalDerivado});
                  }
                }
              }
            }
          }
        }
      }
    }
    ocupado3 = 0;
    ocupado4 = 0;
    asignarTicketVisor();
  }else{
    if(ocupado4 == 0){
      ocupado4 = 1;
      console.log("asignarTicketEjecutivo - OCUPADO");
      setTimeout(function(){
      asignarTicketEjecutivo();
    }, 100);
    }
  }
}

function asignarTicketVisor(){
  //VERIFICO SI HAY TICKECT POR MOSTRAR EN VISOR DEBO PREGUNTAR SI HAY ALGÚN VISOR DISPONIBLE
    //VISORES DISPONIBLES PARA MOSTRAR TICKET? DEBE CONSULTAR EL POR EL ESTADO EN EL CUAL PASO A POR MOSTRAR
    //ESTADO DE TICKET PASA DE ESPERAR DISPONIBILIDAD DE VISOR A ESPERA A SER DESPLEGADO
    //EL VISOR RECUPERA ESTE TICKET Y LO PASA A DESPLEGADO EN VISOR
    var idSocketEjecutivo = "";
    var idTicket = 0;
    for(var x in tickets_fila){
      if((tickets_fila[x].codigo == 'Z' || tickets_fila[x].codigo == 'z') && tickets_fila[x].estado == 4){
        for(var y in ejecutivos){
          if(ejecutivos[y].modulo == tickets_fila[x].modulo){
            cambioEstadoTicket(5, ejecutivos[y].id, tickets_fila[x].id, 0, 0, "0", ejecutivos[y].idPersonalEjecutivo);
            if(tickets_fila[x].estado == 4){
                tickets_fila[x].estado = 5;
              }
              idSocketEjecutivo = ejecutivos[y].socket_id;
              for(var z in filaVisor){
                if(filaVisor[z].id == tickets_fila[x].id){
                  filaVisor.splice(z, 1);
                }
              }
              idTicket = tickets_fila[x].id;
          console.log("Ticket:"+tickets_fila[x].numeroMostrar+" enviado a ejecutivo:"+idSocketEjecutivo);
              io.sockets.to(idSocketEjecutivo).emit('ticketDesplegado', {numeroTicket : tickets_fila[x].numeroMostrar, comentario : '', codigo:tickets_fila[x].motivo, codigoDerivado:'', idMotivoSucursal : tickets_fila[x].idMotivoSucursal, idMotivoSucursalDerivado : ''});
              options.url = "http://localhost:3002/api/cambioEstadoTicket/"+idTicket+"/5";
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  //aqui debo enviar ticket a ejecutivo
                  // aqui debo consultar si el ticket no ha sido atendido por ejecutico se debe rellamar
                }
            });

          }
        }
      }
    }
    for(var w in visores){
      var ticket_asignado = 0;
      var ejecutivoNoDisponible = 0;
      if(visores[w].estado == 1){
        for(var m in filaVisor){
          for(var x in tickets_fila){

            if(filaVisor[m].id == tickets_fila[x].id){

              if((tickets_fila[x].estado == 4 && ticket_asignado == 0)||(tickets_fila[x].estado == 4 && ticket_asignado == 1 && ejecutivoNoDisponible == 1)){
                ejecutivoNoDisponible = 0;
                //console.log("%%%%%%%"+tickets_fila[x].numeroMostrar);
                for(var z in visores[w].motivos){
                  if(((visores[w].motivos[z].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && tickets_fila[x].codigoDerivado == '')||(visores[w].motivos[z].idMotivoSucursal == tickets_fila[x].idMotivoSucursalDerivado)) )//&& ticket_asignado === 0)
                  {
                    var visoresNoDisponibles = 0;
                    for(var v in visores)
                    {
                      for(y in visores[v].motivos){
                        if(((visores[v].motivos[y].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && tickets_fila[x].codigoDerivado == '')||(visores[v].motivos[y].idMotivoSucursal == tickets_fila[x].idMotivoSucursalDerivado)) && visores[v].estado == 2){
                          visoresNoDisponibles = 1;
                        }
                      }
                    }

                    for(var v in ejecutivos){
                      console.log("$$$"+ejecutivos[v].modulo+"$$$"+tickets_fila[x].modulo+"$$$"+ejecutivos[v].estado);
                      if(ejecutivos[v].modulo == tickets_fila[x].modulo && ejecutivos[v].estado == 0){
                        console.log("$$$ejecutivoNoDisponible");
                        ejecutivoNoDisponible = 1;
                      }
                    }

                    if(visoresNoDisponibles == 0 && ejecutivoNoDisponible == 0){
                      for(var v in visores)
                      {
                        for(y in visores[v].motivos){
                          if(((visores[v].motivos[y].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && tickets_fila[x].codigoDerivado == '')||(visores[v].motivos[y].idMotivoSucursal == tickets_fila[x].idMotivoSucursalDerivado)) && visores[v].estado == 1)
                          {
                            console.log("Visor:"+visores[v].id+"--"+tickets_fila[x].numeroMostrar);
                            //console.log(socket.id);
                            tickets_fila[x].estado = 5;
                            visores[v].estado = 2;
                            io.sockets.to(visores[v].socket_id).emit('cambiarVisorTicketActual', {numeroTicket : tickets_fila[x].numeroMostrar, modulo : tickets_fila[x].modulo, numeroCorrelativo: tickets_fila[x].numeroCorrelativo, codigo : tickets_fila[x].codigo});
                          }
                        }
                      }
                      ticket_asignado = 1;
                      if(volverLlamar == 1){
                        setTimeout(volver_llamar, (tiempoRellamadoSegundos * 1000), tickets_fila[x].id,1,tickets_fila[x].modulo);
                      }
                      console.log(filaVisor);
                      for(var y in ejecutivos){
                        if(ejecutivos[y].modulo == tickets_fila[x].modulo){
                          cambioEstadoTicket(5, ejecutivos[y].id, tickets_fila[x].id, 0, 0, "0", ejecutivos[y].idPersonalEjecutivo);
                          console.log("tiempoMaximoLlamado: "+tiempoMaximoLlamado * 1000);
                          if(tiempoMaximoLlamado < 9000){
                            setTimeout(volver_llamar, (tiempoMaximoLlamado * 1000), tickets_fila[x].id,3,tickets_fila[x].modulo);
                          }
                        }
                      }
                    }else{
                      console.log("No están todos los visores disponibles ticket:"+tickets_fila[x].numeroMostrar);
                      ticket_asignado = 1;
                    }
                    //AQUI DEBO SETEAR LOS ESTADOS EN LOS EJECUTIVOS Y EN LOS TICKETS
                    //AQUI DEBO ENVIAR SOCKET CON TICKETS
                  }
                }
              }
            }
          }
        }
      }
    }
}

function actualizarDashboard(accionDashboard){
  console.log("actualizarDashboard - "+accionDashboard);
  var informacionDashboardTemp = [{
    panelMotivos : [],
    panelAgentes : []
  }];
  for(var y in motivosAtencion){
    motivosAtencion[y].largoCola = 0;
    }
  for(var x in tickets_fila)
  {
    for(var y in motivosAtencion){
      if((motivosAtencion[y].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && tickets_fila[x].estado == 1) || (motivosAtencion[y].idMotivoSucursal ==  tickets_fila[x].idMotivoSucursalDerivado && tickets_fila[x].estado == 7)){
        motivosAtencion[y].largoCola = motivosAtencion[y].largoCola + 1;

      }
      if((motivosAtencion[y].idMotivoSucursal == tickets_fila[x].idMotivoSucursal && tickets_fila[x].estado == 3 && motivosAtencion[y].numeroActual != tickets_fila[x].numeroMostrar)){
        motivosAtencion[y].numeroActual = tickets_fila[x].numeroMostrar;
        if(tickets_fila[x].fechaGenerado != 0){

            var tiempoAtencion = new Date();
            var tiempoActual = new Date();
            var tiempoGeneradoTemp = tickets_fila[x].fechaGenerado;
            //console.log(tickets_fila[x].fechaGenerado);
            //console.log(tiempoActual);
            tiempoAtencion.setHours(tiempoActual.getHours() - tiempoGeneradoTemp.getHours(), tiempoActual.getMinutes() - tiempoGeneradoTemp.getMinutes(), tiempoActual.getSeconds() - tiempoGeneradoTemp.getSeconds());
          var tiempoAtencionString = (tiempoAtencion.getHours() + ":" + ((tiempoAtencion.getMinutes()<=9)?"0"+tiempoAtencion.getMinutes():tiempoAtencion.getMinutes()) + ":" + ((tiempoAtencion.getSeconds()<=9)?"0"+tiempoAtencion.getSeconds():tiempoAtencion.getSeconds()));
          motivosAtencion[y].tiempoEsperaActual = tiempoAtencionString;
        }
      }
    }
  }

  if(accionDashboard == 1){
    options.url = "http://localhost:3002/api/actualizarResumenAtencion/"+idSucursal;
    //console.log("Motivos de pausa sucursal:"+idSucursal);
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var proj = JSON.parse(body);
          //console.log(proj);
          for(var x in proj){
            //console.log("id Sucursal: "+ idSucursal);
            for(var y in motivosAtencion){
              if(proj[x].codigo == motivosAtencion[y].codigo){
                var cadena1 = proj[x].esperaColaPromedio;
                var cadena2 = proj[x].atencionPromedio;
                var cadena3 = proj[x].atencionesDentroTiempoObjetivo;
                motivosAtencion[y].esperaColaPromedio = cadena1.substring(0, 8);
                motivosAtencion[y].esperaColaActualSegundos = proj[x].esperaColaActualSegundos;
                motivosAtencion[y].atencionPromedio = cadena2.substring(0, 8);
                motivosAtencion[y].atencionesDentroTiempoObjetivo = Math.floor(cadena3);
                motivosAtencion[y].atencionesHoy = proj[x].atencionesHoy;
                motivosAtencion[y].distraidos = proj[x].distraidos;
                motivosAtencion[y].esperaColaPromedioMinutos = proj[x].promedioEsperaActualMinutos;
                console.log(proj[x].promedioEsperaActualMinutos);
                if(motivosAtencion[y].tiempoMaximoEsperaCola <= proj[x].promedioEsperaActualMinutos && motivosAtencion[y].porActivarAlaramaEsperaCOla == 0 && motivosAtencion[y].alarmaEsperaCola == 0){
                  motivosAtencion[y].porActivarAlaramaEsperaCOla = 1;
                  console.log("SE ACTIVARA LA ALARMA DE ESPERA COLA PROMEDIO");
                  setTimeout(function(idMotivoSucursal){
                for(var w in motivosAtencion){
                      if(motivosAtencion[w].idMotivoSucursal == idMotivoSucursal && motivosAtencion[w].porActivarAlaramaEsperaCOla == 1 && motivosAtencion[w].alarmaEsperaCola == 0){
                        motivosAtencion[w].alarmaEsperaCola = 1;
                        textoAlarma = 'El tiempo promedio de espera supero los '+motivosAtencion[w].tiempoMaximoEsperaCola+' minutos para el motivo de atención: '+motivosAtencion[w].nombre;
                        activarAlarmas(111031072,motivosAtencion[w].id,0,0,textoAlarma);
                        setTimeout(function(idMotivoSucursal2){
                          for(var v in motivosAtencion){
                            if(idMotivoSucursal2 == motivosAtencion[v].idMotivoSucursal){
                              console.log("Volver a evaluar alarma");
                              motivosAtencion[v].alarmaEsperaCola = 0;
                              motivosAtencion[v].porActivarAlaramaEsperaCOla = 0;
                            }
                          }
                        }, 3600000, idMotivoSucursal);
                      }
                    }
                  }, 60000, motivosAtencion[y].idMotivoSucursal);

                }
                if(motivosAtencion[y].tiempoMaximoEsperaCola <= proj[x].promedioEsperaActualMinuto){
                  motivosAtencion[y].porActivarAlaramaEsperaCOla = 0;
                }

              }
            }
          }
        }
    });

    options.url = "http://localhost:3002/api/actualizarResumenAgentes";
    //console.log("Motivos de pausa sucursal:"+idSucursal);
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var proj = JSON.parse(body);
          //console.log(proj);
          for(var x in proj){
            //console.log("Motivo de pausa: "+ proj[x].descripcion);
            for(var y in personalEjecutivo){
              if(personalEjecutivo[y].id == proj[x].id){
              var cadena1 = proj[x].horaIngreso;
              var cadena2 = proj[x].atencionPromedio;
          personalEjecutivo[y].nombre = proj[x].nombre;
              personalEjecutivo[y].horaIngreso = cadena1.substring(0, 8);
              personalEjecutivo[y].atencionesHoy = proj[x].atencionesHoy;
              personalEjecutivo[y].pausasTomadas = proj[x].pausasTomadas;
              personalEjecutivo[y].totalPausas = proj[x].totalPausas;
              personalEjecutivo[y].atencionPromedio = cadena2.substring(0, 8);
              if(proj[x].atencionesDentroTiempoObjetivo > 0){
                personalEjecutivo[y].atencionesDentroTiempoObjetivo = Math.floor(proj[x].atencionesDentroTiempoObjetivo);
              }else{
                personalEjecutivo[y].atencionesDentroTiempoObjetivo = 0;
              }
              
              
              var tiempoAtencion = new Date();
              //var tiempoGeneradoTemp = new Date();

              if(proj[x].horaEgreso != "-"){
                var tiempoActual = new Date('1970-01-01T' + proj[x].horaEgreso + 'Z');
                var ajuste2 = 3;
              }else{
                var tiempoActual = new Date();
                var ajuste2 = 0;
              }

              var timeString = '12:23:00';
              if(proj[x].horaIngreso != "-"){
                var tiempoGeneradoTemp = new Date('1970-01-01T' + proj[x].horaIngreso + 'Z');
                var ajuste = 3;
              }else{
                var tiempoGeneradoTemp = new Date();
                var ajuste = 0;
              }
            

              //tiempoGeneradoTemp.setTime(Date.parse(proj[x].horaIngreso, "g:i"));
              tiempoAtencion.setHours((tiempoActual.getHours()+ajuste2) - (tiempoGeneradoTemp.getHours()+ajuste), tiempoActual.getMinutes() - tiempoGeneradoTemp.getMinutes(), tiempoActual.getSeconds() - tiempoGeneradoTemp.getSeconds());
            var tiempoAtencionString = (tiempoAtencion.getHours() + ":" + ((tiempoAtencion.getMinutes()<=9)?"0"+tiempoAtencion.getMinutes():tiempoAtencion.getMinutes()) + ":" + ((tiempoAtencion.getSeconds()<=9)?"0"+tiempoAtencion.getSeconds():tiempoAtencion.getSeconds()));
              personalEjecutivo[y].horasTrabajadas = tiempoAtencionString;
              }
            }
          }
          ;
        }
    });
  }



  //console.log(personalEjecutivo)

  for(var x in motivosAtencion){
    var informacionMotivoTemp = {
      codigo:motivosAtencion[x].codigo,
      descripcion:motivosAtencion[x].nombre,
      atencionesDentroTiempoObjetivo:Math.floor(motivosAtencion[x].atencionesDentroTiempoObjetivo),
      resumen:[{
        atencionesHoy:motivosAtencion[x].atencionesHoy,
        distraidos:motivosAtencion[x].distraidos,
        esperaColaPromedio:motivosAtencion[x].esperaColaPromedio ,
        atencionPromedio:motivosAtencion[x].atencionPromedio,
        modulosHabilitados:motivosAtencion[x].modulosHabilitados,
        tiempoMaximoAtencion:motivosAtencion[x].tiempoMaximoAtencion,
        tiempoMaximoEsperaCola : motivosAtencion[x].tiempoMaximoEsperaCola
      }],
      situacionActual:[{
        largoCola:motivosAtencion[x].largoCola,
        tiempoEsperaActual:motivosAtencion[x].tiempoEsperaActual,
        modulosAtendiendo:motivosAtencion[x].modulosAtendiendo,
        numeroActual:motivosAtencion[x].numeroActual
      }]
    };
    informacionDashboardTemp[0].panelMotivos.push(informacionMotivoTemp);
  }
  informacionDashboardTemp[0].panelAgentes.push(personalEjecutivo);

    for(var x in usuariosDashboard){
      io.sockets.to(usuariosDashboard[x].socket_id).emit('actualizarDashboard', informacionDashboardTemp);
    }
  

  if(accionDashboard == 1){
    setTimeout(function(){
      actualizarDashboard(1);
    }, 10000);
  }
  return informacionDashboardTemp;
  
}

function activarAlarmas(tipoAlarma, idMotivo, idEjecutivo, idPausa, textoAlarma){

  console.log(`tipoAlarma ${tipoAlarma}, idMotivo ${idMotivo}, idEjecutivo ${idEjecutivo}, idPausa ${idPausa}, textoAlarma ${textoAlarma}`);
  var options2 = {
    url: `http://${configuracion.servidorCentral}:3000/api/alarmas/notificacion/${idSucursal}`,
    method: 'POST',
    headers: headers,
    form: {
      'idMotivoAtencion' : idMotivo,
      'idMotivoPausa' : idPausa,
      'idEjecutivo' : idEjecutivo,
      'idAlarma' : tipoAlarma,
      'text': textoAlarma
    }
  }
  console.log(options2);
  // Start the request
  request(options2, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
  })
}

function acciones(data){
  //console.log(data);
  //aqui se determina que ticket le corresponde a cada modulo

  //aqui determina que números de deben mostrar en pantalla
}

function loginModulo(idModulo, socket_id){
  for(var x in ejecutivos){

    if(ejecutivos[x].id == idModulo)//POR_HACER AQUI VA ES LA IP DEL MODULO
    {
      //console.log(idModulo+"loginModulo"+ejecutivos[x].id);
      io.sockets.to(socket_id).emit('configuracionEjecutivo', {"volverLlamar":volverLlamar, "tiempoPausaSgteLlamado":tiempoPausaSgteLlamado});
      io.sockets.to(socket_id).emit('motivosPausa', motivosPausa);
      io.sockets.to(socket_id).emit('categorias', categorias);
      io.sockets.to(socket_id).emit('motivosAtencion', motivosAtencion);
      io.sockets.to(socket_id).emit('motivosAtencionEjecutivo', ejecutivos[x].motivos);
      io.sockets.to(socket_id).emit('numeroModulo', ejecutivos[x].modulo);
      console.log("estado"+ejecutivos[x].estado);
      switch(ejecutivos[x].estado) {
        case 0:
          ejecutivos[x].socket_id = socket_id;
          console.log("Modulo:"+ejecutivos[x].id+" logeado socketId:"+ejecutivos[x].socket_id);
          break;
        case 1:
          ejecutivos[x].socket_id = socket_id;
          console.log("Modulo:"+ejecutivos[x].id+" logeado socketId:"+ejecutivos[x].socket_id+" con disponibilidad");
          break;
        case 2:
          //enviar el ticket

          ejecutivos[x].socket_id = socket_id;
          for(var y in tickets_fila){

            if(tickets_fila[y].modulo == ejecutivos[x].modulo && tickets_fila[y].estado != 8 && tickets_fila[y].estado != 6 && tickets_fila[y].estado != 7 && tickets_fila[y].estado != 9 && tickets_fila[y].estado != 1){
              console.log("Modulo:"+ejecutivos[x].id+" logeado socketId:"+ejecutivos[x].socket_id+" con atención al ticket:"+tickets_fila[y].numeroMostrar);
              io.sockets.to(ejecutivos[x].socket_id).emit('restablecerTicket', {numeroTicket:tickets_fila[y].numeroMostrar, estado:tickets_fila[y].estado, comentario: tickets_fila[y].comentario, codigo: tickets_fila[y].codigo, codigoDerivado:tickets_fila[y].codigoDerivado, idMotivoSucursal : tickets_fila[y].idMotivoSucursal ,idMotivoSucursalDerivado : tickets_fila[y].idMotivoSucursalDerivado});
            }
          }
          break;
        case 3:
          //enviar estado de pausa
          ejecutivos[x].socket_id = socket_id;
          console.log("Modulo:"+ejecutivos[x].id+" logeado socketId:"+ejecutivos[x].socket_id+" en pausa");
          io.sockets.to(ejecutivos[x].socket_id).emit('restablecerPausa', "restablecer");
          break;
        case 4:
          //enviar estado de pausa
          io.sockets.to(ejecutivos[x].socket_id).emit('ticketDistraido', "0");
          break;
      }
    }
  }
}

function loginEjecutivo(idEjecutivo, socket_id){
  for(var x in personalEjecutivo){
    if(personalEjecutivo[x].id == idEjecutivo)
    {
      for(var y in ejecutivos){
        if(ejecutivos[y].socket_id == socket_id)
        {
          ejecutivos[y].idPersonalEjecutivo = personalEjecutivo[x].id,
          ejecutivos[y].nombreEjecutivo = personalEjecutivo[x].nombres + " " + personalEjecutivo[x].apellidoPaterno;
          console.log("Ejecutivo:"+ejecutivos[y].nombreEjecutivo +" logeado en el modulo:"+ejecutivos[y].modulo);
          io.sockets.to(ejecutivos[y].socket_id).emit('nombreEjecutivo', ejecutivos[y].nombreEjecutivo);
          cambioEstadoEjecutivo(personalEjecutivo[x].id, ejecutivos[y].id, 1, 0, 0);
          for(var w in ejecutivos[y].motivos){
            for(var v in motivosAtencion){
              if(ejecutivos[y].motivos[w].idMotivoSucursal == motivosAtencion[v].idMotivoSucursal){
                personalEjecutivo[x].motivosAtencion = personalEjecutivo[x].motivosAtencion + motivosAtencion[v].codigo;
                motivosAtencion[v].modulosAtendiendo = motivosAtencion[v].modulosAtendiendo + 1;
                console.log("Motivo: "+motivosAtencion[v].codigo+" - modulos atendiendo: "+motivosAtencion[v].modulosAtendiendo);
                actualizarDashboard(0);
              }
            }
          }
          personalEjecutivo[x].moduloActual = ejecutivos[y].modulo;
          personalEjecutivo[x].motivosAtencion = ejecutivos[y].motivos;
        }
      }
    }
  }
}


//accion 1 = volver a llamar, 2: tiempo maximo de llamado agotado

function volver_llamar(idTicket,accionTemp,modulo){
  console.log('Volver a llamar: '+accionTemp+' - '+modulo);
  for(var x in tickets_fila){
    if(( (tickets_fila[x].modulo == modulo && tickets_fila[x].llamados >= cantidadExtraLlamados && accionTemp == 1) || accionTemp == 2 || (tickets_fila[x].modulo == modulo && accionTemp == 3) ) && tickets_fila[x].id == idTicket && tickets_fila[x].estado != 6 && tickets_fila[x].estado != 3 && tickets_fila[x].estado != 8 && tickets_fila[x].estado != 7 && tickets_fila[x].estado != 9)
    {
      console.log('Volver a llamar: '+accionTemp+' - '+modulo+' - '+tickets_fila[x].modulo +' - '+cantidadExtraLlamados+' - '+tickets_fila[x].llamados);
      console.log("Ticket:"+tickets_fila[x].numeroMostrar+" distraido modulo "+tickets_fila[x].modulo);
      tickets_fila[x].estado = 8;
      for(var y in ejecutivos){
        if(ejecutivos[y].modulo == tickets_fila[x].modulo && tickets_fila[x].id == idTicket){
          var idSocketEjecutivo = ejecutivos[y].socket_id;
          ejecutivos[y].estado = 4;
          cambioEstadoEjecutivo(ejecutivos[y].idPersonalEjecutivo, ejecutivos[y].id, 5, tickets_fila[x].id, 0);
          cambioEstadoTicket(8, ejecutivos[y].id, tickets_fila[x].id, 0, 0, "0", ejecutivos[y].idPersonalEjecutivo);
          io.sockets.to(idSocketEjecutivo).emit('ticketDistraido', tickets_fila[x].numeroMostrar);
        }
      }
      options.url = "http://localhost:3002/api/cambioEstadoTicket/"+idTicket+"/8";
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
          }
      });
    }else{
      if(tickets_fila[x].modulo == modulo && accionTemp != 3 && tickets_fila[x].id == idTicket && tickets_fila[x].estado != 4 && tickets_fila[x].estado != 6 && tickets_fila[x].estado != 3 && tickets_fila[x].estado != 8 && tickets_fila[x].llamados < cantidadExtraLlamados && tickets_fila[x].estado != 7 && tickets_fila[x].estado != 9){
        var motivoTicket = "";
        var motivoTicketDerivado = "";
        var idMotivoTicket = "";
        var idMotivoTicketDerivado = "";
        for(var y in tickets_fila){
          if(tickets_fila[y].id ==  idTicket){
            motivoTicket = tickets_fila[y].codigo;
            idMotivoTicket = tickets_fila[y].idMotivoSucursal
            motivoTicketDerivado = tickets_fila[y].codigoDerivado;
            idMotivoTicketDerivado = tickets_fila[y].idMotivoSucursalDerivado
          }
        }
        for(var w in visores){
          for(var z in visores[w].motivos){
            if(visores[w].motivos[z].idMotivoSucursal == idMotivoTicket || visores[w].motivos[z].idMotivoSucursal == idMotivoTicketDerivado)
            {
              io.sockets.to(visores[w].socket_id).emit('confirmarAccion', "confirmar");
            }
          }
        }
        tickets_fila[x].estado = 4;
        var yaEnFila = 0;
        for(var y in filaVisor){
          if(filaVisor[y].id == tickets_fila[x].id){
            yaEnFila = 1;
          }
        }
        if(yaEnFila == 0){
          filaVisor.push({id:tickets_fila[x].id});
        }
        tickets_fila[x].llamados = tickets_fila[x].llamados + 1;
        for(var v in ejecutivos){
          if(ejecutivos[v].modulo == tickets_fila[x].modulo){
            io.sockets.to(ejecutivos[v].socket_id).emit('confirmacionVolverLlamar', tickets_fila[x].llamados);
          }
        }
        console.log("volver a llamar ticket:"+tickets_fila[x].numeroMostrar);
      }
    }
  }
}

function ticket_mostrar(){
  //aqui determina que números de deben mostrar en pantalla
  for(var x in ejecutivos){
    if(ejecutivos[x].estado == 1)
    {
      console.log('ejecutivo disponible');
    }else{
      console.log('ejecutivo no disponible');
    }
  }   
}

function cambioEstadoEjecutivo(idEjecutivo, idModulo, estado, idTicket, idPausa){

  //inicia sesion
  console.log(idEjecutivo+"--"+idModulo+"--"+estado+"--"+idTicket+"--"+idPausa);
  if(ocupado2 == 0)
  {
    ocupado2 = 1;
    options.url = "http://localhost:3002/api/cambioEstadoEjecutivo/"+idEjecutivo+"/"+idModulo+"/"+estado+"/"+idTicket+"/"+idPausa+"/"+idSucursal;
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          
        }
        ocupado2 = 0;
    });
  }else{
    setTimeout(function(){
      cambioEstadoEjecutivo(idEjecutivo, idModulo, estado, idTicket, idPausa);
    }, 100);
  }
}

function cambioEstadoTicket(estado, idModulo, idTicket, idTicketDerivado, idCategoria, comentario, idEjecutivo){
  //console.log(estado+"--"+idModulo+"--"+idTicket+"--"+idTicketDerivado+"--"+idCategoria+"--"+comentario);
  //inicia sesion
  if(ocupado1 == 0)
  {
    if(comentario.length == 0){
      comentario = "0";
    }
    actualizarDashboard(0);
    ocupado1 = 1;
    console.log("http://localhost:3002/api/relacionarTicketEjecutivo/"+estado+"/"+idModulo+"/"+idTicket+"/"+idCategoria+"/"+comentario+"/"+idEjecutivo);
    options.url = "http://localhost:3002/api/relacionarTicketEjecutivo/"+estado+"/"+idModulo+"/"+idTicket+"/"+idCategoria+"/"+comentario+"/"+idEjecutivo;
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          
        }
        ocupado1 = 0;
    });
  }else{
    setTimeout(function(){
      cambioEstadoTicket(estado, idModulo, idTicket, idTicketDerivado, idCategoria, comentario, idEjecutivo);
    }, 100);
  }
}

function listarModulosDisponibles(socket_id){
  var modulosTemp=[];
  var flag1 = 0;
  
  for(var x in modulosLogin){
    if(modulosLogin[x].socket_id == socket_id){
      flag1 = 1;
    }
  }
  if(flag1 == 0){
    modulosLogin.push({socket_id:socket_id});
  }
  console.log("login");
  for(var x in ejecutivos){
    var motivosAsociadosTemp = 0;
    for(var y in ejecutivos[x].motivos){
      motivosAsociadosTemp = 1;
    }
    if(ejecutivos[x].idPersonalEjecutivo == 0 && motivosAsociadosTemp == 1)
    {
      modulosTemp.push({modulo:ejecutivos[x].modulo, descripcion:ejecutivos[x].descripcion});
    }
  }
  return modulosTemp;
}

function cerrarJornada(){
  options.url = "http://localhost:3002/api/cerrarJornada";
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        for(var x in visores){
          io.sockets.to(visores[x].socket_id).emit('limpiarVisor', 'limpiarVisor');
        }

        io.sockets.emit('procesoReiniciar', 'procesoReiniciar');

        ultimoIdTicket = 0;
      idCliente = 0;
      idSucursal = 0;
      cantidadExtraLlamados = 0;
      reproducirAudioLlamado = 0;
      tiempoPausaSgteLlamado = 0;
      volverLlamar = 0;
      tiempoRellamadoSegundos = 0;
      mensajeImpresionTicket = "";
      modulosLogin = [];
      contadorTickets = 0;
      tiempoMaximoLlamado = 0;


      // variables DASHBOARD
      porcentajeAtencionDentroTiempoObjetivo = "100";
      usuariosDashboard = [];

      menu = [];
      equipos = []; //AQUI SE REGISTA LA IP Y EL SOCKET_ID Y EL TIPO (EJECUTIVO, VISOR, TICKETERO, ADMINISTRADOR) 
      ticketeros = [];
      ejecutivos = [];
      personalEjecutivo = []; //datos de acceso de los ejecutivos

      filaVisor = [];
      visores = [];


      tickets_fila = [];
      motivosPausa = [];
      categorias = [];
      motivosAtencion = [];
      configuracionesTicketeros = [];
      horariosMotivosAtencion = [];
      configuracionesVisores = [];
      gruposOrigenDestino = [];
        tickets_fila = [];

        cambioMaestro = 0;
      configuracionInicial();


        console.log("Se he reiniciado el sistema de numeración");
        reinicio = 1;
      }
  });
}

server.listen(3001, function(){
  //console.log('servidor activo');
});
