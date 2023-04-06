mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
  var self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {


    // Cofiguración inicial
    router.get("/configuracionInicial", function(req, res) {
        connection.query("CALL configuracionInicial()", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Cerrar jornada
    router.get("/cerrarJornada", function(req, res) {
        connection.query("CALL cerrarJornada()", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Autenticación
    router.get("/autenticacion/:user/:pass", function(req, res) {
        connection.query("select * from ejecutivo where identificacionAcceso = '"+req.params.user+"' and claveAcceso = '"+req.params.pass+"'", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar todos los tickets
    router.get("/listarTickets/:idTicket", function(req, res) {
        connection.query("SELECT A.id, A.estado, A.codigoDespliegue, A.motivoAtencionSucursal_id as idMotivoSucursal, A.numeroCorrelativoTicket, (CASE A.estado WHEN 4 THEN (SELECT B.modulo_id FROM gestionfila.asociamoduloticketatenciondiaria AS B WHERE A.id = B.generaTicketAtencionDiaria_id order by b.id desc limit 1) ELSE 0 END) AS modulo FROM gestionfila.generaticketatenciondiaria as A WHERE A.estado <> 6 and A.id > "+req.params.idTicket, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Restaurar Tickets - servidor
    router.get("/restaurarTickets", function(req, res) {
        connection.query("CALL restaurarTickets()", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Restaurar información Tickets - servidor
    router.get("/restaurarInformacionTickets", function(req, res) {
        connection.query("select AA.idMotivoSucursal, count(idMotivoSucursal) as atencionesHoy from (select t1.accion accion1, t1.hora hora1, t2.accion accion2, t2.hora hora2,time_to_sec(timediff(t2.hora,t1.hora)) tiempoAtencion,(case when (select accion from asociamoduloticketatenciondiaria where id < t1.id and accion = 7 and generaTicketAtencionDiaria_id = t1.generaTicketAtencionDiaria_id order by id desc limit 1) = 7 then (select A.id from motivoatencionsucursal A, generaticketderivado B, asociamoduloticketatenciondiaria C where A.id = B.motivoAtencionSucursal_id_d and C.generaTicketDerivado_id = B.id and C.id < t1.id and C.accion = 7 order by C.id desc limit 1) else (select motivoAtencionSucursal_id from generaticketatenciondiaria where id = t1.generaTicketAtenciondiaria_id) end ) idMotivoSucursal,(case when (select accion from asociamoduloticketatenciondiaria where id < t1.id and accion = 7 and generaTicketAtencionDiaria_id = t1.generaTicketAtencionDiaria_id order by id desc limit 1) = 7 then 0 else 1 end) numeroCola,(case when (select accion from asociamoduloticketatenciondiaria where id < t1.id and accion = 7 and generaTicketAtencionDiaria_id = t1.generaTicketAtencionDiaria_id order by id desc limit 1) = 7 then 0 else (select time_to_sec(timediff(t1.hora, D.hora)) from generaticketatenciondiaria D where D.id = t1.generaTicketAtencionDiaria_id) end) esperaCola from asociamoduloticketatenciondiaria t1, asociamoduloticketatenciondiaria t2 where t1.id < t2.id and t1.accion = 3 and (t2.accion = 6 or t2.accion = 7) and t1.generaTicketAtencionDiaria_id = t2.generaTicketAtencionDiaria_id and t2.id = (select t3.id from asociamoduloticketatenciondiaria t3 where t1.id < t3.id and t1.generaTicketAtencionDiaria_id = t3.generaTicketAtencionDiaria_id order by id asc limit 1)) AA group by idMotivoSucursal", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });




    // Restaurar estado de los modulos
    router.get("/restaurarEstadosEjecutivos2/:idModulo", function(req, res) {
        connection.query("select A.modulo_id, A.estado from historialatencionejecutivo as A where A.modulo_id = "+req.params.idModulo+" and A.id = (select B.id from historialatencionejecutivo B where A.modulo_id = B.modulo_id order by cast(substring(id,9) as unsigned) desc limit 1)", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Restaurar estado de los modulos
    router.get("/restaurarEstadosEjecutivos", function(req, res) {
        connection.query("select A.modulo_id, A.estado from historialatencionejecutivo as A where A.id = (select B.id from historialatencionejecutivo B where A.modulo_id = B.modulo_id order by cast(substring(id,9) as unsigned) desc limit 1)", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Listar todos los modulos
    router.get("/listarModulos/:idSucursal", function(req, res) {
        connection.query("SELECT * FROM gestionfila.modulo WHERE estado = 1 and sucursal_id = "+req.params.idSucursal, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Actualizar resumen atención
    router.get("/actualizarResumenAtencion/:idSucursal", function(req, res) {
        connection.query(`select * from(
    select 
    codigoDespliegue codigo,
    (case when atencionesHoy is not null then atencionesHoy else 0 end) as atencionesHoy,
    (case when esperaColaPromedio is not null then substring(esperaColaPromedio,1,8)  else 0 end) as esperaColaPromedio,
    tiempoMaximoEsperaCola tiempoEsperaObjetivo,
    (case when atencionPromedio is not null then substring(atencionPromedio,1,8) else 0 end) as atencionPromedio,
    tiempoMaximoAtencion tiempoAtencionObjetivo,
    (case when atencionesHoy is not null then atencionesHoy else 0 end) as distraidos,
    substring((case when esperaColaActualSegundos is not null then esperaColaActualSegundos else 0 end),1,8) as esperaColaActualSegundos,
    (case when esperaColaActualSegundos is not null then cast((time_to_sec(esperaColaActualSegundos)/60) as unsigned)  else 0 end) as promedioEsperaActualMinutos,
    (case when K.atencionesDentroObjetivo is not null then cast(((K.atencionesDentroObjetivo/atencionesHoy)*100) as unsigned) else 100 end) atencionesDentroTiempoObjetivo
    from
    (select id idsucursal, nombre sucursal from sucursal where id in ('`+req.params.idSucursal+`')) A
    left join
    (select MAS.sucursal_id idSucursal, MAS.id idMotivoSucursal, MAS.codigoDespliegue, MA.nombre motivo, MAS.tiempoMaximoAtencion, MAS.tiempoMaximoEsperaCola from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id and MAS.estado = 1) B
    on A.idSucursal = B.idSucursal
    left join
    (select motivoAtencionSucursal_id idMotivoSucursal, count(motivoAtencionSucursal_id) ejecutivosActivos from modulomotivoatencionsucursal MMAS, resumensesionejecutivo RSE 
    where MMAS.modulo_id = RSE.idModulo and RSE.fin is null group by MMAS.motivoAtencionSucursal_id) C
    on B.idMotivoSucursal = C.idMotivoSucursal
    left join
    (select idmotivosucursalatencion idMotivoSucursal, count(id) ticketsEmitidos from resumenticket where estadoInicial = 1 group by idMotivoSucursalAtencion) D
    on B.idMotivoSucursal = D.idMotivoSucursal
    left join
    (select idmotivosucursalatencion idMotivoSucursal, count(id) ticketsEnAtencion from resumenticket where estadoInicial = 1 and inicioAtencion is not null and estadoFinal = 0 group by idMotivoSucursalAtencion) E
    on B.idMotivoSucursal = E.idMotivoSucursal
    left join
    (select idmotivosucursalatencion idMotivoSucursal, count(id) ticketsEnEspera from resumenticket where estadoInicial = 1 and inicioAtencion is null and estadoFinal = 0 group by idMotivoSucursalAtencion) F
    on B.idMotivoSucursal = F.idMotivoSucursal
    left join
    (select idMotivoSucursalAtencion idMotivoSucursal, count(id) atencionesHoy, sec_to_time((sum(time_to_sec(tiempoAtencion))/count(id))) atencionPromedio from resumenticket where estadoInicial = 1 and (estadofinal = 6 or estadofinal = 7) group by idMotivoSucursalAtencion) G
    on B.idMotivoSucursal = G.idMotivoSucursal
    left join
    (select idMotivoSucursalAtencion idMotivoSucursal, sec_to_time((sum(time_to_sec(tiempoEspera))/count(id))) esperaColaPromedio from resumenticket where estadoInicial = 1 and (estadofinal = 6 or estadofinal = 7 or estadofinal = 8) group by idMotivoSucursalAtencion) H
    on B.idMotivoSucursal = H.idMotivoSucursal
    left join
    (select idmotivosucursalatencion idMotivoSucursal, count(id) ticketsDistraidos from resumenticket where estadoInicial = 1 and estadoFinal = 8 group by idMotivoSucursalAtencion) I
    on B.idMotivoSucursal = I.idMotivoSucursal
    left join
    (select idMotivoSucursalAtencion idMotivoSucursal, sec_to_time((sum(time_to_sec(timediff(curtime(), inicio) ))/count(id))) esperaColaActualSegundos from resumenticket where estadoInicial = 1 and estadofinal = 0 and tiempoEspera is null group by idMotivoSucursalAtencion) J
    on B.idMotivoSucursal = J.idMotivoSucursal
    left join
    (select idMotivoSucursalAtencion idMotivoSucursal, sum((case when (time_to_sec(RT.tiempoAtencion)/60) <= MAS2.tiempoMaximoAtencion then 1 else 0 end )) atencionesDentroObjetivo from resumenticket RT, motivoatencionsucursal MAS2 where MAS2.id = RT.idMotivoSucursalAtencion and estadoInicial = 1 and (estadofinal = 6 or estadofinal = 7) group by idMotivoSucursalAtencion) K
    on B.idMotivoSucursal = K.idMotivoSucursal
) AA order by codigo asc`, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Actualizar resumen agentes
    router.get("/actualizarResumenAgentes", function(req, res) {
        connection.query(`select A.id, A.nombre, (case when B.horaIngreso then B.horaIngreso else '-' end) as horaIngreso, (case when B.horaEgreso then B.horaEgreso else '-' end) as horaEgreso, (case when C.atencionesHoy then C.atencionesHoy else '-' end) as atencionesHoy, (case when D.pausasTomadas then D.pausasTomadas else '-' end) as pausasTomadas, (case when E.totalPausas then E.totalPausas else '-' end) as totalPausas, (case when F.atencionPromedio then F.atencionPromedio else '-' end) as atencionPromedio, (case when G.atencionesDentroTiempoObjetivo then G.atencionesDentroTiempoObjetivo else '-' end) as atencionesDentroTiempoObjetivo from (select id, concat(nombres, " ", apellidoPaterno, " ", apellidoMaterno) as nombre from ejecutivo) A
                left join
                (select idEjecutivo as id, hora as horaIngreso, (select hora from historialatencionejecutivo t2 where estado = 2 and t1.id < t2.id and t1.idEjecutivo = t2.idEjecutivo) as horaEgreso from historialatencionejecutivo t1 where estado = 1 and id = (select id from historialatencionejecutivo where estado = 1 and idEjecutivo = t1.idEjecutivo order by id desc limit 1)) as B
                on A.id = B.id
                left join
                (select idEjecutivo as id, count(estado) as atencionesHoy from historialatencionejecutivo where estado = 7 group by idEjecutivo) as C
                on A.id = C.id
                left join
                (select idEjecutivo as id, count(estado) as pausasTomadas from historialatencionejecutivo where estado = 3 group by idEjecutivo) as D
                on A.id = D.id
                left join
                (select t1.idEjecutivo as id, SEC_TO_TIME(sum(TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora)))) totalPausas from historialatencionejecutivo t1, historialatencionejecutivo t2 
                where t1.hora < t2.hora and t1.estado = 3 and t2.estado = 4 and t1.idEjecutivo = t2.idEjecutivo
                and t2.id = (select id from historialatencionejecutivo t3 where t3.estado = 4 and t3.hora > t1.hora and t3.idEjecutivo = t1.idEjecutivo and t3.id > t1.id order by t3.id asc limit 1)
                group by t1.idEjecutivo) E
                on A.id = E.id
                left join
                (select t1.idEjecutivo as id, SEC_TO_TIME((sum(TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora))))/count(t1.id)) atencionPromedio from historialatencionejecutivo t1, historialatencionejecutivo t2 
                where t1.hora < t2.hora and t1.estado = 7 and t2.estado = 8 and t1.idEjecutivo = t2.idEjecutivo
                and t2.id = (select id from historialatencionejecutivo t3 where t3.estado = 8 and t3.hora > t1.hora and t3.idEjecutivo = t1.idEjecutivo and t3.id > t1.id order by t3.id asc limit 1)
                group by t1.idEjecutivo) F
                on A.id = F.id
                left join
                (select t1.idEjecutivo as id, (((sum((case when TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora)) <= (B.tiempoMaximoAtencion*60) then 1 else 0 end)))/count(t1.id))*100) as atencionesDentroTiempoObjetivo
                from historialatencionejecutivo t1, historialatencionejecutivo t2, generaTicketAtencionDiaria A, motivoatencionsucursal B
                where t1.hora < t2.hora and t1.estado = 7 and t2.estado = 8 and t1.idEjecutivo = t2.idEjecutivo and A.id = t1.generaTicketAtencionDiaria_id and A.motivoAtencionSucursal_id = B.id
                and t2.id = (select id from historialatencionejecutivo t3 where t3.estado = 8 and t3.hora > t1.hora and t3.idEjecutivo = t1.idEjecutivo and t3.id > t1.id order by t3.id asc limit 1)
                group by t1.idEjecutivo) G
                on A.id = G.id`, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar todos los motivos correspondiente a cada uno de los modulos
    router.get("/listarMotivosModulos", function(req, res) {
        connection.query("SELECT A.id as idModulo, C.codigoDespliegue as codigo, C.id as idMotivoSucursal, B.prioridad, B.atiendeDesborde as atiendeRebalse FROM gestionfila.modulo A,  gestionfila.modulomotivoatencionsucursal B, gestionfila.motivoatencionsucursal C WHERE A.id = B.modulo_id AND C.id = B.motivoAtencionSucursal_id AND C.estado = 1 AND B.fecha_elminacion is null ORDER BY C.codigoDespliegue ASC", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar todos los grupos origen - destino para las derivaciones
    router.get("/listarGruposOrigenDestino", function(req, res) {
        connection.query("SELECT * FROM grupomodulosucursal_od", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });




    //
    router.get("/relacionarTicketEjecutivo/:estado/:idModulo/:idTicket/:idCategoria/:comentario/:idPersonalEjecutivo", function(req, res) {
        connection.query("CALL relacionarTicketEjecutivo("+req.params.estado+","+req.params.idModulo+","+req.params.idTicket+","+req.params.idCategoria+",'"+req.params.comentario+"',"+req.params.idPersonalEjecutivo+")", function(err, rows) {
            if(err) {
                console.log(err);
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });



    // Cambio de estado de un ticket
    router.get("/cambioEstadoTicket/:id_ticket/:estado", function(req, res) {
        connection.query("CALL cambioEstadoTicket("+req.params.id_ticket+","+req.params.estado+")", function(err, rows) {
            if(err) {
                console.log(err);
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Cambio de estado ejecutivo - modulo
    router.get("/cambioEstadoEjecutivo/:idEjecutivo/:idModulo/:estado/:idTicket/:idPausa/:idSucursal", function(req, res) {
        connection.query("CALL cambioEstadoEjecutivo("+req.params.idEjecutivo+","+req.params.idModulo+","+req.params.estado+","+req.params.idTicket+","+req.params.idPausa+","+req.params.idSucursal+")", function(err, rows) {
            if(err) {
                console.log(err);
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Finalizacion atención
    router.get("/finalizacionAtencion/:id_ticket/:idCategoria/:comentario", function(req, res) {
        connection.query("CALL finalizacionAtencion("+req.params.id_ticket+","+req.params.idCategoria+","+req.params.comentario+")", function(err, rows) {
            if(err) {
                console.log(err);
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Generar nuevo ticket
    router.get("/generaNuevoTicket/:idMotivo/:rut", function(req, res) {
        connection.query("CALL generaNuevoTicket("+req.params.idMotivo+","+req.params.rut+")", function(err, rows) {
            if(err) {
                console.log(err);
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/derivarTicket/:idTicket/:idMotivoDestino/:comentario", function(req, res) {
        connection.query("CALL derivarTicket("+req.params.idTicket+","+req.params.idMotivoDestino+","+req.params.comentario+")", function(err, rows) {
            if(err) {
                console.log(err);
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar todos los motivos de pausa
    router.get("/listarMotivosPausa/:id", function(req, res) {
        connection.query("SELECT A.id, A.codigo, A.descripcion, B.tiempoMinutosAsignado FROM gestionfila.motivopausa A, motivopausasucursal B where A.id = B.motivoPausa_id and b.estado = 1 and B.sucursal_id = "+req.params.id+" ORDER BY id ASC", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar todos los motivos de atención
    router.get("/listarMotivosAtencion/:id", function(req, res) {
        connection.query("SELECT B.id, A.id as idMotivoSucursal, A.codigoDespliegue as codigo, B.nombre, A.tiempoMaximoAtencion, A.tiempoMaximoEsperaCola, B.icono, A.cantidadActivarDesborde, A.cantidadAtencionesDesborde FROM gestionfila.motivoatencionsucursal A, gestionfila.motivoatencion B WHERE B.id = A.motivoAtencion_id AND A.estado = 1 AND B.tipo = 'D' AND A.sucursal_id ="+req.params.id+" ORDER BY B.id ASC", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar todos las restricciones para la derivación
    router.get("/listarRestriccionesDerivacion/:id", function(req, res) {
        connection.query("SELECT * FROM gestionfila.restriccionderivacion WHERE idSucursal ="+req.params.id, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Listar todas las categorias
    router.get("/listarCategorias/:id", function(req, res) {
        connection.query("SELECT A.id, C.codigoDespliegue as codigo, A.descripcion, C.id as idMotivoSucursal FROM gestionfila.categoria A, gestionfila.categoriamotivoatencionsucursal B,  gestionfila.motivoatencionsucursal C where A.id = B.categoria_id and B.motivoAtencionSucursal_id = C.id AND C.estado = 1 and B.estado = 1 and C.sucursal_id = "+req.params.id+" ORDER BY A.id ASC", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Listar ticketeros
    router.get("/listarTicketeros/:id", function(req, res) {
        connection.query("SELECT * FROM gestionfila.ticketero WHERE sucursal_id ="+req.params.id, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar motivos de atención a desplegar en ticketeros
    router.get("/listarTicketeroMotivoAtencion", function(req, res) {
        connection.query("SELECT A.ticketero_id, B.motivoAtencion_id FROM gestionfila.ticketeromotivoatencionsucursal A, gestionfila.motivoatencionsucursal B WHERE B.id = A.motivoAtencionSucursal_id and B.estado = 1 and A.fecha_elminacion is null", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Listar configuraciones de ticketeros
    router.get("/listarConfiguracionesTicketeros/:id", function(req, res) {
        connection.query("SELECT * FROM configuracionticketero WHERE cliente_idCliente ="+req.params.id, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });
    // Listar horarios de deshabilitacion de motivos de atención en ticketeros
    router.get("/listarHorariosMotivosAtencion", function(req, res) {
        connection.query("select E.valor as hora, D.id as dia, A.ticketero_id as idTicketero, B.motivoAtencion_id as idMotivo from ticketeromotivoatencionsucursal A, motivoAtencionSucursal B, ticketerohorariomotivoatencion C, dia D, hora E where A.motivoAtencionSucursal_id = B.id and C.ticketeroMotivoAtencionSucursal_id = A.id and C.hora_idhora = E.idhora and C.dia_id = D.id and C.estado = 1 and C.fecha_elminacion is null and A.fecha_elminacion is null", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Listar Servidores Secundarios
    router.get("/listarServidoresSecundarios", function(req, res) {
        connection.query("SELECT * FROM gestionfila.servidorsecundariosucursal", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Listar visores
    router.get("/listarVisores/:id", function(req, res) {
        connection.query("SELECT A.id, A.descripcion, A.ip, A.configuracionVisor_id as idConfiguracion FROM gestionfila.visor A WHERE A.estado = 1 AND sucursal_id ="+req.params.id, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar motivos de atención a desplegar en visores
    router.get("/listarVisoresMotivoAtencion", function(req, res) {
        connection.query("SELECT A.id, C.codigoDespliegue as codigo, C.id as idMotivoSucursal FROM gestionfila.visor A, gestionfila.visormotivoatenciosucursal B, gestionfila.motivoatencionsucursal C WHERE A.id = B.visor_id AND C.id = B.motivoAtencionSucursal_id AND C.estado = 1 and B.fecha_elminacion is null ORDER BY A.id ASC", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar configuraciones de visores
    router.get("/listarConfiguracionesVisores/:id", function(req, res) {
        connection.query("SELECT * FROM configuracionvisor WHERE cliente_idCliente = "+req.params.id, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar componentes de visores
    router.get("/listarComponentesVisores", function(req, res) {
        connection.query("select B.alto, B.ancho, B.posicionX, B.posicionY, C.id, A.urlDisponibleRecurso from componente A, componentevisor B, configuracionvisor C where B.componente_id = A.id and B.configuracionVisor_id = C.id ", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar contenido de visores
    router.get("/visor/contenido/:idVisor", function(req, res) {
        console.log(`SELECT
                            B.archivo nombre
                        FROM
                            publicidadsucursal A
                            LEFT JOIN
                            publicidad B
                            on A.publicidad_id = B.id
                        WHERE
                            A.sucursal_id = SUBSTRING(${req.params.idVisor},1,8)
                            and A.fecha_elminacion is NULL
                            and B.fecha_elminacion is NULL`);
        connection.query(`SELECT
                            B.archivo nombre
                        FROM
                            publicidadsucursal A
                            LEFT JOIN
                            publicidad B
                            on A.publicidad_id = B.id
                        WHERE
                            A.sucursal_id = SUBSTRING(${req.params.idVisor},1,8)
                            and A.fecha_elminacion is NULL
                            and B.fecha_elminacion is NULL`, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Listar menú
    router.get("/listarMenu", function(req, res) {
        connection.query("SELECT A.id, A.nombre, A.nivel, A.idPadre, A.tipo, (CASE A.tipo WHEN 'D' THEN (SELECT C.codigoDespliegue FROM gestionfila.motivoatencionsucursal C WHERE A.id = C.motivoAtencion_id limit 1) ELSE 0 END) AS codigo, '1' as estado, A.icono FROM gestionfila.motivoatencion A", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Buscar datos de un ejecutivo
    router.get("/listarEjecutivos/:idSucursal", function(req, res) {
        connection.query("SELECT * FROM gestionfila.ejecutivo WHERE estado = 1", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    // Buscar datos de un ejecutivo
    router.get("/descartarTicketsMasivos/:idMotivo/:desde/:hasta", function(req, res) {
        connection.query("CALL descartarTicketsMasivos("+req.params.idMotivo+","+req.params.desde+","+req.params.hasta+")", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });




    // Listar todos los usuarios
    router.get("/usuario2", function(req, res) {
        connection.query("SELECT * FROM usuario ORDER BY id", function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

  
  // Búsqueda usuario por ID
  router.get("/usuario/:id", function(req, res) {
    connection.query("SELECT * FROM usuario WHERE id = " + req.params.id, function(err, rows) {
      if(err) {
        res.json({"error": err});
      } else {
        res.json(rows);
      }
    });
  });
  
    // Insertar usuario
    router.post("/usuario", function(req, res){
      var detalle = req.body.detalle;
      for(var item in detalle) {
        connection.query("INSERT INTO usuario(correo, nombre, password) VALUES('" + req.body.correo + "', '" + req.body.nombre + "', '" + req.body.password + "')", function(err, rows) {
          if(err){
            res.json({"error": err});
          }else{
            res.json("Usuario registrado");
          }
        });
      }
    });

    // Modificar usuario
    router.put("/usuario/:id", function(req, res){
      connection.query("UPDATE usuario SET nombre = '" + req.body.nombre + "' WHERE id = " + req.params.id, function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
        res.json("Usuario modificado");
        }
      });
    });
    
    // Eliminar usuario
    router.delete("/usuario/:id", function(req, res){
      connection.query("DELETE FROM usuario WHERE id = " + req.params.id, function(err, rows){
        if(err){
          res.json({"error": err});
        } else {
          res.json("Usuario eliminado");
        }
      });
    });

}
module.exports = REST_ROUTER;
