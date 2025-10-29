"use client";
import { useState } from "react";
import Header from "@/components/Header";
import CalendarioPsicologo from "@/components/CalendarioPsicologo";
import PacientesPsicologo from "@/components/PacientesPsicologo";

export default function Psicologo() {
  const [ativo, setAtivo] = useState("calendario");

  return (
    <div className="">
      <Header ativo={ativo} setAtivo={setAtivo} />
      <div className="min-h-screen bg-[#D36183] flex items-center justify-center p-6">
        {ativo === "calendario" && <CalendarioPsicologo />}
        {ativo === "pacientes" && <PacientesPsicologo />}
      </div>
    </div>
  );
}
