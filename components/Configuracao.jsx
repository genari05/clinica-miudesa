"use client";

export default function Configuracao({ idioma, setIdioma, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-[#FDFBD4] dark:bg-[#121212] text-[#D33865] p-6 rounded-2xl shadow-xl w-[90%] md:w-[400px]">
        <h3 className="text-lg font-bold mb-4">⚙️ Configurações</h3>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Idioma</label>
          <select
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            className="w-full p-2 rounded-lg border border-[#b12c54]/40 bg-white text-[#D33865]"
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>

        <button onClick={onClose} className="mt-4 w-full py-2 rounded-full bg-[#D33865] text-[#FDFBD4]">
          Fechar
        </button>
      </div>
    </div>
  );
}