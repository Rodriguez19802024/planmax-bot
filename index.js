import express from "express";
import bodyParser from "body-parser";

const app = express().use(bodyParser.json());

const token = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.PHONE_NUMBER_ID;
const version = process.env.GRAPH_VER;

app.get("/", (req, res) => {
  res.send("Bot activo ✅");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const verifyToken = "planmaxdigital"; // tu mismo identificador de verificación

  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const tokenReq = req.query["hub.verify_token"];

  if (mode && tokenReq && mode === "subscribe" && tokenReq === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Endpoint para mensajes
app.post("/webhook", (req, res) => {
  console.log("Mensaje entrante:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
