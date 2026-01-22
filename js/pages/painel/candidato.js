document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();

  if (!session) return;

  renderWelcome(session.name);
  loadDashboardData(session.id);
});

/* =========================
   SESSÃO
========================= */
function getSession() {
  try {
    return JSON.parse(localStorage.getItem("session"));
  } catch {
    return null;
  }
}

/* =========================
   UI
========================= */
function renderWelcome(name) {
  const title = document.getElementById("welcome-user");
  if (title) {
    title.textContent = `Bem-vindo(a), ${name}`;
  }
}

/* =========================
   DADOS DO PAINEL
========================= */
function loadDashboardData(userId) {
  const candidaturas =
    JSON.parse(localStorage.getItem("candidaturas")) || [];

  const documentos =
    JSON.parse(localStorage.getItem("documentos")) || [];

  const vagasSalvas =
    JSON.parse(localStorage.getItem("vagasSalvas")) || [];

  const minhasCandidaturas = candidaturas.filter(
    (c) => c.userId === userId
  );

  const meusDocumentos = documentos.filter(
    (d) => d.userId === userId
  );

  const minhasSalvas = vagasSalvas.filter(
    (v) => v.userId === userId
  );

  setValue("total-candidaturas", minhasCandidaturas.length);
  setValue("total-documentos", meusDocumentos.length);
  setValue("total-salvas", minhasSalvas.length);
}

/* =========================
   UTIL
========================= */
function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
