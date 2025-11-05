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
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="bg-white dark:bg-black border-2 border-[#D33865] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b-1 border-[#D33865] mb-4">
                    <h1 className="text-2xl font-bold text-[#D33865]">
                        {idioma === "pt" ? "Criar uma sala" : "Create a room"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4">
                    <input
                        className="w-full bg-[#FFE3EB] p-4 rounded-xl shadow-sm text-black"
                        type="text"
                        placeholder={idioma === "pt" ? "Nome da Sala" : "Room Name"}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#FFE3EB] p-4 rounded-xl shadow-sm text-black"
                        type="text"
                        placeholder={idioma === "pt" ? "Descrição (opcional)" : "Description (optional)"}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />

                    {mensagem && (
                        <p className="text-sm text-center text-[#D33865]">{mensagem}</p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex-1 bg-[#D33865] text-white dark:text-black py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-60 cursor-pointer"
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
                                className="bg-white dark:bg-black text-[#D33865] py-3 px-4 rounded-full font-semibold border hover:opacity-90 cursor-pointer"
                            >
                                {idioma === "pt" ? "Cancelar" : "Cancel"}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-black border-2 border-[#D33865] rounded-xl shadow-inner border-1">
                <div className="w-full p-4 border-b-1 border-[#D33865]">
                    <h1 className="text-2xl font-bold text-[#D33865]">
                        {idioma === "pt" ? "Todas as salas" : "All rooms"}
                    </h1>
                </div>

                {buscando ? (
                    <p>{idioma === "pt" ? "Carregando..." : "Loading..."}</p>
                ) : salas.length === 0 ? (
                    <p>{idioma === "pt" ? "Nenhuma sala encontrada." : "No rooms found."}</p>
                ) : (
                    <ul className="flex flex-col gap-3 p-4">
                        {salas.map((sala) => (
                            <li
                                key={sala.id}
                                className="flex items-center justify-between gap-4 p-3 bg-[#fff9d9] dark:bg-[#121212] rounded-lg border border-[#D33865]/30"
                            >
                                <div>
                                    <div className="font-semibold text-[#D33865]">{sala.nome}</div>
                                    {sala.descricao && <div className="text-sm text-gray-600 dark:text-gray-300">{sala.descricao}</div>}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(sala)}
                                        className="px-3 py-2 rounded-md bg-[#f9d7df] hover:bg-[#f2c7cf] text-[#D33865] font-semibold cursor-pointer"
                                    >
                                        {idioma === "pt" ? "Editar" : "Edit"}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(sala.id)}
                                        className="px-3 py-2 rounded-md bg-red-600 hover:opacity-90 text-white font-semibold cursor-pointer"
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