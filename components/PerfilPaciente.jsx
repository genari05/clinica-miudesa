// src/components/PerfilPaciente.js
"use client";
import { useState } from 'react'; 
// A função updatePaciente não é mais necessária

export default function PerfilPaciente({ paciente }) {
    // Cor de texto principal (Azul/Cinza Escuro)
    const NOVA_COR = "#2F4156"; 
    
    // Cores unificadas para o botão 'Sair'
    const COR_BOTAO_FUNDO = "#38d3a6";
    const COR_BOTAO_HOVER = "#2fb28e"; 
    const COR_BOTAO_TEXTO = "#063226"; 

    // Estados para gerenciar o hover (apenas para o botão Sair)
    const [hoverSair, setHoverSair] = useState(false);
    
    // Função de saída (Logout)
    const handleSair = () => {
        // Remove a informação do paciente logado do armazenamento local
        localStorage.removeItem("paciente");
        // Redireciona o usuário para a página inicial
        window.location.href = "/"; 
    };

    return (
        <section 
            className="
                max-w-sm mx-auto 
                bg-white/70 rounded-2xl p-5 
                shadow-xl transition-all duration-300 
                backdrop-blur-sm
                text-center 
                hover:shadow-2xl hover:scale-[1.01] 
            "
        >
            
            {/* BLOCO DE TEXTO: TÍTULO DO PERFIL */}
            <h2 className="text-xl font-semibold mb-4" style={{ color: NOVA_COR }}>
                Meu Perfil
            </h2>

            {/* BLOCO DE TEXTO: DADOS DO PACIENTE */}
            <div 
                className="space-y-2 text-sm text-left mx-auto" 
                style={{ color: NOVA_COR, maxWidth: '250px' }}
            >
                <p><span>Nome:</span> {paciente?.nome || "—"}</p>
                <p><span>Email:</span> {paciente?.email || "—"}</p>
                <p><span>Telefone:</span> {paciente?.telefone || "—"}</p>
                <p><span>Data de nascimento:</span> {paciente?.data_nascimento || "—"}</p>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
                
                {/* 🚨 BOTÃO EDITAR FOI REMOVIDO */}

                {/* BLOCO DE BOTÃO: SAIR */}
                <button
                    onClick={handleSair} 
                    onMouseEnter={() => setHoverSair(true)}
                    onMouseLeave={() => setHoverSair(false)}
                    className="
                        px-4 py-2 rounded-full font-medium border-none
                        transition-all duration-200 hover:scale-105
                    "
                    style={{ 
                        backgroundColor: hoverSair ? COR_BOTAO_HOVER : COR_BOTAO_FUNDO, 
                        color: COR_BOTAO_TEXTO,
                        minWidth: '100px' // Garante um tamanho decente para o botão
                    }}
                >
                    Sair
                </button>
            </div>
        </section>
    );
}