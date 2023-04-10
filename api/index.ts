import "dotenv/config";
import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const proxyUrl = process.env.PROXY_URL;

if (!proxyUrl) {
  throw new Error("PROXY_URL is not defined");
}

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(cors());

app.all("/proxy", async (req: Request, res: Response) => {
  try {
    const { method, headers, body, query } = req;
    const targetUrl = req.headers["x-target-url"] as string;

    console.log(targetUrl);
    if (!targetUrl) {
      return res
        .status(400)
        .send({ error: "Missing target URL in x-target-url header" });
    }

    const axiosConfig = {
      method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
      url: targetUrl,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      data: body,
      params: query,
      Proxy: {
        proxyUrl,
      },
    };

    console.log(axiosConfig);
    const response = await axios(axiosConfig);

    console.log(response.data);
    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error("Error in proxy:", error.message);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res
        .status(500)
        .send({ error: "An error occurred while processing the request" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
