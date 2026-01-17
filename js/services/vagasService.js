const VAGAS_STORAGE_KEY = "sce_vagas";


function getVagas() {
  const vagas = localStorage.getItem(VAGAS_STORAGE_KEY);
  return vagas ? JSON.parse(vagas) : [];
}

/**
 * Salva a lista completa de vagas no localStorage
 */
function saveVagas(vagas) {
  localStorage.setItem(VAGAS_STORAGE_KEY, JSON.stringify(vagas));
}

/**
 * Gera um ID único simples
 */
function generateId() {
  return Date.now().toString();
}

/**
 * Cria uma nova vaga
 */
function createVaga(vagaData) {
  const vagas = getVagas();

  const novaVaga = {
    id: generateId(),
    titulo: vagaData.titulo,
    descricao: vagaData.descricao,
    requisitos: vagaData.requisitos,
    localizacao: vagaData.localizacao,
    tipo: vagaData.tipo,
    status: "aberta",
    dataCriacao: new Date().toISOString(),
    dataEncerramento: null,
  };

  vagas.push(novaVaga);
  saveVagas(vagas);

  return novaVaga;
}

/**
 * Retorna apenas vagas abertas
 */
function getVagasAbertas() {
  return getVagas().filter((vaga) => vaga.status === "aberta");
}

/**
 * Busca uma vaga pelo ID
 */
function getVagaById(id) {
  return getVagas().find((vaga) => vaga.id === id) || null;
}

/**
 * Atualiza uma vaga existente
 */
function updateVaga(id, updatedData) {
  const vagas = getVagas();
  const index = vagas.findIndex((vaga) => vaga.id === id);

  if (index === -1) return null;

  vagas[index] = {
    ...vagas[index],
    ...updatedData,
  };

  saveVagas(vagas);
  return vagas[index];
}

/**
 * Fecha uma vaga (sem excluir)
 */
function closeVaga(id) {
  const vagas = getVagas();
  const vaga = vagas.find((v) => v.id === id);

  if (!vaga) return false;

  vaga.status = "fechada";
  vaga.dataEncerramento = new Date().toISOString();

  saveVagas(vagas);
  return true;
}

/**
 * Remove uma vaga definitivamente
 */
function deleteVaga(id) {
  const vagas = getVagas();
  const novasVagas = vagas.filter((vaga) => vaga.id !== id);

  if (vagas.length === novasVagas.length) return false;

  saveVagas(novasVagas);
  return true;
}
