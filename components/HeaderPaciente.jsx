import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeaderPaciente({ ativo, setAtivo, paciente }) {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!paciente) {
      const dados = localStorage.getItem("paciente");
      if (dados) {
        try {
          // caso queira setar paciente
        } catch (e) {
          console.error("Erro ao ler paciente local:", e);
        }
      }
    }
  }, [paciente]);

  const nomeCurto = paciente?.nome ? paciente.nome.split(" ")[0] : "Paciente";

  const itens = [
    { id: "inicio", label: "Início", icon: "💬" },
    { id: "agendar", label: "Agendar", icon: "📅" },
    { id: "terapia", label: "Terapias", icon: "🧠" },
    { id: "perfil", label: "Perfil", icon: "👤" },
  ];

  return (
    <header className="w-full py-4 shadow-md" style={{ backgroundColor: "#CBD9E6" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">

        {/* ESQUERDA — Logo */}
        <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-[2px]">
              <Image 
                src="/logopaciente.jpg" 
                alt="Logo" 
                width={64} 
                height={64} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: "#2F4156" }}>
                Clínica Mente Viva
              </h1>
              <p className="text-xs" style={{ color: "#2F4156" }}>
                Cuidar da mente é viver em equilíbrio
              </p>
            </div>
        </div>


        {/* CENTRO — Botões */}
        <nav className="hidden md:flex items-center justify-center gap-4 flex-1">
          {itens.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setAtivo(id)}
              className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-lg"
              style={{
                backgroundColor: ativo === id ? "#2F4156" : "#FFFFFF",
                color: ativo === id ? "#F5FEEB" : "#567C8D"
              }}
              onMouseEnter={(e) => {
                if (ativo !== id) {
                  e.currentTarget.style.backgroundColor = "#567C8D";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (ativo !== id) {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#567C8D";
                }
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* DIREITA — Perfil */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-full shadow-sm hover:scale-[1.03] transition-transform" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-[2px]">
            <Image src="/logopaciente.jpg" alt="icone paciente" width={32} height={32} />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold" style={{ color: "#2F4156" }}>
              {`Olá, ${nomeCurto}!`}
            </div>
            <div className="text-xs" style={{ color: "#567C8D" }}>
              Bem-vindo de volta 💙
            </div>
          </div>
        </div>

        {/* MENU MOBILE */}
        <button className="md:hidden px-3 py-2 rounded-full bg-white/30" style={{ color: "#2F4156" }} onClick={() => setMenuAberto(!menuAberto)}>
          ☰
        </button>
      </div>

      {/* MENU MOBILE DROP */}
      {menuAberto && (
        <div className="md:hidden mt-2 px-6 pb-4">
          <div className="rounded-xl p-3 flex flex-col gap-2" style={{ backgroundColor: "#FFFFFF" }}>
            {itens.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setAtivo(id);
                  setMenuAberto(false);
                }}
                className="text-left px-3 py-2 rounded-lg font-semibold transition-colors"
                style={{ color: "#2F4156" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#567C8D";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#2F4156";
                }}
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
