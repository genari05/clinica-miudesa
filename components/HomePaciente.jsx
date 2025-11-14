"use client";

export default function HomePaciente({ paciente, onAgendar }) {
  const primeiraSessao = !paciente?.ultimaConsulta;

  return (
    <section
      className="max-w-3xl mx-auto rounded-2xl p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.25)]"
      style={{
        backgroundColor: "#001f3f", // 🔵 NAVY
      }}
    >
      <h2
        className="text-3xl font-bold mb-6 drop-shadow-md text-center"
        style={{ color: "#F5F5DC" }} // BEIGE
      >
        {paciente?.nome
          ? `Olá, ${paciente.nome.split(" ")[0]}!`
          : "Olá, seja bem-vindo(a)!"}
      </h2>

      {primeiraSessao ? (
        <>
          <p
            className="mb-10 text-base leading-relaxed text-center"
            style={{ color: "#F5F5DC" }} // BEIGE
          >
            É um prazer ter você conosco na{" "}
            <strong style={{ color: "#F5F5DC" }}>Clínica Mente Viva</strong>.  
            Aqui, você encontrará profissionais dedicados ao seu bem-estar emocional.  
            Comece agora sua jornada para uma mente mais leve 🌿
          </p>

          {/* 🔵 BOTÃO CENTRALIZADO + ESTILO DO HEADER */}
          <div className="flex justify-center">
            <button
              onClick={() => onAgendar && onAgendar()}
              className="px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#567C8D",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#567C8D"; // teal
                e.currentTarget.style.color = "#F5F5DC"; // beige
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.color = "#567C8D";
              }}
            >
              Agendar primeira sessão
            </button>
          </div>
        </>
      ) : (
        <>
          <p
            className="mb-6 text-base leading-relaxed text-center"
            style={{ color: "#F5F5DC" }}
          >
            Sua próxima sessão está marcada para:{" "}
            <strong style={{ color: "#F5F5DC" }}>
              {paciente.proximaConsulta || "—"}
            </strong>
          </p>

          <div className="flex justify-center gap-3">
            {/* Botão estilo header */}
            <button
              onClick={() => alert("Ir para minhas consultas")}
              className="px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#567C8D",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#567C8D";
                e.currentTarget.style.color = "#F5F5DC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.color = "#567C8D";
              }}
            >
              Ver minhas consultas
            </button>

            <button
              onClick={() => alert("Reagendar / cancelar")}
              className="px-6 py-3 rounded-full font-semibold shadow-lg border transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: "#F5F5DC",
                borderColor: "rgba(255,255,255,0.4)",
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
