"use client";
import { useState, useEffect } from "react";
import { getPacienteByPsicologo } from "@/services/api";

export default function PacientesPsicologo() {
    const [psicologo, setPsicologo] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        try {
            const dados = JSON.parse(localStorage.getItem("psicologo") || "null");
            if (dados) setPsicologo(dados);
        } catch (e) {
            console.error("Erro ao ler dados do psicólogo:", e);
        }
    }, []);

    async function handlePacientes() {
        setErro("");
        setCarregando(true);
        try {
            const response = await getPacienteByPsicologo(psicologo?.id);

            const data = response?.data;

            if (
                !data ||
                (Array.isArray(data) && data.length === 0) ||
                (typeof data === "object" &&
                    Object.values(data).every((v) => v === null))
            ) {
                setPacientes([]);
            } else {
                setPacientes(Array.isArray(data) ? data : [data]);
            }
        } catch (err) {
            console.error(err);
            setErro(err.message || "Erro ao carregar pacientes");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        if (psicologo?.id) {
            handlePacientes();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [psicologo]);

    if (carregando)
        return (
            <p className="text-center text-[#D33865] font-medium mt-8 animate-pulse">
                Carregando pacientes...
            </p>
        );

    return (
        <div className="flex flex-wrap gap-5 p-4 justify-center">
            {pacientes.length > 0 ? (
                pacientes.map((p) => (
                    <div
                        key={p.id}
                        className="bg-[#D33865] text-white w-[320px] p-4 rounded-lg border-2 border-black shadow-md"
                    >
                        <p><strong>Nome:</strong> {p.nome}</p>
                        <p><strong>Email:</strong> {p.email}</p>
                        <p><strong>Idade:</strong> {p.idade}</p>
                        <p><strong>Telefone:</strong> {p.telefone}</p>
                        <p><strong>Gênero:</strong> {p.genero}</p>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center text-center mt-12 text-gray-700 dark:text-gray-300">
                    <p className="text-lg font-semibold">
                        Nenhum paciente encontrado
                    </p>
                    <p className="text-sm opacity-80 mt-1">
                        Assim que um paciente for cadastrado, ele aparecerá aqui.
                    </p>
                </div>
            )}
        </div>
    );
}
