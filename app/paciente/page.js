"use client";
import { useState, useEffect } from "react";
import HeaderPaciente from "@/components/HeaderPaciente";
import HomePaciente from "@/components/HomePaciente";
import AgendarConsulta from "@/components/AgendarConsulta";
import TerapiaPaciente from "@/components/TerapiaPaciente";
import PerfilPaciente from "@/components/PerfilPaciente";

export default function PacientePage() {
  const [ativo, setAtivo] = useState("inicio");
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    // Tenta carregar paciente do localStorage (setado no login)
    const dados = localStorage.getItem("paciente");
    if (dados) {
      try {
        setPaciente(JSON.parse(dados));
      } catch (e) {
        console.error("Erro ao ler paciente do localStorage:", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixo com o vermelho padrão */}
      <HeaderPaciente ativo={ativo} setAtivo={setAtivo} paciente={paciente} />

      {/* Corpo da página com azul bebê suave */}
      <main
        className="flex-1 flex items-center justify-center px-6 md:px-12 py-6 transition-all duration-500"
        style={{
          backgroundColor: "#bfe6f5", // azul bebê
          backgroundImage: "linear-gradient(to bottom, #bfe6f5, #dff4ff)", // gradiente sutil
        }}
      >
        <div className="w-full max-w-5xl">
          {ativo === "inicio" && (
            <HomePaciente
              paciente={paciente}
              onAgendar={() => setAtivo("agendar")}
            />
          )}
          {ativo === "agendar" && <AgendarConsulta paciente={paciente} />}
          {ativo === "terapia" && <TerapiaPaciente paciente={paciente} />}
          {ativo === "perfil" && <PerfilPaciente paciente={paciente} />}
        </div>
      </main>
    </div>
  );
}
