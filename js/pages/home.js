// Home (index) - topo minimalista + menu de perfil
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnPerfil");
  const menu = document.getElementById("perfilDropdown");
  if (!btn || !menu) return;

  // sessão (compatível com auth.js)
  const session = (typeof getSession === "function") ? getSession() : (() => {
    try {
      const data = localStorage.getItem("session") || localStorage.getItem("auth");
      return data ? JSON.parse(data) : null;
    } catch { return null; }
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
    if (target instanceof Node && (menu.contains(target) || btn.contains(target))) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Ajusta opções conforme login
  const onlyAuth = menu.querySelectorAll(".only-auth");
  const loginItems = Array.from(menu.querySelectorAll('a[href*="login-"], a[href*="recuperar-senha"]'));

  if (!session) {
    onlyAuth.forEach((el) => (el.style.display = "none"));
    loginItems.forEach((el) => (el.style.display = ""));
    return;
  }

  // logado
  loginItems.forEach((el) => (el.style.display = "none"));
  onlyAuth.forEach((el) => (el.style.display = ""));

  const role = session.role || session.tipo || session.userType || null;

  // filtra por papel (se vier)
  onlyAuth.forEach((el) => {
    const required = el.getAttribute("data-only-role");
    if (!required) return;
    if (!role) return; // se não tem role, deixa aparecer (não quebra)
    el.style.display = required === role ? "" : "none";
  });
});
