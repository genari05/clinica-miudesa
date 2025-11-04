"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function Perfil({ onClose }) {
  const [psicologo, setPsicologo] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("psicologo");
    if (dados) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPsicologo(JSON.parse(dados));
      } catch (e) {
        console.error("Erro ao ler dados do psicólogo:", e);
      }
    }
  }, []);

  if (!psicologo) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-[#FDFBD4] dark:bg-[#121212] p-6 rounded-2xl shadow-xl text-center">
          <p className="text-[#D33865]">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-[#FDFBD4] dark:bg-[#121212] text-[#D33865] p-6 rounded-2xl shadow-xl w-[90%] md:w-[400px]">
        <div className="flex flex-col items-center text-center mb-6">
          <Image
            src={Logo}
            alt={`Foto de perfil de ${psicologo.nome}`}
            width={80}
            height={80}
            className="rounded-full border-4 border-[#D33865]/50 shadow-inner"
          />
          <h4 className="mt-3 text-xl font-semibold text-[#D33865] dark:text-[#FDFBD4]">
            {psicologo.nome}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {psicologo.especializacao || "Psicólogo(a)"}
          </p>
        </div>

        <div className="text-sm space-y-2">
          <p>
            <span className="font-semibold text-[#b12c54] dark:text-[#f9c9d9]">
              E-mail:
            </span>{" "}
            {psicologo.email}
          </p>
          <p>
            <span className="font-semibold text-[#b12c54] dark:text-[#f9c9d9]">
              Telefone:
            </span>{" "}
            {psicologo.telefone}
          </p>
          <p>
            <span className="font-semibold text-[#b12c54] dark:text-[#f9c9d9]">
              CRP:
            </span>{" "}
            {psicologo.crp}
          </p>
          <p>
            <span className="font-semibold text-[#b12c54] dark:text-[#f9c9d9]">
              Idade:
            </span>{" "}
            {psicologo.idade} anos
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-2">
          <button className="mt-6 w-1/2 py-2 rounded-full bg-[#D33865] text-[#FDFBD4] hover:opacity-90 transition-all cursor-pointer"
            onClick={onClose}
          >
            Fechar
          </button>
          <button className="mt-6 w-1/2 py-2 rounded-full bg-[#D33865] text-[#FDFBD4] hover:opacity-90 transition-all cursor-pointer"
            onClick={onClose}
          >
            Gerenciar
          </button>
        </div>
      </div>
    </div>
  );
}
