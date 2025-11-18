/* =====================================================================
   cadastro.js — Envio do formulário de cadastro de currículo
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
   2. Validação simples e eficaz
--------------------------------------------------------------------- */
function validarFormulario(dados) {
    if (!dados.nome.trim()) return "Informe seu nome completo.";
    if (!dados.email.trim() || !dados.email.includes("@")) return "Forneça um e-mail válido.";
    if (!dados.telefone.trim()) return "Informe um número de telefone para contato.";
    if (!dados.area.trim()) return "Selecione a área desejada.";
    if (!dados.experiencia.trim()) return "Descreva brevemente sua experiência.";

    return null; // válido
}


/* ---------------------------------------------------------------------
   3. Simular envio (futuramente vira integração real com API)
--------------------------------------------------------------------- */
async function enviarParaServidor(dados) {
    // Exemplo real futuro:
    // return fetch("https://api.sce.com/candidatos", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(dados)
    // });

    return new Promise(resolve => {
        setTimeout(() => resolve({ ok: true }), 1500); // animação fake bonitinha
    });
}


/* ---------------------------------------------------------------------
   4. Função principal de envio
--------------------------------------------------------------------- */
async function processarCadastro(event) {
    event.preventDefault();

    msgErro.textContent = "";
    msgSucesso.textContent = "";

    const dados = {
        nome: form.nome.value,
        email: form.email.value,
        telefone: form.telefone.value,
        area: form.area.value,
        experiencia: form.experiencia.value
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
            msgErro.textContent = "Não foi possível enviar seu cadastro. Tente novamente.";
            msgErro.style.display = "block";
        }
    } catch (e) {
        msgErro.textContent = "Erro inesperado. Verifique sua conexão.";
        msgErro.style.display = "block";
    }

    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar Currículo";
}


/* ---------------------------------------------------------------------
   5. Eventos
--------------------------------------------------------------------- */
form.addEventListener("submit", processarCadastro);
