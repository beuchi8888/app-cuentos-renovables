import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    // Solo aceptar peticiones POST
    if (req?.method !== 'POST') {
      res?.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { name, theme } = req.body || {};

    if (!name || !theme) {
      res.status(400).json({ error: "Faltan datos: nombre o tema" });
      return;
    }

    const prompt = `Escribe un cuento infantil para un niño llamado ${name}, relacionado con el tema de ${theme} dentro del mundo de las energías renovables. El cuento debe ser educativo, entretenido y fácil de entender. Usa lenguaje claro, ejemplos visuales y personajes que enseñen sobre tecnologías limpias. Máximo 500 palabras.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    res.status(200).json({ story: chatCompletion.choices[0].message.content });

  } catch (error) {
    // Evitar error si res no está definido por el entorno
    if (res?.status) {
      res.status(500).json({ error: error.message });
    }
  }
}

