const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express().use(bodyParser.json());

// === ENV ===
const VERIFY_TOKEN   = "planmaxdigital";             // Igual que en Meta
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;   // EAA...
const PHONE_NUMBER_ID= process.env.PHONE_NUMBER_ID;  // 8494...
const GRAPH_VER      = process.env.GRAPH_VER || "v20.0";

// Healthcheck
app.get("/", (_req, res) => res.send("OK"));

// Verificación Webhook (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK_VERIFIED");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Recepción de mensajes (POST)
app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // responder rápido a Meta

  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return;

    const from = msg.from;
    const body = msg.text?.body || "";

    await axios.post(
      https://graph.facebook.com/${GRAPH_VER}/${PHONE_NUMBER_ID}/messages,
      { messaging_product: "whatsapp", to: from, type: "text", text: { body: Hola 👋 recibí: "${body}" } },
      { headers: { Authorization: Bearer ${WHATSAPP_TOKEN} } }
    );
  } catch (err) {
    console.error("❌ Error en /webhook:", err.response?.data || err.message);
  }
});

// * OJO: PUERTO DINÁMICO DE RENDER *
const PORT = process.env.PORT || 3000;
