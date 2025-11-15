"use client";
import { useEffect, useState } from "react";
import { getSalas, createSala, updateSala, deleteSala } from "@/services/api";
import { useIdioma } from "@/context/IdiomaContext";

export default function Sala() {
    const { idioma } = useIdioma();
    const [salas, setSalas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [buscando, setBuscando] = useState(false);

    useEffect(() => {
        fetchSalas();
    }, []);

    async function fetchSalas() {
        setBuscando(true);
        try {
            const res = await getSalas();
            const data = res.data?.salas ?? res.data ?? [];
            setSalas(data);
        } catch (err) {
            console.error(err);
            setMensagem(err.message || (idioma === "pt" ? "Erro ao buscar salas." : "Error fetching rooms."));
        } finally {
            setBuscando(false);
        }
    }

    function resetForm() {
        setNome("");
        setDescricao("");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e?.preventDefault();
        setMensagem("");
        if (!nome.trim()) {
            setMensagem(idioma === "pt" ? "Digite o nome da sala." : "Enter the room name.");
            return;
        }

        setCarregando(true);
        try {
            if (editingId) {
                await updateSala(editingId, { nome, descricao });
                setMensagem(idioma === "pt" ? "Sala atualizada com sucesso!" : "Room updated successfully!");
            } else {
                await createSala(nome, descricao);
                setMensagem(idioma === "pt" ? "Sala criada com sucesso!" : "Room created successfully!");
            }
            await fetchSalas();
            resetForm();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || (idioma === "pt" ? "Erro ao salvar sala." : "Error saving room."));
        } finally {
            setCarregando(false);
        }
    }

    function startEdit(sala) {
        setEditingId(sala.id);
        setNome(sala.nome || "");
        setDescricao(sala.descricao || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        const confirmMsg = idioma === "pt" ? "Deseja excluir esta sala?" : "Do you want to delete this room?";
        if (!confirm(confirmMsg)) return;
        try {
            setCarregando(true);
            await deleteSala(id);
            setMensagem(idioma === "pt" ? "Sala excluída." : "Room deleted.");
            await fetchSalas();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || (idioma === "pt" ? "Erro ao excluir sala." : "Error deleting room."));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="w-full flex flex-col items-center gap-8 p-6">
            {/* Formulário */}
            <div className="w-full max-w-4xl p-6 flex flex-col gap-4 rounded-xl shadow-lg border  bg-white/10">
                <h1 className="text-2xl font-bold text-[#2F4156]">
                    {idioma === "pt" ? "Criar uma sala" : "Create a room"}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        className="w-full p-4 rounded-lg  text-white bg-[#2F4156] shadow-sm"
                        type="text"
                        placeholder={idioma === "pt" ? "Nome da Sala" : "Room Name"}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <input
                        className="w-full p-4 rounded-lg  text-white bg-[#2F4156] shadow-sm"
                        type="text"
                        placeholder={idioma === "pt" ? "Descrição (opcional)" : "Description (optional)"}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />

                    {mensagem && <p className="text-center text-blue-700 font-medium">{mensagem}</p>}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex-1 py-3 rounded-full bg-[#2F4156] text-white font-bold hover:bg-blue-800 disabled:opacity-60 transition-all"
                        >
                            {carregando
                                ? idioma === "pt" ? "Salvando..." : "Saving..."
                                : editingId
                                    ? idioma === "pt" ? "ATUALIZAR" : "UPDATE"
                                    : idioma === "pt" ? "ADICIONAR" : "ADD"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="py-3 px-4 rounded-full border border-blue-900 text-blue-900 hover:bg-blue-50 transition-all"
                            >
                                {idioma === "pt" ? "Cancelar" : "Cancel"}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista de Salas */}
            <div className="w-full max-w-4xl p-6 flex flex-col gap-4 rounded-xl shadow-lg border  bg-white/10">
                <h1 className="text-2xl font-bold text-[#2F4156]">
                    {idioma === "pt" ? "Todas as salas" : "All rooms"}
                </h1>

                {buscando ? (
                    <p className="text-[#2F4156]">{idioma === "pt" ? "Carregando..." : "Loading..."}</p>
                ) : salas.length === 0 ? (
                    <p className="text-[#2F4156]">{idioma === "pt" ? "Nenhuma sala encontrada." : "No rooms found."}</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {salas.map((sala) => (
                            <li
                                key={sala.id}
                                className="flex items-center justify-between gap-4 p-4 rounded-lg border border-blue-400 bg-white/20 shadow-md"
                            >
                                <div>
                                    <div className="font-semibold text-blue-900">{sala.nome}</div>
                                    {sala.descricao && <div className="text-gray-800 text-sm">{sala.descricao}</div>}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(sala)}
                                        className="px-3 py-2 rounded-md bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-all"
                                    >
                                        {idioma === "pt" ? "Editar" : "Edit"}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(sala.id)}
                                        className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-all"
                                    >
                                        {idioma === "pt" ? "Excluir" : "Delete"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
