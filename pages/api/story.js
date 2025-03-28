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
      Escribe un cuento infantil original y en español para un niño llamado ${name}, de ${age} años.

      El cuento debe estar inspirado en el tema de "${theme}", relacionado con las energías renovables.
      Debe desarrollarse en ${place} y contar con un compañero de aventuras que sea ${companion}.

      El cuento debe tener:
      - Una introducción mágica que despierte la curiosidad
      - Un desarrollo en el que los personajes aprendan sobre la fuente de energía de forma divertida y comprensible
      - Un desenlace con una moraleja que enseñe un valor positivo (como cuidar el planeta, trabajar en equipo o ser curioso)

      🧠 Introduce, de forma sencilla, cómo funciona la fuente de energía correspondiente.
      🎨 Utiliza emojis adecuados a lo largo del cuento para hacerlo más visual.
      ✍️ Escribe en párrafos separados, usando saltos de línea reales para cada uno (doble salto de línea: \\n\\n).
      ❌ No añadas encabezados tipo "1. Introducción", ni títulos, ni explicaciones externas. Solo el cuento narrativo.

      Límite: 800 palabras.
  `;

    const chatCompletion = await openai.chat.completions.create({
      model: "mistralai/mixtral-8x7b-instruct",
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

