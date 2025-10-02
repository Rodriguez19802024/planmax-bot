const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Variables de entorno (Render → Environment)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Verificación del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recepción de mensajes
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from; // número del usuario
      const msg_body = message.text?.body; // mensaje escrito

      console.log("Mensaje recibido:", msg_body);

      // Respuesta automática
      await axios.post(
        https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: Hola 👋, recibí tu mensaje: "${msg_body}" },
        },
        { headers: { Authorization: Bearer ${WHATSAPP_TOKEN} } }
      );
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(3000, () => console.log("Bot corriendo en puerto 3000"));
