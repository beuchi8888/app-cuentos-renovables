import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("");
  const [companion, setCompanion] = useState("");
  const [place, setPlace] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    if (!name || !age || !theme || !companion || !place) {
      alert("Rellena todos los campos por favor");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/story", {
        name,
        age,
        theme,
        companion,
        place,
      });
      setStory(res.data.story);
    } catch (err) {
      setStory("❌ Error al generar el cuento.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-5xl mb-2">🔋⚡🌞🌱</div>
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Crea tu cuento sobre energías renovables
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Historias personalizadas sobre energías renovables.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="👦 Nombre del niño/a"
            className="p-3 border rounded w-full"
          />
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="🎂 Edad del niño/a"
            className="p-3 border rounded w-full"
            type="number"
            min="1"
          />

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-3 border rounded w-full"
          >
            <option value="">💡 Selecciona un tema</option>
            <option value="energía solar">🌞 Energía solar</option>
            <option value="energía eólica">💨 Energía eólica</option>
            <option value="almacenamiento con baterías">🔋 Baterías</option>
            <option value="coches eléctricos">🚗⚡ Coches eléctricos</option>
            <option value="hibridación de fuentes">🔄 Hibridación</option>
          </select>

          <select
            value={companion}
            onChange={(e) => setCompanion(e.target.value)}
            className="p-3 border rounded w-full"
          >
            <option value="">🧍‍♂️ Compañero de aventura</option>
            <option value="un robot">🤖 Un robot</option>
            <option value="una criatura mágica">🧚‍♀️ Criatura mágica</option>
            <option value="un amigo">👫 Un amigo</option>
          </select>

          <select
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="p-3 border rounded w-full md:col-span-2"
          >
            <option value="">🌍 Lugar de la historia</option>
            <option value="un bosque">🌲 Un bosque</option>
            <option value="una isla">🏝️ Una isla</option>
            <option value="un colegio">🏫 Un colegio</option>
            <option value="una ciudad futurista">🏙️ Una ciudad futurista</option>
          </select>
        </div>

        <button
          onClick={generateStory}
          className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Generando..." : "✨ Crear cuento"}
        </button>

        {story && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8 text-left text-lg leading-relaxed text-gray-800 whitespace-pre-line">
            <h2 className="text-2xl font-bold text-green-700 mb-4">📖 Tu cuento:</h2>
            {story}
          </div>
        )}
      </div>
    </div>
  );
}

