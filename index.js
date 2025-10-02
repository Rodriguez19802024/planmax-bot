const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;
const graphVer = process.env.GRAPH_VER;
const verifyToken = process.env.VERIFY_TOKEN || "planmaxdigital"; // Usa el que pusiste en Facebook

// 📌 Ruta principal
app.get("/", (req, res) => {
  res.send("✅ Bot PlanMax Digital funcionando...");
});

// 📌 Webhook para verificación
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verificado ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// 📌 Webhook para recibir mensajes
app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object) {
    console.log(JSON.stringify(body, null, 2));
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// 📌 Enviar mensaje de prueba
app.get("/send-message", async (req, res) => {
  const fetch = (await import("node-fetch")).default;

  const url = https://graph.facebook.com/${graphVer}/${phoneNumberId}/messages;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: Bearer ${token},
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "5217711887705", // 👈 pon aquí tu número para pruebas
      type: "text",
      text: { body: "Hola! Esto es un mensaje de prueba desde mi bot 🚀" },
    }),
  });

  const data = await response.json();
  res.send(data);
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(🚀 Servidor corriendo en puerto ${PORT});
});
