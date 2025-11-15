"use client";
import { useState, useEffect } from "react";
import { useIdioma } from "@/context/IdiomaContext";

import Image from "next/image";
import Logo from "@/public/logo.png";
import {
  MdCalendarMonth,
  MdPeople,
  MdSettings,
  MdMeetingRoom,
  MdAccessTime,
  MdMenu,
  MdClose
} from "react-icons/md";

import Perfil from "./Perfil";
import Configuracao from "./Configuracao";

export default function Header({ ativo, setAtivo }) {
  const [psicologo, setPsicologo] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const { idioma, setIdioma } = useIdioma();

  // Recupera dados do psicólogo do localStorage
  useEffect(() => {
    const dados = localStorage.getItem("psicologo");
    if (dados) {
      try {
        setPsicologo(JSON.parse(dados));
      } catch (e) {
        console.error("Erro ao ler dados do psicólogo:", e);
      }
    }
  }, []);

  const labels = {
    calendario: idioma === "pt" ? "Calendário" : "Calendar",
    pacientes: idioma === "pt" ? "Pacientes" : "Patients",
    disponibilidade: idioma === "pt" ? "Disponibilidade" : "Availability",
    salas: idioma === "pt" ? "Salas" : "Rooms",
  };

  const opcoesNav = [
    { id: "calendario", label: labels.calendario, icon: <MdCalendarMonth size={20} /> },
    { id: "pacientes", label: labels.pacientes, icon: <MdPeople size={20} /> },
    { id: "disponibilidade", label: labels.disponibilidade, icon: <MdAccessTime size={20} /> },
    { id: "salas", label: labels.salas, icon: <MdMeetingRoom size={20} /> },
  ];

  return (
    <>
      <header className="flex items-center justify-between w-full px-6 md:px-12 py-4 bg-[#0a0a0a] text-white shadow-sm transition-colors duration-500 relative">

        {/* Perfil */}
        <button
          onClick={() => setMostrarPerfil(true)}
          className="group flex items-center gap-3 hover:opacity-85 transition-all cursor-pointer"
          title={`Dr. ${psicologo?.nome || "psicólogo"}`}
        >
          <Image
            className="bg-[#001f3f] p-[0.1rem] rounded-full shadow-inner border border-[#2a2a2a]/40"
            src={Logo}
            alt={`Foto de perfil de ${psicologo?.nome || "psicólogo"}`}
            width={42}
            height={42}
          />
        </button>

        {/* Navegação - Desktop */}
        <nav className="hidden md:flex items-center gap-8 bg-[#001f3f] px-4 py-2 rounded-full shadow-inner border border-[#2a2a2a]/40">
          {opcoesNav.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setAtivo(id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer
                ${ativo === id
                  ? "bg-[#1493D1] text-white shadow-md scale-105"
                  : "text-[#ccc] hover:bg-[#2a2a2a] hover:text-[#1493D1]"}`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Botão de menu - Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="bg-[#001f3f] p-2 rounded-full shadow-inner border border-[#2a2a2a]/40"
          >
            {menuAberto ? (
              <MdClose size={26} className="text-[#1493D1]" />
            ) : (
              <MdMenu size={26} className="text-[#1493D1]" />
            )}
          </button>

          <button
            onClick={() => setMostrarConfig(true)}
            title="Configurações"
            className="bg-[#001f3f] p-2 rounded-full shadow-inner border border-[#2a2a2a]/40"
          >
            <MdSettings className="hover:rotate-12 transition-transform" size={26} />
          </button>
        </div>

        {/* Config - Desktop */}
        <button
          onClick={() => setMostrarConfig(true)}
          title="Configurações"
          className="hidden md:flex items-center bg-[#001f3f] p-2 rounded-full shadow-inner border border-[#2a2a2a]/40 cursor-pointer"
        >
          <MdSettings className="hover:rotate-12 transition-transform" size={26} />
        </button>

        {/* Menu dropdown - Mobile */}
        {menuAberto && (
          <div className="absolute top-full right-0 mt-2 w-[80%] max-w-[300px] bg-[#001f3f] border border-[#2a2a2a]/40 rounded-2xl shadow-lg p-4 flex flex-col gap-3 z-50 animate-fadeIn">
            {opcoesNav.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => {
                  setAtivo(id);
                  setMenuAberto(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                  ${ativo === id
                    ? "bg-[#1493D1] text-white shadow-md"
                    : "text-[#ccc] hover:bg-[#2a2a2a] hover:text-[#1493D1]"}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {mostrarPerfil && <Perfil onClose={() => setMostrarPerfil(false)} />}
      {mostrarConfig && <Configuracao idioma={idioma} setIdioma={setIdioma} onClose={() => setMostrarConfig(false)} />}
    </>
  );
}
