"use client";
import { useEffect, useState } from "react";
import { createDisponibilidade } from "@/services/api";

export default function Disponibilidade() {
    const [id_sala, setSala] = useState("");
    const [data, setData] = useState("");
    const [horario_inicial, setHoraInicial] = useState("");
    const [horario_final, setHoraFinal] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleDisponibilidade() {
        setErro("");
        setCarregando(true);
        try {
            const response = await createDisponibilidade(id_psicologo, id_sala, data, horario_inicial, horario_final);
            return response.data.disponibilidade;
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full items-center">
            <h1>Disponibilidade</h1>
            <select
                value={id_sala}
                onChange={(e) => setSala(e.target.value)}
            >
                <option value=""></option>
            </select>
            <input
                className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
                type="date"
                placeholder="Data"
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <input
                className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
                type="text"
                placeholder="Horário Inicial"
                value={horario_inicial}
                onChange={(e) => setHoraInicial(e.target.value)}
            />
            <input
                className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
                type="text"
                placeholder="Horário Final"
                value={horario_final}
                onChange={(e) => setHoraFinal(e.target.value)}
            />

            {erro && <p className="text-red-600 text-sm">{erro}</p>}

            <button
                onClick={handleDisponibilidade}
                disabled={carregando}
                className="w-full font-bold bg-[#D33865] text-[#FDFBD4] p-5 rounded-full shadow-lg cursor-pointer disabled:opacity-60"
            >
                {carregando ? "Adicionando..." : "ADICIONAR"}
            </button>
        </div>
    )
}