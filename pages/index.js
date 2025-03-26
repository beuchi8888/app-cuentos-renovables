import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    if (!name || !theme) {
      alert("Por favor, completa el nombre y elige un tema.");
      return;
    }

    setLoading(true);
    const res = await axios.post("/api/story", { name, theme });
    setStory(res.data.story);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crea tu cuento sobre energías renovables</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del niño o niña"
        className="border p-2 w-full mb-2"
      />

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border p-2 w-full mb-2"
      >
        <option value="">Elige un tema</option>
        <option value="energía solar">Energía solar</option>
        <option value="energía eólica">Energía eólica</option>
        <option value="almacenamiento con baterías">Almacenamiento con baterías</option>
        <option value="coches eléctricos">Coches eléctricos</option>
        <option value="hibridación de fuentes">Hibridación de fuentes</option>
        <option value="redes inteligentes">Redes inteligentes</option>
        <option value="biomasa">Biomasa</option>
      </select>

      <button
        onClick={generateStory}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generando..." : "Crear cuento"}
      </button>

      <div className="mt-4 whitespace-pre-wrap">{story}</div>
    </div>
  );
}
