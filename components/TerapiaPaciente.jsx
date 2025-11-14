// src/components/TerapiaPaciente.js
"use client";
import { useState, useEffect, useMemo } from "react";
import { getTerapias, getPsicologos, getSalas } from "@/services/api"; 

const COR_TEXTO = "#2F4156"; 

// Função auxiliar para formatar a data e hora (mantida)
const formatarDataSessao = (datetimeString) => {
    if (!datetimeString) return { formattedDate: 'Data Indisponível', formattedTime: '' };
    const parts = datetimeString.split(' ');
    const datePart = parts[0]; 
    const timePart = parts[1] || ''; 
    if (datePart && datePart.includes('-')) {
        const [year, month, day] = datePart.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        return { formattedDate, formattedTime: timePart };
    }
    return { formattedDate: datetimeString, formattedTime: '' };
};


export default function TerapiaPaciente({ paciente }) {
    const [terapias, setTerapias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para armazenar os dados de lookup
    const [psicologosMap, setPsicologosMap] = useState({});
    const [salasMap, setSalasMap] = useState({});

    useEffect(() => {
        if (!paciente || !paciente.id) {
            setIsLoading(false);
            return;
        }
        fetchDados();
    }, [paciente]); 

    async function fetchDados() {
        setIsLoading(true);
        setError(null);
        try {
            // Busca Paralela de todos os dados
            const [resTerapias, resPsicologos, resSalas] = await Promise.all([
                getTerapias(),
                getPsicologos(),
                getSalas(),
            ]);

            // Cria mapas de ID para Nome (Lookup Tables)
            const mapPsicologos = (resPsicologos.data ?? []).reduce((acc, p) => {
                acc[p.id] = p.nome;
                return acc;
            }, {});
            setPsicologosMap(mapPsicologos);

            const mapSalas = (resSalas.data ?? []).reduce((acc, s) => {
                acc[s.id] = s.nome;
                return acc;
            }, {});
            setSalasMap(mapSalas);


            // Filtra e seta as terapias do paciente
            const todasTerapias = resTerapias.data ?? []; 
            const minhasTerapias = todasTerapias.filter(
                (terapia) => terapia.id_paciente === paciente.id
            );
            setTerapias(minhasTerapias);

        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Erro ao carregar sessões ou dados de apoio (psicólogos/salas).");
        } finally {
            setIsLoading(false);
        }
    }

    // Função de Exclusão/Cancelamento (A ser implementada)
    const handleCancelarSessao = (terapiaId) => {
        const confirmacao = window.confirm("Tem certeza que deseja cancelar esta sessão? Esta ação é irreversível.");
        if (confirmacao) {
            // 🚨 Aqui você chamaria a API de deleteTerapia(terapiaId)
            alert(`Sessão ID ${terapiaId} marcada para cancelamento. (Implementação de API necessária)`);
            // Após o sucesso da API, você chamaria: fetchDados();
        }
    };


    // ----------------------------------------------------------------------
    // 🚨 CORREÇÃO: Renderização Condicional com os blocos completos
    // ----------------------------------------------------------------------
    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto bg-white/70 rounded-2xl p-6 shadow-lg text-center" style={{ color: COR_TEXTO }}>
                <h3 className="text-lg font-semibold mb-4">Minhas Sessões</h3>
                <p>Carregando sessões...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="max-w-3xl mx-auto bg-white/70 rounded-2xl p-6 shadow-lg text-center text-red-600">
                <h3 className="text-lg font-semibold mb-4">Minhas Sessões</h3>
                <p>Erro: {error}</p>
            </div>
        );
    }
    // ----------------------------------------------------------------------


    // --- Renderização Principal ---
    return (
        <div 
            className="max-w-3xl mx-auto bg-white/70 rounded-2xl p-6 shadow-lg" 
            style={{ color: COR_TEXTO }}
        >
            <h3 className="text-xl font-bold mb-5">Minhas Sessões</h3>
            
            {terapias.length === 0 ? (
                <p className="text-center">Você ainda não tem sessões registradas aqui. Assim que marcar, elas aparecerão nesta lista.</p>
            ) : (
                <div className="space-y-4">
                    {terapias.map((terapia) => {
                        const { formattedDate, formattedTime } = formatarDataSessao(terapia.data);
                        
                        // Mapeamento dos IDs para os nomes
                        const nomePsicologo = psicologosMap[terapia.id_psicologo] || `Psicólogo ID: ${terapia.id_psicologo}`;
                        const nomeSala = salasMap[terapia.id_sala] || `Sala ID: ${terapia.id_sala || 'N/A'}`;

                        return (
                            <div 
                                key={terapia.id} 
                                className="p-4 bg-white/60 rounded-lg shadow-sm border border-gray-200"
                            >
                                <p className="font-semibold text-lg">{nomePsicologo}</p>
                                <p className="text-sm">Data: **{formattedDate}** | Horário: **{formattedTime}**</p>
                                <p className="text-sm mb-3">Sala: {nomeSala}</p>
                                
                                {/* BOTÃO DE CANCELAR */}
                                <button
                                    onClick={() => handleCancelarSessao(terapia.id)}
                                    className="px-4 py-1 text-sm rounded-full font-medium transition-colors duration-200"
                                    style={{ backgroundColor: '#D33865', color: 'white' }}
                                >
                                    Cancelar Sessão
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}