const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express().use(bodyParser.json());

const VERIFY_TOKEN = "planmaxdigital"; // Identificador de verificación (el mismo que pones en Meta)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // Token permanente de Meta
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // Phone Number ID de tu app
const GRAPH_VER = "v20.0"; // Versión de la API

// Verificación del Webhook (Meta llama con GET al configurar)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Recepción de mensajes (Meta manda POST aquí)
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (entry) {
      const from = entry.from; // Número del cliente
      const msg_body = entry.text?.body;

      console.log("📩 Mensaje recibido:", msg_body);

      // Responder mensaje
      axios.post(
        https://graph.facebook.com/${GRAPH_VER}/${PHONE_NUMBER_ID}/messages,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: Hola 👋 recibí tu mensaje: "${msg_body}" },
        },
        {
          headers: {
            Authorization: Bearer ${WHATSAPP_TOKEN},
            "Content-Type": "application/json",
          },
        }
      ).catch(err => console.error("❌ Error enviando:", err.response?.data || err.message));
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Servidor en Render
app.listen(3000, () => console.log("🚀 Servidor corriendo en puerto 3000"));
