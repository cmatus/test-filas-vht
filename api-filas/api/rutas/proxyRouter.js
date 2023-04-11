const express = require("express");
const axios = require("axios");
const { dataLab, dataCDT, dataFarmaciaRut, dataFarmaciaNum } = require("../data/test");
const proxyRouter = express.Router();

proxyRouter.all("/proxy", async function (req, res) {
    try {
        const { method, headers, body, query } = req;
        const targetUrl = req.headers["x-target-url"];
        console.log(targetUrl);

        if (!targetUrl) {
            return res.status(400).send({
                error: "Missing target URL in x-target-url header",
            });
        }

        const axiosConfig = {
            method,
            url: targetUrl,
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            data: body,
            params: query,
        };

        // tests
        // test lab
        if (targetUrl.includes("http://10.6.84.181/api/apiTotem/")) {
            console.log(dataLab)
            return res.status(200).send(dataLab);
        }

        // test cdt
        if (
            targetUrl.includes(
                "https://test.ssasur.cl/servicios/totem_hhha/citas/"
            )
        ) {
            return res.status(200).send(dataCDT);
        }

        // test farmacia x rut
        if (
            targetUrl.includes(
                "https://test.ssasur.cl/servicios/totem_hhha/recetas/obtener_por_rut"
            )
        ) {
            return res.status(200).send(dataFarmaciaRut);
        }

        // test farmacia x numero
        if (
            targetUrl.includes(
                "https://test.ssasur.cl/servicios/totem_hhha/recetas/obtener_por_numero"
            )
        ) {
            return res.status(200).send(dataFarmaciaNum);
        }

        const response = await axios(axiosConfig);
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Error in proxy:", error.message);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send({
                error: "An error ocurred while processing the request",
            });
        }
    }
});

module.exports = proxyRouter;
