/* =====================================================================
   cadastro.js — Envio do formulário de currículo
   Projeto: SCE – Banco de Talentos
===================================================================== */

/* ---------------------------------------------------------------------
   1. Capturar elementos
--------------------------------------------------------------------- */
const form = document.getElementById("form-curriculo");
const msgSucesso = document.getElementById("msg-sucesso");
const msgErro = document.getElementById("msg-erro");
const btnEnviar = document.getElementById("btn-enviar");

/* ---------------------------------------------------------------------
   2. Validação
--------------------------------------------------------------------- */
function validarFormulario(dados) {
    if (!dados.nome.trim()) return "Informe seu nome completo.";
    if (!dados.email.trim() || !dados.email.includes("@")) return "Forneça um e-mail válido.";
    if (!dados.telefone.trim()) return "Informe um telefone para contato.";
    if (!dados.area.trim()) return "Selecione a área desejada.";
    if (!dados.experiencia.trim()) return "Descreva sua experiência.";

    return null;
}

/* ---------------------------------------------------------------------
   3. Simulação de envio
--------------------------------------------------------------------- */
function enviarParaServidor(dados) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ ok: true }), 1500);
    });
}

/* ---------------------------------------------------------------------
   4. Envio do formulário
--------------------------------------------------------------------- */
async function processarCadastro(event) {
    event.preventDefault();

    msgErro.style.display = "none";
    msgSucesso.style.display = "none";

    const vagaSelecionada = JSON.parse(localStorage.getItem("vagaSelecionada"));

    const dados = {
        nome: form.nome.value,
        email: form.email.value,
        telefone: form.telefone.value,
        area: form.area.value,
        experiencia: form.experiencia.value,
        vaga: vagaSelecionada ? vagaSelecionada.titulo : "Vaga não identificada"
    };

    const erro = validarFormulario(dados);

    if (erro) {
        msgErro.textContent = erro;
        msgErro.style.display = "block";
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    try {
        const resposta = await enviarParaServidor(dados);

        if (resposta.ok) {
            msgSucesso.textContent = "Currículo enviado com sucesso!";
            msgSucesso.style.display = "block";
            form.reset();
        } else {
            throw new Error();
        }
    } catch {
        msgErro.textContent = "Erro ao enviar. Tente novamente.";
        msgErro.style.display = "block";
    }

    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar Currículo";
}

/* ---------------------------------------------------------------------
   5. Evento
--------------------------------------------------------------------- */
form.addEventListener("submit", processarCadastro);
