mysql = require("mysql");

/*
express = require('express');
app = express();
server = require('http').Server(app);
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3001');
*/

function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}

// Global
var seleccionados = [];

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {

    router.get("/rol/count", function(req, res) {
        console.log(
            `
            SELECT 
                COUNT(id) ultimoregistro 
            FROM 
                rol
            `
            )
        
        connection.query(
            `
            SELECT 
                COUNT(id) ultimoregistro 
            FROM 
                rol
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/rol/limit", function(req, res) {
        console.log(
            `
            SELECT 
                id ultimoregistro
            FROM 
                gestionfila.rol
            ORDER BY id DESC
            LIMIT 1
            `
            )
        
        connection.query(
            `
            SELECT 
                id ultimoregistro
            FROM 
                rol
            ORDER BY id DESC
            LIMIT 1
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.post("/rol", function(req, res){
        var detalle = req.body.detalle;
        /*console.log(`
            INSERT INTO rol
                (id,
                codigo,
                descripcion,
                flagSincronizado,
                )
            VALUES
                ('`+detalle.id+`',
                '`+detalle.codigo+`',
                '`+detalle.descripcion+`',
                '`+detalle.flagSincronizado+`')
                `
            )
        */
        connection.query(`
            INSERT INTO rol
                (id,
                codigo,
                descripcion,
                flagSincronizado
                )
            VALUES
                ('`+detalle.id+`',
                '`+detalle.codigo+`',
                '`+detalle.descripcion+`',
                '`+detalle.flagSincronizado+`')
            `
            , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.put("/rol/:id", function(req, res){
        console.log(`
            UPDATE rol
            SET
                codigo = '`+req.body.codigo+`',
                descripcion = '`+req.body.descripcion+`',
                flagSincronizado = '`+req.body.flagSincronizado+`'
            WHERE 
                id = '`+req.params.id+`'
            `)
        
        connection.query(`
            UPDATE rol
            SET
                codigo = '`+req.body.codigo+`',
                descripcion = '`+req.body.descripcion+`',
                flagSincronizado = '`+req.body.flagSincronizado+`'
            WHERE 
                id = '`+req.params.id+`'
            `
        , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/rolcliente/count/:idcliente", function(req, res) {
        /*console.log(
            `
            SELECT 
                COUNT(rc.id) ultimoregistro 
            FROM 
                rolcliente rc
            WHERE
                rc.cliente_idCliente = '`+req.params.idcliente+`'
            `
            )
        */
        connection.query(
            `
            SELECT 
                COUNT(rc.id) ultimoregistro 
            FROM 
                rolcliente rc
            WHERE
                rc.cliente_idCliente = '`+req.params.idcliente+`'
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/rolcliente/limit", function(req, res) {
      
        connection.query(
            `
            SELECT 
                id ultimoregistro
            FROM 
                rolcliente
            ORDER BY id DESC
            LIMIT 1
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.post("/rolcliente", function(req, res){
        var detalle = req.body.detalle2;
        
        connection.query(`
            INSERT INTO rolcliente
                (id,
                rol_id,
                cliente_idCliente,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.idrol+`',
                '`+detalle.idcliente+`',
                '`+detalle.flagSincronizado+`')
                `
            , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    // Listar todos los usuarios
    router.get("/rol", function(req, res) {
        connection.query(`SELECT * FROM rol WHERE id != 0 ORDER BY descripcion`, function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });
    
    // Búsqueda usuario por ID
    router.get("/rol/cliente/:idcliente", function(req, res) {
        console.log(
            `
            SELECT 
                r.id
                , r.codigo
                , r.descripcion
                , rc.id idrolcliente
                , rc.cliente_idCliente idcliente
                , c.nombreFantasia
                , c.razonSocial
            FROM
               gestionfila.rolcliente rc
                , gestionfila.rol r
                , gestionfila.cliente c
            WHERE
                rc.cliente_idCliente = '`+req.params.idcliente+`'
                AND rc.rol_id = r.id
                AND c.idCliente = rc.cliente_idCliente
            ORDER BY r.descripcion
            `
        )
        connection.query(
            `
            SELECT 
                r.id
                , r.codigo
                , r.descripcion
                , rc.id idrolcliente
                , rc.cliente_idCliente idcliente
                , c.nombreFantasia
                , c.razonSocial
            FROM
                rolcliente rc
                , rol r
                , cliente c
            WHERE
                rc.cliente_idCliente = '`+req.params.idcliente+`'
                AND rc.rol_id = r.id
                AND c.idCliente = rc.cliente_idCliente
            ORDER BY r.descripcion
            `
            , function(err, rows) {
            if(err) {
                res.json([]);
            } else {
                res.json(rows);
            }
        });
    });

    

    router.post("/rol/permiso", function(req, res){
        var detalle = req.body.detalle;
        /*console.log(`
            INSERT INTO rolpermiso
                (id,
                menuModulo_id,
                permiso_id,
                flagSincronizado,
                rolCliente_id)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.idmenumodulo+`',
                '`+detalle.idpermiso+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idrolcliente+`')
            `
            )
        */
        connection.query(`
            INSERT INTO rolpermiso
                (id,
                menuModulo_id,
                permiso_id,
                flagSincronizado,
                rolCliente_id)
            VALUES
                ('`+detalle.id+`',
                '`+detalle.idmenumodulo+`',
                '`+detalle.idpermiso+`',
                '`+detalle.flagSincronizado+`',
                '`+detalle.idrolcliente+`')
            `
            , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    router.get("/rolmotivosasociados/:idcliente", function(req, res) {
        console.log("buscarInfoAsociada",
            `
            SELECT 
                rcma.idMotivoAtencionSucursal
                , rcma.idRolCliente
            FROM
                gestionfila.rolcliente rc    
                , gestionfila.motivoatencionsucursal mas
                , gestionfila.rolclientemotivoatencionsucursal rcma
            WHERE
                rc.id = rcma.idRolCliente
                AND mas.id = rcma.idMotivoAtencionSucursal
                AND rc.cliente_idCliente = '`+req.params.idcliente+`'
            `
        )   
        connection.query(
            `
            SELECT 
                rcma.idMotivoAtencionSucursal
                , rcma.idRolCliente
            FROM
                gestionfila.rolcliente rc    
                , gestionfila.motivoatencionsucursal mas
                , gestionfila.rolclientemotivoatencionsucursal rcma
            WHERE
                rc.id = rcma.idRolCliente
                AND mas.id = rcma.idMotivoAtencionSucursal
                AND rc.cliente_idCliente = '`+req.params.idcliente+`'
            `

        , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    router.post(
        "/revisarolesmotivosasociados", function(req, res){
        var roles = req.body.rolesJSON;
        var motivos = req.body.motivosJSON;
        var seleccionados = req.body.seleccionadosJSON;
        
        //console.log(JSON.stringify(seleccionados))
        var roles2 = []
        for(var i = 0; i < roles.length; i++){
            var motivos2 = []
            for(var j = 0; j < motivos.length; j++){
                
                for(var x = 0; x < seleccionados.length; x++){
                    if(roles[i].idrolcliente === seleccionados[x].idRolCliente
                        && motivos[j].idmotivoatencionsucursal === seleccionados[x].idMotivoAtencionSucursal
                    ){
                        motivos[j].seleccionado = 1
                        break
                    }
                    motivos[j].seleccionado = 0  
                }


                motivos2.push({
                    idmotivoatencion: motivos[j].idmotivoatencion 
                    , nombremotivoatencion:motivos[j].nombremotivoatencion
                    , seleccionado: motivos[j].seleccionado
                    , idmotivoatencionsucursal: motivos[j].idmotivoatencionsucursal
                }
                )
                motivos[j].seleccionado = 0
                
            }

            roles2.push(
            {
                 id: roles[i].id
                , descripcion: roles[i].descripcion
                , idrolcliente: roles[i].idrolcliente
                , motivos: motivos2
            });
        }

        //console.log(JSON.stringify(roles2))
        res.json(roles2);        

    });




    router.delete("/rolpermiso/:idpermiso/:idmenumodulo/:idrolcliente", function(req, res){
        console.log(
            `
           DELETE FROM 
                gestionfila.rolpermiso
            WHERE 
                permiso_id = '`+req.params.idpermiso+`'
                AND menuModulo_id =  '`+req.params.idmenumodulo+`'
                AND rolCliente_id =  '`+req.params.idrolcliente+`'
            `
            )
        
        connection.query(
            `
            DELETE FROM 
                rolpermiso
            WHERE 
                permiso_id = '`+req.params.idpermiso+`'
                AND menuModulo_id =  '`+req.params.idmenumodulo+`'
                AND rolCliente_id =  '`+req.params.idrolcliente+`'
            `
            , function(err, rows){
            if(err){
                res.json({"error": err});
            } else {
                res.json("Usuario eliminado");
            }
        });
    });
    
    router.get("/rolpermiso/count", function(req, res) {
        console.log(
        `
            SELECT rp.id ultimoregistro
            FROM gestionfila.rolpermiso rp
            ORDER BY id DESC
            LIMIT 1
        `
        )
        
        connection.query(
        `
            SELECT rp.id ultimoregistro
            FROM rolpermiso rp
            ORDER BY id DESC
            LIMIT 1
        `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/rol/usuario/:idcliente/:idusuario", function(req, res) {
        console.log(
            `
            select 
                 A.id idrol
                , A.descripcion
                , A.codigo
                , B.id idrolcliente
                , case
                    when (C.idCliente) is null then false
                    else true
                END asociado
            from 
                rol A
                , rolcliente B

                left join usuariorol C on B.rol_id = C.rol_id 
                and B.cliente_idCliente = C.idCliente
                and C.usuario_id = '`+req.params.idusuario+`'
            where 
                A.id != 0
                and B.cliente_idCliente = '`+req.params.idcliente+`'
                and B.rol_id = A.id
            order by A.descripcion
            `
            )
        connection.query(
            `
            select 
                 A.id idrol
                , A.descripcion
                , A.codigo
                , B.id idrolcliente
                , case
                    when (C.idCliente) is null then false
                    else true
                END asociado
            from 
                rol A
                , rolcliente B

                left join usuariorol C on B.rol_id = C.rol_id 
                and B.cliente_idCliente = C.idCliente
                and C.usuario_id = '`+req.params.idusuario+`'
            where 
                A.id != 0
                and B.cliente_idCliente = '`+req.params.idcliente+`'
                and B.rol_id = A.id
            order by A.descripcion
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.get("/rolmotivoatencionsucursal/count", function(req, res) {
        console.log(
        `
            SELECT id ultimoregistro
            FROM gestionfila.rolclientemotivoatencionsucursal
            ORDER BY id DESC
            LIMIT 1
        `
        )
        
        connection.query(
        `
            SELECT id ultimoregistro
            FROM rolclientemotivoatencionsucursal
            ORDER BY id DESC
            LIMIT 1
        `

        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    router.post("/rolmotivoatencionsucursal", function(req, res){
        var detalle = req.body.detalle;
        console.log(
            `
            INSERT INTO gestionfila.rolclientemotivoatencionsucursal
                (id,
                idRolCliente,
                idMotivoAtencionSucursal,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.idrolcliente+`',
                 '`+detalle.idmotivoatencionsucursal+`',
                 '`+detalle.flagSincronizado+`')
            `
        )
        
        connection.query(
            `
            INSERT INTO rolclientemotivoatencionsucursal
                (id,
                idRolCliente,
                idMotivoAtencionSucursal,
                flagSincronizado)
            VALUES
                ('`+detalle.id+`',
                 '`+detalle.idrolcliente+`',
                 '`+detalle.idmotivoatencionsucursal+`',
                 '`+detalle.flagSincronizado+`')
            `
        , function(err, rows) {
            
        if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                //socket.emit("actualizarRolMotivoAtencion", "");
                res.json(rows);
            }
        });
    });

    router.delete("/rolmotivoatencionsucursal/:idrolcliente/:idmotivoatencionsucursal", function(req, res){
        console.log(
            `
            DELETE FROM 
               gestionfila.rolclientemotivoatencionsucursal
            WHERE 
                idRolCliente = '`+req.params.idrolcliente+`'
                AND idMotivoAtencionSucursal = '`+req.params.idmotivoatencionsucursal+`'
            `
        )
        
        connection.query(
            `
            DELETE FROM 
                rolclientemotivoatencionsucursal
            WHERE 
                idRolCliente = '`+req.params.idrolcliente+`'
                AND idMotivoAtencionSucursal = '`+req.params.idmotivoatencionsucursal+`'
            `
            , function(err, rows){
            if(err){
                res.json({"error": err});
            } else {
                //socket.emit("actualizarRolMotivoAtencion", "");
                res.json("Usuario eliminado");
            }
        });
    });

    router.get("/rolmotivos/:idrolcliente", function(req, res) {
        console.log(
            `
            SELECT 
                B.codigoDespliegue
                , C.nombre
                , C.id idmotivoatencion
                , B.id idmotivoatencionsucursal
                , B.motivoAtencion_id
            FROM 
                rolclientemotivoatencionsucursal A
                , motivoatencionsucursal B 
                , motivoatencion C
            WHERE
                A.idRolCliente = '`+req.params.idrolcliente+`'
                AND A.idMotivoAtencionSucursal = B.id
                AND C.id = B.motivoAtencion_id
            ORDER BY B.codigoDespliegue
            `
        )
        
        connection.query(
            `
            SELECT 
                B.codigoDespliegue
                , C.nombre
                , C.id idmotivoatencion
                , B.id idmotivoatencionsucursal
                , B.motivoAtencion_id
            FROM 
                rolclientemotivoatencionsucursal A
                , motivoatencionsucursal B 
                , motivoatencion C
            WHERE
                A.idRolCliente = '`+req.params.idrolcliente+`'
                AND A.idMotivoAtencionSucursal = B.id
                AND C.id = B.motivoAtencion_id
            ORDER BY B.codigoDespliegue
            `
        , function(err, rows) {
            if(err) {
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


    router.delete("/rolcliente/:id", function(req, res){
        console.log(
            `
           DELETE FROM 
                gestionfila.rolcliente
            WHERE 
                id = '`+req.params.id+`'
            `
            )
        
        connection.query(
            `
            DELETE FROM 
                rolcliente
            WHERE 
                id = '`+req.params.id+`'
            `
            , function(err, rows){
            if(err){
                res.json({"error": err});
            } else {
                res.json("Usuario eliminado");
            }
        });
    });

    // Búsqueda usuario por ID
    router.get("/rolcliente/:idrol", function(req, res) {
        console.log(
            `
            SELECT 
                cliente_idCliente idCliente
                , id idRolCliente
            FROM
               gestionfila.rolcliente
            WHERE
                rol_id = '`+req.params.idrol+`'
            ORDER BY cliente_idCliente
            `
        )
        connection.query(
            `
            SELECT 
                cliente_idCliente idCliente
                , id idRolCliente
            FROM
               rolcliente
            WHERE
                rol_id = '`+req.params.idrol+`'
            ORDER BY cliente_idCliente
            `
            , function(err, rows) {
            if(err) {
                res.json([]);
            } else {
                res.json(rows);
            }
        });
    });


    router.post("/rolclienteNotIn/:idrol", function(req, res){
        var inDatos = ''
        for(var i = 0; i < req.body.detalle.length; i++)
        {
            inDatos+= `'`+req.body.detalle[i]+"',"
        }
        inDatos = inDatos.substr(0, inDatos.length - 1)
        console.log(
        `
            select
                * 
            from 
                rolcliente A
            where 
                A.cliente_idCliente 
            not in (`+inDatos+`) 
            and A.rol_id = '`+req.params.idrol+`'
            `)
        connection.query(
            `
            select
                * 
            from 
                rolcliente A
            where 
                A.cliente_idCliente 
            not in (`+inDatos+`) 
            and A.rol_id = '`+req.params.idrol+`'
            `
        , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.delete("/rolpermisoAll/:idRolCliente", function(req, res){
        console.log(
            `
           DELETE FROM 
                gestionfila.rolpermiso
            WHERE 
                rolCliente_id = '`+req.params.idRolCliente+`'
            `
            )
        
        connection.query(
            `
           DELETE FROM 
                rolpermiso
            WHERE 
                rolCliente_id = '`+req.params.idRolCliente+`'
            `
            , function(err, rows){
            if(err){
                res.json({"error": err});
            } else {
                res.json("rolpermiso eliminados");
            }
        });
    });


    router.post("/rolpermisoIn", function(req, res){
        var inDatos = ''
        console.log("req.body.detalle: "+req.body.detalle)
        for(var i = 0; i < req.body.detalle.length; i++)
        {
            inDatos+= `'`+req.body.detalle[i]+"',"
        }
        inDatos = inDatos.substr(0, inDatos.length - 1)
        console.log(
            `
            select
                *
            from
                rolpermiso A
            where
                A.rolCliente_id
            in (`+inDatos+`)
            group by A.permiso_id, A.menuModulo_id
            `
        )

        connection.query(
        `
            select
                *
            from
                rolpermiso A
            where
                A.rolCliente_id
            in (`+inDatos+`)
            group by A.permiso_id, A.menuModulo_id
        `
        , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });

    router.post("/rolclienteIn/:idrol", function(req, res){
        var inDatos = ''
        for(var i = 0; i < req.body.detalle.length; i++)
        {
            inDatos+= `'`+req.body.detalle[i]+"',"
        }
        inDatos = inDatos.substr(0, inDatos.length - 1)
        console.log(
        `
            select
                cliente_idCliente idCliente 
            from 
                rolcliente A
            where 
                A.cliente_idCliente 
            in (`+inDatos+`) 
            and A.rol_id = '`+req.params.idrol+`'
            `)
        connection.query(
            `
            select
                cliente_idCliente idCliente
            from 
                rolcliente A
            where 
                A.cliente_idCliente 
            in (`+inDatos+`) 
            and A.rol_id = '`+req.params.idrol+`'
            `
        , function(err, rows) {
            
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                var rowsNuevo = []
                for(var i = 0; i < req.body.detalle.length;i++){
                    var existeRegistro = false
                    for(var j = i; j < rows.length; j++){
                        if(req.body.detalle[i] == rows[j].idCliente){
                            existeRegistro = true
                            break
                        }
                    }
                    if(!existeRegistro)
                        rowsNuevo.push(req.body.detalle[i])
                }
                console.log("req.body.detalle: "+req.body.detalle)
                console.log("rowsNuevo: "+rowsNuevo)
                res.json(rowsNuevo);
            }
        });
    });


    router.post("/rolespermisoList/:idRolCliente/:idCliente", function(req, res){
        var arrrolpermiso = req.body.arrrolpermiso;
        var strInsert = 
        `INSERT INTO rolpermiso(id, menuModulo_id, permiso_id, flagSincronizado, rolCliente_id) VALUES `
        var ultimoregistroAux = 0
        for(var i = 0; i < arrrolpermiso.length;i++){
            ultimoregistroAux = req.params.idCliente+""+ (i+1)
            //console.log("ultimoregistroAux: "+ultimoregistroAux)
            strInsert+=
            `('`+ultimoregistroAux+`','`+arrrolpermiso[i].menuModulo_id+`','`+arrrolpermiso[i].permiso_id+`','`+arrrolpermiso[i].flagSincronizado+`','`+req.params.idRolCliente+`')            
            `
            if(i != arrrolpermiso.length - 1){
                strInsert += `,`
            }
        }
        
        console.log('arrrolpermiso',
            strInsert
        )
        
        connection.query(
            strInsert
        , function(err, rows) {
            if(err) {
                console.log("error: "+err)
                res.json({"error": err});
            } else {
                res.json(rows);
            }
        });
    });


}

module.exports = REST_ROUTER;
