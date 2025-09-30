import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "planmaxdigital";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const GRAPH_VER = process.env.GRAPH_VER || "v19.0";
const GRAPH_URL = `https://graph.facebook.com/${GRAPH_VER}/${PHONE_NUMBER_ID}/messages`;

async function sendText(to, body) {
  try {
    await axios.post(
      GRAPH_URL,
      { messaging_product: "whatsapp", to, type: "text", text: { body } },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
  } catch (e) {
    console.error("Error enviando mensaje:", e.response?.data || e.message);
  }
}

function route(text = "") {
  const t = text.toLowerCase();
  if (/^0$|humano|asesor|agente/.test(t)) return "humano";
  if (/^1$|venta|plan|combo|netflix|disney|spotify|precio/.test(t)) return "ventas";
  if (/^2$|empleo|vacante|trabajo|senix|daye|kawasaki|lg|entrevista/.test(t)) return "vacantes";
  if (/^3$|soporte|pago|acceso|no entra|fallo/.test(t)) return "soporte";
  return "menu";
}

async function reply(to, r) {
  if (r === "ventas") return sendText(to, 
    "💥 Ventas Digitales\n\n• Netflix: 1 día $15 | 7 días $70 (por mes no disponible)\n• También: Disney+, Paramount+, Spotify, Max\n\nEscribe 'pagar' para datos de pago o 'menu' para volver.");
  if (r === "vacantes") return sendText(to, 
    "👷 Vacantes (Salinas Victoria, Ciénega, Apodaca)\n- SENIX (L-V, sin exámenes médicos, sí doping)\n- DAYE (Calidad/Ensamble, turno fijo)\n- COOPER (Rotativos)\n\nResponde tu zona (Ciénega/San Roque/Juárez/Apodaca) o 'menu' para volver.");
  if (r === "soporte") return sendText(to, 
    "🛠️ Soporte\n1) No abre la cuenta\n2) Error de pago\n3) Cambio de dispositivo\n\nEscribe el número (1-3). Si no se resuelve, escribe 'humano'.");
  if (r === "humano") return sendText(to, 
    "Te paso con un asesor. Horario: 9:00–20:00. Si es URGENTE, indícalo.");
  return sendText(to, 
    "👋 Hola, soy el asistente de Plan Max Digital.\n\n1) Ventas Digitales\n2) Vacantes\n3) Soporte\n0) Hablar con humano\n\nEscribe el número o palabra clave.");
}

// Healthcheck
app.get("/", (req, res) => res.send("OK"));

// Verificación de webhook
app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === VERIFY_TOKEN) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// Recepción de mensajes
app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // responde rápido a Meta
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    if (value?.statuses) return; // ignorar callbacks de estado
    for (const m of value?.messages || []) {
      const from = m.from;
      const type = m.type;
      if (type === "text") {
        const body = m.text?.body || "";
        const r = route(body);
        await reply(from, r);
      } else if (type === "interactive") {
        const id = m.interactive?.list_reply?.id || m.interactive?.button_reply?.id || "menu";
        await reply(from, id);
      } else {
        await reply(from, "menu");
      }
    }
  } catch (e) {
    console.error("Error en webhook:", e.response?.data || e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Bot escuchando en puerto ${PORT}`));
