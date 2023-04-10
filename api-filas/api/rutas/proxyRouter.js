const express = require("express");
const axios = require("axios");
const proxyRouter = express.Router();

proxyRouter.all("/proxy", async function (req, res) {
    try {
        const { method, headers, body, query } = req;
        const targetUrl = req.headers["x-target-url"];

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
