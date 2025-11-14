// src/components/ListaPsicologos.js
"use client";
import { useState, useEffect, useMemo } from "react";
import { getPsicologos } from "@/services/api";

export default function ListaPsicologos({ onSelect }) {
    const COR_TEXTO = "#002147"; // azul escuro elegante

    const [psicologos, setPsicologos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEspecialidade, setFilterEspecialidade] = useState("");

    // ============================
    // 1️⃣ BUSCA PSICÓLOGOS (CORRIGIDO)
    // ============================
    useEffect(() => {
        const fetchPsicologos = async () => {
            try {
                const res = await getPsicologos();

                // Normaliza qualquer formato retornado pela API
                let lista = res?.data ?? res;

                if (typeof lista === "string") {
                    lista = JSON.parse(lista); // caso backend retorne string
                }

                if (Array.isArray(lista.psicologos)) {
                    lista = lista.psicologos; // caso venha dentro de objeto
                }

                if (!Array.isArray(lista)) {
                    console.warn("⚠ API retornou formato inesperado:", lista);
                    lista = [];
                }

                setPsicologos(lista);
            } catch (err) {
                console.error("Erro ao buscar psicólogos:", err);
                setError("Erro ao carregar profissionais.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPsicologos();
    }, []);

    // ============================
    // 2️⃣ ESPECIALIDADES ÚNICAS
    // ============================
    const especialidades = useMemo(() => {
        const list = new Set(psicologos.map((p) => p.especialidade).filter(Boolean));
        return ["Todas", ...Array.from(list)];
    }, [psicologos]);

    // ============================
    // 3️⃣ FILTROS + BUSCA
    // ============================
    const filteredPsicologos = useMemo(() => {
        return psicologos.filter((p) => {
            const matchesSearch =
                p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.especialidade?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEspecialidade =
                filterEspecialidade === "Todas" ||
                !filterEspecialidade ||
                p.especialidade === filterEspecialidade;

            return matchesSearch && matchesEspecialidade;
        });
    }, [psicologos, searchTerm, filterEspecialidade]);

    // ============================
    // 4️⃣ LOADING
    // ============================
    if (isLoading) {
        return (
            <div className="text-center font-medium" style={{ color: COR_TEXTO }}>
                Carregando profissionais...
            </div>
        );
    }

    // ============================
    // 5️⃣ ERRO
    // ============================
    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    // ============================
    // 6️⃣ RENDERIZAÇÃO FINAL
    // ============================
    return (
        <div className="text-center" style={{ color: COR_TEXTO }}>
            {/* Filtros */}
            <div className="mb-6 flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Buscar por nome ou especialidade..."
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="p-3 rounded-lg border border-gray-300 text-black"
                    value={filterEspecialidade}
                    onChange={(e) => setFilterEspecialidade(e.target.value)}
                >
                    {especialidades.map((spec) => (
                        <option key={spec} value={spec}>
                            {spec}
                        </option>
                    ))}
                </select>
            </div>

            <h2 className="text-2xl font-bold mb-4">Profissionais Disponíveis</h2>

            {/* Se não houver resultados */}
            {filteredPsicologos.length === 0 ? (
                <div className="text-center py-5">
                    Nenhum profissional encontrado.
                </div>
            ) : (
                // Lista
                <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                    {filteredPsicologos.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => typeof onSelect === "function" && onSelect(p)}
                            className="
                                bg-[#002147]/10 p-4 rounded-xl shadow-md 
                                hover:scale-[1.02] hover:shadow-xl 
                                transition-transform duration-300 cursor-pointer text-left
                            "
                        >
                            <h3 className="text-xl font-semibold" style={{ color: COR_TEXTO }}>
                                {p.nome}
                            </h3>
                            <p className="text-sm" style={{ color: COR_TEXTO }}>
                                {p.especialidade}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
