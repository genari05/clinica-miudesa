// src/components/DetalheAgendamento.js
"use client";
import { useState, useEffect, useMemo } from "react";
import { getDisponibilidades, createTerapia } from "@/services/api"; // Certifique-se de que o import está correto

const COR_TEXTO = "#002147"; 
const COR_DESTAQUE = "#38d3a6"; 
const COR_DESTAQUE_TEXTO = "#063226"; 

export default function DetalheAgendamento({ psicologo, paciente, onBack }) {
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);
    const [error, setError] = useState(null);

    // Busca de Dados (Agenda do Psicólogo)
    useEffect(() => {
        const fetchAgenda = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await getDisponibilidades();
                // Filtra as disponibilidades pelo psicólogo selecionado
                const agendaPsicologo = (res.data ?? []).filter(
                    (disp) => disp.id_psicologo === psicologo.id
                );
                setDisponibilidades(agendaPsicologo);
            } catch (err) {
                console.error("Erro ao buscar agenda:", err);
                setError("Não foi possível carregar a agenda.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAgenda();
    }, [psicologo]);

    // Agrupamento de Horários por Data (Mini-Calendário)
    const agendaAgrupada = useMemo(() => {
        return disponibilidades.reduce((acc, slot) => {
            const date = slot.data; 
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(slot);
            return acc;
        }, {});
    }, [disponibilidades]);


    // Função de Agendamento
    const handleAgendar = async () => {
        if (!selectedSlot || !paciente || !psicologo) return;

        setIsScheduling(true);
        setError(null);

        // 🚨 CORREÇÃO DO ERRO 400: Adição do id_disponibilidade
        const terapiaData = {
            id_paciente: paciente.id, 
            id_psicologo: psicologo.id,
            // ID que o backend usa para saber qual horário específico deve ser reservado
            id_disponibilidade: selectedSlot.id, 
            data: selectedSlot.data,
            horario_inicial: selectedSlot.horario_inicial,
            id_sala: selectedSlot.id_sala || null, // Garante que a sala é enviada ou é null
        };

        try {
            await createTerapia(terapiaData);
            alert(`Sessão agendada com sucesso com ${psicologo.nome}!`);
            onBack(); 
        } catch (err) {
            console.error("Erro ao agendar:", err);
            // Mensagem de erro mais útil para o usuário
            setError(err.message || "Falha ao confirmar agendamento. Tente outro horário ou verifique se o horário já foi reservado.");
        } finally {
            setIsScheduling(false);
        }
    };

    // --- Renderização ---
    return (
        <section style={{ color: COR_TEXTO }}>
            <h2 className="text-xl font-bold mb-5 text-center">
                Agenda de {psicologo?.nome}
            </h2>

            {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

            {isLoading ? (
                <p className="text-center">Carregando disponibilidade...</p>
            ) : Object.keys(agendaAgrupada).length === 0 ? (
                <p className="text-center text-gray-500">
                    Nenhum horário disponível encontrado.
                </p>
            ) : (
                // Visualização do Calendário Agrupado
                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(agendaAgrupada).map(([date, slots]) => (
                        <div key={date} className="border p-4 rounded-xl shadow-md bg-white/50">
                            <h4 className="font-bold text-lg mb-3 border-b pb-1">📅 {date}</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {slots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`
                                            px-4 py-2 text-sm rounded-full transition-colors duration-150
                                            ${selectedSlot?.id === slot.id
                                                ? `bg-[${COR_DESTAQUE}] text-[${COR_DESTAQUE_TEXTO}] font-bold border-transparent shadow-md`
                                                : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                            }
                                        `}
                                    >
                                        {slot.horario_inicial} - {slot.horario_final || 'FIM'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="mt-8 flex gap-3 justify-center">
                {/* BOTÃO DE CONFIRMAÇÃO */}
                <button
                    onClick={handleAgendar}
                    disabled={!selectedSlot || isScheduling}
                    className="
                        px-6 py-3 rounded-full font-semibold transition-colors duration-200 
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    style={{ backgroundColor: COR_DESTAQUE, color: COR_DESTAQUE_TEXTO }}
                >
                    {isScheduling ? 'Agendando...' : `Confirmar Agendamento ${selectedSlot ? `(${selectedSlot.horario_inicial})` : ''}`}
                </button>
                
                {/* BOTÃO VOLTAR */}
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-full font-semibold border transition-colors duration-200 hover:bg-gray-200"
                    style={{ color: COR_TEXTO, borderColor: COR_TEXTO }}
                >
                    Voltar
                </button>
            </div>
        </section>
    );
}