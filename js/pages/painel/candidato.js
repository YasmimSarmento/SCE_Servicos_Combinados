(() => {
  /* =========================
     SESSÃO / PROTEÇÃO
  ========================= */
  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("session"));
    } catch {
      return null;
    }
  }

  const session = getSession();

  // Dashboard é principal -> exige login
  if (!session) {
    window.location.href = "login-candidato.html";
    return;
  }

  // Se não for candidato, tira daqui
  if (session.role && session.role !== "candidato") {
    window.location.href = "index.html";
    return;
  }

  /* =========================
     HELPERS
  ========================= */
  const getList = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatarData(valor) {
    if (!valor) return "-";
    const d = new Date(valor);
    if (!isNaN(d.getTime())) return d.toLocaleString("pt-BR");
    return String(valor);
  }

  /* =========================
     ANIMAÇÕES DE NÚMEROS
  ========================= */
  function animateNumber(el, to, duration = 700) {
    if (!el) return;

    const from = parseInt(el.textContent.replace(/\D/g, "") || "0", 10);
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const value = Math.round(from + (to - from) * eased);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function animatePercent(el, toPercent, duration = 700) {
    if (!el) return;

    const from = parseInt((el.textContent || "0").replace("%", ""), 10) || 0;
    const to = Math.max(0, Math.min(100, toPercent));
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      el.textContent = value + "%";
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* =========================
     THEME TOGGLE (DARK MODE)
  ========================= */
  function setupThemeToggle() {
    const btn = document.getElementById("btnTema");
    if (!btn) return;

    // Prefer the global theme controller (html.theme-dark + appTheme_v1),
    // but keep legacy support for older CSS that might rely on .dash-body.dark.
    const body = document.querySelector(".dash-body");

    // Ensure the initial visual state follows the global theme (if present)
    try {
      const isDark = document.documentElement.classList.contains("theme-dark");
      if (body) body.classList.toggle("dark", isDark);
    } catch (e) {}

    btn.addEventListener("click", () => {
      // 1) Use global API when available
      if (window.__theme && typeof window.__theme.toggle === "function") {
        window.__theme.toggle();
      } else {
        // 2) Fallback: toggle html class + persist
        const html = document.documentElement;
        html.classList.toggle("theme-dark");
        try {
          localStorage.setItem("appTheme_v1", html.classList.contains("theme-dark") ? "dark" : "light");
        } catch (e) {}
      }

      // Mirror to legacy dashboard class + key (safe, lightweight)
      const isDarkNow = document.documentElement.classList.contains("theme-dark");
      if (body) body.classList.toggle("dark", isDarkNow);
      try { localStorage.setItem("dashboardTheme", isDarkNow ? "dark" : "light"); } catch (e) {}
    });
  }


  /* =========================
     DADOS REAIS
  ========================= */
  function filtrarMinhasCandidaturas(candidaturas, session) {
    return (candidaturas || []).filter((c) => {
      // padrão novo
      if (c && c.userId != null) return c.userId === session.id;

      // compatibilidade antiga
      const emailC = c?.emailSessao || c?.candidato?.email || null;
      return !!emailC && !!session.email && emailC === session.email;
    });
  }

  function buscarMeuCurriculo(session) {
    const banco = getList("bancoTalentos");

    if (session.email) {
      const match = banco.find(
        (c) => (c?.email || "").toLowerCase() === session.email.toLowerCase()
      );
      if (match) return match;
    }

    return banco.length ? banco[banco.length - 1] : null;
  }

  /* =========================
     PONTUAÇÃO (COMPLETUDE)
  ========================= */
  function calcularPontuacao(curriculo, minhasCandidaturas) {
    let pontos = 0;

    if (curriculo?.nome && curriculo?.email && curriculo?.telefone) pontos += 25;
    if (curriculo?.cidade && curriculo?.estado) pontos += 15;
    if (curriculo?.area && curriculo?.experiencia && curriculo?.disponibilidade) pontos += 20;
    if (curriculo?.especialidades || curriculo?.conhecimentos) pontos += 15;
    if (Array.isArray(curriculo?.arquivos) && curriculo.arquivos.length) pontos += 15;
    if (minhasCandidaturas.length) pontos += 10;

    if (pontos > 100) pontos = 100;

    return pontos + "%";
  }

  /* =========================
     NOTIFICAÇÕES (INTELIGENTES)
  ========================= */
  function gerarNotificacoes(session, curriculo, minhasCandidaturas, vagasSalvas) {
    const notas = [];

    if (!curriculo) {
      notas.push({ texto: "Você ainda não cadastrou seu currículo.", data: new Date().toISOString() });
      return notas;
    }

    const semArquivo = !Array.isArray(curriculo.arquivos) || curriculo.arquivos.length === 0;
    if (semArquivo) {
      notas.push({ texto: "Envie um currículo (PDF/DOC/DOCX) para fortalecer seu perfil.", data: new Date().toISOString() });
    }

    if (!curriculo.linkedin) {
      notas.push({ texto: "Adicione seu LinkedIn para aumentar suas chances.", data: new Date().toISOString() });
    }

    if (!minhasCandidaturas.length) {
      notas.push({ texto: "Você ainda não se candidatou a nenhuma vaga. Que tal começar pela aba Vagas?", data: new Date().toISOString() });
    }

    if (vagasSalvas.length && !minhasCandidaturas.length) {
      notas.push({ texto: `Você tem ${vagasSalvas.length} vaga(s) salva(s). Quer se candidatar em alguma?`, data: new Date().toISOString() });
    }

    const emAnalise = minhasCandidaturas.filter((c) => (c.status || "").toLowerCase().includes("análise")).length;
    if (emAnalise) {
      notas.push({ texto: `Você tem ${emAnalise} candidatura(s) em análise. Fique de olho!`, data: new Date().toISOString() });
    }

    return notas;
  }

function renderNotificacoes(notificacoes) {
  const ul = document.getElementById("listaNotificacoes");
  if (!ul) return;

  ul.innerHTML = "";

  if (!notificacoes.length) {
    ul.innerHTML = `
      <li class="notify-item">
        <div class="txt">
          <strong>Tudo certo!</strong>
          <span>Seu perfil está em dia no momento.</span>
        </div>
        <span class="tag">OK</span>
      </li>
    `;
    return;
  }

  // mostra até 5 sugestões
  notificacoes.slice(0, 5).forEach((n) => {
    const li = document.createElement("li");
    li.className = "notify-item";
    li.innerHTML = `
      <div class="txt">
        <strong>${escapeHtml(n.texto)}</strong>
      </div>
      <span class="tag">Sugestão</span>
    `;
    ul.appendChild(li);
  });
}


  /* =========================
     UI - STATUS LIST
  ========================= */
  function badgeClass(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("aprov")) return "badge-success";
    if (s.includes("reprov") || s.includes("recus")) return "badge-danger";
    if (s.includes("cancel")) return "badge-neutral";
    return "badge-warning";
  }

  function listarStatus(minhasCandidaturas) {
    const lista = document.getElementById("listaStatus");
    if (!lista) return;

    lista.innerHTML = "";

    if (!minhasCandidaturas.length) {
      lista.innerHTML = `<li class="status-item">Nenhuma candidatura registrada.</li>`;
      return;
    }

    const recentes = [...minhasCandidaturas]
      .sort((a, b) => new Date(b.createdAt || b.data || 0) - new Date(a.createdAt || a.data || 0))
      .slice(0, 6);

    recentes.forEach((c) => {
      const titulo = c?.vaga?.titulo || c?.vaga?.nome || "Vaga";
      const data = formatarData(c.createdAt || c.data);
      const status = c?.status || "Em análise";

      const li = document.createElement("li");
      li.className = "status-item";
      li.innerHTML = `
        <div class="status-info">
          <strong>${escapeHtml(titulo)}</strong>
          <span>${escapeHtml(data)}</span>
        </div>
        <span class="badge ${badgeClass(status)}">${escapeHtml(status)}</span>
      `;
      lista.appendChild(li);
    });
  }

  function preencherResumoStatus(minhasCandidaturas) {
    const emAnalise = minhasCandidaturas.filter(c => (c.status || "").toLowerCase().includes("análise")).length;
    const aprovadas = minhasCandidaturas.filter(c => (c.status || "").toLowerCase().includes("aprov")).length;
    const recusadas = minhasCandidaturas.filter(c => {
      const s = (c.status || "").toLowerCase();
      return s.includes("recus") || s.includes("reprov");
    }).length;

    setText("countEmAnalise", String(emAnalise));
    setText("countAprovadas", String(aprovadas));
    setText("countRecusadas", String(recusadas));
  }

  /* =========================
     LOGOUT
  ========================= */
  function setupLogout() {
    const btn = document.getElementById("btnLogout");
    if (!btn) return;

    btn.addEventListener("click", () => {
      localStorage.removeItem("session");
      localStorage.removeItem("auth");
      window.location.href = "index.html";
    });
  }

  /* =========================
     BARRA DE PONTUAÇÃO
  ========================= */
  function atualizarBarraPontuacao(pontuacaoTxt) {
    const bar = document.getElementById("pontuacaoBar");
    if (!bar) return;

    const n = parseInt(String(pontuacaoTxt).replace("%", ""), 10);
    const pct = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
    bar.style.width = pct + "%";
  }

  /* =========================
     DASHBOARD
  ========================= */
  function carregarDashboard() {
    setupLogout();
    setupThemeToggle();

    // Nome no header
    const nomePrimeiro = (session.name || "Candidato").split(" ")[0];
    setText("userNome", nomePrimeiro);

    // Dados reais
    const candidaturas = getList("candidaturas");
    const vagasSalvas = getList("vagasSalvas");
    const minhasCandidaturas = filtrarMinhasCandidaturas(candidaturas, session);
    const curriculo = buscarMeuCurriculo(session);

    // KPIs com animação
    animateNumber(document.getElementById("countVagas"), minhasCandidaturas.length);

    const pontTxt = calcularPontuacao(curriculo, minhasCandidaturas);
    const pontN = parseInt(String(pontTxt).replace("%", ""), 10) || 0;
    animatePercent(document.getElementById("pontuacao"), pontN);
    atualizarBarraPontuacao(pontN + "%");

    const notificacoes = gerarNotificacoes(session, curriculo, minhasCandidaturas, vagasSalvas);
    animateNumber(document.getElementById("qtdNotificacoes"), notificacoes.length);

    // UI
    renderNotificacoes(notificacoes);
    preencherResumoStatus(minhasCandidaturas);
    listarStatus(minhasCandidaturas);
  }

  carregarDashboard();
})();