"use client";
import { useState } from "react";
import Header from "@/components/Header";
import CalendarioPsicologo from "@/components/CalendarioPsicologo";
import PacientesPsicologo from "@/components/PacientesPsicologo";
import Disponibilidade from "@/components/Disponibilidade";
import Sala from "@/components/Sala";

export default function Psicologo() {
  const [ativo, setAtivo] = useState("calendario");

  return (
    <div className="min-h-screen bg-[#e7e9c4] text-[#FDFBD4] dark:text-[#f8f8f8] transition-colors duration-500">
      {/* Header */}
      <Header ativo={ativo} setAtivo={setAtivo} />
      
      {/* Conteúdo principal */}
      <div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-6 md:px-12 py-6 gap-6 w-full">
        {ativo === "calendario" && <CalendarioPsicologo />}
        {ativo === "pacientes" && <PacientesPsicologo />}
        {ativo === "disponibilidade" && <Disponibilidade />}
        {ativo === "salas" && <Sala />}
      </div>
    </div>
  );
}
