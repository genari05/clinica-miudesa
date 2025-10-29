"use client";
import { useState } from "react";
import LoginPaciente from "./LoginPaciente";

export default function CadastroPaciente() {
    const [mostrarLogin, setMostrarLogin] = useState(false);

    const handleVoltarLogin = () => {
        setMostrarLogin(true);
    };

    if (mostrarLogin) {
        return <LoginPaciente />;
    }

    return (
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-10 w-full items-center">
            <input
                className="w-full bg-[#E3FCFF] p-3 rounded-xl shadow-lg text-black placeholder:text-left"
                type="text"
                placeholder="Nome"
            />
            <input
                className="w-full bg-[#E3FCFF] p-3 rounded-xl shadow-lg text-black placeholder:text-left"
                type="email"
                placeholder="Email"
            />
            <input
                className="w-full bg-[#E3FCFF] p-3 rounded-xl shadow-lg text-black"
                type="password"
                placeholder="Senha"
            />
            <select
                className="w-full bg-[#E3FCFF] p-3 rounded-xl shadow-lg text-black"
                name="genero"
                id="genero"
                required
            >
                <option value="">--Selecione seu gênero--</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
            </select>

            <button className="w-full text-black font-bold bg-[#38d3a6] p-5 rounded-full shadow-lg cursor-pointer hover:opacity-90 transition">
                CADASTRE-SE
            </button>
            <p className="text-sm">
                Já tem uma conta?{" "}
                <button
                    onClick={handleVoltarLogin}
                    className="text-[#38d3a6] font-semibold hover:underline transition"
                >
                    Faça Login
                </button>
            </p>
        </div>
    );
}
