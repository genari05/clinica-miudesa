// src/components/ListaPsicologos.js
"use client";
import { useState, useEffect, useMemo } from "react";
import { getPsicologos } from "@/services/api"; 

export default function ListaPsicologos({ onSelect }) { 
    const COR_TEXTO = "#002147"; 
    
    const [psicologos, setPsicologos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEspecialidade, setFilterEspecialidade] = useState("");

    // Busca de dados
    useEffect(() => {
        const fetchPsicologos = async () => {
            try {
                const res = await getPsicologos(); 
                setPsicologos(res.data ?? []);
            } catch (err) {
                console.error("Erro ao buscar psicólogos:", err);
                setError(err.message || "Erro ao carregar a lista de profissionais.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPsicologos();
    }, []); 

    // Lista de especialidades únicas para o filtro
    const especialidades = useMemo(() => {
        const specs = new Set(psicologos.map(p => p.especialidade).filter(Boolean));
        return ["Todas", ...Array.from(specs)];
    }, [psicologos]);

    // Lógica de Filtragem e Busca
    const filteredPsicologos = useMemo(() => {
        return psicologos.filter(p => {
            const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  p.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesEspecialidade = filterEspecialidade === "Todas" || 
                                         !filterEspecialidade || 
                                         p.especialidade === filterEspecialidade;

            return matchesSearch && matchesEspecialidade;
        });
    }, [psicologos, searchTerm, filterEspecialidade]);


    // --- Renderização Condicional ---
    if (isLoading) {
        return <div className="text-center font-medium" style={{ color: COR_TEXTO }}>Carregando profissionais...</div>;
    }
    if (error) {
        return <div className="text-center text-red-600">Erro: {error}. Não foi possível carregar a lista.</div>;
    }

    // --- Renderização Principal ---
    return (
        <div className="text-center" style={{ color: COR_TEXTO }}>
            
            {/* Bloco de Filtros */}
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
                    {especialidades.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>

            <h2 className="text-2xl font-bold mb-4">Profissionais Disponíveis</h2>
            
            {filteredPsicologos.length === 0 ? (
                <div className="text-center py-5">Nenhum profissional encontrado com os filtros aplicados.</div>
            ) : (
                <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                    {filteredPsicologos.map((p, i) => (
                        <div
                            key={i}
                            // CORREÇÃO ROBUSTA APLICADA AQUI
                            onClick={() => {
                                if (typeof onSelect === 'function') {
                                    onSelect(p);
                                }
                            }} 
                            className="
                                bg-[#002147]/10 p-4 rounded-xl shadow-md 
                                hover:scale-[1.02] hover:shadow-xl 
                                transition-transform duration-300 cursor-pointer text-left
                            "
                        >
                            <h3 className="text-xl font-semibold" style={{ color: COR_TEXTO }}>{p.nome}</h3>
                            <p className="text-sm" style={{ color: COR_TEXTO }}>{p.especialidade}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}