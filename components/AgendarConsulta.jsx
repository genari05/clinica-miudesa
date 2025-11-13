// src/components/AgendarConsulta.js
"use client";
import { useState } from "react";
import ListaPsicologos from "@/components/ListaPsicologos";
import DetalheAgendamento from "@/components/DetalheAgendamento";

export default function AgendarConsulta({ paciente }) {
    // ESTADO: Gerencia qual profissional foi selecionado
    const [psicologoSelecionado, setPsicologoSelecionado] = useState(null);

    // Definição de cores
    const COR_FUNDO_SECAO = "bg-white/70"; 
    const COR_TEXTO = "#002147"; 

    // Função para voltar
    const handleBack = () => {
        setPsicologoSelecionado(null);
    };

    return (
        <div
            className={`
                max-w-3xl mx-auto 
                ${COR_FUNDO_SECAO} rounded-2xl p-8 
                shadow-xl hover:shadow-2xl 
                transition-all duration-300 
                backdrop-blur-sm
            `}
            style={{ color: COR_TEXTO }}
        >
            {!psicologoSelecionado ? (
                // === 1. TELA DE LISTAGEM DE PSICÓLOGOS E FILTRO ===
                <>
                    <h3 className="text-xl font-bold mb-4">
                        Escolha um Profissional para Agendar
                    </h3>
                    
                    {/* Lista todos os profissionais */}
                    <ListaPsicologos 
                        onSelect={(p) => setPsicologoSelecionado(p)} 
                    />
                </>
            ) : (
                // === 2. TELA DE DETALHES E AGENDAMENTO (CALENDÁRIO) ===
                
                <DetalheAgendamento
                    psicologo={psicologoSelecionado}
                    paciente={paciente}
                    onBack={handleBack}
                />
            )}
        </div>
    );
}