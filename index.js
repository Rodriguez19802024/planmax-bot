const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// ENV (pon estos en Render)
const VERIFY_TOKEN    = "planmaxdigital";
const GRAPH_VER       = process.env.GRAPH_VER || "v20.0";
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN  = process.env.WHATSAPP_TOKEN;

// Healthcheck
app.get("/", (_req, res) => res.send("OK"));

// Verificación de webhook (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Recepción de mensajes (POST)
app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // responde rápido a Meta

  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return;

    const from = msg.from;
    const text = msg.text?.body || "";

    // ⚠️ OJO: la URL DEBE ESTAR ENTRE BACKTICKS ` `
    const apiUrl = https://graph.facebook.com/${GRAPH_VER}/${PHONE_NUMBER_ID}/messages;

    await axios.post(
      apiUrl,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: Hola 👋 recibí: "${text}" }
      },
      {
        headers: {
          Authorization: Bearer ${WHATSAPP_TOKEN},
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("❌ Error enviando:", err.response?.data || err.message);
  }
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(✅ Bot escuchando en puerto ${PORT}));
