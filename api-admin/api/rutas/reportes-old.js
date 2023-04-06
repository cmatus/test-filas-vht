mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

	router.get("/reportemotivossolicitados/:idcliente/:idsucursal/:fechaI/:fechaF", function(req, res) {
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

	router.get("/promedionumerossolicititadosejecutivo/:idsucursal/:fechaI/:fechaF", function(req, res) {
		connection.query(
			`
			select
				A.idEjecutivo as id
				, concat(B.nombres, ' ', B.apellidoPaterno) as nombre
				, (count(A.estado)) as promedioNumerosSolicitados
			from
				historicohistorialatencionejecutivo A
				, ejecutivo B
			where
				A.estado = 6 and A.idEjecutivo = B.id
				and B.sucursal_id = '`+req.params.idsucursal+`'
				and (A.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
			group by idEjecutivo
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
		connection.query(
			`
			select AA.atencionesDentroTiempoObjetivo, CC.nombre from (select t1.idEjecutivo as id, (((sum((case when TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora)) <= (B.tiempoMaximoAtencion*60) then 1 else 0 end)))/count(t1.id))*100) as atencionesDentroTiempoObjetivo
			from historicohistorialatencionejecutivo t1, historicohistorialatencionejecutivo t2, historicogeneraticketatencion A, motivoatencionsucursal B
			where t1.hora < t2.hora and (t1.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and t1.estado = 7 and t2.estado = 8 and B.sucursal_id = `+req.params.idsucursal+` and t1.idEjecutivo = t2.idEjecutivo and A.id = t1.historicoGeneraTicketAtencion_id and A.motivoAtencionSucursal_id = B.id
			and t2.id = (select id from historicohistorialatencionejecutivo t3 where t3.estado = 8 and t3.hora > t1.hora and t3.idEjecutivo = t2.idEjecutivo order by t3.hora asc limit 1)
			group by t1.idEjecutivo) AA
			left join
			(select id, concat(nombres, ' ', apellidoPaterno,' ',apellidoMaterno) as nombre from ejecutivo) CC
			on AA.id = CC.id
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
		connection.query(
			`
			select AA.nombre, ((AA.atendidos/AA.total)*100) as porcentajeAtendidos from (select A.idEjecutivo as id, concat(B.nombres, ' ', B.apellidoPaterno,' ',B.apellidoMaterno) as nombre, count(A.estado) as atendidos, (select count(estado) from historicohistorialatencionejecutivo where estado = 8 and (fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')) total
				from historicohistorialatencionejecutivo A, ejecutivo B
				where A.estado = 8 and A.idEjecutivo = B.id and B.sucursal_id = '`+req.params.idsucursal+`' and (A.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
				group by idEjecutivo) AA
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
		connection.query(
			`
			select concat(A.nombres, ' ', A.apellidoPaterno,' ',A.apellidoMaterno) as nombre, time_to_sec(SEC_TO_TIME((sum(TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora)))))/count(t1.id)) atencionPromedio
			from historicohistorialatencionejecutivo t1, historicohistorialatencionejecutivo t2, ejecutivo A
			where t1.hora < t2.hora and (t1.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`') and t1.estado = 7 and t2.estado = 8 and t1.idEjecutivo = t2.idEjecutivo and A.sucursal_id = '`+req.params.idsucursal+`'
			and t1.idEjecutivo = A.id and t2.id = (select id from historicohistorialatencionejecutivo t3 where t3.estado = 8 and t3.hora > t1.hora and t3.idEjecutivo = t2.idEjecutivo order by t3.hora asc limit 1)
			group by t1.idEjecutivo
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

	router.get("/numerosatencionabiertos/:idmotivoatencionsucursal/:idsucursal", function(req, res) {
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
		connection.query(
			`
			select * from
			(
				select
					t1.id
					, M.codigo as modulo
					, (select concat(nombres,' ',apellidoPaterno,' ',apellidoMaterno) from ejecutivo where id = HHAE.idEjecutivo) as Agente
					, concat(HGTA.codigoDespliegue
					, HGTA.numeroCorrelativoTicket) numeroMostrar
					, t1.accion as accion1
					, t1.hora inicio
					, t2.accion as accion2
					, sec_to_time(TIME_TO_SEC(TIMEDIFF(t2.hora, t1.hora))) duracion
					, (case when (select accion
						from historicoasociamoduloticketatencion
						where id < t1.id and accion = 7
						and historicoGeneraTicketAtencion_id = t1.historicoGeneraTicketAtencion_id) = 7
						then (select A.codigoDespliegue
								from motivoatencionsucursal A
								, historicogeneraticketderivado B
								, historicoasociamoduloticketatencion C
								where A.id = B.motivoAtencionSucursal_id_d
								and C.historicoGeneraTicketDerivado_id = B.id
								and C.id < t1.id and C.accion = 7)
								else (select codigodespliegue from historicogeneraticketatencion where id = t1.historicoGeneraTicketAtencion_id) end) codigo
					from
						historicoasociamoduloticketatencion t1
						, historicoasociamoduloticketatencion t2
						, historicogeneraticketatencion HGTA
						, modulo M
						, historicohistorialatencionejecutivo HHAE
				where t1.historicoGeneraTicketAtencion_id = t2.historicoGeneraTicketAtencion_id
				and t1.fecha <= t2.fecha
				and t1.hora <= t2.hora and t1.accion = 3 and (t2.accion = 6 or t2.accion = 7)
				and t2.id = (select t3.id from historicoasociamoduloticketatencion t3
				where t1.historicoGeneraTicketAtencion_id = t3.historicoGeneraTicketAtencion_id
			    and t1.id < t3.id and (t3.accion = 6 or t3.accion = 7) order by t3.id asc limit 1)
				and t1.historicoGeneraTicketAtencion_id = HGTA.id
				and t1.modulo_id = M.id
				and HHAE.historicoGeneraTicketAtencion_id = t1.historicoGeneraTicketAtencion_id
				and HHAE.modulo_id = t1.modulo_id
				and HHAE.estado = 7
			    and (HHAE.idEjecutivo = '`+req.params.idejecutivo+`' or '`+req.params.idejecutivo+`' = '0')
			    and (HHAE.fecha between '`+req.params.fechaI+`' and '`+req.params.fechaF+`')
				order by t1.id desc) as I
			left join
			(select H.codigoDespliegue codigo, G.nombre as motivo from motivoatencion G, motivoatencionsucursal H where G.id = H.motivoAtencion_id) J
			on I.codigo = J.codigo
			where J.codigo = '`+req.params.idcodigo+`' or '`+req.params.idcodigo+`' = '0'

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


}
module.exports = REST_ROUTER;
