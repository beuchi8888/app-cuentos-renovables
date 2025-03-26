import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    if (!name || !theme) return alert("Rellena todos los campos");

    setLoading(true);
    const res = await axios.post("/api/story", { name, theme });
    setStory(res.data.story);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Crea tu cuento sobre energías renovables
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Historias personalizadas para niños con temas como energía solar, eólica, baterías, y más.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del niño/a"
            className="p-3 border rounded w-64"
          />
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-3 border rounded w-64"
          >
            <option value="">Selecciona un tema</option>
            <option value="energía solar">Energía solar</option>
            <option value="energía eólica">Energía eólica</option>
            <option value="almacenamiento con baterías">Baterías</option>
            <option value="coches eléctricos">Coches eléctricos</option>
            <option value="hibridación de fuentes">Hibridación</option>
          </select>
        </div>

        <button
          onClick={generateStory}
          className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Generando..." : "Crear cuento"}
        </button>

        {story && (
          <div className="bg-white rounded shadow p-6 mt-8 text-left whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-4">Tu cuento:</h2>
            {story}
          </div>
        )}
      </div>
    </div>
  );
}

