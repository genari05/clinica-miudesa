"use client";
import { useState } from "react";
import { MdKeyboardArrowLeft, MdFingerprint } from "react-icons/md";
import LoginPsicologo from "./LoginPsicologo";
import LoginPaciente from "./LoginPaciente";

export default function TelaInicial() {
    const [loginSelecionado, setLoginSelecionado] = useState(null);
    const [hover, setHover] = useState(false);

    return (
        <div className="min-h-screen flex items-stretch justify-evenly bg-[#FDFBD4] dark:bg-black relative">
            <div className="hidden md:flex flex-[1.3] min-h-full bg-[url('/logo.png')] bg-cover bg-center bg-no-repeat relative">
                <div className="absolute top-0 right-0 h-full w-[4px] bg-gradient-to-b from-[#D33865] via-[#38d3a6] to-[#D33865] animate-borderMove" />
            </div>

            {loginSelecionado && (
                <button
                    onClick={() => setLoginSelecionado(null)}
                    className={`group absolute right-0 top-1/5 transform -translate-y-1/2 px-1 py-2 rounded-l-full cursor-pointer font-semibold hover:opacity-90 transition flex items-center justify-center ${loginSelecionado === "psicologo"
                        ? "bg-[#D33865] text-black"
                        : loginSelecionado === "paciente"
                            ? "bg-[#38d3a6] text-black"
                            : ""
                        }`}
                >
                    <MdKeyboardArrowLeft size={24} />
                    <span className="p-0 m-0 flex text-[0px] overflow-hidden transition-all duration-300 group-hover:text-xs">
                        VOLTAR
                    </span>
                </button>
            )}

            <div className="min-h-screen flex flex-col justify-between items-center p-8 w-full md:flex-[0.7]">
                <div className="flex items-center w-full gap-4 mb-8">
                    <h1
                        className={`flex-1 text-center text-4xl md:text-5xl leading-tight font-bold
                            ${loginSelecionado === "psicologo"
                                ? "text-[#D33865]"
                                : loginSelecionado === "paciente"
                                    ? "text-[#38d3a6]"
                                    : "text-black dark:text-[#FDFBD4]"
                            }`}
                    >
                        CLÍNICA <br /> LABIRINTO DA <br /> MENTE
                    </h1>
                </div>

                {loginSelecionado === "psicologo" ? (
                    <LoginPsicologo />
                ) : loginSelecionado === "paciente" ? (
                    <LoginPaciente />
                ) : (
                    <div
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        className={`relative flex items-center justify-center transition-all duration-500 rounded-full shadow-xl cursor-pointer overflow-hidden
                            ${hover ? "w-80 h-80" : "w-28 h-28"}
                            ${hover ? "bg-stone-900 dark:bg-[#FDFBD4]" : "bg-black dark:bg-[#eae9c3]"}
                        `}
                    >
                        {!hover && (
                            <span className="text-xl font-bold text-[#FDFBD4] dark:text-black transition-all duration-300">
                                <MdFingerprint size={100} />
                            </span>
                        )}

                        {hover && (
                            <div className="flex w-full h-full">
                                <button
                                    onClick={() => setLoginSelecionado("psicologo")}
                                    className="w-1/2 h-full text-[#D33865] text-xl font-bold flex items-center justify-center hover:scale-110 transition-transform duration-300 rounded-l-full cursor-pointer"
                                >
                                    PSICÓLOGO
                                </button>
                                <button
                                    onClick={() => setLoginSelecionado("paciente")}
                                    className="w-1/2 h-full text-[#38d3a6] text-xl font-bold flex items-center justify-center hover:scale-110 transition-transform duration-300 rounded-r-full cursor-pointer"
                                >
                                    PACIENTE
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}