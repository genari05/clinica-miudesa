"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { MdCalendarMonth, MdPeople, MdSettings } from "react-icons/md";
import Configuracao from "./Configuracao";

export default function Header({ ativo, setAtivo }) {
    const [idioma, setIdioma] = useState(() => localStorage.getItem("idioma") || "pt");
    const [mostrarConfig, setMostrarConfig] = useState(false);

    useEffect(() => {
        localStorage.setItem("idioma", idioma);
    }, [idioma]);

    return (
        <>
            <header className="flex items-center justify-between w-full px-6 md:px-12 py-4 bg-[#FDFBD4] dark:bg-[#0a0a0a] text-[#D33865] shadow-sm transition-colors duration-500">

                <a className="group flex items-center gap-3 hover:opacity-85 transition-all" href="#" title="Perfil">
                    <Image
                        className="bg-[#fff9d9] dark:bg-[#121212] p-[0.1rem] rounded-full shadow-inner border border-[#d7cfc0]/40"
                        src={Logo}
                        alt="Foto de perfil do Dr. Tiago"
                        width={42}
                        height={42}
                    />
                    <span className="font-semibold text-base tracking-wide opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        <span className="text-gray-600 dark:text-gray-400">Dr.</span>{" "}
                        <span className="text-[#D33865]">Tiago</span>
                    </span>
                </a>

                <nav className="hidden md:flex items-center gap-8 bg-[#fff9d9] dark:bg-[#121212] px-4 py-2 rounded-full shadow-inner border border-[#d7cfc0]/40">
                    <button
                        onClick={() => setAtivo("calendario")}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300
                        ${ativo === "calendario"
                                ? "bg-[#D33865] text-[#FDFBD4] shadow-md scale-105"
                                : "text-[#b12c54] hover:bg-[#f9d7df] dark:hover:bg-[#2a0f15] hover:text-[#D33865]"
                            }`}
                    >
                        <MdCalendarMonth size={20} />
                        <span>{idioma === "pt" ? "Calendário" : "Calendar"}</span>
                    </button>

                    <div className="w-[1px] h-6 bg-[#D33865]/40"></div>

                    <button
                        onClick={() => setAtivo("pacientes")}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300
                        ${ativo === "pacientes"
                                ? "bg-[#D33865] text-[#FDFBD4] shadow-md scale-105"
                                : "text-[#b12c54] hover:bg-[#f9d7df] dark:hover:bg-[#2a0f15] hover:text-[#D33865]"
                            }`}
                    >
                        <MdPeople size={20} />
                        <span>{idioma === "pt" ? "Pacientes" : "Patients"}</span>
                    </button>
                </nav>

                <button
                    onClick={() => setMostrarConfig(true)}
                    title="Configurações"
                    className="flex items-center bg-[#fff9d9] dark:bg-[#121212] p-2 rounded-full shadow-inner border border-[#d7cfc0]/40"
                >
                    <MdSettings className="hover:rotate-12 transition-transform" size={26} />
                </button>
            </header>

            {mostrarConfig && (
                <Configuracao
                    idioma={idioma}
                    setIdioma={setIdioma}
                    onClose={() => setMostrarConfig(false)}
                />
            )}
        </>
    );
}