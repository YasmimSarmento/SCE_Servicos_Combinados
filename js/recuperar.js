document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tipo = (params.get("tipo") || "candidato").toLowerCase();

  const btnVoltar = document.getElementById("btn-voltar");
  const form = document.getElementById("recover-form");
  const input = document.getElementById("identificador");
  const msg = document.getElementById("recover-message");

  if (btnVoltar) {
    btnVoltar.href = tipo === "empresa" ? "login-empresa.html" : "login-candidato.html";
  }

  // Máscara simples para CPF enquanto digita (000.000.000-00)
  if (input) {
    input.addEventListener("input", () => {
      const raw = String(input.value || "").replace(/\D/g, "").slice(0, 11);
      if (raw.length <= 11 && raw.length >= 4 && raw.indexOf("@") === -1) {
        let v = raw;
        if (v.length > 3) v = v.slice(0, 3) + "." + v.slice(3);
        if (v.length > 7) v = v.slice(0, 7) + "." + v.slice(7);
        if (v.length > 11) v = v.slice(0, 11) + "-" + v.slice(11);
        input.value = v;
      }
      clearMsg(msg);
    });
  }

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = String(input?.value || "").trim();
    if (!value) {
      setMsg(msg, "Digite seu e-mail ou CPF para continuar.", "error");
      return;
    }

    // Mensagem padrão (sem revelar se existe conta)
    setMsg(
      msg,
      "Se existir uma conta com esses dados, você receberá instruções para redefinir sua senha.",
      "ok"
    );

    // UX: volta pro login depois de um tempinho
    window.setTimeout(() => {
      window.location.href = tipo === "empresa" ? "login-empresa.html" : "login-candidato.html";
    }, 1800);
  });
});

function setMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.classList.remove("auth-message--error", "auth-message--success");
  if (type === "error") el.classList.add("auth-message--error");
  if (type === "ok") el.classList.add("auth-message--success");
}

function clearMsg(el) {
  if (!el) return;
  el.textContent = "";
  el.classList.remove("auth-message--error", "auth-message--success");
}
