// Controle global de navegação (botões/links conforme sessão e papel)
document.addEventListener("DOMContentLoaded", () => {
  const session = getSessionSafe();
  const role = session?.role || null;

  // 1) Links para CADASTRO (currículo): sempre aparecem, mas respeitam login/role
  document.querySelectorAll('a[href="cadastro.html"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      // deixa o navegador seguir normalmente se for candidato logado
      if (!session) {
        e.preventDefault();
        window.location.href = "login-candidato.html";
        return;
      }
      if (role !== "candidato") {
        e.preventDefault();
        window.location.href = "painel-empresa.html";
      }
    });
  });

  // 2) Botões do topo (somente no index): "Cadastrar currículo" e "Entrar"
  const topoCtaCadastro = document.querySelector('.topo__actions a.topo__cta[href="cadastro.html"]');
  const topoCtaEntrar = document.querySelector('.topo__actions a.topo__cta[href="login-candidato.html"]');

  if (topoCtaCadastro) {
    if (!session) {
      topoCtaCadastro.href = "login-candidato.html";
    } else if (role === "candidato") {
      topoCtaCadastro.href = "cadastro.html";
    } else {
      topoCtaCadastro.href = "painel-empresa.html";
    }
  }

  if (topoCtaEntrar) {
    topoCtaEntrar.style.display = session ? "none" : "";
  }

  // 3) Links de login no menu superior
  const linksLoginCandidato = Array.from(document.querySelectorAll('a[href="login-candidato.html"]'));
  const linksLoginEmpresa = Array.from(document.querySelectorAll('a[href="login-empresa.html"]'));

  const isLoginCandidatoPage = window.location.pathname.endsWith("login-candidato.html");
  const isLoginEmpresaPage = window.location.pathname.endsWith("login-empresa.html");

  // Se já estiver logado, some com os dois (ninguém precisa logar duas vezes)
  if (session) {
    linksLoginCandidato.forEach((a)=> (a.style.display = "none"));
    linksLoginEmpresa.forEach((a)=> (a.style.display = "none"));
  } else {
    // Não logado: em cada tela de login, esconde o "outro" login
    if (isLoginCandidatoPage) linksLoginEmpresa.forEach((a)=> (a.style.display = "none"));
    if (isLoginEmpresaPage) linksLoginCandidato.forEach((a)=> (a.style.display = "none"));
  }

  // 4) Se logado por um papel, esconde o login do outro papel em qualquer página
  // (ex: entrou como candidato -> some LOGIN EMPRESA)
  if (session && role === "candidato") linksLoginEmpresa.forEach((a)=> (a.style.display = "none"));
  if (session && role === "empresa") linksLoginCandidato.forEach((a)=> (a.style.display = "none"));

  // 5) Se tentar abrir tela de login já logado, manda pro painel certo
  if (session && (isLoginCandidatoPage || isLoginEmpresaPage)) {
    window.location.href = role === "empresa" ? "painel-empresa.html" : "painel-candidato.html";
  }
});

function getSessionSafe() {
  try {
    const raw = localStorage.getItem("session") || localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
