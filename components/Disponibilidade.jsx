"use client";
import { useEffect, useState } from "react";
import { getSalas, getDisponibilidades, createDisponibilidade, updateDisponibilidade, deleteDisponibilidade } from "@/services/api";
import { useIdioma } from "@/context/IdiomaContext";

export default function Disponibilidade() {
    const { idioma } = useIdioma();

    const [salas, setSalas] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [id_sala, setIdSala] = useState("");
    const [data, setData] = useState("");
    const [horario_inicial, setHoraInicial] = useState("");
    const [horario_final, setHoraFinal] = useState("");
    const [id_psicologo, setIdPsicologo] = useState(null);

    useEffect(() => {
        const psicologo = JSON.parse(localStorage.getItem("psicologo"));
        if (psicologo) setIdPsicologo(psicologo.id);

        fetchAll();
    }, []);

    async function fetchAll() {
        setBuscando(true);
        try {
            const [resSalas, resDisp] = await Promise.all([getSalas(), getDisponibilidades()]);
            const salasData = resSalas.data?.salas ?? resSalas.data ?? [];
            const dispData = resDisp.data?.disponibilidades ?? resDisp.data ?? [];
            setSalas(salasData);
            setDisponibilidades(dispData);
        } catch (err) {
            console.error(err);
            setMensagem(err.message || (idioma === "pt" ? "Erro ao buscar dados." : "Error fetching data."));
        } finally {
            setBuscando(false);
        }
    }

    function resetForm() {
        setEditingId(null);
        setIdSala("");
        setData("");
        setHoraInicial("");
        setHoraFinal("");
    }

    function startEdit(disp) {
        setEditingId(disp.id);
        setIdSala(disp.id_sala?.toString() ?? disp.id_sala);
        setData(disp.data ?? "");
        setHoraInicial(disp.horario_inicial ?? "");
        setHoraFinal(disp.horario_final ?? "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(e) {
        e?.preventDefault();
        setMensagem("");

        if (!id_sala || !data || !horario_inicial || !horario_final) {
            setMensagem(idioma === "pt" ? "Preencha todos os campos." : "Fill all fields.");
            return;
        }
        if (!id_psicologo) {
            setMensagem(idioma === "pt" ? "Usuário não identificado." : "Psychologist not identified.");
            return;
        }

        setCarregando(true);
        try {
            if (editingId) {
                await updateDisponibilidade(editingId, {
                    id_psicologo,
                    id_sala,
                    data,
                    horario_inicial,
                    horario_final,
                });
                setMensagem(idioma === "pt" ? "Disponibilidade atualizada!" : "Availability updated!");
            } else {
                await createDisponibilidade(id_psicologo, id_sala, data, horario_inicial, horario_final);
                setMensagem(idioma === "pt" ? "Disponibilidade adicionada!" : "Availability added!");
            }
            await fetchAll();
            resetForm();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || (idioma === "pt" ? "Erro ao salvar disponibilidade." : "Error saving availability."));
        } finally {
            setCarregando(false);
        }
    }

    async function handleDelete(id) {
        const confirmMsg = idioma === "pt" ? "Deseja excluir esta disponibilidade?" : "Delete this availability?";
        if (!confirm(confirmMsg)) return;
        try {
            setCarregando(true);
            await deleteDisponibilidade(id);
            setMensagem(idioma === "pt" ? "Disponibilidade excluída." : "Availability deleted.");
            await fetchAll();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || (idioma === "pt" ? "Erro ao excluir disponibilidade." : "Error deleting availability."));
        } finally {
            setCarregando(false);
        }
    }

    function salaNomeById(id) {
        const s = salas.find((x) => x.id?.toString() === id?.toString());
        return s ? s.nome : (idioma === "pt" ? "Sala removida" : "Removed room");
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="bg-white dark:bg-black border-2 border-[#D33865] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b-1 border-[#D33865] mb-4">
                    <h1 className="text-2xl font-bold text-[#D33865]">
                        {idioma === "pt" ? "Definir disponibilidade" : "Set availability"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4">
                    <select
                        value={id_sala}
                        onChange={(e) => setIdSala(e.target.value)}
                        className="w-full bg-[#FFE3EB] p-4 rounded-xl shadow-sm text-black"
                    >
                        <option value="">{idioma === "pt" ? "Selecione uma sala" : "Select a room"}</option>
                        {salas.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.nome}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full bg-[#FFE3EB] p-4 rounded-xl shadow-sm text-black"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="time"
                            value={horario_inicial}
                            onChange={(e) => setHoraInicial(e.target.value)}
                            className="w-full bg-[#FFE3EB] p-4 rounded-xl shadow-sm text-black"
                        />
                        <input
                            type="time"
                            value={horario_final}
                            onChange={(e) => setHoraFinal(e.target.value)}
                            className="w-full bg-[#FFE3EB] p-4 rounded-xl shadow-sm text-black"
                        />
                    </div>

                    {mensagem && <p className="text-sm text-center text-[#D33865]">{mensagem}</p>}

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
                                className="bg-white dark:bg-black text-[#D33865] py-3 px-4 rounded-full font-semibold hover:opacity-90 border cursor-pointer"
                            >
                                {idioma === "pt" ? "Cancelar" : "Cancel"}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-black border-2 border-[#D33865] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b-1 border-[#D33865]">
                    <h1 className="text-2xl font-bold text-[#D33865]">
                        {idioma === "pt" ? "Todas as disponibilidades" : "All availabilities"}
                    </h1>
                </div>

                {buscando ? (
                    <p>{idioma === "pt" ? "Carregando..." : "Loading..."}</p>
                ) : disponibilidades.length === 0 ? (
                    <p>{idioma === "pt" ? "Nenhuma disponibilidade." : "No availabilities."}</p>
                ) : (
                    <ul className="flex flex-col gap-3 p-4">
                        {disponibilidades.map((d) => {
                            const [ano, mes, dia] = d.data.split("-").map(Number);
                            const dataLocal = new Date(ano, mes - 1, dia);

                            const dataFormatada = dataLocal.toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            });

                            return (
                                <li
                                    key={d.id}
                                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-[#fff9d9] dark:bg-[#121212] rounded-xl border border-[#D33865]/30 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[#D33865] font-semibold text-lg">
                                            {d.nome_sala
                                                ? `${d.nome_sala} — ${d.nome_psicologo}`
                                                : `${salaNomeById(d.id_sala)} — ${d.nome_psicologo}`}
                                        </span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}
                                        </span>

                                        <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                                            <span className="bg-[#D33865]/20 text-[#D33865] dark:bg-[#f9c9d9]/20 px-2 py-[2px] rounded-full">
                                                {d.horario_inicial} → {d.horario_final}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => startEdit(d)}
                                            className="px-3 py-2 rounded-md bg-[#f9d7df] hover:bg-[#f2c7cf] text-[#D33865] font-semibold cursor-pointer transition-all"
                                        >
                                            {idioma === "pt" ? "Editar" : "Edit"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer transition-all"
                                        >
                                            {idioma === "pt" ? "Excluir" : "Delete"}
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}