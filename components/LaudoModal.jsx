"use client";
import { useState, useEffect } from "react";
import { createLaudo, getLaudos, updateLaudo, deleteLaudo } from "@/services/api";
import { MdEdit, MdDelete, MdClose, MdSave } from "react-icons/md";

export default function LaudoModal({ terapia, onClose }) {
    const [laudos, setLaudos] = useState([]);
    const [novoLaudo, setNovoLaudo] = useState("");
    const [editando, setEditando] = useState(null);
    const [textoEditando, setTextoEditando] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (!terapia?.id) return;
        carregarLaudos();
    }, [terapia]);

    async function carregarLaudos() {
        setCarregando(true);
        try {
            const resp = await getLaudos();
            const filtrados = resp.data.filter((l) => l.id_terapia === terapia.id);
            setLaudos(filtrados);
        } catch (e) {
            console.error("Erro ao carregar laudos:", e);
        } finally {
            setCarregando(false);
        }
    }

    async function adicionarLaudo() {
        if (!novoLaudo.trim()) return;
        setCarregando(true);
        try {
            const resp = await createLaudo({
                id_terapia: terapia.id,
                texto: novoLaudo,
            });

            if (resp.data?.id) {
                setLaudos((prev) => [...prev, resp.data]);
            } else {
                await carregarLaudos();
            }

            setNovoLaudo("");
        } catch (e) {
            alert("Erro ao criar laudo.");
        } finally {
            setCarregando(false);
        }
    }

    async function salvarEdicao(id) {
        if (!textoEditando.trim()) return;
        try {
            await updateLaudo(id, {
                id_terapia: terapia.id,
                texto: textoEditando,
            });
            await carregarLaudos();
            setEditando(null);
        } catch (e) {
            alert("Erro ao atualizar laudo.");
        }
    }

    async function excluirLaudo(id) {
        if (!confirm("Deseja excluir este laudo?")) return;
        try {
            await deleteLaudo(id);
            setLaudos((prev) => prev.filter((l) => l.id !== id));
        } catch (e) {
            alert("Erro ao excluir laudo.");
        }
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-[#FDFBD4] text-[#D33865] dark:bg-[#121212] dark:text-[#FDFBD4]
                p-6 rounded-2xl shadow-xl w-[90%] md:w-[450px] max-h-[85vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">
                        {terapia.nome_paciente}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[#D33865]/10 transition-all"
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                <p className="text-sm mb-4 opacity-80">
                    Sessão em{" "}
                    {new Date(terapia.data).toLocaleString("pt-BR", {
                        dateStyle: "full",
                        timeStyle: "short",
                    })}
                </p>

                <h4 className="font-semibold mb-2">Laudos</h4>

                {carregando ? (
                    <p className="text-sm">Carregando...</p>
                ) : laudos.length > 0 ? (
                    <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D33865]/30">
                        {laudos.map((l, idx) => (
                            <li
                                key={l.id || `temp-${idx}`}
                                className="bg-[#D33865]/10 p-2 rounded-md text-sm flex justify-between items-start"
                            >
                                {editando === l.id ? (
                                    <div className="flex flex-col w-full gap-2">
                                        <textarea
                                            value={textoEditando}
                                            onChange={(e) => setTextoEditando(e.target.value)}
                                            rows={3}
                                            className="w-full border border-[#D33865]/40 rounded-md p-2 text-sm bg-transparent text-[#D33865] dark:text-[#FDFBD4]"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => salvarEdicao(l.id)}
                                                className="p-1 rounded-full hover:bg-[#D33865]/10"
                                            >
                                                <MdSave size={18} />
                                            </button>
                                            <button
                                                onClick={() => setEditando(null)}
                                                className="p-1 rounded-full hover:bg-[#D33865]/10"
                                            >
                                                <MdClose size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="flex-1">{l.texto}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditando(l.id);
                                                    setTextoEditando(l.texto);
                                                }}
                                                className="p-1 rounded-full hover:bg-[#D33865]/10"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => excluirLaudo(l.id)}
                                                className="p-1 rounded-full hover:bg-[#D33865]/10"
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm opacity-70 mb-2">Nenhum laudo registrado.</p>
                )}

                <textarea
                    value={novoLaudo}
                    onChange={(e) => setNovoLaudo(e.target.value)}
                    placeholder="Escreva um novo laudo..."
                    rows={3}
                    className="mt-3 w-full border border-[#D33865]/40 rounded-md p-2 text-sm bg-transparent text-[#D33865] dark:text-[#FDFBD4]"
                />

                <button
                    onClick={adicionarLaudo}
                    disabled={carregando}
                    className="mt-2 w-full py-2 rounded-full bg-[#D33865] text-[#FDFBD4]
                        hover:bg-[#b12c54] transition-all font-semibold"
                >
                    {carregando ? "Salvando..." : "Adicionar Laudo"}
                </button>
            </div>
        </div>
    );
}