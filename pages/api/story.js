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

      El cuento debe estar inspirado en el tema de "${theme}", que es una fuente de energía renovable. 
      Debe desarrollarse en ${place} y contar con un compañero de aventuras que sea ${companion}.

      🔍 El objetivo es que el niño o niña comprenda **cómo funciona la fuente de energía "${theme}"** de forma sencilla, clara y adaptada a su edad (${age} años). 
      Debes **explicar los conceptos básicos y el funcionamiento** de esta energía (por ejemplo: cómo se produce, de dónde proviene, para qué sirve, que elementos utiliza para conseguir electricidad, etc.), usando un lenguaje comprensible, analogías en relación a la edad (${age} años) y ejemplos cercanos a su mundo. 
      Evita tecnicismos innecesarios, pero no simplifiques en exceso: el niño debe poder **entender correctamente los términos clave** relacionados con esta fuente de energía.

      El cuento debe tener:
      - 🪄 Una introducción mágica que despierte la curiosidad del niño y lo invite a la aventura
      - 🚀 Un desarrollo donde los personajes vivan una experiencia divertida y educativa en la que **aprendan cómo funciona la fuente de energía**, con explicaciones naturales dentro de la historia
      - 🌱 Un desenlace con una **moraleja** que transmita un valor positivo, como cuidar el planeta, la curiosidad, el trabajo en equipo o la perseverancia, la importancia de aprender y ser buenas personas, etc.

      🎨 Usa algunos emojis apropiados para hacerlo más visual, pero sin abusar.
      ✍️ Escribe el cuento con párrafos separados usando saltos de línea dobles (\\n\\n). 
      ❌ No añadas encabezados como “Introducción” o “Desenlace”, ni títulos o explicaciones externas. Solo el cuento narrativo.

      📏 Límite: máximo 1000 palabras.
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

