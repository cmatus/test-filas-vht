mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
  var self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

  router.get("/reportemotivossolicitados/:idcliente/:idsucursal/:fechaI/:fechaF", function(req, res) {
    console.log(
      `
      SELECT 
        A.id idmotivoatencion
        , A.nombre nombremotivoatencion
          , COUNT(A.id) totalmotivosatencion
      FROM
        motivoatencion A
        , motivoatencionsucursal B
          LEFT JOIN historicogeneraticketatencion C ON B.id = C.motivoAtencionSucursal_id
      WHERE 
        A.tipo = 'D'
          AND A.id = B.motivoAtencion_id
          AND (C.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
          AND B.sucursal_id = '`+req.params.idsucursal+`'
          AND B.cliente_idCliente = '`+req.params.idcliente+`'
      GROUP BY A.id 
      `
    )

    connection.query(
      `
      SELECT 
        A.id idmotivoatencion
        , A.nombre nombremotivoatencion
          , COUNT(A.id) totalmotivosatencion
      FROM
        motivoatencion A
        , motivoatencionsucursal B
          LEFT JOIN historicogeneraticketatencion C ON B.id = C.motivoAtencionSucursal_id
      WHERE 
        A.tipo = 'D'
          AND A.id = B.motivoAtencion_id
          AND (C.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
          AND B.sucursal_id = '`+req.params.idsucursal+`'
          AND B.cliente_idCliente = '`+req.params.idcliente+`'
      GROUP BY A.id 
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });

  // Listar las zonas del pais seleccionado
  router.get("/reportemotivosatendidos/:idcliente/:idsucursal/:fechaI/:fechaF/:accion1", function(req, res) {
    /*console.log(
      `
      -- Atendidos
      SELECT
        A.id idmotivoatencion
        , A.nombre nombremotivoatencion
          , COUNT(A.id) totalmotivosatencion
      FROM
        motivoatencion A
        , motivoatencionsucursal B
          LEFT JOIN historicogeneraticketatencion C ON B.id = C.motivoAtencionSucursal_id -- AND C.estado = 6
          LEFT JOIN historicoasociamoduloticketatencion D ON D.historicoGeneraTicketAtencion_id = C.id -- AND C.estado = 6
          LEFT JOIN historicogeneraticketderivado E ON D.historicoGeneraTicketAtencion_id = E.id -- AND E.estado = 8
      WHERE
        A.tipo = 'D'
          AND A.id = B.motivoAtencion_id
          AND (C.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
          AND B.sucursal_id = '`+req.params.idsucursal+`'
          AND (D.accion = '`+req.params.accion1+`')
      GROUP BY C.motivoAtencionSucursal_id
      `
    )*/

    connection.query(
      `
      -- Atendidos Normal
      SELECT 
        A.id idmotivoatencion
        , A.nombre nombremotivoatencion
          , COUNT(A.id) totalmotivosatencion
      FROM
        motivoatencion A
        , motivoatencionsucursal B
          LEFT JOIN historicogeneraticketatencion C ON B.id = C.motivoAtencionSucursal_id -- AND C.estado = 6
          LEFT JOIN historicoasociamoduloticketatencion D ON D.historicoGeneraTicketAtencion_id = C.id -- AND C.estado = 6
          LEFT JOIN historicogeneraticketderivado E ON D.historicoGeneraTicketAtencion_id = E.id -- AND E.estado = 8
      WHERE 
        A.tipo = 'D'
          AND A.id = B.motivoAtencion_id
          AND (C.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
          AND B.sucursal_id = '`+req.params.idsucursal+`'
          AND (D.accion = '`+req.params.accion1+`')
      GROUP BY C.motivoAtencionSucursal_id  
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });


  router.get("/reportetiempoatencionmotivos/:idsucursal/:fechaI/:fechaF", function(req, res) {
    console.log(
      `reportetiempoatencionmotivos`,
      `
      -- CALCULO DEL PORCENTAJE DENTRO DEL TIEMPO OBJETIVO MOTIVOS
        select 
         AA.codigo
        , AA.atencionesDentroTiempoObjetivo
        , CC.nombre nombremotivoatencion
        from (select codigo, ((sum(objetivo)/sum(total))*100) as atencionesDentroTiempoObjetivo from ( select A.codigo, "1" as total, (case when(atencionPromedio)<=(tiempoMaximoAtencion*60)then 1 else 0 end) as objetivo from (select (case when (select id from historicoasociamoduloticketatencion where hora < t1.hora and accion = 7 and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id limit 1) then (select codigoDespliegue from motivoatencionsucursal A, historicogeneraticketderivado B  where A.id = B.motivoAtencionSucursal_id_d and B.id = (select historicoGeneraTicketDerivado_id from historicoasociamoduloticketatencion where accion=7 and hora < t1.hora and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id order by hora desc limit 1)) else (select codigoDespliegue from historicogeneraticketatencion where id = t1.historicoGeneraTicketAtencion_id) end ) as codigo, (TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora))) as atencionPromedio 
        from historicoasociamoduloticketatencion t1, historicoasociamoduloticketatencion t2, historicogeneraticketatencion H, motivoatencionsucursal M
        where t1.accion = 3 and (t2.accion = 6 or t2.accion = 7) and t1.historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and t1.hora < t2.hora and (t1.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and t1.historicoGeneraTicketAtencion_id = H.id and H.motivoAtencionSucursal_id = M.id and M.sucursal_id = '`+req.params.idsucursal+`'
        and t2.id = (select id from historicoasociamoduloticketatencion where historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and (accion = 6 or accion = 7) and hora > t1.hora order by hora asc limit 1)) as A
        left join
        (select * from motivoatencionsucursal) B on A.codigo = B.codigoDespliegue) as resumenObjetivo group by codigo) as AA
        left join
        (select * from motivoatencionsucursal) as BB
        on AA.codigo = BB.codigoDespliegue
        left join
        (select * from motivoatencion) CC
        on CC.id = BB.motivoatencion_id
      `
    )

    connection.query(
      `
      -- CALCULO DEL PORCENTAJE DENTRO DEL TIEMPO OBJETIVO MOTIVOS
        select 
         AA.codigo
        , AA.atencionesDentroTiempoObjetivo
        , CC.nombre nombremotivoatencion
        from (select codigo, ((sum(objetivo)/sum(total))*100) as atencionesDentroTiempoObjetivo from ( select A.codigo, "1" as total, (case when(atencionPromedio)<=(tiempoMaximoAtencion*60)then 1 else 0 end) as objetivo from (select (case when (select id from historicoasociamoduloticketatencion where hora < t1.hora and accion = 7 and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id limit 1) then (select codigoDespliegue from motivoatencionsucursal A, historicogeneraticketderivado B  where A.id = B.motivoAtencionSucursal_id_d and B.id = (select historicoGeneraTicketDerivado_id from historicoasociamoduloticketatencion where accion=7 and hora < t1.hora and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id order by hora desc limit 1)) else (select codigoDespliegue from historicogeneraticketatencion where id = t1.historicoGeneraTicketAtencion_id) end ) as codigo, (TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora))) as atencionPromedio 
        from historicoasociamoduloticketatencion t1, historicoasociamoduloticketatencion t2, historicogeneraticketatencion H, motivoatencionsucursal M
        where t1.accion = 3 and (t2.accion = 6 or t2.accion = 7) and t1.historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and t1.hora < t2.hora and (t1.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and t1.historicoGeneraTicketAtencion_id = H.id and H.motivoAtencionSucursal_id = M.id and M.sucursal_id = '`+req.params.idsucursal+`'
        and t2.id = (select id from historicoasociamoduloticketatencion where historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and (accion = 6 or accion = 7) and hora > t1.hora order by hora asc limit 1)) as A
        left join
        (select * from motivoatencionsucursal) B on A.codigo = B.codigoDespliegue) as resumenObjetivo group by codigo) as AA
        left join
        (select * from motivoatencionsucursal) as BB
        on AA.codigo = BB.codigoDespliegue
        left join
        (select * from motivoatencion) CC
        on CC.id = BB.motivoatencion_id
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });


  router.get("/tiempoesperamotivos/:idsucursal/:fechaI/:fechaF", function(req, res) {
    /*console.log(
      `tiempoesperamotivos`,
      `
          -- CALCULO DEL TIEMPO PROMEDIO ESPERA MOTIVOS
        select AA.codigo, AA.esperaColaPromedio, CC.nombre from (select A.codigoDespliegue as codigo, time_to_sec(SEC_TO_TIME((sum(TIMEDIFF(B.hora, A.hora))/count(A.hora)))) as esperaColaPromedio
        from motivoatencionsucursal M, historicogeneraticketatencion A
        left join historicoasociamoduloticketatencion B on A.id = B.historicoGeneraTicketAtencion_id
        where B.accion = 5 and A.motivoAtencionSucursal_id = M.id and M.sucursal_id = '`+req.params.idsucursal+`' and (A.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and B.id = (select id from historicoasociamoduloticketatencion
          where historicoGeneraTicketAtencion_id = A.id and accion = 5 order by hora asc limit 1) group by codigo) AA
        left join
        (select * from motivoatencionsucursal) as BB
        on AA.codigo = BB.codigoDespliegue
        left join
        (select * from motivoatencion) CC
        on CC.id = BB.motivoatencion_id
      `
    )
    */

    connection.query(
      `
          -- CALCULO DEL TIEMPO PROMEDIO ESPERA MOTIVOS
        select AA.codigo, AA.esperaColaPromedio, CC.nombre from (select A.codigoDespliegue as codigo, time_to_sec(SEC_TO_TIME((sum(TIMEDIFF(B.hora, A.hora))/count(A.hora)))) as esperaColaPromedio 
        from motivoatencionsucursal M, historicogeneraticketatencion A
        left join historicoasociamoduloticketatencion B on A.id = B.historicoGeneraTicketAtencion_id 
        where B.accion = 5 and A.motivoAtencionSucursal_id = M.id and M.sucursal_id = '`+req.params.idsucursal+`' and (A.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and B.id = (select id from historicoasociamoduloticketatencion 
          where historicoGeneraTicketAtencion_id = A.id and accion = 5 order by hora asc limit 1) group by codigo) AA
        left join
        (select * from motivoatencionsucursal) as BB
        on AA.codigo = BB.codigoDespliegue
        left join
        (select * from motivoatencion) CC
        on CC.id = BB.motivoatencion_id
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  })

  router.get("/tiempopromedioatencion/:idsucursal/:fechaI/:fechaF", function(req, res) {
    /*console.log(
      `tiempopromedioatencion`,
      `
          -- CALCULO DEL TIEMPO DE PROMEDIO ATENCION
        select AA.codigo, AA.atencionPromedio, CC.nombre from (select (case when (select id from historicoasociamoduloticketatencion where hora < t1.hora and accion = 7 and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id limit 1) then (select codigoDespliegue from motivoatencionsucursal A, historicogeneraticketderivado B where A.id = B.motivoAtencionSucursal_id_d and B.id = (select historicoGeneraTicketDerivado_id from historicoasociamoduloticketatencion where accion=7 and hora < t1.hora and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id order by hora desc limit 1)) else (select codigoDespliegue from historicogeneraticketatencion where id = t1.historicoGeneraTicketAtencion_id) end ) as codigo, time_to_sec(SEC_TO_TIME((sum(TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora)))/count(t1.hora)))) as atencionPromedio
        from historicoasociamoduloticketatencion t1, historicoasociamoduloticketatencion t2, historicogeneraticketatencion H, motivoatencionsucursal M
        where t1.accion = 3 and (t2.accion = 6 or t2.accion = 7) and t1.historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and t1.hora < t2.hora and (t1.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and t1.historicoGeneraTicketAtencion_id = H.id and H.motivoAtencionSucursal_id = M.id and M.sucursal_id = '`+req.params.idsucursal+`'
        and t2.id = (select id from historicoasociamoduloticketatencion where historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and (accion = 6 or accion = 7) and hora > t1.hora order by hora asc limit 1) group by codigo) as AA
        left join
        (select * from motivoatencionsucursal) as BB
        on AA.codigo = BB.codigoDespliegue
        left join
        (select * from motivoatencion) CC
        on CC.id = BB.motivoatencion_id
      `
    )
    */

    connection.query(
      `
          -- CALCULO DEL TIEMPO DE PROMEDIO ATENCION
        select AA.codigo, AA.atencionPromedio, CC.nombre from (select (case when (select id from historicoasociamoduloticketatencion where hora < t1.hora and accion = 7 and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id limit 1) then (select codigoDespliegue from motivoatencionsucursal A, historicogeneraticketderivado B where A.id = B.motivoAtencionSucursal_id_d and B.id = (select historicoGeneraTicketDerivado_id from historicoasociamoduloticketatencion where accion=7 and hora < t1.hora and t1.historicoGeneraTicketAtencion_id = historicoGeneraTicketAtencion_id order by hora desc limit 1)) else (select codigoDespliegue from historicogeneraticketatencion where id = t1.historicoGeneraTicketAtencion_id) end ) as codigo, time_to_sec(SEC_TO_TIME((sum(TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora)))/count(t1.hora)))) as atencionPromedio 
        from historicoasociamoduloticketatencion t1, historicoasociamoduloticketatencion t2, historicogeneraticketatencion H, motivoatencionsucursal M
        where t1.accion = 3 and (t2.accion = 6 or t2.accion = 7) and t1.historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and t1.hora < t2.hora and (t1.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and t1.historicoGeneraTicketAtencion_id = H.id and H.motivoAtencionSucursal_id = M.id and M.sucursal_id = '`+req.params.idsucursal+`'
        and t2.id = (select id from historicoasociamoduloticketatencion where historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id and (accion = 6 or accion = 7) and hora > t1.hora order by hora asc limit 1) group by codigo) as AA
        left join
        (select * from motivoatencionsucursal) as BB
        on AA.codigo = BB.codigoDespliegue
        left join
        (select * from motivoatencion) CC
        on CC.id = BB.motivoatencion_id
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  })

  // (+) Reportes Ejecutivos
  router.get("/promedionumerossolicititadosejecutivo/:idsucursal/:fechaI/:fechaF", function(req, res) {
    console.log(
      `promedionumerossolicititadosejecutivo`,
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, A.promedioNumerosSolicitados from
      (select idEjecutivo, idMotivoSucursal, count(id) promedioNumerosSolicitados from historicoresumenticket 
      where estadoInicial = 1 and(fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring(id, 1, 8) = '`+req.params.idsucursal+`' group by idEjecutivo) A
      left join
      (select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
      on A.idEjecutivo = B.idEjecutivo
      left join
      (select MAS.id idmotivoatencion, MA.nombre nombreMotivo from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
      on A.idMotivoSucursal = C.idmotivoatencion;
      `
    )


    connection.query(
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, A.promedioNumerosSolicitados from
      (select idEjecutivo, idMotivoSucursal, count(id) promedioNumerosSolicitados from historicoresumenticket 
      where estadoInicial = 1 and(fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring(id, 1, 8) = '`+req.params.idsucursal+`' group by idEjecutivo) A
      left join
      (select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
      on A.idEjecutivo = B.idEjecutivo
      left join
      (select MAS.id idmotivoatencion, MA.nombre nombreMotivo from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
      on A.idMotivoSucursal = C.idmotivoatencion;
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/porcentajetiempoobjetivoejecutivo/:idsucursal/:fechaI/:fechaF", function(req, res) {
    console.log(
      `atencionesdentrotiempoobjetivoejecutivo`,
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, CAST(((atencionesDentroObjetivo/atenciones)*100) as unsigned) atencionesDentroTiempoObjetivo
from
(select idEjecutivo, idMotivoSucursal, count(HRT.id) atenciones, tiempoAtencion,
sum(case when ( time_to_sec(HRT.tiempoAtencion)/60) <= MAS1.tiempoMaximoAtencion then 1 else 0 end) atencionesDentroObjetivo
from historicoresumenticket HRT, motivoatencionsucursal MAS1 where HRT.idMotivoSucursal = MAS1.id
and estadoInicial = 1 and tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring( HRT.id, 1, 8) = '`+req.params.idsucursal+`' group by idEjecutivo) A
left join
(select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
on A.idEjecutivo = B.idEjecutivo
left join
(select MAS.id idmotivoatencion, MA.nombre nombreMotivo, MAS.tiempoMaximoAtencion from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
on A.idMotivoSucursal = C.idmotivoatencion;
      `
    )

    connection.query(
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, CAST(((atencionesDentroObjetivo/atenciones)*100) as unsigned) atencionesDentroTiempoObjetivo
from
(select idEjecutivo, idMotivoSucursal, count(HRT.id) atenciones, tiempoAtencion,
sum(case when ( time_to_sec(HRT.tiempoAtencion)/60) <= MAS1.tiempoMaximoAtencion then 1 else 0 end) atencionesDentroObjetivo
from historicoresumenticket HRT, motivoatencionsucursal MAS1 where HRT.idMotivoSucursal = MAS1.id
and estadoInicial = 1 and tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring( HRT.id, 1, 8) = '`+req.params.idsucursal+`' group by idEjecutivo) A
left join
(select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
on A.idEjecutivo = B.idEjecutivo
left join
(select MAS.id idmotivoatencion, MA.nombre nombreMotivo, MAS.tiempoMaximoAtencion from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
on A.idMotivoSucursal = C.idmotivoatencion;
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/porcentajenumerosatendidosejecutivo/:idsucursal/:fechaI/:fechaF", function(req, res) {
    console.log(
      `porcentajenumerosatendidosejecutivos`,
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, CAST(((A.numerosAtendidos/D.atencionesMotivo)*100) as unsigned) porcentajeAtendidos from
(select idEjecutivo, idMotivoSucursal, count(id) numerosAtendidos from historicoresumenticket 
where estadoInicial = 1 and tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring(id, 1, 8) = '11102101' group by idEjecutivo, idMotivoSucursal) A
left join
(select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
on A.idEjecutivo = B.idEjecutivo
left join
(select MAS.id idmotivoatencion, MA.nombre nombreMotivo from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
on A.idMotivoSucursal = C.idmotivoatencion
left join
(select idMotivoSucursal, count(idMotivoSucursal) atencionesMotivo from historicoresumenticket 
where estadoInicial = 1 and tiempoAtencion is not null and substring(id, 1, 8) = '`+req.params.idsucursal+`' and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idMotivoSucursal) D
on A.idMotivoSucursal = D.idMotivoSucursal;
      `
    )


    connection.query(
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, CAST(((A.numerosAtendidos/D.atencionesMotivo)*100) as unsigned) porcentajeAtendidos from
(select idEjecutivo, idMotivoSucursal, count(id) numerosAtendidos from historicoresumenticket 
where estadoInicial = 1 and tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring(id, 1, 8) = '11102101' group by idEjecutivo, idMotivoSucursal) A
left join
(select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
on A.idEjecutivo = B.idEjecutivo
left join
(select MAS.id idmotivoatencion, MA.nombre nombreMotivo from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
on A.idMotivoSucursal = C.idmotivoatencion
left join
(select idMotivoSucursal, count(idMotivoSucursal) atencionesMotivo from historicoresumenticket 
where estadoInicial = 1 and tiempoAtencion is not null and substring(id, 1, 8) = '`+req.params.idsucursal+`' and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idMotivoSucursal) D
on A.idMotivoSucursal = D.idMotivoSucursal;
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/tiempopromedioatencionejecutivo/:idsucursal/:fechaI/:fechaF", function(req, res) {
    console.log(
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, A.atencionPromedio from
(select idEjecutivo, idMotivoSucursal, cast((sum(time_to_sec(tiempoAtencion)/1)/count(id)) as unsigned) atencionPromedio from historicoresumenticket 
where estadoInicial = 1 and tiempoAtencion is not null and(fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring(id, 1, 8) = '`+req.params.idsucursal+`' group by idEjecutivo) A
left join
(select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
on A.idEjecutivo = B.idEjecutivo
left join
(select MAS.id idmotivoatencion, MA.nombre nombreMotivo from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
on A.idMotivoSucursal = C.idmotivoatencion;
      `
    )

    connection.query(
      `
      select A.idEjecutivo, B.nombreEjecutivo, C.nombreMotivo, C.idmotivoatencion, A.atencionPromedio from
(select idEjecutivo, idMotivoSucursal, cast((sum(time_to_sec(tiempoAtencion)/1)/count(id)) as unsigned) atencionPromedio from historicoresumenticket 
where estadoInicial = 1 and tiempoAtencion is not null and(fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring(id, 1, 8) = '`+req.params.idsucursal+`' group by idEjecutivo) A
left join
(select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
on A.idEjecutivo = B.idEjecutivo
left join
(select MAS.id idmotivoatencion, MA.nombre nombreMotivo from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
on A.idMotivoSucursal = C.idmotivoatencion;
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });

  // (-) Reportes Ejecutivos

  router.get("/numerosatencionabiertos/:idmotivoatencionsucursal/:idsucursal", function(req, res) {
    console.log(
      `
      select 
        concat(A.codigoDespliegue,A.numeroCorrelativoTicket) numeroMostrar
          , C.nombre
          , A.estado
          , A.hora
          , (case when A.estado = 1 then 0 else (select sec_to_time(time_to_sec(timediff(D.hora, A.hora)))
      from 
        asociamoduloticketatenciondiaria D 
          where generaTicketAtencionDiaria_id = A.id 
          and D.accion <> 1 
          order by D.id asc limit 1) end) 
          tiempoEspera 
          from generaticketatenciondiaria A
          , motivoatencionsucursal B
          , motivoatencion C
      where 
        C.id = B.motivoAtencion_id 
          and B.id = A.motivoAtencionSucursal_id 
          and A.estado <> 6 
          and A.estado <> 8
          and (A.motivoAtencionSucursal_id = '`+req.params.idmotivoatencionsucursal+`' or '`+req.params.idmotivoatencionsucursal+`' = '0')
          and B.sucursal_id = '`+req.params.idsucursal+`'
      `
    );

    connection.query(
      `
      select 
        concat(A.codigoDespliegue,A.numeroCorrelativoTicket) numeroMostrar
          , C.nombre
          , A.estado
          , A.hora
          , (case when A.estado = 1 then 0 else (select sec_to_time(time_to_sec(timediff(D.hora, A.hora)))
      from 
        asociamoduloticketatenciondiaria D 
          where generaTicketAtencionDiaria_id = A.id 
          and D.accion <> 1 
          order by D.id asc limit 1) end) 
          tiempoEspera 
          from generaticketatenciondiaria A
          , motivoatencionsucursal B
          , motivoatencion C
      where 
        C.id = B.motivoAtencion_id 
          and B.id = A.motivoAtencionSucursal_id 
          and A.estado <> 6 
          and A.estado <> 8
          and (A.motivoAtencionSucursal_id = '`+req.params.idmotivoatencionsucursal+`' or '`+req.params.idmotivoatencionsucursal+`' = '0')
          and B.sucursal_id = '`+req.params.idsucursal+`'
      `
      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });

  router.get("/numerosatencioncerrados/:idcodigo/:idsucursal/:fechaI/:fechaF/:idejecutivo", function(req, res) {
    console.log(
      `
      select * from(
select HRT.fecha fechaCompleta, Date_format(HRT.fecha,'%d-%m-%Y') fecha, concat(HGTA.codigoDespliegue, HGTA.numeroCorrelativoTicket) numeroMostrar,
MA.nombre motivo,
M.codigo modulo,
concat(E.nombres,' ',E.apellidoPaterno) Agente,
HRT.inicio,
HRT.tiempoEspera,
(case when HRT.tiempoAtencion is not null then HRT.tiempoAtencion else 'Distraido' end) duracion
from historicoresumenticket HRT, ejecutivo E, motivoatencionsucursal MAS, motivoatencion MA, historicogeneraticketatencion HGTA, modulo M
where HRT.idEjecutivo = E.id and HRT.idMotivoSucursal = MAS.id and MA.id = MAS.motivoAtencion_id and HGTA.id = HRT.idGeneraTicketAtencionDiaria and M.id = HRT.idModulo
and (HRT.estadoFinal = 6 or HRT.estadoFinal = 7 or HRT.estadoFinal = 8)
and (HRT.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
and (MAS.codigoDespliegue = '`+req.params.idcodigo+`' or '`+req.params.idcodigo+`' = '0')
and (HRT.idEjecutivo = '`+req.params.idejecutivo+`' or '`+req.params.idejecutivo+`' = '0')) AA order by fechaCompleta asc;
      `
    );

    connection.query(
      `
      select * from(
select HRT.fecha fechaCompleta, Date_format(HRT.fecha,'%d-%m-%Y') fecha, concat(HGTA.codigoDespliegue, HGTA.numeroCorrelativoTicket) numeroMostrar,
MA.nombre motivo,
M.codigo modulo,
concat(E.nombres,' ',E.apellidoPaterno) Agente,
HRT.inicio,
HRT.tiempoEspera,
(case when HRT.tiempoAtencion is not null then HRT.tiempoAtencion else 'Distraido' end) duracion
from historicoresumenticket HRT, ejecutivo E, motivoatencionsucursal MAS, motivoatencion MA, historicogeneraticketatencion HGTA, modulo M
where HRT.idEjecutivo = E.id and HRT.idMotivoSucursal = MAS.id and MA.id = MAS.motivoAtencion_id and HGTA.id = HRT.idGeneraTicketAtencionDiaria and M.id = HRT.idModulo
and (HRT.estadoFinal = 6 or HRT.estadoFinal = 7 or HRT.estadoFinal = 8)
and (HRT.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
and (MAS.codigoDespliegue = '`+req.params.idcodigo+`' or '`+req.params.idcodigo+`' = '0')
and (HRT.idEjecutivo = '`+req.params.idejecutivo+`' or '`+req.params.idejecutivo+`' = '0')) AA order by fechaCompleta asc;
      `

      , function(err, rows) {
        if(err) {
          //console.log({"error": err});
          res.json([]);// indicamos que la respuesta esta vacía
        } else {
          res.json(rows);
        }
      });
  });

  router.post("/monitoreoatencionlinearesumen", function(req, res) {
    var inDatos = ''

    for(var i = 0; i < req.body.sucursalesUsuario.length; i++)
    {
      inDatos+= `'`+req.body.sucursalesUsuario[i].sucursal_id+"',"
    }
    inDatos = inDatos.substr(0, inDatos.length - 1)


    connection.query(
      `
            select 
              idsucursal,
                sucursal,
                motivo,
                sum(ejecutivosActivos) ejecutivosActivos,
                sum(ticketsEmitidos) ticketsEmitidos,
                sum(atencionesHoy) atencionesHoy,
                sum(ticketsEnAtencion) ticketsEnAtencion,
                sum(ticketsEnEspera) ticketsEnEspera,
                atencionPromedio,
                esperaColaPromedio,
                deltaAtencion,
                deltaEspera
            from(
              select 
              A.idsucursal,
              sucursal,
              motivo,
              (case when ejecutivosActivos is not null then ejecutivosActivos else 0 end) as ejecutivosActivos,
              (case when ticketsEmitidos is not null then ticketsEmitidos else 0 end) as ticketsEmitidos,
              (case when atencionesHoy is not null then atencionesHoy else 0 end) as atencionesHoy,
              (case when ticketsEnAtencion is not null then ticketsEnAtencion else 0 end) as ticketsEnAtencion,
              (case when ticketsEnEspera is not null then ticketsEnEspera else 0 end) as ticketsEnEspera,
              (case when atencionPromedio is not null then substring(atencionPromedio,1,8) else 0 end) as atencionPromedio,
              (case when esperaColaPromedio is not null then substring(esperaColaPromedio,1,8)  else 0 end) as esperaColaPromedio,
                (case when atencionPromedio is not null then (case when atencionPromedio > sec_to_time(tiempoMaximoAtencion*60) then substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,8) end) else 0 end) as deltaAtencion,
                (case when esperaColaPromedio is not null then (case when esperaColaPromedio > sec_to_time(tiempoMaximoEsperaCola*60) then substring((timediff(sec_to_time(tiempoMaximoEsperaCola*60),esperaColaPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoEsperaCola*60),esperaColaPromedio)),1,8) end) else 0 end) as deltaEspera
              from
              (select id idsucursal, nombre sucursal from sucursal where id in (`+inDatos+`)) A
              left join
              (select MAS.sucursal_id idSucursal, MAS.id idMotivoSucursal, MA.nombre motivo, MAS.tiempoMaximoAtencion, MAS.tiempoMaximoEsperaCola from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id and MAS.estado = 1) B
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
            ) AA group by idsucursal order by sucursal asc
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          console.log("monitoreoatencionlinearesumen: "+JSON.stringify(rows))
          res.json(rows);
        }
      });
  });

  router.post("/monitoreoatencionlinea", function(req, res) {
    var inDatos = ''

    for(var i = 0; i < req.body.sucursalesUsuario.length; i++)
    {
      inDatos+= `'`+req.body.sucursalesUsuario[i].sucursal_id+"',"
    }
    inDatos = inDatos.substr(0, inDatos.length - 1)

    connection.query(
      `
      select * from(
  select 
  A.idsucursal,
  sucursal,
  motivo,
  (case when ejecutivosActivos is not null then ejecutivosActivos else 0 end) as ejecutivosActivos,
  (case when ticketsEmitidos is not null then ticketsEmitidos else 0 end) as ticketsEmitidos,
  (case when atencionesHoy is not null then atencionesHoy else 0 end) as atencionesHoy,
  (case when ticketsEnAtencion is not null then ticketsEnAtencion else 0 end) as ticketsEnAtencion,
  (case when ticketsEnEspera is not null then ticketsEnEspera else 0 end) as ticketsEnEspera,
  (case when atencionPromedio is not null then substring(atencionPromedio,1,8) else 0 end) as atencionPromedio,
  (case when esperaColaPromedio is not null then substring(esperaColaPromedio,1,8)  else 0 end) as esperaColaPromedio,
    (case when atencionPromedio is not null then (case when atencionPromedio > sec_to_time(tiempoMaximoAtencion*60) then substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,8) end) else 0 end) as deltaAtencion,
    (case when esperaColaPromedio is not null then (case when esperaColaPromedio > sec_to_time(tiempoMaximoEsperaCola*60) then substring((timediff(sec_to_time(tiempoMaximoEsperaCola*60),esperaColaPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoEsperaCola*60),esperaColaPromedio)),1,8) end) else 0 end) as deltaEspera
  from
  (select id idsucursal, nombre sucursal from sucursal where id in (`+inDatos+`)) A
  left join
  (select MAS.sucursal_id idSucursal, MAS.id idMotivoSucursal, MA.nombre motivo, MAS.tiempoMaximoAtencion, MAS.tiempoMaximoEsperaCola from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id and MAS.estado = 1) B
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
) AA order by sucursal, motivo asc
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          console.log("monitoreoatencionlinea: "+JSON.stringify(rows))
          res.json(rows);
        }
      });
  });

  router.get("/monitoreoatencionlinearesumenejecutivo/:idsucursal", function(req, res) {
    console.log(
      `
        select
          nombreEjecutivo,
            sum(atendidos) atendidos,
            sum(enAtencion) enAtencion,
            substring(sec_to_time(sum(time_to_sec(atencionPromedio))/count(atencionPromedio)),1,8) atencionPromedio,
                  enPausa,
                  nombrePausa,
                  ejecutivoActivo
        from (
            select 
              nombreEjecutivo,
                motivo,
                atendidos,
                (case when enAtencion is not null then enAtencion else 0 end) as enAtencion,
                substring(atencionPromedio,1,8) atencionPromedio,
                (case when atencionPromedio is not null then (case when atencionPromedio > sec_to_time(tiempoMaximoAtencion*60) then substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,8) end) else 0 end) as deltaAtencion,
                          ( case when nombrePausa is not null then 1 else 0 end) enPausa,
                          ( case when nombrePausa is not null then nombrePausa else '' end) nombrePausa,
                          ( case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
            from
            (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) A
            right join
            (select idEjecutivo, idMotivoSucursalAtencion idMotivoSucursal, count(id) atendidos, sec_to_time((sum(time_to_sec(tiempoAtencion))/count(id))) atencionPromedio from resumenticket 
            where estadoInicial = 1 and (estadofinal = 6 or estadofinal = 7) and substring(id,1,8) = '`+req.params.idsucursal+`' group by idEjecutivo, idMotivoSucursal) B
            on A.id = B.idEjecutivo
            left join
            (select idEjecutivo, idmotivosucursalatencion idMotivoSucursal, count(id) enAtencion from resumenticket where estadoInicial = 1 and inicioAtencion is not null and estadoFinal = 0 and fin is null group by idEjecutivo, idMotivoSucursalAtencion) C
            on B.idEjecutivo = C.idEjecutivo and B.idMotivoSucursal = C.idMotivoSucursal
            left join
            (select MAS.sucursal_id idSucursal, MAS.id idMotivoSucursal, MA.nombre motivo, MAS.tiempoMaximoAtencion, MAS.tiempoMaximoEsperaCola from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id and MAS.estado = 1) D
            on B.idMotivoSucursal = D.idMotivoSucursal
                      left join
                      (select RP.idEjecutivo, MP.descripcion nombrePausa from resumenpausa RP, motivopausa MP where RP.idPausa = MP.id and RP.fin is null and substring(RP.id,1,8) = '`+req.params.idsucursal+`') E
                      on E.idEjecutivo = B.idEjecutivo
                      left join
                      (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) F
                      on F.idEjecutivo = B.idEjecutivo
        ) AA where ejecutivoActivo = 1 group by nombreEjecutivo order by nombreEjecutivo, motivo;
        `
    )

    connection.query(
      `
        select
          nombreEjecutivo,
            sum(atendidos) atendidos,
            sum(enAtencion) enAtencion,
            substring(sec_to_time(sum(time_to_sec(atencionPromedio))/count(atencionPromedio)),1,8) atencionPromedio,
                  enPausa,
                  nombrePausa,
                  ejecutivoActivo
        from (
            select 
              nombreEjecutivo,
                motivo,
                atendidos,
                (case when enAtencion is not null then enAtencion else 0 end) as enAtencion,
                substring(atencionPromedio,1,8) atencionPromedio,
                (case when atencionPromedio is not null then (case when atencionPromedio > sec_to_time(tiempoMaximoAtencion*60) then substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,8) end) else 0 end) as deltaAtencion,
                          ( case when nombrePausa is not null then 1 else 0 end) enPausa,
                          ( case when nombrePausa is not null then nombrePausa else '' end) nombrePausa,
                          ( case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
            from
            (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) A
            right join
            (select idEjecutivo, idMotivoSucursalAtencion idMotivoSucursal, count(id) atendidos, sec_to_time((sum(time_to_sec(tiempoAtencion))/count(id))) atencionPromedio from resumenticket 
            where estadoInicial = 1 and (estadofinal = 6 or estadofinal = 7) and substring(id,1,8) = '`+req.params.idsucursal+`' group by idEjecutivo, idMotivoSucursal) B
            on A.id = B.idEjecutivo
            left join
            (select idEjecutivo, idmotivosucursalatencion idMotivoSucursal, count(id) enAtencion from resumenticket where estadoInicial = 1 and inicioAtencion is not null and estadoFinal = 0 and fin is null group by idEjecutivo, idMotivoSucursalAtencion) C
            on B.idEjecutivo = C.idEjecutivo and B.idMotivoSucursal = C.idMotivoSucursal
            left join
            (select MAS.sucursal_id idSucursal, MAS.id idMotivoSucursal, MA.nombre motivo, MAS.tiempoMaximoAtencion, MAS.tiempoMaximoEsperaCola from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id and MAS.estado = 1) D
            on B.idMotivoSucursal = D.idMotivoSucursal
                      left join
                      (select RP.idEjecutivo, MP.descripcion nombrePausa from resumenpausa RP, motivopausa MP where RP.idPausa = MP.id and RP.fin is null and substring(RP.id,1,8) = '`+req.params.idsucursal+`') E
                      on E.idEjecutivo = B.idEjecutivo
                      left join
                      (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) F
                      on F.idEjecutivo = B.idEjecutivo
        ) AA where ejecutivoActivo = 1 group by nombreEjecutivo order by nombreEjecutivo, motivo;
        `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
          console.log("Info ejecutivo: "+JSON.stringify(rows))
        }
      });
  });

  router.get("/monitoreoatencionlineaejecutivo/:idsucursal", function(req, res) {
    console.log(
      `
        select * from (
        select 
            nombreEjecutivo,
            motivo,
            atendidos,
            (case when enAtencion is not null then enAtencion else 0 end) as enAtencion,
            substring(atencionPromedio,1,8) atencionPromedio,
            (case when atencionPromedio is not null then (case when atencionPromedio > sec_to_time(tiempoMaximoAtencion*60) then substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,8) end) else 0 end) as deltaAtencion,
            ( case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
          from
          (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) A
          right join
          (select idEjecutivo, idMotivoSucursalAtencion idMotivoSucursal, count(id) atendidos, sec_to_time((sum(time_to_sec(tiempoAtencion))/count(id))) atencionPromedio from resumenticket 
          where estadoInicial = 1 and (estadofinal = 6 or estadofinal = 7) and substring(id,1,8) = '`+req.params.idsucursal+`' group by idEjecutivo, idMotivoSucursal) B
          on A.id = B.idEjecutivo
          left join
          (select idEjecutivo, idmotivosucursalatencion idMotivoSucursal, count(id) enAtencion from resumenticket where estadoInicial = 1 and inicioAtencion is not null and estadoFinal = 0 group by idEjecutivo, idMotivoSucursalAtencion) C
          on B.idEjecutivo = C.idEjecutivo and B.idMotivoSucursal = C.idMotivoSucursal
          left join
          (select MAS.sucursal_id idSucursal, MAS.id idMotivoSucursal, MA.nombre motivo, MAS.tiempoMaximoAtencion, MAS.tiempoMaximoEsperaCola from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id and MAS.estado = 1) D
          on B.idMotivoSucursal = D.idMotivoSucursal
          left join
          (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) E
          on B.idEjecutivo = E.idEjecutivo) AA where ejecutivoActivo = 1 order by nombreEjecutivo, motivo
        `
    )

    connection.query(
      `
        select * from (
        select 
            nombreEjecutivo,
            motivo,
            atendidos,
            (case when enAtencion is not null then enAtencion else 0 end) as enAtencion,
            substring(atencionPromedio,1,8) atencionPromedio,
            (case when atencionPromedio is not null then (case when atencionPromedio > sec_to_time(tiempoMaximoAtencion*60) then substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,9) else substring((timediff(sec_to_time(tiempoMaximoAtencion*60),atencionPromedio)),1,8) end) else 0 end) as deltaAtencion,
            ( case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
          from
          (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) A
          right join
          (select idEjecutivo, idMotivoSucursalAtencion idMotivoSucursal, count(id) atendidos, sec_to_time((sum(time_to_sec(tiempoAtencion))/count(id))) atencionPromedio from resumenticket 
          where estadoInicial = 1 and (estadofinal = 6 or estadofinal = 7) and substring(id,1,8) = '`+req.params.idsucursal+`' group by idEjecutivo, idMotivoSucursal) B
          on A.id = B.idEjecutivo
          left join
          (select idEjecutivo, idmotivosucursalatencion idMotivoSucursal, count(id) enAtencion from resumenticket where estadoInicial = 1 and inicioAtencion is not null and estadoFinal = 0 group by idEjecutivo, idMotivoSucursalAtencion) C
          on B.idEjecutivo = C.idEjecutivo and B.idMotivoSucursal = C.idMotivoSucursal
          left join
          (select MAS.sucursal_id idSucursal, MAS.id idMotivoSucursal, MA.nombre motivo, MAS.tiempoMaximoAtencion, MAS.tiempoMaximoEsperaCola from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id and MAS.estado = 1) D
          on B.idMotivoSucursal = D.idMotivoSucursal
          left join
          (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) E
          on B.idEjecutivo = E.idEjecutivo) AA where ejecutivoActivo = 1 order by nombreEjecutivo, motivo
        `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
          console.log("Info ejecutivo: "+JSON.stringify(rows))
        }
      });
  });

  router.get("/monitoreoatencionlineapausa/:idsucursal", function(req, res) {
    console.log(
      `
        select
          descripcion nombrePausa,
          (case when cantidadPausa is not null then cantidadPausa else 0 end) as cantidadPausa,
          (case when tiempoPausa is not null then tiempoPausa else 0 end) as tiempoPausa,
          (case when promedioPausa is not null then promedioPausa else 0 end) as promedioPausa
          from
          (select MP.id, MP.descripcion from motivopausa MP, motivopausasucursal MPS where MPS.motivoPausa_id = MP.id and MPS.sucursal_id = '`+req.params.idsucursal+`') A
          right join
          (select idpausa, count(id) cantidadPausa, sec_to_time(sum(time_to_sec(duracion))) tiempoPausa, substring(sec_to_time(sum(time_to_sec(duracion))/count(id)),1,8) promedioPausa from resumenpausa where substring(id,1,8) = '`+req.params.idsucursal+`' group by idpausa) B
          on A.id = B.idPausa;
        `
    )

    connection.query(
      `
        select
          descripcion nombrePausa,
          (case when cantidadPausa is not null then cantidadPausa else 0 end) as cantidadPausa,
          (case when tiempoPausa is not null then tiempoPausa else 0 end) as tiempoPausa,
          (case when promedioPausa is not null then promedioPausa else 0 end) as promedioPausa
          from
          (select MP.id, MP.descripcion from motivopausa MP, motivopausasucursal MPS where MPS.motivoPausa_id = MP.id and MPS.sucursal_id = '`+req.params.idsucursal+`') A
          right join
          (select idpausa, count(id) cantidadPausa, sec_to_time(sum(time_to_sec(duracion))) tiempoPausa, substring(sec_to_time(sum(time_to_sec(duracion))/count(id)),1,8) promedioPausa from resumenpausa where substring(id,1,8) = '`+req.params.idsucursal+`' group by idpausa) B
          on A.id = B.idPausa;
        `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
          console.log("Info pausa: "+JSON.stringify(rows))
        }
      });
  });
  router.get("/monitoreoatencionlineapausadetalle/:idsucursal", function(req, res) {
    console.log(
      `
        select * from (
          select
          nombreEjecutivo,
          descripcion nombrePausa,
          (case when cantidadPausa is not null then cantidadPausa else 0 end) as cantidadPausa,
          (case when tiempoPausa is not null then tiempoPausa else 0 end) as tiempoPausa,
          (case when promedioPausa is not null then promedioPausa else 0 end) as promedioPausa,
          (case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
          from 
          (select id, descripcion from motivopausa) A
          right join
          (select idEjecutivo, idPausa, count(id) cantidadPausa, sec_to_time(sum(time_to_sec(duracion))) tiempoPausa, substring(sec_to_time(sum(time_to_sec(duracion))/count(id)),1,8) promedioPausa from resumenpausa where substring(id,1,8) = '`+req.params.idsucursal+`' group by idEjecutivo, idPausa) B
          on A.id = B.idPausa
          left Join
          (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) C
          on B.idEjecutivo = C.id
          left join
          (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) D
          on B.idEjecutivo = D.idEjecutivo
        ) AA
        where ejecutivoActivo = 1
        order by nombreEjecutivo, nombrePausa asc;
        `
    )

    connection.query(
      `
        select * from (
          select
          nombreEjecutivo,
          descripcion nombrePausa,
          (case when cantidadPausa is not null then cantidadPausa else 0 end) as cantidadPausa,
          (case when tiempoPausa is not null then tiempoPausa else 0 end) as tiempoPausa,
          (case when promedioPausa is not null then promedioPausa else 0 end) as promedioPausa,
          (case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
          from 
          (select id, descripcion from motivopausa) A
          right join
          (select idEjecutivo, idPausa, count(id) cantidadPausa, sec_to_time(sum(time_to_sec(duracion))) tiempoPausa, substring(sec_to_time(sum(time_to_sec(duracion))/count(id)),1,8) promedioPausa from resumenpausa where substring(id,1,8) = '`+req.params.idsucursal+`' group by idEjecutivo, idPausa) B
          on A.id = B.idPausa
          left Join
          (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) C
          on B.idEjecutivo = C.id
          left join
          (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) D
          on B.idEjecutivo = D.idEjecutivo
        ) AA
        where ejecutivoActivo = 1
        order by nombreEjecutivo, nombrePausa asc;
        `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
          console.log("Info pausa: "+JSON.stringify(rows))
        }
      });
  });

  router.get("/monitoreoatencionlineacargatrabajo/:idsucursal", function(req, res) {
    console.log(
      `
        select * from(
          select 
            D.nombreEjecutivo,
            A.idEjecutivo,
              A.horasActivo,
              (case when B.numeroAtenciones is not null then B.numeroAtenciones else 0 end) numeroAtenciones,
              (case when B.numeroAtenciones is not null then B.tiempoAtenciones else 0 end) tiempoAtenciones,
              (case when B.numeroAtenciones is not null then cast(((B.tiempoAtenciones/A.horasActivo)*100) as unsigned) else 0 end) porcentajeAtenciones,
              (case when C.numeroPausas is not null then C.numeroPausas else 0 end) numeroPausas,
              (case when C.numeroPausas is not null then C.tiempoPausas else 0 end) tiempoPausas,
              (case when C.numeroPausas is not null then cast(((C.tiempoPausas/A.horasActivo)*100) as unsigned) else 0 end) porcentajePausas,
              (case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
          from
          (select 
            idEjecutivo,
            sec_to_time(sum(time_to_sec(case when fin is null then timediff(curtime(), inicio) else timediff(fin, inicio) end))) horasActivo 
          from 
            resumensesionejecutivo 
          where 
            substring(id,1,8) = '`+req.params.idsucursal+`' 
          group by 
            idEjecutivo
          ) A
          left join
            (select 
              idEjecutivo, 
              count(id) numeroAtenciones, 
              sec_to_time(sum(time_to_sec(tiempoAtencion))) tiempoAtenciones
            from 
              resumenticket
            where
              tiempoAtencion is not null
            group by 
              idEjecutivo
            ) B
            on A.idEjecutivo = B.idEjecutivo
            left join
            (select
              idEjecutivo,
              count(id) numeroPausas,
              sec_to_time(sum(time_to_sec(duracion))) tiempoPausas
            from
              resumenpausa
            where
              duracion is not null 
            group by 
              idEjecutivo) C
            on A.idEjecutivo = C.IdEjecutivo
          left Join
            (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) D
          on A.idEjecutivo = D.id
          left join
            (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) E
          on A.idEjecutivo = E.idEjecutivo
        )AA
        where ejecutivoActivo = 1
        order by nombreEjecutivo asc;

        `
    )

    connection.query(
      `
        select * from(
          select 
            D.nombreEjecutivo,
            A.idEjecutivo,
              A.horasActivo,
              (case when B.numeroAtenciones is not null then B.numeroAtenciones else 0 end) numeroAtenciones,
              (case when B.numeroAtenciones is not null then B.tiempoAtenciones else 0 end) tiempoAtenciones,
              (case when B.numeroAtenciones is not null then cast(((B.tiempoAtenciones/A.horasActivo)*100) as unsigned) else 0 end) porcentajeAtenciones,
              (case when C.numeroPausas is not null then C.numeroPausas else 0 end) numeroPausas,
              (case when C.numeroPausas is not null then C.tiempoPausas else 0 end) tiempoPausas,
              (case when C.numeroPausas is not null then cast(((C.tiempoPausas/A.horasActivo)*100) as unsigned) else 0 end) porcentajePausas,
              (case when ejecutivoActivo is not null then 1 else 0 end) ejecutivoActivo
          from
          (select 
            idEjecutivo,
            sec_to_time(sum(time_to_sec(case when fin is null then timediff(curtime(), inicio) else timediff(fin, inicio) end))) horasActivo 
          from 
            resumensesionejecutivo 
          where 
            substring(id,1,8) = '`+req.params.idsucursal+`' 
          group by 
            idEjecutivo
          ) A
          left join
            (select 
              idEjecutivo, 
              count(id) numeroAtenciones, 
              sec_to_time(sum(time_to_sec(tiempoAtencion))) tiempoAtenciones
            from 
              resumenticket
            where
              tiempoAtencion is not null
            group by 
              idEjecutivo
            ) B
            on A.idEjecutivo = B.idEjecutivo
            left join
            (select
              idEjecutivo,
              count(id) numeroPausas,
              sec_to_time(sum(time_to_sec(duracion))) tiempoPausas
            from
              resumenpausa
            where
              duracion is not null 
            group by 
              idEjecutivo) C
            on A.idEjecutivo = C.IdEjecutivo
          left Join
            (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo where estado = 1) D
          on A.idEjecutivo = D.id
          left join
            (select idEjecutivo, idEjecutivo ejecutivoActivo from resumensesionejecutivo where fin is null group by idEjecutivo) E
          on A.idEjecutivo = E.idEjecutivo
        )AA
        where ejecutivoActivo = 1
        order by nombreEjecutivo asc;
            
        `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          res.json(rows);
          console.log("Info pausa: "+JSON.stringify(rows))
        }
      });
  });


  router.post("/rangoEspera/:fechaI/:fechaF", function(req, res) {
    var inDatos = ''

    for(var i = 0; i < req.body.sucursalesUsuario.length; i++)
    {
      inDatos+= `'`+req.body.sucursalesUsuario[i].sucursal_id+"',"
    }
    inDatos = inDatos.substr(0, inDatos.length - 1)
    console.log("inDatos: "+inDatos)
    console.log(
      `
      select 
      nombreSucursal,
      nombreMotivo,
      emitidos,
      atendidos,
      (case when emitidos > 0 then cast(((atendidos/emitidos)*100) as unsigned) else 0 end) porcentajeAtendidos,
      distraidos,
      (case when emitidos > 0 then cast(((distraidos/emitidos)*100) as unsigned) else 0 end) porcentajeDistraidos,
      esperaColaPromedio,
      deltaEspera
      from (
        select
          A.id idSucursal,
          A.nombre nombreSucursal,
          B.nombre nombreMotivo,
          (case when C.emitidos is not null then C.emitidos else 0 end) emitidos,
          (case when D.atendidos is not null then D.atendidos else 0 end) atendidos,
          (case when E.distraidos is not null then E.distraidos else 0 end) distraidos,
          (case when F.esperaColaPromedio is not null then F.esperaColaPromedio else 0 end) esperaColaPromedio,
          (case when F.esperaColaPromedio is not null then (case when time_to_sec(F.esperaColaPromedio) > (B.tiempoEsperaObjetivo*60) then substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),F.esperaColaPromedio)),1,9) else substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),F.esperaColaPromedio)),1,8) end) else 0 end) as deltaEspera
        from
        (select id, nombre from sucursal where id in (`+inDatos+`)) A
        left join
        (select MAS2.id idMotivoSucursal, MA2.nombre, MAS2.tiempoMaximoAtencion tiempoAtencionObjetivo, MAS2.tiempoMaximoEsperaCola tiempoEsperaObjetivo, MAS2.sucursal_id from motivoatencionsucursal MAS2, motivoatencion MA2 where MAS2.motivoAtencion_id = MA2.id and MAS2.sucursal_id in (`+inDatos+`)) B
        on B.sucursal_id = A.id
        left join
        (select idMotivoSucursal, count(id) emitidos from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and estadoInicial = 1 group by idMotivoSucursal) C
        on C.idMotivoSucursal = B.idMotivoSucursal
        left join
        (select idMotivoSucursal, count(id) atendidos from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and estadoInicial = 1 and (estadoFinal = 6 or estadoFinal = 7) group by idMotivoSucursal) D
        on D.idMotivoSucursal = B.idMotivoSucursal
        left join
        (select idMotivoSucursal, count(id) distraidos from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and estadoInicial = 1 and estadoFinal = 8 and tiempoEspera is not null group by idMotivoSucursal) E
        on E.idMotivoSucursal = B.idMotivoSucursal
        left join
        (select idMotivoSucursal, substring(sec_to_time(sum(time_to_sec(tiempoEspera))/count(id)),1,8) esperaColaPromedio from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and tiempoEspera is not null group by idMotivoSucursal) F
        on F.idMotivoSucursal = B.idMotivoSucursal
      ) AA order by nombreSucursal, nombreMotivo;

            `
    )

    connection.query(
      `
      select 
      nombreSucursal,
      nombreMotivo,
      emitidos,
      atendidos,
      (case when emitidos > 0 then cast(((atendidos/emitidos)*100) as unsigned) else 0 end) porcentajeAtendidos,
      distraidos,
      (case when emitidos > 0 then cast(((distraidos/emitidos)*100) as unsigned) else 0 end) porcentajeDistraidos,
      esperaColaPromedio,
      deltaEspera
      from (
        select
          A.id idSucursal,
          A.nombre nombreSucursal,
          B.nombre nombreMotivo,
          (case when C.emitidos is not null then C.emitidos else 0 end) emitidos,
          (case when D.atendidos is not null then D.atendidos else 0 end) atendidos,
          (case when E.distraidos is not null then E.distraidos else 0 end) distraidos,
          (case when F.esperaColaPromedio is not null then F.esperaColaPromedio else 0 end) esperaColaPromedio,
          (case when F.esperaColaPromedio is not null then (case when time_to_sec(F.esperaColaPromedio) > (B.tiempoEsperaObjetivo*60) then substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),F.esperaColaPromedio)),1,9) else substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),F.esperaColaPromedio)),1,8) end) else 0 end) as deltaEspera
        from
        (select id, nombre from sucursal where id in (`+inDatos+`)) A
        left join
        (select MAS2.id idMotivoSucursal, MA2.nombre, MAS2.tiempoMaximoAtencion tiempoAtencionObjetivo, MAS2.tiempoMaximoEsperaCola tiempoEsperaObjetivo, MAS2.sucursal_id from motivoatencionsucursal MAS2, motivoatencion MA2 where MAS2.motivoAtencion_id = MA2.id and MAS2.sucursal_id in (`+inDatos+`)) B
        on B.sucursal_id = A.id
        left join
        (select idMotivoSucursal, count(id) emitidos from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and estadoInicial = 1 group by idMotivoSucursal) C
        on C.idMotivoSucursal = B.idMotivoSucursal
        left join
        (select idMotivoSucursal, count(id) atendidos from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and estadoInicial = 1 and (estadoFinal = 6 or estadoFinal = 7) group by idMotivoSucursal) D
        on D.idMotivoSucursal = B.idMotivoSucursal
        left join
        (select idMotivoSucursal, count(id) distraidos from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and estadoInicial = 1 and estadoFinal = 8 and tiempoEspera is not null group by idMotivoSucursal) E
        on E.idMotivoSucursal = B.idMotivoSucursal
        left join
        (select idMotivoSucursal, substring(sec_to_time(sum(time_to_sec(tiempoEspera))/count(id)),1,8) esperaColaPromedio from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and tiempoEspera is not null group by idMotivoSucursal) F
        on F.idMotivoSucursal = B.idMotivoSucursal
      ) AA order by nombreSucursal, nombreMotivo;
      
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          console.log("monitoreoatencionlinea: "+JSON.stringify(rows))
          res.json(rows);
        }
      });
  });



  router.post("/resumenPorEjejcutivo/:fechaI/:fechaF", function(req, res) {
    var inDatos = ''

    for(var i = 0; i < req.body.sucursalesUsuario.length; i++)
    {
      inDatos+= `'`+req.body.sucursalesUsuario[i].sucursal_id+"',"
    }
    inDatos = inDatos.substr(0, inDatos.length - 1)
    console.log("inDatos: "+inDatos)
    console.log(
      `
            select * from (
              select
                E.nombre nombreSucursal,
                D.nombreEjecutivo,
                A.idEjecutivo,
                A.horasActivo,
                D.jornada,
                    (cast(((time_to_sec(A.horasActivo)/time_to_sec(D.jornada))*100) as unsigned)) porcentajeActivo,
                        (timediff(D.jornada, A.horasActivo)) horasApagado,
                    (cast(((time_to_sec(timediff(D.jornada, A.horasActivo))/time_to_sec(D.jornada))*100) as unsigned)) porcentajeApagado,
                    A.horas,
                (case when B.numeroAtenciones is not null then B.numeroAtenciones else 0 end) numeroAtenciones,
                (case when B.numeroAtenciones is not null then B.tiempoAtenciones else 0 end) tiempoAtenciones,
                (case when B.numeroAtenciones is not null then cast(((time_to_sec(B.tiempoAtenciones)/time_to_sec(D.jornada))*100) as unsigned) else 0 end) porcentajeAtenciones,
                (case when C.numeroPausas is not null then C.numeroPausas else 0 end) numeroPausas,
                (case when C.numeroPausas is not null then C.tiempoPausas else 0 end) tiempoPausas,
                (case when C.numeroPausas is not null then cast(((time_to_sec(C.tiempoPausas)/time_to_sec(D.jornada))*100) as unsigned) else 0 end) porcentajePausas
              from
              (select (sec_to_time((datediff('`+req.params.fechaF+`' ,'`+req.params.fechaI+`')*36000)+36000)) as horas, idEjecutivo, idModulo, sec_to_time(sum(time_to_sec(case when fin is null then (case when curtime() > inicio then timediff(curtime(), inicio) else timediff( inicio, curtime()) end) else (case when fin > inicio then timediff(fin, inicio) else timediff(inicio, fin) end) end))) horasActivo from historicoresumensesionejecutivo where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idEjecutivo
              ) A
              left join
              (select idEjecutivo, count(id) numeroAtenciones, sec_to_time(sum(time_to_sec(tiempoAtencion))) tiempoAtenciones from historicoresumenticket where tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idEjecutivo) B
              on A.idEjecutivo = B.idEjecutivo
              left join
              (select idEjecutivo, count(id) numeroPausas, sec_to_time(sum(time_to_sec(duracion))) tiempoPausas from historicoresumenpausa where duracion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idEjecutivo) C
              on A.idEjecutivo = C.IdEjecutivo
              left Join
              (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo, sec_to_time(((jornada*60*60)/7)*(datediff('`+req.params.fechaF+`' ,'`+req.params.fechaI+`')+1)) jornada from ejecutivo where estado = 1) D
              on A.idEjecutivo = D.id
                left join
              (select sucursal_id, id idModulo from modulo) F
                on A.idModulo = F.idModulo
                right join
                (select id, nombre from sucursal where id in (`+inDatos+`)) E
                on E.id = F.sucursal_id
            ) AA order by nombreSucursal, nombreEjecutivo ASC;

            `
    )

    connection.query(
      `
            select * from (
              select
                E.nombre nombreSucursal,
                D.nombreEjecutivo,
                A.idEjecutivo,
                A.horasActivo,
                D.jornada,
                    (cast(((time_to_sec(A.horasActivo)/time_to_sec(D.jornada))*100) as unsigned)) porcentajeActivo,
                        (timediff(D.jornada, A.horasActivo)) horasApagado,
                    (cast(((time_to_sec(timediff(D.jornada, A.horasActivo))/time_to_sec(D.jornada))*100) as unsigned)) porcentajeApagado,
                    A.horas,
                (case when B.numeroAtenciones is not null then B.numeroAtenciones else 0 end) numeroAtenciones,
                (case when B.numeroAtenciones is not null then B.tiempoAtenciones else 0 end) tiempoAtenciones,
                (case when B.numeroAtenciones is not null then cast(((time_to_sec(B.tiempoAtenciones)/time_to_sec(D.jornada))*100) as unsigned) else 0 end) porcentajeAtenciones,
                (case when C.numeroPausas is not null then C.numeroPausas else 0 end) numeroPausas,
                (case when C.numeroPausas is not null then C.tiempoPausas else 0 end) tiempoPausas,
                (case when C.numeroPausas is not null then cast(((time_to_sec(C.tiempoPausas)/time_to_sec(D.jornada))*100) as unsigned) else 0 end) porcentajePausas
              from
              (select (sec_to_time((datediff('`+req.params.fechaF+`' ,'`+req.params.fechaI+`')*36000)+36000)) as horas, idEjecutivo, idModulo, sec_to_time(sum(time_to_sec(case when fin is null then (case when curtime() > inicio then timediff(curtime(), inicio) else timediff( inicio, curtime()) end) else (case when fin > inicio then timediff(fin, inicio) else timediff(inicio, fin) end) end))) horasActivo from historicoresumensesionejecutivo where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idEjecutivo
              ) A
              left join
              (select idEjecutivo, count(id) numeroAtenciones, sec_to_time(sum(time_to_sec(tiempoAtencion))) tiempoAtenciones from historicoresumenticket where tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idEjecutivo) B
              on A.idEjecutivo = B.idEjecutivo
              left join
              (select idEjecutivo, count(id) numeroPausas, sec_to_time(sum(time_to_sec(duracion))) tiempoPausas from historicoresumenpausa where duracion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') group by idEjecutivo) C
              on A.idEjecutivo = C.IdEjecutivo
              left Join
              (select id, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo, sec_to_time(((jornada*60*60)/7)*(datediff('`+req.params.fechaF+`' ,'`+req.params.fechaI+`')+1)) jornada from ejecutivo where estado = 1) D
              on A.idEjecutivo = D.id
                left join
              (select sucursal_id, id idModulo from modulo) F
                on A.idModulo = F.idModulo
                right join
                (select id, nombre from sucursal where id in (`+inDatos+`)) E
                on E.id = F.sucursal_id
            ) AA order by nombreSucursal, nombreEjecutivo ASC;
      
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          console.log("monitoreoatencionlinea: "+JSON.stringify(rows))
          res.json(rows);
        }
      });
  });


  router.post("/reporteCargaTrabajo/:fechaI/:fechaF/:hora1/:hora2", function(req, res) {
    var inDatos = ''

    for(var i = 0; i < req.body.sucursalesUsuario.length; i++)
    {
      inDatos+= `'`+req.body.sucursalesUsuario[i].sucursal_id+"',"
    }
    inDatos = inDatos.substr(0, inDatos.length - 1)
    console.log("inDatos: "+inDatos)
    console.log(
      `
      select * from (
        select
          H.fecha,
          A.id idSucursal,
              A.nombre nombreSucursal,
          B.nombre nombreMotivo,
          (case when C.emitidos is not null then C.emitidos else 0 end) emitidos,
          (case when D.atendidos is not null then D.atendidos else 0 end) atendidos,
          (case when E.distraidos is not null then E.distraidos else 0 end) distraidos,
          (case when G.ejecutivosActivos is not null then G.ejecutivosActivos else 0 end) ejecutivosActivos,
          (case when E.distraidos is not null then E.esperaColaPromedio else 0 end) esperaColaPromedio,
          (case when E.esperaColaPromedio is not null then (case when time_to_sec(E.esperaColaPromedio) > (B.tiempoEsperaObjetivo*60) then substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),E.esperaColaPromedio)),1,9) else substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),E.esperaColaPromedio)),1,8) end) else 0 end) as deltaEspera
        from
          (select * from 
        (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) fecha from
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
        where fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') H 
          left join
        (select id, nombre from sucursal where id in (`+inDatos+`)) A
          on 1 = 1
        left join
        (select MAS2.id idMotivoSucursal, MA2.nombre, MAS2.tiempoMaximoAtencion tiempoAtencionObjetivo, MAS2.tiempoMaximoEsperaCola tiempoEsperaObjetivo, MAS2.sucursal_id from motivoatencionsucursal MAS2, motivoatencion MA2 where MAS2.motivoAtencion_id = MA2.id and MAS2.sucursal_id in (`+inDatos+`)) B
        on B.sucursal_id = A.id
        left join
        (select idMotivoSucursal, count(id) emitidos, fecha from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and estadoInicial = 1 group by idMotivoSucursal, fecha) C
        on C.idMotivoSucursal = B.idMotivoSucursal and C.fecha = H.fecha
        left join
        (select idMotivoSucursal, count(id) atendidos, fecha from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and estadoInicial = 1 and tiempoAtencion is not null group by idMotivoSucursal, fecha) D
        on D.idMotivoSucursal = B.idMotivoSucursal and D.fecha = H.fecha
        left join
        (select idMotivoSucursal, count(id) distraidos, fecha,  substring(sec_to_time(sum(time_to_sec(tiempoEspera))/count(id)),1,8) esperaColaPromedio from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and estadoInicial = 1 and estadoFinal = 8 and tiempoEspera is not null group by idMotivoSucursal, fecha) E
        on E.idMotivoSucursal = B.idMotivoSucursal and E.fecha = H.fecha
        left join
        (select idMotivoSucursal, count(idEjecutivo) ejecutivosActivos, fecha from (select idMotivoSucursal, idEjecutivo, fecha from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and idEjecutivo <> 0 group by idEjecutivo, idMotivoSucursal) F group by idMotivoSucursal, fecha) G
        on G.idMotivoSucursal = B.idMotivoSucursal and G.fecha = H.fecha
      ) AA order by fecha, nombreSucursal, nombreMotivo asc;
            `
    )

    connection.query(
      `
      select * from (
        select
          H.fecha,
          A.id idSucursal,
              A.nombre nombreSucursal,
          B.nombre nombreMotivo,
          (case when C.emitidos is not null then C.emitidos else 0 end) emitidos,
          (case when D.atendidos is not null then D.atendidos else 0 end) atendidos,
          (case when E.distraidos is not null then E.distraidos else 0 end) distraidos,
          (case when G.ejecutivosActivos is not null then G.ejecutivosActivos else 0 end) ejecutivosActivos,
          (case when E.distraidos is not null then E.esperaColaPromedio else 0 end) esperaColaPromedio,
          (case when E.esperaColaPromedio is not null then (case when time_to_sec(E.esperaColaPromedio) > (B.tiempoEsperaObjetivo*60) then substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),E.esperaColaPromedio)),1,9) else substring((timediff(sec_to_time(B.tiempoEsperaObjetivo*60),E.esperaColaPromedio)),1,8) end) else 0 end) as deltaEspera
        from
          (select * from 
        (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) fecha from
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
         (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
        where fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') H 
          left join
        (select id, nombre from sucursal where id in (`+inDatos+`)) A
          on 1 = 1
        left join
        (select MAS2.id idMotivoSucursal, MA2.nombre, MAS2.tiempoMaximoAtencion tiempoAtencionObjetivo, MAS2.tiempoMaximoEsperaCola tiempoEsperaObjetivo, MAS2.sucursal_id from motivoatencionsucursal MAS2, motivoatencion MA2 where MAS2.motivoAtencion_id = MA2.id and MAS2.sucursal_id in (`+inDatos+`)) B
        on B.sucursal_id = A.id
        left join
        (select idMotivoSucursal, count(id) emitidos, fecha from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and estadoInicial = 1 group by idMotivoSucursal, fecha) C
        on C.idMotivoSucursal = B.idMotivoSucursal and C.fecha = H.fecha
        left join
        (select idMotivoSucursal, count(id) atendidos, fecha from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and estadoInicial = 1 and tiempoAtencion is not null group by idMotivoSucursal, fecha) D
        on D.idMotivoSucursal = B.idMotivoSucursal and D.fecha = H.fecha
        left join
        (select idMotivoSucursal, count(id) distraidos, fecha,  substring(sec_to_time(sum(time_to_sec(tiempoEspera))/count(id)),1,8) esperaColaPromedio from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and estadoInicial = 1 and estadoFinal = 8 and tiempoEspera is not null group by idMotivoSucursal, fecha) E
        on E.idMotivoSucursal = B.idMotivoSucursal and E.fecha = H.fecha
        left join
        (select idMotivoSucursal, count(idEjecutivo) ejecutivosActivos, fecha from (select idMotivoSucursal, idEjecutivo, fecha from historicoresumenticket 
        where (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and(hour(inicio) between '`+req.params.hora1+`' and '`+req.params.hora2+`') and idEjecutivo <> 0 group by idEjecutivo, idMotivoSucursal) F group by idMotivoSucursal, fecha) G
        on G.idMotivoSucursal = B.idMotivoSucursal and G.fecha = H.fecha
      ) AA order by fecha, nombreSucursal, nombreMotivo asc;
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          console.log("monitoreoatencionlinea: "+JSON.stringify(rows))
          res.json(rows);
        }
      });
  });


  router.post("/reporterankingejecutivo/:fechaI/:fechaF", function(req, res) {
    var inDatos = ''

    for(var i = 0; i < req.body.sucursalesUsuario.length; i++)
    {
      inDatos+= `'`+req.body.sucursalesUsuario[i].sucursal_id+"',"
    }
    inDatos = inDatos.substr(0, inDatos.length - 1)
    console.log("inDatos: "+inDatos)
    console.log(
      `
      select * from ( select A.idEjecutivo, B.nombreEjecutivo, A.atenciones, 
      substring((sec_to_time((time_to_sec(A.tiempoAtencion)/A.atenciones))),1,8) tiempoPromedioAtencion,
      C.nombreMotivo, C.idmotivoatencion, CAST(((atencionesDentroObjetivo/atenciones)*100) as unsigned) atencionesDentroTiempoObjetivo
      from
      (select idEjecutivo, idMotivoSucursal, count(HRT.id) atenciones, sec_to_time(sum(time_to_sec(tiempoAtencion))) tiempoAtencion,
      sum(case when ( time_to_sec(HRT.tiempoAtencion)/60) <= MAS1.tiempoMaximoAtencion then 1 else 0 end) atencionesDentroObjetivo
      from historicoresumenticket HRT, motivoatencionsucursal MAS1 where HRT.idMotivoSucursal = MAS1.id
      and estadoInicial = 1 and tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring( HRT.id, 1, 8) in (`+inDatos+`) group by idEjecutivo) A
      left join
      (select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
      on A.idEjecutivo = B.idEjecutivo
      left join
      (select MAS.id idmotivoatencion, MA.nombre nombreMotivo, MAS.tiempoMaximoAtencion from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
      on A.idMotivoSucursal = C.idmotivoatencion) A order by atenciones desc;

            `
    )

    connection.query(
      `
      select * from ( select A.idEjecutivo, B.nombreEjecutivo, A.atenciones, 
      substring((sec_to_time((time_to_sec(A.tiempoAtencion)/A.atenciones))),1,8) tiempoPromedioAtencion,
      C.nombreMotivo, C.idmotivoatencion, CAST(((atencionesDentroObjetivo/atenciones)*100) as unsigned) atencionesDentroTiempoObjetivo
      from
      (select idEjecutivo, idMotivoSucursal, count(HRT.id) atenciones, sec_to_time(sum(time_to_sec(tiempoAtencion))) tiempoAtencion,
      sum(case when ( time_to_sec(HRT.tiempoAtencion)/60) <= MAS1.tiempoMaximoAtencion then 1 else 0 end) atencionesDentroObjetivo
      from historicoresumenticket HRT, motivoatencionsucursal MAS1 where HRT.idMotivoSucursal = MAS1.id
      and estadoInicial = 1 and tiempoAtencion is not null and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and substring( HRT.id, 1, 8) in (`+inDatos+`) group by idEjecutivo) A
      left join
      (select id idEjecutivo, CONCAT(nombres,' ', apellidoPaterno) nombreEjecutivo from ejecutivo) B
      on A.idEjecutivo = B.idEjecutivo
      left join
      (select MAS.id idmotivoatencion, MA.nombre nombreMotivo, MAS.tiempoMaximoAtencion from motivoatencion MA, motivoatencionsucursal MAS where MA.id = MAS.motivoAtencion_id) C
      on A.idMotivoSucursal = C.idmotivoatencion) A order by atenciones desc;
      
            `
      , function(err, rows) {
        if(err) {
          res.json({"error": err});
        } else {
          console.log("monitoreoatencionlinea: "+JSON.stringify(rows))
          res.json(rows);
        }
      });
  });





}
module.exports = REST_ROUTER;

