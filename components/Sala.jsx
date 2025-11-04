"use client";
import { useEffect, useState } from "react";
import { createSala } from "@/services/api";

export default function Sala() {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSala() {
        setErro("");
        setCarregando(true);
        try {
            const response = await createSala(nome, descricao);
            return response.data.sala;
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full items-center">
            <h1>Salas</h1>
            <input
                className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
                type="text"
                placeholder="Nome da Sala"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />
            <input
                className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            />

            {erro && <p className="text-red-600 text-sm">{erro}</p>}

            <button
                onClick={handleSala}
                disabled={carregando}
                className="w-full font-bold bg-[#D33865] text-[#FDFBD4] p-5 rounded-full shadow-lg cursor-pointer disabled:opacity-60"
            >
                {carregando ? "Adicionando..." : "ADICIONAR"}
            </button>
        </div>
    )
}