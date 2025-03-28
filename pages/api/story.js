import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://app-cuentos-renovables-xfo2.vercel.app", // pon aquí tu dominio real
    "X-Title": "cuentos-renovables"
  }
});

export default async function handler(req, res) {
  try {
    if (req?.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Recogemos todos los datos del cuerpo de la petición
    const { name, theme, age, companion, place } = req.body || {};

    if (!name || !theme) {
      return res.status(400).json({ error: "Faltan datos: nombre o tema" });
    }

  const prompt = `
    Escribe un cuento infantil en español para un niño llamado ${name}, de ${age || "edad no especificada"} años. 
    El cuento debe tratar sobre el tema de ${theme} dentro del mundo de las energías renovables.

    La historia debe desarrollarse en ${place || "un lugar interesante"} y debe incluir como compañero de aventura a ${companion || "alguien especial"}.

    Redacta el cuento en **párrafos separados** (con saltos de línea entre ellos), como si fuera un cuento de un libro infantil.

    Haz que sea:
    - Educativo y entretenido
    - Adaptado a la edad del niño
    - Con personajes simpáticos y situaciones divertidas
    - Usando lenguaje claro y accesible
    - Que explique el funcionamiento principal de cada fuente de energía renovable adaptado a la edad del niño

    Incluye **emojis** donde tenga sentido para hacerlo visual y atractivo.

    Máximo 600 palabras.
  `;

    const chatCompletion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    res.status(200).json({ story: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("Error generando cuento:", error);
    if (res?.status) {
      res.status(500).json({ error: error.message });
    }
  }
}

