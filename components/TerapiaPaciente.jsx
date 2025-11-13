"use client";
import { useState, useEffect } from "react";
// Importamos a função de busca de terapias do seu arquivo de serviço
import { getTerapias } from "@/services/api"; 

export default function TerapiaPaciente({ paciente }) {
    // Definimos a cor do texto para o contraste no fundo claro/transparente
    const COR_TEXTO = "#2F4156"; // Usando a cor escura que você preferiu recentemente
    
    // 1. Estados para os dados, carregamento e erro
    const [terapias, setTerapias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Hook useEffect para buscar as terapias do paciente
    useEffect(() => {
        if (!paciente || !paciente.id) {
            // Se não houver paciente logado, apenas mostra a mensagem
            setIsLoading(false);
            return;
        }
        fetchTerapias();
    }, [paciente]); // Dependência em paciente: executa quando o paciente é carregado

    async function fetchTerapias() {
        setIsLoading(true);
        setError(null);
        try {
            // Chamada à API. Nota: getTerapias() deve ser adaptado no backend
            // para aceitar um ID de paciente se a lista for muito grande.
            const res = await getTerapias(); 
            const todasTerapias = res.data ?? []; 

            // Filtramos as terapias para mostrar apenas as do paciente logado
            const minhasTerapias = todasTerapias.filter(
                (terapia) => terapia.id_paciente === paciente.id
            );

            setTerapias(minhasTerapias);

        } catch (err) {
            console.error("Erro ao buscar terapias:", err);
            const errorMessage = err.response?.data?.mensagem || err.message || "Erro ao carregar sessões.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // --- Renderização Condicional ---
    
    if (isLoading) {
        return <div className="max-w-3xl mx-auto bg-white/70 rounded-2xl p-6 shadow-lg text-center" style={{ color: COR_TEXTO }}>
            <h3 className="text-lg font-semibold mb-4">Minhas Sessões</h3>
            <p>Carregando sessões...</p>
        </div>;
    }

    if (error) {
        return <div className="max-w-3xl mx-auto bg-white/70 rounded-2xl p-6 shadow-lg text-center text-red-600">
            <h3 className="text-lg font-semibold mb-4">Minhas Sessões</h3>
            <p>Erro: {error}</p>
        </div>;
    }

    // --- Renderização Principal ---

    return (
        <div 
            className="max-w-3xl mx-auto bg-white/70 rounded-2xl p-6 shadow-lg" 
            style={{ color: COR_TEXTO }}
        >
            <h3 className="text-xl font-bold mb-5">Minhas Sessões</h3>
            
            {terapias.length === 0 ? (
                // Se não houver sessões
                <p className="text-center">Você ainda não tem sessões registradas aqui. Assim que marcar, elas aparecerão nesta lista.</p>
            ) : (
                // Se houver sessões, listamos
                <div className="space-y-4">
                    {terapias.map((terapia) => (
                        <div 
                            key={terapia.id} 
                            className="p-4 bg-white/60 rounded-lg shadow-sm border border-gray-200"
                        >
                            <p className="font-semibold text-lg">{terapia.psicologo_nome || "Psicólogo Não Informado"}</p>
                            <p className="text-sm">Data: **{terapia.data}** | Horário: **{terapia.horario_inicial}**</p>
                            <p className="text-sm">Sala: {terapia.sala_nome || "Sala Padrão"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}