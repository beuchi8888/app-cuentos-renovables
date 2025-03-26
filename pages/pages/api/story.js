import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  const { name, theme } = req.body;

  const prompt = `Escribe un cuento infantil para un niño llamado ${name}, relacionado con el tema de ${theme} dentro del mundo de las energías renovables. El cuento debe ser educativo, entretenido y fácil de entender. Usa lenguaje claro, ejemplos visuales y personajes que enseñen sobre tecnologías limpias. Máximo 500 palabras.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    res.status(200).json({ story: completion.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
