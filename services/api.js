import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-miudesa.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  // 🚨 Adicione ou aumente o tempo limite para 30 segundos (30000 ms)
  timeout: 30000, 
});
// ...

// ======================= PSICÓLOGOS =======================
export const getPsicologos = () => apiClient.get("/psicologos/");
export const getPsicologoById = (id) => apiClient.get(`/psicologos/${id}`);
export const createPsicologo = (data) => apiClient.post("/psicologos/", data);
export const updatePsicologo = (id, data) => apiClient.put(`/psicologos/${id}`, data);
export const deletePsicologo = (id) => apiClient.delete(`/psicologos/${id}`);
export const getPacienteByPsicologo = (id) => apiClient.get(`/psicologos/${id}/pacientes`);

// ======================= PACIENTES =======================
export const getPacientes = () => apiClient.get("/pacientes/");
export const getPacienteById = (id) => apiClient.get(`/pacientes/${id}`);
export const createPaciente = (data) => apiClient.post("/pacientes/", data);
export const updatePaciente = (id, data) => apiClient.put(`/pacientes/${id}`, data);
export const deletePaciente = (id) => apiClient.delete(`/pacientes/${id}`);

// ======================= SALAS =======================
export const getSalas = () => apiClient.get("/salas/");
export const getSalaById = (id) => apiClient.get(`/salas/${id}`);
export const createSala = async (nome, descricao) => {
  try {
    const response = await apiClient.post("/salas/", { nome, descricao });
    return response.data.sala;
  } catch (error) {
    const msg = error.response?.data?.erro || error.response?.data?.mensagem || "Erro ao tentar adicionar sala.";
    throw new Error(msg);
  }
};
export const updateSala = (id, data) => apiClient.put(`/salas/${id}`, data);
export const deleteSala = (id) => apiClient.delete(`/salas/${id}`);

// ======================= DISPONIBILIDADES =======================
export const getDisponibilidades = () => apiClient.get("/disponibilidades/");
export const getDisponibilidadeById = (id) => apiClient.get(`/disponibilidades/${id}`);
export const createDisponibilidade = async (id_psicologo, id_sala, data, horario_inicial, horario_final) => {
  try {
    const response = await apiClient.post("/disponibilidades/", { id_psicologo, id_sala, data, horario_inicial, horario_final });
    return response.data.disponibilidade;
  } catch (error) {
    const msg = error.response?.data?.erro || error.response?.data?.mensagem || "Erro ao tentar adicionar disponibilidade.";
    throw new Error(msg);
  }
};
export const updateDisponibilidade = (id, data) => apiClient.put(`/disponibilidades/${id}`, data);
export const deleteDisponibilidade = (id) => apiClient.delete(`/disponibilidades/${id}`);
export const getDisponibilidadeDia = (data) => apiClient.get(`/disponibilidades/dia/${data}`);
export const getDisponibilidadeSemana = (inicio, fim) =>
  apiClient.get(`/disponibilidades/semana/${inicio}/${fim}`);

// ======================= TERAPIAS =======================
export const getTerapias = () => apiClient.get("/terapias/");
export const getTerapiaById = (id) => apiClient.get(`/terapias/${id}`);
export const createTerapia = (data) => apiClient.post("/terapias/", data);
export const updateTerapia = (id, data) => apiClient.put(`/terapias/${id}`, data);
export const deleteTerapia = (id) => apiClient.delete(`/terapias/${id}`);
export const getTerapiaDia = (data, psicologoId) =>
  apiClient.get(`/terapias/dia/${data}/${psicologoId || ""}`);
export const getTerapiaSemana = (inicio, fim, psicologoId) =>
  apiClient.get(`/terapias/semana/${inicio}/${fim}/${psicologoId || ""}`);

// ======================= LAUDOS =======================
export const getLaudos = () => apiClient.get("/laudos/");
export const getLaudoById = (id) => apiClient.get(`/laudos/${id}`);
export const createLaudo = (data) => apiClient.post("/laudos/", data);
export const updateLaudo = (id, data) => apiClient.put(`/laudos/${id}`, data);
export const deleteLaudo = (id) => apiClient.delete(`/laudos/${id}`);

// ======================= LOGIN =======================
export const loginPsicologo = async (login, senha) => {
  try {
    const response = await apiClient.post("/login/psicologo", { login, senha });
    return response.data.psicologo;
  } catch (error) {
    const msg = error.response?.data?.erro || error.response?.data?.mensagem || "Erro ao tentar fazer login.";
    throw new Error(msg);
  }
};

export const loginPaciente = async (email, senha) => {
  try {
    const response = await apiClient.post("/login/paciente", { email, senha });
    return response.data.paciente; // paciente vem dentro do JSON
  } catch (error) {
    // 🔍 Mostra tudo o que vier do backend (Render) no console
    console.log("Erro completo:", error.response?.data || error.message);

    const msg =
      error.response?.data?.erro ||
      error.response?.data?.mensagem ||
      "Erro ao tentar fazer login.";
    throw new Error(msg);
  }
};


export default apiClient;