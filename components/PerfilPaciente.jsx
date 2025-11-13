"use client";
import { useState } from 'react'; // Importamos useState para gerenciar o hover

export default function PerfilPaciente({ paciente }) {
    // Cor de texto principal (Azul/Cinza Escuro)
    const NOVA_COR = "#2F4156"; 
    
    // Cores unificadas para os botões
    const COR_BOTAO_FUNDO = "#38d3a6";
    const COR_BOTAO_HOVER = "#2fb28e"; // Cor mais escura para o hover
    const COR_BOTAO_TEXTO = "#063226"; 

    // Estados para gerenciar o hover dos botões (Necessário para aplicar a cor do hover via 'style')
    const [hoverEditar, setHoverEditar] = useState(false);
    const [hoverSair, setHoverSair] = useState(false);

    return (
        <section 
            className="
                max-w-sm mx-auto 
                bg-white/70 rounded-2xl p-5 
                shadow-xl transition-all duration-300 
                backdrop-blur-sm
                text-center 
                /* 🚨 HOVER DO RETÂNGULO: Sombra mais forte e leve escala */
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
                <p><strong>Nome:</strong> {paciente?.nome || "—"}</p>
                <p><strong>Email:</strong> {paciente?.email || "—"}</p>
                <p><strong>Telefone:</strong> {paciente?.telefone || "—"}</p>
                <p><strong>Data de nascimento:</strong> {paciente?.data_nascimento || "—"}</p>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
                {/* BLOCO DE BOTÃO: EDITAR - CORRIGIDO */}
                <button
                    onClick={() => alert("Editar perfil (a implementar)")}
                    // 🚨 EVENTOS DE HOVER PARA GERENCIAR A MUDANÇA DE COR
                    onMouseEnter={() => setHoverEditar(true)}
                    onMouseLeave={() => setHoverEditar(false)}
                    className="
                        px-3 py-1.5 rounded-full font-medium 
                        transition-all duration-200 hover:scale-105
                    "
                    style={{ 
                        // A cor muda baseada no estado 'hoverEditar'
                        backgroundColor: hoverEditar ? COR_BOTAO_HOVER : COR_BOTAO_FUNDO, 
                        color: COR_BOTAO_TEXTO 
                    }}
                >
                    Editar
                </button>
                
                {/* BLOCO DE BOTÃO: SAIR - CORRIGIDO */}
                <button
                    onClick={() => {
                        localStorage.removeItem("paciente");
                        window.location.href = "/"; 
                    }}
                    // 🚨 EVENTOS DE HOVER PARA GERENCIAR A MUDANÇA DE COR
                    onMouseEnter={() => setHoverSair(true)}
                    onMouseLeave={() => setHoverSair(false)}
                    className="
                        px-3 py-1.5 rounded-full font-medium border-none
                        transition-all duration-200 hover:scale-105
                    "
                    // Usando as mesmas cores do botão "Editar"
                    style={{ 
                        // A cor muda baseada no estado 'hoverSair'
                        backgroundColor: hoverSair ? COR_BOTAO_HOVER : COR_BOTAO_FUNDO, 
                        color: COR_BOTAO_TEXTO 
                    }}
                >
                    Sair
                </button>
            </div>
        </section>
    );
}