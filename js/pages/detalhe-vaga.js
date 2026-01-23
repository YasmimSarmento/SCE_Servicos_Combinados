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
  const listaRequisitos = document.getElementById("listaRequisitos");
  const listaBeneficios = document.getElementById("listaBeneficios");
  const elSalario = document.getElementById("vagaSalario");

  if (elTitulo) elTitulo.textContent = vaga.titulo || "Vaga";
  if (elEmpresa) elEmpresa.textContent = "SCE – Banco de Talentos";
  if (elTipo) elTipo.textContent = vaga.tipo || "-";
  if (elLocal) elLocal.textContent = vaga.local || "-";
  if (elArea) elArea.textContent = vaga.area || "-";
  if (elDescricao) elDescricao.textContent = vaga.descricao || "Sem descrição.";
  if (elSalario) elSalario.textContent = vaga.salario || "A combinar";

  if (listaRequisitos) {
    if (vaga.requisitos && vaga.requisitos.length) {
      listaRequisitos.innerHTML = vaga.requisitos.map(r => `<li>${r}</li>`).join("");
    } else {
      listaRequisitos.innerHTML = "<li>Não informado</li>";
    }
  }

  if (listaBeneficios) {
    if (vaga.beneficios && vaga.beneficios.length) {
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
  // Ação: Candidatar-se
  // ===============================
  const btnCandidatar = document.getElementById("btnCandidatar");
  if (!btnCandidatar) return;

  btnCandidatar.addEventListener("click", () => {
    const session = getSession();
    const role = getRole();

    // ✅ exige session (padrão oficial)
    if (!session?.role) {
      alert("Faça login como candidato para se candidatar.");
      window.location.href = "login-candidato.html";
      return;
    }

    if (role !== "candidato") {
      alert("Apenas candidatos podem se candidatar a vagas.");
      return;
    }

    const email = session.email || "anon";
    const candidaturas = JSON.parse(localStorage.getItem("candidaturas") || "[]");

    const jaExiste = candidaturas.some(c => c.vagaId === vaga.id && c.email === email);
    if (jaExiste) {
      alert("Você já se candidatou a esta vaga.");
      return;
    }

    candidaturas.push({
      vagaId: vaga.id,
      titulo: vaga.titulo,
      local: vaga.local,
      tipo: vaga.tipo,
      area: vaga.area,
      data: new Date().toISOString(),
      email
    });

    localStorage.setItem("candidaturas", JSON.stringify(candidaturas));
    alert("Candidatura enviada com sucesso!");
  });
});
