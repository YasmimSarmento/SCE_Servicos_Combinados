document.addEventListener("DOMContentLoaded", () => {
  const vaga = JSON.parse(localStorage.getItem("vagaSelecionada") || "null");

  // 🔒 Se não houver vaga selecionada, volta
  if (!vaga) {
    window.location.href = "vagas.html";
    return;
  }

  // ===============================
  // Preenchimento dos dados
  // ===============================
  const elTitulo = document.getElementById("vagaTitulo");
  const elEmpresa = document.getElementById("vagaEmpresa");
  const elTipo = document.getElementById("vagaTipo");
  const elLocal = document.getElementById("vagaLocal");
  const elArea = document.getElementById("vagaArea");
  const elDescricao = document.getElementById("vagaDescricao");
  const listaRequisitos = document.getElementById("vagaRequisitos");   // ✅ ID correto
  const listaBeneficios = document.getElementById("vagaBeneficios");   // ✅ ID correto
  const elSalario = document.getElementById("vagaSalario");
  const hintEl = document.getElementById("vagaHint"); // opcional (no HTML melhorado)

  if (elTitulo) elTitulo.textContent = vaga.titulo || "Vaga";
if (elEmpresa) {
  elEmpresa.textContent = vaga.empresa || "";
}
  if (elTipo) elTipo.textContent = vaga.tipo || "-";
  if (elLocal) elLocal.textContent = vaga.local || "-";
  if (elArea) elArea.textContent = vaga.area || "-";
  if (elDescricao) elDescricao.textContent = vaga.descricao || "Sem descrição.";
  if (elSalario) elSalario.textContent = vaga.salario || "A combinar";

  if (listaRequisitos) {
    if (Array.isArray(vaga.requisitos) && vaga.requisitos.length) {
      listaRequisitos.innerHTML = vaga.requisitos.map(r => `<li>${r}</li>`).join("");
    } else {
      listaRequisitos.innerHTML = "<li>Não informado</li>";
    }
  }

  if (listaBeneficios) {
    if (Array.isArray(vaga.beneficios) && vaga.beneficios.length) {
      listaBeneficios.innerHTML = vaga.beneficios.map(b => `<li>${b}</li>`).join("");
    } else {
      listaBeneficios.innerHTML = "<li>Não informado</li>";
    }
  }

  // ===============================
  // Sessão / role (padrão)
  // ===============================
  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("session") || "null");
    } catch {
      return null;
    }
  }

  function getRole() {
    const session = getSession();
    if (session?.role) return session.role;
    return localStorage.getItem("auth"); // fallback
  }

  // ===============================
  // Botão "Copiar link" (opcional)
  // ===============================
  const btnCopiarLink = document.getElementById("btnCopiarLink");
  if (btnCopiarLink) {
    btnCopiarLink.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (hintEl) hintEl.textContent = "✅ Link copiado!";
        setTimeout(() => { if (hintEl) hintEl.textContent = ""; }, 1800);
      } catch {
        // fallback simples
        if (hintEl) hintEl.textContent = "Não foi possível copiar o link.";
        setTimeout(() => { if (hintEl) hintEl.textContent = ""; }, 1800);
      }
    });
  }

  // ===============================
  // Ação: Candidatar-se
  // ✅ Agora vai pro cadastro (como você pediu)
  // ===============================
  const btnCandidatar = document.getElementById("btnCandidatar");
  if (!btnCandidatar) return;

  // Ajuda visual se o HTML tiver hint
  const session = getSession();
  const role = getRole();

  if (!session?.role) {
    if (hintEl) hintEl.textContent = "Faça login como candidato para se candidatar.";
  } else if (role !== "candidato") {
    if (hintEl) hintEl.textContent = "Apenas candidatos podem se candidatar a vagas.";
  } else {
    if (hintEl) hintEl.textContent = "Você pode se candidatar normalmente.";
  }

  btnCandidatar.addEventListener("click", () => {
    const sessionNow = getSession();
    const roleNow = getRole();

    if (!sessionNow?.role) {
      alert("Faça login como candidato para se candidatar.");
      window.location.href = "login-candidato.html";
      return;
    }

    if (roleNow !== "candidato") {
      alert("Apenas candidatos podem se candidatar a vagas.");
      return;
    }

    // ✅ garante que a vaga está salva e manda pro cadastro
    localStorage.setItem("vagaSelecionada", JSON.stringify(vaga));
    window.location.href = "cadastro.html";
  });
});
