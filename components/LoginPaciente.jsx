"use client";
import { useState } from "react";
import CadastroPaciente from "./CadastroPaciente";

export default function LoginPaciente() {
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    const handleCadastroClick = () => {
        setMostrarCadastro(true);
    };

    if (mostrarCadastro) {
        return <CadastroPaciente />;
    }

    return (
        <div className="flex flex-col gap-10 w-full items-center">
            <input
                className="w-full bg-[#E3FCFF] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
                type="email"
                placeholder="Email"
            />
            <input
                className="w-full bg-[#E3FCFF] p-5 rounded-xl shadow-lg text-black"
                type="password"
                placeholder="Senha"
            />
            <a className="text-[#38d3a6] self-start" href="#">
                Esqueceu a senha?
            </a>
            <button className="w-full text-black font-bold bg-[#38d3a6] p-5 rounded-full shadow-lg cursor-pointer">
                ENTRAR
            </button>
            <button
                onClick={handleCadastroClick}
                className="w-full text-black font-bold bg-[#38d3a6] p-5 rounded-full shadow-lg cursor-pointer hover:opacity-90 transition"
            >
                CRIE UMA CONTA
            </button>
        </div>
    );
}