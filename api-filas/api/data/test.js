const dataLab = {
    validacion: "003",
    resultado: {
        solicitud: [1297137, 1297138],
        solicitudes: {
            16948832: [
                {
                    sol_codigo: "1216061001",
                    profesional: "PABLO ANDRES HAURI LONGERI",
                    paciente: "SERGIO FLORES DURAN",
                    servicio: "URGENCIA ADULTO",
                    agendado: "1",
                    prioridad: "1",
                    examen: ["ACIDO URICO EN ORINA", "ACIDO URICO EN ORINA"],
                    edadPaciente: "34 años",
                    edad: 34,
                },
                {
                    sol_codigo: "1216061002",
                    profesional: "PABLO ANDRES HAURI LONGERI",
                    paciente: "SERGIO FLORES DURAN",
                    servicio: "URGENCIA ADULTO",
                    agendado: "1",
                    prioridad: "1",
                    examen: [
                        "GLUCOSA BASAL - PTGO",
                        "ACIDO URICO EN ORINA",
                        "ACIDO URICO EN ORINA",
                    ],
                    edadPaciente: "34 años",
                    edad: 34,
                },
            ],
        },
        "1297137-examenes": ["342", "342"],
        "1297138-examenes": ["87", "87"],
    },
    tipo: "solicitudes",
};

const dataCDT = {
    DATOS_PACIENTE: [
        {
            PERSONA_ID: "1203895",
            RUT: "16794572",
            DV: "4",
            RUT_COMPLETO: "16794572-4",
            NOMBRES: "CARLOS ISMAEL",
            APELLIDO_PAT: "PARADA",
            APELLIDO_MAT: "SCHULTHESS",
            NOMBRE_SOCIAL: "CARLA",
            NOMBRE_COMPLETO: "CARLOS ISMAEL PARADA SCHULTHESS",
            FECHA_NACIMIENTO: "22/01/1988",
            GENERO_DESC: "HOMBRE",
            ESTADO_CIVIL_DESC: "DESCONOCIDO",
            OCUPACION_DESC: "NO APLICA",
            RUT_REPRESENTANTE_LEGAL: "15273685",
            DV_REPRESENTANTE_LEGAL: "1",
            REPRESENTANTE_LEGAL: "SANDRA FIGUEROA SARAVIA",
            NOMBRE_PADRE: "SIN INFORMACION",
            NOMBRE_MADRE: "SIN INFORMACION",
            NOMBRE_PAREJA: "NONES",
            URL_FOTO: null,
            PUEBLO_ORIGINARIO_DESC: "NINGUNO ",
            PAIS_DESC: "CHILE",
            PRAIS: "N",
            PREVISION_ID: "12",
            PREVISION: "CRUZ BLANCA S.A.",
            CELULAR:
                "56452640766; 56452640767; 56452640788; 56931402034; 56965854444; 56971402034; 56979854666; 56988744555; 56991972342; 56991974422",
            COMUNA: "TEMUCO",
            CIUDAD: null,
            DIRECCION: "PRUEBA",
            EMAIL: "CARLOS.PARADA@ASUR.CL",
            FECHA_FALLECIMIENTO: null,
            SITUACION_DISCAPACIDAD: "N",
            POLICLINICOS_ACTIVOS: [],
        },
    ],

    CITAS: [
        {
            CUENTA_CORRIENTE: "123456789",
            ID_HORA_MEDICA: 1,
            NUMERO_FICHA_LOCAL: 1,
            PACIENTE_ID: 1,
            PACIENTE_RUT: "12345678-9",
            MODALIDA_ATENCION: "CONSULTA",
            MODALIDA_ATENCION_ID: 1,
            POLICLINICO: "POLICLINICO",
            MODULO: "A",
            BOX: "7",
            NOMBRE_PROFESIONAL: "JORGE",
            APELLIDO_PAT_PROFESIONAL: "CORTES",
            APELLIDO_MAT_PROFESIONAL: "BUSTOS",
            ID_PROFESIONAL: 1,
            ATENCION_FECHA: "20230410",
            ATENCION_HORA: "161500",
        },
        {
            CUENTA_CORRIENTE: "123456789",
            ID_HORA_MEDICA: 2,
            NUMERO_FICHA_LOCAL: 2,
            PACIENTE_ID: 1,
            PACIENTE_RUT: "12345678-9",
            MODALIDA_ATENCION: "CONSULTA",
            MODALIDA_ATENCION_ID: 1,
            POLICLINICO: "POLICLINICO",
            MODULO: "A",
            BOX: "7",
            NOMBRE_PROFESIONAL: "MARÍA",
            APELLIDO_PAT_PROFESIONAL: "JIMENEZ",
            APELLIDO_MAT_PROFESIONAL: "ALVAREZ",
            ID_PROFESIONAL: 2,
            ATENCION_FECHA: "20230410",
            ATENCION_HORA: "163000",
        },
    ],
};

const dataFarmaciaRut = {
    "16794572-4": {
        DATOS: [
            {
                PERSONA_ID: "1203895",
                RUT: "16794572",
                DV: "4",
                RUT_COMPLETO: "16794572-4",
                NOMBRES: "CARLOS ISMAEL",
                APELLIDO_PAT: "PARADA",
                APELLIDO_MAT: "SCHULTHESS",
                NOMBRE_SOCIAL: "CARLA",
                NOMBRE_COMPLETO: "CARLOS ISMAEL PARADA SCHULTHESS",
                FECHA_NACIMIENTO: "22/01/1988",
                GENERO_DESC: "HOMBRE",
                ESTADO_CIVIL_DESC: "DESCONOCIDO",
                OCUPACION_DESC: "NO APLICA",
                RUT_REPRESENTANTE_LEGAL: "15273685",
                DV_REPRESENTANTE_LEGAL: "1",
                REPRESENTANTE_LEGAL: "SANDRA FIGUEROA SARAVIA",
                NOMBRE_PADRE: "SIN INFORMACION",
                NOMBRE_MADRE: "SIN INFORMACION",
                NOMBRE_PAREJA: "NONES",
                URL_FOTO: null,
                PUEBLO_ORIGINARIO_DESC: "NINGUNO ",
                PAIS_DESC: "CHILE",
                PRAIS: "N",
                PREVISION_ID: "12",
                PREVISION: "CRUZ BLANCA S.A.",
                CELULAR:
                    "56452640766; 56452640767; 56452640788; 56931402034; 56965854444; 56971402034; 56979854666; 56988744555; 56991972342; 56991974422",
                COMUNA: "TEMUCO",
                CIUDAD: null,
                DIRECCION: "PRUEBA",
                EMAIL: "CARLOS.PARADA@ASUR.CL",
                FECHA_FALLECIMIENTO: null,
                SITUACION_DISCAPACIDAD: "N",
                POLICLINICOS_ACTIVOS: [],
            },
        ],
        RECETAS: [
            {
                ID: "14987273",
                MV_RECETA_ID: "14987273",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987274",
                MV_RECETA_ID: "14987274",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987275",
                MV_RECETA_ID: "14987275",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987276",
                MV_RECETA_ID: "14987276",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987286",
                MV_RECETA_ID: "14987286",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987287",
                MV_RECETA_ID: "14987287",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987288",
                MV_RECETA_ID: "14987288",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987289",
                MV_RECETA_ID: "14987289",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987290",
                MV_RECETA_ID: "14987290",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987291",
                MV_RECETA_ID: "14987291",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987302",
                MV_RECETA_ID: "14987302",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987303",
                MV_RECETA_ID: "14987303",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987304",
                MV_RECETA_ID: "14987304",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987305",
                MV_RECETA_ID: "14987305",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987306",
                MV_RECETA_ID: "14987306",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987308",
                MV_RECETA_ID: "14987308",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: "12510561",
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987309",
                MV_RECETA_ID: "14987309",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: "12510567",
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987310",
                MV_RECETA_ID: "14987310",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: "12510562",
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987313",
                MV_RECETA_ID: "14987313",
                TB_ENCABEZADO_ESTADO_ID: "4",
                TB_ENCABEZADO_ESTADO_DESC: "PENDIENTE",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: "12510559",
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
            {
                ID: "14987490",
                MV_RECETA_ID: "14987490",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                PROCEDENCIA_ID: "5",
                PROCEDENCIA_DESC: "SIN RESPALDO",
                MV_EPISODIO_ID: "12511002",
                CUENTA_CORRIENTE: null,
                RECETA_HOSPITAL_DIGITAL: "N",
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
        ],
        PACIENTE_ARRIBADO: "S",
    },
};

const dataFarmaciaNum = {
    14987273: {
        RECETAS: [
            {
                ID: "14987273",
                MV_RECETA_ID: "14987273",
                TB_ENCABEZADO_ESTADO_ID: "1",
                TB_ENCABEZADO_ESTADO_DESC: "SOLICITADA",
                MV_PERSONA_PROFESIONAL_ID: "1203895",
                NOMBRE_PROFESIONAL: "CARLOS ISMAEL PARADA SCHULTHESS",
                NOMBRE_PACIENTE: "CARLOS ISMAEL PARADA SCHULTHESS",
                RUT_PACIENTE: "16794572-4",
                PROCEDENCIA_ID: "4",
                PROCEDENCIA_DESC: "ATENCION ABIERTA",
                MV_EPISODIO_ID: null,
                CUENTA_CORRIENTE: "61456102",
                RECETA_HOSPITAL_DIGITAL: null,
                SERVICIO_CLINICO_ID: null,
                SERVICIO_CLINICO_DESC: null,
                ID_SECTOR: null,
                DESC_SECTOR: null,
                CODIGO_SECTOR: null,
            },
        ],
        PACIENTE_ARRIBADO: "S",
    },
};

module.exports = {
    dataLab,
    dataCDT,
    dataFarmaciaRut,
    dataFarmaciaNum,
};
