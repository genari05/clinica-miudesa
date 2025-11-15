"use client";
import { useState, useEffect } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { getTerapiaDia } from "@/services/api";
import LaudoModal from "./LaudoModal";

export default function CalendarioPsicologo() {
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const hoje = new Date();

  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const [dadosAPI, setDadosAPI] = useState({});
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [terapiaSelecionada, setTerapiaSelecionada] = useState(null);
  const [psicologo, setPsicologo] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Recupera psicólogo do localStorage
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

  // Carrega terapias do mês
  useEffect(() => {
    async function carregarTerapias() {
      if (!psicologo?.id) return;
      setCarregando(true);
      setErro("");

      try {
        const inicioMes = new Date(ano, mes, 1);
        const fimMes = new Date(ano, mes + 1, 0);
        const dados = {};

        for (let dia = 1; dia <= fimMes.getDate(); dia++) {
          const dataStr = new Date(ano, mes, dia).toISOString().split("T")[0];
          try {
            const resp = await getTerapiaDia(dataStr, psicologo.id);
            if (Array.isArray(resp.data) && resp.data.length > 0) {
              dados[dia] = resp.data;
            }
          } catch (e) {
            if (e.response?.status !== 404) {
              console.error("Erro ao buscar terapias:", e);
            }
          }
        }

        setDadosAPI(dados);
      } catch (e) {
        setErro("Erro ao carregar sessões.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    carregarTerapias();
  }, [mes, ano, psicologo]);

  const mudarMes = (incremento) => {
    setMes((m) => {
      let novoMes = m + incremento;
      let novoAno = ano;

      if (novoMes > 11) {
        novoMes = 0;
        novoAno++;
      } else if (novoMes < 0) {
        novoMes = 11;
        novoAno--;
      }

      setAno(novoAno);
      return novoMes;
    });
  };

  const irParaHoje = () => {
    setMes(hoje.getMonth());
    setAno(hoje.getFullYear());
    setDiaSelecionado(null);
    setTerapiaSelecionada(null);
  };

  const dataInicio = new Date(ano, mes, 1);
  const primeiroDiaSemana = dataInicio.getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  const dias = [];
  for (let i = 0; i < primeiroDiaSemana; i++) dias.push(null);
  for (let i = 1; i <= diasNoMes; i++) dias.push(i);

  const nomeMes = dataInicio.toLocaleString("pt-BR", { month: "long" });

  if (carregando)
    return (
      <p className="text-center mt-10 text-[#1493D1] font-semibold">
        Carregando sessões do calendário...
      </p>
    );

  if (erro)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">{erro}</p>
    );

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ">
      <div className="w-full max-w-6xl bg-[#1e3b5a] text-white rounded-3xl shadow-2xl border border-[#0f2a44]/40 flex flex-col overflow-hidden p-6 md:p-8">
        {/* Cabeçalho do calendário */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => mudarMes(-1)}
              className="p-2 rounded-full bg-[#1493D1]/30 hover:bg-[#1493D1]/50 transition-all"
            >
              <MdArrowBackIosNew size={20} />
            </button>
            <button
              onClick={irParaHoje}
              className="px-4 py-2 rounded-full bg-[#1493D1]/30 hover:bg-[#1493D1]/50 transition-all text-sm font-semibold"
            >
              {hoje.toLocaleDateString()}
            </button>
            <button
              onClick={() => mudarMes(1)}
              className="p-2 rounded-full bg-[#1493D1]/30 hover:bg-[#1493D1]/50 transition-all"
            >
              <MdArrowForwardIos size={20} />
            </button>
          </div>

          <h2 className="text-2xl font-bold capitalize">
            {nomeMes} de {ano}
          </h2>
        </div>

        {/* Cabeçalho dias da semana */}
        <div className="grid grid-cols-7 text-center font-semibold mb-2">
          {diasSemana.map((dia) => (
            <div key={dia} className="py-3 uppercase tracking-wide text-sm md:text-base">
              {dia}
            </div>
          ))}
        </div>

        {/* Dias */}
        <div className="grid grid-cols-7 gap-2 text-sm md:text-base">
          {dias.map((dia, idx) => {
            const isHoje =
              dia &&
              dia === hoje.getDate() &&
              mes === hoje.getMonth() &&
              ano === hoje.getFullYear();

            const terapias = dia ? dadosAPI[dia] || [] : [];

            return (
              <div
                key={idx}
                onClick={() => dia && setDiaSelecionado(dia)}
                className={`border border-[#1493D1]/50 flex flex-col p-2 md:p-3 rounded-xl transition-all
                  ${dia ? "hover:bg-[#1493D1]/20 cursor-pointer" : "bg-transparent"}
                  ${isHoje ? "bg-[#1493D1]/40 ring-2 ring-[#1493D1]" : ""}`}
                style={{ aspectRatio: "1 / 1", minHeight: "90px" }}
              >
                <div className="flex justify-end text-xs md:text-sm font-semibold mb-1">
                  {dia ?? ""}
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1493D1]/50 flex-1">
                  {terapias.map((sessao, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTerapiaSelecionada(sessao);
                      }}
                      className="text-[0.7rem] md:text-xs bg-[#1493D1]/25 rounded-lg px-2 py-1 truncate hover:bg-[#1493D1]/40 transition-all"
                    >
                      {sessao.nome_paciente} às{" "}
                      {new Date(sessao.data).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal dia */}
      {diaSelecionado && !terapiaSelecionada && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-[#1e3b5a] text-white p-6 rounded-2xl shadow-2xl w-[90%] md:w-[450px]">
            <h3 className="text-lg font-bold mb-3">
              Compromissos do dia {diaSelecionado} de {nomeMes} de {ano}
            </h3>

            {dadosAPI[diaSelecionado] && dadosAPI[diaSelecionado].length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm">
                {dadosAPI[diaSelecionado].map((sessao, i) => (
                  <li key={i}>
                    {sessao.nome_paciente} às{" "}
                    {new Date(sessao.data).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm opacity-70">Nenhum compromisso neste dia.</p>
            )}

            <button
              onClick={() => setDiaSelecionado(null)}
              className="mt-4 w-full py-2 rounded-full bg-[#1493D1] hover:bg-[#0a0a0a] transition-all font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {terapiaSelecionada && (
        <LaudoModal
          terapia={terapiaSelecionada}
          onClose={() => setTerapiaSelecionada(null)}
        />
      )}
    </main>
  );
}
