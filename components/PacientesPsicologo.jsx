"use client";
import { useState, useEffect } from "react";
import { getPacienteByPsicologo } from "@/services/api";
import { FaUserCircle } from "react-icons/fa";

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
            if (!data || (Array.isArray(data) && data.length === 0)) {
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
        if (psicologo?.id) handlePacientes();
    }, [psicologo]);

    if (carregando)
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <p className="text-center text-[#D33865] font-medium animate-pulse">
                    Carregando pacientes...
                </p>
            </div>
        );

    return (
        <div className="w-full flex flex-col items-center justify-center px-4 py-6">

            {pacientes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
                    {pacientes.map((p) => (
                        <div
                            key={p.id}
                            className="bg-[#FDFBD4] dark:bg-[#121212] border border-[#D33865]/30 rounded-2xl shadow-md hover:shadow-xl transition-all p-5 text-[#D33865] dark:text-[#FDFBD4]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-[#D33865]/20 flex items-center justify-center text-[#D33865] dark:bg-[#f9c9d9]/20">
                                    <FaUserCircle size={26} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{p.nome}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{p.email}</p>
                                </div>
                            </div>

                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="font-semibold text-[#b12c54] dark:text-[#f9c9d9]">
                                        Idade:
                                    </span>{" "}
                                    {p.idade} anos
                                </p>
                                <p>
                                    <span className="font-semibold text-[#b12c54] dark:text-[#f9c9d9]">
                                        Telefone:
                                    </span>{" "}
                                    {p.telefone}
                                </p>
                                <p>
                                    <span className="font-semibold text-[#b12c54] dark:text-[#f9c9d9]">
                                        Gênero:
                                    </span>{" "}
                                    {p.genero}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
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
