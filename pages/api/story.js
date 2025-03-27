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
El cuento debe tratar sobre el tema de ${theme} en el contexto de las energías renovables.
La historia debe desarrollarse en ${place || "un lugar interesante"} y debe incluir como compañero de aventura a ${companion || "alguien especial"}.
Haz que sea educativo, entretenido y adaptado a la edad del niño.
Usa un lenguaje claro, personajes simpáticos y situaciones divertidas.
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

