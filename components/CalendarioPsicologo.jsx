"use client";
import { useState, useEffect } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { getTerapiaDia, getLaudos, createLaudo } from "@/services/api";
import LaudoModal from "./LaudoModal";

export default function CalendarioPsicologo() {
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const hoje = new Date();

    const [mes, setMes] = useState(hoje.getMonth());
    const [ano, setAno] = useState(hoje.getFullYear());
    const [dadosAPI, setDadosAPI] = useState({});
    const [diaSelecionado, setDiaSelecionado] = useState(null);
    const [terapiaSelecionada, setTerapiaSelecionada] = useState(null);
    const [psicologo, setPsicologo] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const dados = localStorage.getItem("psicologo");
        if (dados) {
            try {
                setPsicologo(JSON.parse(dados));
            } catch (e) {
                console.error("Erro ao ler dados do psicólogo:", e);
            }
        }
    }, []);

    useEffect(() => {
        async function carregarTerapias() {
            if (!psicologo?.id) return;
            setCarregando(true);
            setErro("");

            try {
                const inicioMes = new Date(ano, mes, 1);
                const fimMes = new Date(ano, mes + 1, 0);
                const dados = {};

                for (let dia = 1; dia <= fimMes.getDate(); dia++) {
                    const dataStr = new Date(ano, mes, dia).toISOString().split("T")[0];
                    try {
                        const resp = await getTerapiaDia(dataStr, psicologo.id);
                        if (Array.isArray(resp.data) && resp.data.length > 0) {
                            dados[dia] = resp.data;
                        }
                    } catch (e) {
                        if (e.response?.status !== 404) {
                            console.error("Erro ao buscar terapias:", e);
                        }
                    }
                }

                setDadosAPI(dados);
            } catch (e) {
                setErro("Erro ao carregar sessões.");
                console.error(e);
            } finally {
                setCarregando(false);
            }
        }

        carregarTerapias();
    }, [mes, ano, psicologo]);

    async function carregarLaudos(id_terapia) {
        setCarregandoLaudos(true);
        try {
            const resp = await getLaudos();
            setLaudos(resp.data.filter((l) => l.id_terapia === id_terapia));
        } catch (e) {
            console.error("Erro ao carregar laudos:", e);
        } finally {
            setCarregandoLaudos(false);
        }
    }

    const mudarMes = (incremento) => {
        setMes((m) => {
            let novoMes = m + incremento;
            let novoAno = ano;

            if (novoMes > 11) {
                novoMes = 0;
                novoAno++;
            } else if (novoMes < 0) {
                novoMes = 11;
                novoAno--;
            }

            setAno(novoAno);
            return novoMes;
        });
    };

    const irParaHoje = () => {
        setMes(hoje.getMonth());
        setAno(hoje.getFullYear());
        setDiaSelecionado(null);
        setTerapiaSelecionada(null);
    };

    const dataInicio = new Date(ano, mes, 1);
    const primeiroDiaSemana = dataInicio.getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    const dias = [];
    for (let i = 0; i < primeiroDiaSemana; i++) dias.push(null);
    for (let i = 1; i <= diasNoMes; i++) dias.push(i);

    const nomeMes = dataInicio.toLocaleString("pt-BR", { month: "long" });

    if (carregando)
        return (
            <p className="text-center mt-10 text-[#D33865] font-semibold">
                Carregando sessões do calendário...
            </p>
        );

    if (erro)
        return (
            <p className="text-center mt-10 text-red-600 font-semibold">{erro}</p>
        );

    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-center transition-colors duration-500 relative">
            <div className="w-full min-h-screen bg-[#D33865] text-[#FDFBD4] rounded-2xl shadow-xl border border-[#b12c54]/40 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#b12c54]/40">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => mudarMes(-1)}
                            className="p-1 rounded-full bg-[#FDFBD4]/10 hover:bg-[#FDFBD4]/20 transition-all"
                        >
                            <MdArrowBackIosNew />
                        </button>
                        <button
                            onClick={() => irParaHoje()}
                            className="px-3 py-1 rounded-full bg-[#FDFBD4]/10 hover:bg-[#FDFBD4]/20 transition-all text-sm font-semibold"
                        >
                            {hoje.toLocaleDateString()}
                        </button>
                        <button
                            onClick={() => mudarMes(1)}
                            className="p-1 rounded-full bg-[#FDFBD4]/10 hover:bg-[#FDFBD4]/20 transition-all"
                        >
                            <MdArrowForwardIos />
                        </button>
                    </div>

                    <h2 className="text-xl font-semibold capitalize">
                        {nomeMes} de {ano}
                    </h2>
                </div>

                <div className="grid grid-cols-7 text-center font-semibold border-b border-[#b12c54]/40">
                    {diasSemana.map((dia) => (
                        <div key={dia} className="py-3 uppercase tracking-wide text-sm">
                            {dia}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 flex-1 text-sm md:text-base">
                    {dias.map((dia, idx) => {
                        const isHoje =
                            dia &&
                            dia === hoje.getDate() &&
                            mes === hoje.getMonth() &&
                            ano === hoje.getFullYear();

                        const terapias = dia ? dadosAPI[dia] || [] : [];

                        return (
                            <div
                                key={idx}
                                onClick={() => dia && setDiaSelecionado(dia)}
                                className={`border border-[#b12c54]/40 flex flex-col p-1 md:p-2 transition-all
                    ${dia ? "hover:bg-[#FDFBD4]/10 cursor-pointer" : "bg-transparent"}
                    ${isHoje ? "bg-[#FDFBD4]/20 ring-2 ring-[#FDFBD4]" : ""}
                `}
                            >
                                <div className="flex justify-end text-xs md:text-sm font-semibold mb-1">
                                    {dia ?? ""}
                                </div>

                                <div className="flex flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FDFBD4]/30 flex-1">
                                    {terapias.map((sessao, i) => (
                                        <div
                                            key={i}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTerapiaSelecionada(sessao);
                                                carregarLaudos(sessao.id);
                                            }}
                                            className="text-[0.65rem] md:text-xs bg-[#FDFBD4]/15 rounded px-1 py-0.5 truncate hover:bg-[#FDFBD4]/25"
                                        >
                                            {sessao.nome_paciente} às{" "}
                                            {new Date(sessao.data).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {diaSelecionado && !terapiaSelecionada && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-[#FDFBD4] text-[#D33865] dark:bg-[#121212] dark:text-[#FDFBD4] p-6 rounded-2xl shadow-xl w-[90%] md:w-[400px]">
                        <h3 className="text-lg font-bold mb-2">
                            Compromissos do dia {diaSelecionado} de {nomeMes} de {ano}
                        </h3>

                        {dadosAPI[diaSelecionado] && dadosAPI[diaSelecionado].length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {dadosAPI[diaSelecionado].map((sessao, i) => (
                                    <li key={i}>
                                        {sessao.nome_paciente} às{" "}
                                        {new Date(sessao.data).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm opacity-70">Nenhum compromisso neste dia.</p>
                        )}

                        <button
                            onClick={() => setDiaSelecionado(null)}
                            className="mt-4 w-full py-2 rounded-full bg-[#D33865] text-[#FDFBD4] hover:bg-[#b12c54] transition-all font-semibold"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {terapiaSelecionada && (
                <LaudoModal
                    terapia={terapiaSelecionada}
                    onClose={() => setTerapiaSelecionada(null)}
                />
            )}
        </main>
    );
}
