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
    document.getElementById("vagaNivel").textContent = vaga.area || "-";
    document.getElementById("vagaLocal").textContent = vaga.local || "-";

    document.getElementById("vagaDescricao").textContent =
        vaga.descricao || "Descrição não informada.";

    // Requisitos
    const listaRequisitos = document.getElementById("vagaRequisitos");
    listaRequisitos.innerHTML = "";

    if (vaga.requisitos && vaga.requisitos.length) {
        vaga.requisitos.forEach(req => {
            const li = document.createElement("li");
            li.textContent = req;
            listaRequisitos.appendChild(li);
        });
    } else {
        listaRequisitos.innerHTML = "<li>Não informado</li>";
    }

    // Benefícios
    const listaBeneficios = document.getElementById("vagaBeneficios");
    listaBeneficios.innerHTML = "";

    if (vaga.beneficios && vaga.beneficios.length) {
        vaga.beneficios.forEach(ben => {
            const li = document.createElement("li");
            li.textContent = ben;
            listaBeneficios.appendChild(li);
        });
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

// fallback: se não tem session mas tem auth, valida por auth
if (!session && auth !== "candidato") {
  alert("Apenas candidatos podem se candidatar a vagas.");
  return;
}


        // segue fluxo normal
        window.location.href = "cadastro.html";
    });
});
