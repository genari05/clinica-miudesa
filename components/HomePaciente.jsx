"use client";

export default function HomePaciente({ paciente, onAgendar }) {
  const primeiraSessao = !paciente?.ultimaConsulta;

  return (
    <section
      className="max-w-3xl mx-auto bg-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: "rgba(173, 216, 230, 0.15)" }} // azul-bb translúcido
    >
      <h2 className="text-3xl font-bold mb-4 text-[#063970] drop-shadow-md">
        {paciente?.nome
          ? `Olá, ${paciente.nome.split(" ")[0]}!`
          : "Olá, seja bem-vindo(a)!"}
      </h2>

      {primeiraSessao ? (
        <>
          <p className="mb-10 text-base text-[#063970]/90 leading-relaxed">
            É um prazer ter você conosco na{" "}
            <strong>Clínica Mente Viva</strong>. Aqui, você encontrará
            profissionais dedicados ao seu bem-estar emocional.  
            Comece agora sua jornada para uma mente mais leve 🌿
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onAgendar && onAgendar()}
              className="px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#9ee7d8", // tom azul-esverdeado suave
                color: "#063226",
              }}
            >
              Agendar primeira sessão
            </button>

            <button
              onClick={() => alert("Saber mais sobre a clínica")}
              className="px-6 py-3 rounded-full font-semibold shadow-lg border transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#9ee7d8",
                color: "#063226",
                borderColor: "rgba(234,248,242,0.3)",
              }}
            >
              Sobre a Clínica
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-base text-[#EAF8F2]/90 leading-relaxed">
            Sua próxima sessão está marcada para:{" "}
            <strong>{paciente.proximaConsulta || "—"}</strong>
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => alert("Ir para minhas consultas")}
              className="px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#9ee7d8",
                color: "#063226",
              }}
            >
              Ver minhas consultas
            </button>

            <button
              onClick={() => alert("Reagendar / cancelar")}
              className="px-6 py-3 rounded-full font-semibold shadow-lg border transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "transparent",
                color: "#063970",
                borderColor: "rgba(234,248,242,0.3)",
              }}
            >
              Reagendar
            </button>
          </div>
        </>
      )}
    </section>
  );
}
