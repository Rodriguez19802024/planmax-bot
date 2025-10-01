const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor de WhatsApp Bot funcionando 🚀");
});

// Verificación del Webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "planmaxdigital"; // usa el mismo que pusiste en Facebook

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Recibir mensajes
app.post("/webhook", (req, res) => {
  let body = req.body;
  console.log(JSON.stringify(body, null, 2));

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body.entry[0].changes[0].value.messages[0].from; 
      let msg_body = body.entry[0].changes[0].value.messages[0].text.body;

      // Responder el mismo mensaje
      axios({
        method: "POST",
        url: https://graph.facebook.com/${process.env.GRAPH_VER}/${process.env.PHONE_NUMBER_ID}/messages,
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${process.env.WHATSAPP_TOKEN},
        },
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: Recibí tu mensaje: ${msg_body} },
        },
      })
        .then(() => {
          console.log("Mensaje enviado ✅");
        })
        .catch((err) => {
          console.error("Error enviando mensaje ❌", err.response?.data || err);
        });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Puerto para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));
