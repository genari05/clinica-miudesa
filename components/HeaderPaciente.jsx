"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MdCalendarMonth, MdChat, MdPerson, MdEventAvailable } from "react-icons/md";
import Logo from "@/public/logo.png";

export default function HeaderPaciente({ ativo, setAtivo, paciente }) {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!paciente) {
      const dados = localStorage.getItem("paciente");
      if (dados) {
        try {
          // apenas mantém compatibilidade
        } catch (e) {
          console.error("Erro ao ler paciente local:", e);
        }
      }
    }
  }, [paciente]);

  const nomeCurto = paciente?.nome ? paciente.nome.split(" ")[0] : "Paciente";

  const itens = [
    { id: "inicio", label: "Início", icon: <MdChat size={18} /> },
    { id: "agendar", label: "Agendar", icon: <MdEventAvailable size={18} /> },
    { id: "terapia", label: "Terapias", icon: <MdCalendarMonth size={18} /> },
    { id: "perfil", label: "Perfil", icon: <MdPerson size={18} /> },
  ];

  return (
    <header className="w-full py-4 shadow-md" style={{ backgroundColor: "#D33865" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">

        {/* ESQUERDA — Logo e slogan */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-[2px]">
            <Image src={Logo} alt="Logo" width={44} height={44} style={{ objectFit: "cover" }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#063226]">Clínica Mente Viva</h1>
            <p className="text-xs text-[#063226]/80">Cuidar da mente é viver em equilíbrio</p>
          </div>
        </div>

        {/* CENTRO — Botões de navegação */}
        <nav className="hidden md:flex items-center justify-center gap-4 flex-1">
          {itens.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setAtivo(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-lg`}
              style={
                ativo === id
                  ? { backgroundColor: "#81D4FA", color: "#063970" }
                  : { backgroundColor: "#E1F5FE", color: "#063226" }
              }
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B3E5FC")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  ativo === id ? "#81D4FA" : "#E1F5FE")
              }
            >
              <span className="flex items-center">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* DIREITA — Perfil e nome do paciente */}
        <div className="hidden sm:flex items-center gap-3 bg-[#E1F5FE] px-3 py-2 rounded-full shadow-sm hover:scale-[1.03] transition-transform">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-[2px]">
            <Image src={Logo} alt="icone paciente" width={32} height={32} style={{ objectFit: "cover" }} />
          </div>
          <div className="text-left">
            <div className="text-[#063970] text-sm font-semibold">
              {`Olá, ${nomeCurto}!`}
            </div>
            <div className="text-xs text-[#063970]/80">Bem-vindo de volta 💙</div>
          </div>
        </div>

        {/* MENU MOBILE */}
        <button
          className="md:hidden px-3 py-2 rounded-full bg-white/10 text-[#063970]"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </div>

      {/* Dropdown mobile */}
      {menuAberto && (
        <div className="md:hidden mt-2 px-6 pb-4">
          <div className="bg-[#E1F5FE] rounded-xl p-3 flex flex-col gap-2">
            {itens.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setAtivo(id);
                  setMenuAberto(false);
                }}
                className="text-left px-3 py-2 rounded-lg font-semibold text-[#063970] hover:bg-[#B3E5FC] transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
