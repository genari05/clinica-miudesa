import { useState } from "react";
import { loginPsicologo } from "@/services/api";

export default function LoginPsicologo() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setErro("");
    setCarregando(true);
    try {
      const user = await loginPsicologo(login, senha);
      localStorage.setItem("psicologo", JSON.stringify(user));
      alert(`Bem-vindo(a), Dr(a). ${user.nome}`);
      window.location.href = "/psicologo";
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <input
        className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
        type="text"
        placeholder="CRP ou email"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <button
        onClick={handleLogin}
        disabled={carregando}
        className="w-full font-bold bg-[#D33865] p-5 rounded-full shadow-lg cursor-pointer disabled:opacity-60"
      >
        {carregando ? "Entrando..." : "ENTRAR"}
      </button>
    </div>
  );
}
