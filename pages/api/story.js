import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY, // acepta ambas
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://tuapp.vercel.app", // tu dominio o el de vercel
    "X-Title": "cuentos-renovables"
  }
});

export default async function handler(req, res) {
  try {
    if (req?.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { name, theme } = req.body || {};

    if (!name || !theme) {
      return res.status(400).json({ error: "Faltan datos: nombre o tema" });
    }

    const prompt = `Escribe un cuento infantil en español para un niño llamado ${name}, relacionado con el tema de ${theme} dentro del mundo de las energías renovables. El cuento debe ser educativo, entretenido y fácil de entender. Usa lenguaje claro, ejemplos visuales y personajes que enseñen sobre tecnologías limpias. Máximo 1000 palabras.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // modelo gratuito compatible
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    res.status(200).json({ story: chatCompletion.choices[0].message.content });
  } catch (error) {
    if (res?.status) {
      res.status(500).json({ error: error.message });
    }
  }
}
