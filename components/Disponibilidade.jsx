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
            setSalas(resSalas.data?.salas ?? resSalas.data ?? []);
            setDisponibilidades(resDisp.data?.disponibilidades ?? resDisp.data ?? []);
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
                await updateDisponibilidade(editingId, { id_psicologo, id_sala, data, horario_inicial, horario_final });
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
        <div className="w-full flex flex-col items-center gap-8 p-6">
            {/* Formulário */}
            <div className="w-full max-w-4xl p-6 flex flex-col gap-4 rounded-xl shadow-lg border  bg-white/10">
                <h1 className="text-2xl font-bold text-[#2F4156]">
                    {idioma === "pt" ? "Definir disponibilidade" : "Set availability"}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <select
                        value={id_sala}
                        onChange={(e) => setIdSala(e.target.value)}
                        className="w-full p-4 rounded-lg  text-white bg-[#2F4156] shadow-sm"
                    >
                        <option value="">{idioma === "pt" ? "Selecione uma sala" : "Select a room"}</option>
                        {salas.map((s) => (
                            <option key={s.id} value={s.id}>{s.nome}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full p-4 rounded-lg  text-white bg-[#2F4156] shadow-sm"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="time"
                            value={horario_inicial}
                            onChange={(e) => setHoraInicial(e.target.value)}
                            className="w-full p-4 rounded-lg  text-white bg-[#2F4156] shadow-sm"
                        />
                        <input
                            type="time"
                            value={horario_final}
                            onChange={(e) => setHoraFinal(e.target.value)}
                            className="w-full p-4 rounded-lg  text-white bg-[#2F4156] shadow-sm"
                        />
                    </div>

                    {mensagem && <p className="text-center text-blue-700 font-medium">{mensagem}</p>}

                    <div className="flex gap-4">
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

            {/* Lista de Disponibilidades */}
            <div className="w-full max-w-4xl p-6 flex flex-col gap-4 rounded-xl shadow-lg border  bg-white/10">
                <h1 className="text-2xl font-bold text-[#2F4156]">
                    {idioma === "pt" ? "Todas as disponibilidades" : "All availabilities"}
                </h1>

                {buscando ? (
                    <p className="text-[#2F4156]">{idioma === "pt" ? "Carregando..." : "Loading..."}</p>
                ) : disponibilidades.length === 0 ? (
                    <p className="text-[#2F4156]">{idioma === "pt" ? "Nenhuma disponibilidade." : "No availabilities."}</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {disponibilidades.map((d) => {
                            const [ano, mes, dia] = d.data.split("-").map(Number);
                            const dataLocal = new Date(ano, mes - 1, dia);
                            const dataFormatada = dataLocal.toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            });

                            return (
                                <li key={d.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-white/20 border border-blue-400 shadow-md">
                                    <div className="flex flex-col">
                                        <span className="text-blue-900 font-semibold text-lg">
                                            {d.nome_sala ? `${d.nome_sala} — ${d.nome_psicologo}` : `${salaNomeById(d.id_sala)} — ${d.nome_psicologo}`}
                                        </span>
                                        <span className="text-gray-800 text-sm capitalize">
                                            {dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}
                                        </span>
                                        <span className="mt-1 inline-block px-2 py-1 rounded-full text-sm font-medium text-white bg-blue-900">
                                            {d.horario_inicial} → {d.horario_final}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 mt-2 md:mt-0">
                                        <button
                                            onClick={() => startEdit(d)}
                                            className="px-3 py-2 rounded-md bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-all"
                                        >
                                            {idioma === "pt" ? "Editar" : "Edit"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-all"
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
