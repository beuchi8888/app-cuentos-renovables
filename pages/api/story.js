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
      ✨ ¡Escribe un cuento infantil completamente original y en español para un niño llamado ${name}, de ${age} años! ✨

      🌟 Este cuento debe estar inspirado en el tema de "${theme}", una fuente de energía renovable. 
      🌍 La historia se desarrollará en ${place} y contará con un compañero de aventuras que sea ${companion}. 

      💡 **Objetivo:** Ayuda al niño o niña a **comprender de forma sencilla y clara cómo funciona la fuente de energía "${theme}"**, adaptada a su edad (${age} años). 
      Debes incluir explicaciones naturales dentro de la historia para que entienda:
      - De dónde proviene la energía.
      - Cómo se produce.
      - Para qué sirve.
      - Qué elementos se utilizan para generar electricidad.

      🔑 Usa un lenguaje accesible y creativo, incorporando analogías que conecten con el mundo del niño (${age} años). Evita tecnicismos innecesarios, pero no simplifiques al punto de omitir conceptos clave.

      El cuento debe incluir:
      1. 🪄 **Una introducción mágica** que despierte la curiosidad y lo lleve a la aventura.
      2. 🚀 **Un desarrollo emocionante** donde los personajes vivan experiencias divertidas y educativas mientras aprenden sobre la energía renovable.
      3. 🌱 **Un desenlace con una moraleja positiva**, transmitiendo valores como:
       - Cuidar el planeta.
       - Fomentar la curiosidad.
       - Trabajar en equipo y la amistad.
       - Perseverar y aprender con entusiasmo.

      📝 **Formato:**
        - Utiliza párrafos separados con saltos de línea dobles para una lectura más fluida.
        - Añade algunos emojis 🐦🌟 para hacer el cuento más visual, pero sin excederte. 
        - Sin títulos ni secciones como “Introducción” o “Desenlace”: solo el cuento narrativo.

      📏 **Extensión máxima:** 1000 palabras. 

        ¡Hazlo mágico, educativo y divertido! 🎉`;

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

