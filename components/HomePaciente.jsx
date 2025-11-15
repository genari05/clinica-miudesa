"use client";
import Image from "next/image";

export default function HomePaciente({ paciente, onAgendar }) {
  const primeiraSessao = !paciente?.ultimaConsulta;

  return (
    <section
      className="max-w-3xl mx-auto rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.25)]"
      style={{
        backgroundColor: "#001f3f", // 🔵 NAVY
      }}
    >
      {/* 🔹 Retângulo com logo + mensagem */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 p-4 sm:p-6 rounded-xl shadow-lg bg-[#001f3f]">
        {/* Logo do paciente */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 bg-white p-[2px]">
          <Image
            src="/logopaciente.jpg"
            alt="Logo paciente"
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Mensagem */}
        <div className="flex-1 text-center sm:text-left">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: "#F5F5DC" }}
          >
            {paciente?.nome
              ? `Olá, ${paciente.nome.split(" ")[0]}!`
              : "Olá, seja bem-vindo(a)!"}
          </h2>

          {primeiraSessao ? (
            <p
              className="text-base leading-relaxed"
              style={{ color: "#F5F5DC" }}
            >
              É um prazer ter você conosco na{" "}
              <strong>Clínica Miudesa</strong>. Aqui, você encontrará
              profissionais dedicados ao seu bem-estar emocional. Comece agora
              sua jornada para uma mente mais leve 🌿
            </p>
          ) : (
            <p
              className="text-base leading-relaxed"
              style={{ color: "#F5F5DC" }}
            >
              Sua próxima sessão está marcada para:{" "}
              <strong>{paciente.proximaConsulta || "—"}</strong>
            </p>
          )}
        </div>
      </div>

      {/* 🔹 Botões */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-3">
        {primeiraSessao ? (
          <button
            onClick={() => onAgendar && onAgendar()}
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
            Agendar primeira sessão
          </button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
