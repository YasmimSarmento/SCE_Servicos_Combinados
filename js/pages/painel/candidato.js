document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();

  // Painel do candidato é página principal -> exige login
  if (!session) {
    window.location.href = "login-candidato.html";
    return;
  }

  // Se por algum motivo entrou com outro perfil
  if (session.role && session.role !== "candidato") {
    window.location.href = "index.html";
    return;
  }

  renderWelcome(session.name);
  loadDashboardData(session);
  renderCandidaturasList(session);
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
    title.textContent = `Bem-vindo(a), ${name || "Candidato(a)"}`;
  }
}

/* =========================
   DADOS DO PAINEL (CONTADORES)
========================= */
function loadDashboardData(session) {
  const candidaturas = JSON.parse(localStorage.getItem("candidaturas")) || [];
  const vagasSalvas = JSON.parse(localStorage.getItem("vagasSalvas")) || [];

  const minhasCandidaturas = filtrarMinhasCandidaturas(candidaturas, session);

  // 🔧 Documentos: normaliza (id/userId) e filtra pro usuário
  const meusDocumentos = normalizeDocumentos(session);

  const minhasSalvas = (vagasSalvas || []).filter((v) => v.userId === session.id);

  setValue("total-candidaturas", minhasCandidaturas.length);
  setValue("total-documentos", meusDocumentos.length);
  setValue("total-salvas", minhasSalvas.length);
}

/* =========================
   DOCUMENTOS (NORMALIZA + COMPATIBILIDADE)
========================= */
function normalizeDocumentos(session) {
  let documentos = JSON.parse(localStorage.getItem("documentos")) || [];
  let changed = false;

  // Garante array
  if (!Array.isArray(documentos)) documentos = [];

  documentos = documentos.map((d) => {
    if (!d || typeof d !== "object") return d;

    const novo = { ...d };

    // Garante id
    if (!novo.id) {
      novo.id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
      changed = true;
    }

    // Compatibilidade: se veio sem userId, atribui ao usuário atual
    // (isso casa com o comportamento do documentos.js)
    if (novo.userId == null && session?.id != null) {
      novo.userId = session.id;
      changed = true;
    }

    return novo;
  });

  if (changed) {
    localStorage.setItem("documentos", JSON.stringify(documentos));
  }

  // Retorna só os documentos do usuário logado
  return (documentos || []).filter((d) => d && d.userId === session.id);
}

/* =========================
   LISTA DE CANDIDATURAS (DETALHADA)
========================= */
function renderCandidaturasList(session) {
  // Você precisa ter esse container no HTML:
  // <div id="lista-candidaturas"></div>
  const container = document.getElementById("lista-candidaturas");
  if (!container) return;

  const candidaturas = JSON.parse(localStorage.getItem("candidaturas")) || [];
  const minhas = filtrarMinhasCandidaturas(candidaturas, session);

  if (minhas.length === 0) {
    container.innerHTML = `
      <p class="muted">
        Você ainda não se candidatou a nenhuma vaga.
      </p>
    `;
    return;
  }

  // Ordena por data mais recente (preferindo createdAt)
  minhas.sort((a, b) => {
    const da = new Date(a.createdAt || a.data || 0).getTime();
    const db = new Date(b.createdAt || b.data || 0).getTime();
    return db - da;
  });

  container.innerHTML = minhas.map((c) => cardCandidatura(c)).join("");
}

function cardCandidatura(c) {
  const titulo = c?.vaga?.titulo || c?.vaga?.nome || "Vaga";
  const tipo = c?.vaga?.tipo || "-";
  const local = c?.vaga?.local || "-";
  const salario = c?.vaga?.salario || "A combinar";
  const status = c?.status || "Em análise";

  const dataTxt = formatarData(c.createdAt || c.data);

  return `
    <div class="card-candidatura">
      <div class="card-candidatura-top">
        <strong class="card-candidatura-titulo">${escapeHtml(titulo)}</strong>
        <span class="card-candidatura-status">${escapeHtml(status)}</span>
      </div>

      <div class="card-candidatura-meta">
        <span><b>Tipo:</b> ${escapeHtml(tipo)}</span>
        <span><b>Local:</b> ${escapeHtml(local)}</span>
        <span><b>Salário:</b> ${escapeHtml(salario)}</span>
      </div>

      <div class="card-candidatura-footer">
        <span><b>Data:</b> ${escapeHtml(dataTxt)}</span>
      </div>
    </div>
  `;
}

/* =========================
   FILTRO (COMPATIBILIDADE)
========================= */
function filtrarMinhasCandidaturas(candidaturas, session) {
  return (candidaturas || []).filter((c) => {
    // Novo padrão: userId
    if (c && c.userId != null) return c.userId === session.id;

    // Compatibilidade com candidaturas antigas (sem userId)
    // Tenta emailSessao, depois candidato.email
    const emailC = c?.emailSessao || c?.candidato?.email || null;
    return !!emailC && !!session.email && emailC === session.email;
  });
}

/* =========================
   UTIL
========================= */
function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatarData(valor) {
  if (!valor) return "-";

  // ISO -> pt-BR bonitinho
  const d = new Date(valor);
  if (!isNaN(d.getTime())) {
    return d.toLocaleString("pt-BR");
  }

  // Se vier como string já formatada, só devolve
  return String(valor);
}

// Evita quebrar HTML se vier caracteres especiais
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
