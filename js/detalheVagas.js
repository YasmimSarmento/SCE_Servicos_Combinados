/* =====================================================================
   detalhe-vaga.js — Exibição da vaga selecionada
   Projeto: SCE – Banco de Talentos
===================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const vaga = JSON.parse(localStorage.getItem("vagaSelecionada"));
    const container = document.querySelector(".vaga-container");

    if (!vaga || !container) {
        container.innerHTML = "<p class='erro'>Vaga não encontrada.</p>";
        return;
    }

    // Cabeçalho
    document.getElementById("vagaTitulo").textContent = vaga.titulo;
    document.getElementById("vagaEmpresa").textContent =
        vaga.empresa || "Empresa confidencial";

    document.getElementById("vagaTipo").textContent = vaga.tipo;
    document.getElementById("vagaLocal").textContent = vaga.local;
    document.getElementById("vagaNivel").textContent = vaga.area;

    // Descrição
    document.getElementById("vagaDescricao").textContent = vaga.descricao;

    // Requisitos
    const listaRequisitos = document.getElementById("vagaRequisitos");
    listaRequisitos.innerHTML = "";

    (vaga.requisitos || []).forEach(req => {
        const li = document.createElement("li");
        li.textContent = req;
        listaRequisitos.appendChild(li);
    });

    // Benefícios
    const listaBeneficios = document.getElementById("vagaBeneficios");
    listaBeneficios.innerHTML = "";

    (vaga.beneficios || []).forEach(ben => {
        const li = document.createElement("li");
        li.textContent = ben;
        listaBeneficios.appendChild(li);
    });

    // Salário
    document.getElementById("vagaSalario").textContent =
        vaga.salario || "A combinar";

    // Botão candidatar
    document.getElementById("btnCandidatar").addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });

});
