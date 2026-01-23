document.addEventListener("DOMContentLoaded", () => {
    const vaga = JSON.parse(localStorage.getItem("vagaSelecionada"));

    // 🔒 Se não houver vaga selecionada, volta
    if (!vaga) {
        window.location.href = "vagas.html";
        return;
    }

    // ===============================
    // Preenchimento dos dados
    // ===============================
    document.getElementById("vagaTitulo").textContent = vaga.titulo || "Vaga";
    document.getElementById("vagaEmpresa").textContent = "SCE – Banco de Talentos";

    document.getElementById("vagaTipo").textContent = vaga.tipo || "-";
    document.getElementById("vagaLocal").textContent = vaga.local || "-";
    document.getElementById("vagaArea").textContent = vaga.area || "-";

    document.getElementById("vagaDescricao").textContent =
        vaga.descricao || "Sem descrição.";

    // Requisitos
    const listaRequisitos = document.getElementById("listaRequisitos");
    if (vaga.requisitos && vaga.requisitos.length) {
        listaRequisitos.innerHTML = vaga.requisitos
            .map(r => `<li>${r}</li>`)
            .join("");
    } else {
        listaRequisitos.innerHTML = "<li>Não informado</li>";
    }

    // Benefícios
    const listaBeneficios = document.getElementById("listaBeneficios");
    if (vaga.beneficios && vaga.beneficios.length) {
        listaBeneficios.innerHTML = vaga.beneficios
            .map(b => `<li>${b}</li>`)
            .join("");
    } else {
        listaBeneficios.innerHTML = "<li>Não informado</li>";
    }

    // Salário
    document.getElementById("vagaSalario").textContent =
        vaga.salario || "A combinar";

    // ===============================
    // Ação: Candidatar-se
    // ===============================
    const btnCandidatar = document.getElementById("btnCandidatar");

    if (!btnCandidatar) return;

    btnCandidatar.addEventListener("click", () => {
const session = JSON.parse(localStorage.getItem("session") || "null");
const auth = localStorage.getItem("auth");

// se não tem sessão, força login
if (!session && !auth) {
  alert("Faça login como candidato para se candidatar.");
  window.location.href = "login-candidato.html";
  return;
}

// se tiver session, valida por ela (mais confiável)
if (session && session.role !== "candidato") {
  alert("Apenas candidatos podem se candidatar a vagas.");
  return;
}

// se não tiver session mas tiver auth, valida por auth
if (!session && auth !== "candidato") {
  alert("Apenas candidatos podem se candidatar a vagas.");
  return;
}

const email = session?.email || "anon";

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
