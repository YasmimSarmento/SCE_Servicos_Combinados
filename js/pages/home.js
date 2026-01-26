// Home (index) - topo minimalista + menu de perfil
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnPerfil");
  const menu = document.getElementById("perfilDropdown");
  if (!btn || !menu) return;

  // sessão (compatível com auth.js)
  const session =
    typeof getSession === "function"
      ? getSession()
      : (() => {
          try {
            const data =
              localStorage.getItem("session") || localStorage.getItem("auth");
            return data ? JSON.parse(data) : null;
          } catch {
            return null;
          }
        })();

  const openMenu = () => {
    menu.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;

    const target = e.target;
    if (target instanceof Node && (menu.contains(target) || btn.contains(target)))
      return;

    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Ajusta opções conforme login
  const onlyAuth = menu.querySelectorAll(".only-auth");
  const loginItems = Array.from(
    menu.querySelectorAll('a[href^="login-"], a[href^="recuperar-senha"]')
  );

  if (!session) {
    onlyAuth.forEach((el) => (el.style.display = "none"));
    loginItems.forEach((el) => (el.style.display = ""));

    // Botões do topo (index.html)
    const btnCadastrar = document.querySelector('a.topo__cta--ghost[href="cadastro.html"]');
    const btnEntrar = document.querySelector('a.topo__cta--primary[href^="login-"]');
    if (btnCadastrar) btnCadastrar.style.display = ""; // aparece sempre (sem login redireciona)
    if (btnEntrar) btnEntrar.style.display = "";

    return;
  }

  // logado
  loginItems.forEach((el) => (el.style.display = "none"));
  onlyAuth.forEach((el) => (el.style.display = ""));

  const role = session.role || session.tipo || session.userType || null;

  // Botões do topo (index.html)
  const btnCadastrar = document.querySelector('a.topo__cta--ghost[href="cadastro.html"]');
  const btnEntrar = document.querySelector('a.topo__cta--primary[href^="login-"]');

  // Logado: some com "Entrar"
  if (btnEntrar) btnEntrar.style.display = "none";

  // Currículo só faz sentido para candidato
  if (btnCadastrar) btnCadastrar.style.display = role === "candidato" ? "" : "none";


  // filtra por papel (se vier)
  onlyAuth.forEach((el) => {
    const required = el.getAttribute("data-only-role");
    if (!required) return;

    if (!role) return; // se não tem role, deixa aparecer (não quebra)

    el.style.display = required === role ? "" : "none";
  });

  // Logout (usa auth.js se existir; fallback para localStorage)
  const logoutLink = menu.querySelector('[data-action="logout"]');
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();

      // tenta chamar uma função de logout do auth.js, se existir
      const candidates = ["logout", "doLogout", "signOut"];
      for (const fnName of candidates) {
        if (typeof window[fnName] === "function") {
          try {
            window[fnName]();
          } catch {}
          closeMenu();
          window.location.href = "index.html";
          return;
        }
      }

      // fallback caso auth.js não exponha função
      try {
        localStorage.removeItem("session");
        localStorage.removeItem("auth");
      } catch {}

      closeMenu();
      window.location.href = "index.html";
    });
  }
});
