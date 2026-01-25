// Sidebar controller (desktop: recolher/expandir | mobile/tablet: drawer abrir/fechar)
// + Floating menu button draggable (only the fallback floating button, not the header one)
(function () {
  const body = document.body;

  const btnToggleInside = document.querySelector('[data-sidebar-toggle]');

  // Pode existir mais de um botão de menu (header + fallback flutuante). Prioriza o do header.
  const headerToggle = document.querySelector('.topo [data-menu-toggle]');
  const fallbackToggle = headerToggle ? null : document.querySelector('[data-menu-toggle]');
  const btnToggleMenu = headerToggle || fallbackToggle;

  const overlay = document.querySelector('[data-sidebar-overlay]');
  const sidebarEl = document.querySelector('.sidebar, .sidebar-pro');
  const hasSidebar = !!sidebarEl;

  if (hasSidebar) body.classList.add('has-sidebar');
  if (headerToggle) body.classList.add('has-header-menu');

  const mqDrawer = window.matchMedia('(max-width: 1024px)');
  const mqAutoCollapse = window.matchMedia('(max-width: 1200px)');
  const mqForceExpand = window.matchMedia('(min-width: 1400px)');

  function isSmall() {
    return mqDrawer.matches;
  }

  function shouldAutoCollapse() {
    // Só aplica em "desktop" (acima do breakpoint do drawer)
    return !isSmall() && mqAutoCollapse.matches;
  }

  function openDrawer() {
    body.classList.add('sidebar-open');
  }

  function closeDrawer() {
    body.classList.remove('sidebar-open');
  }

  function toggleDrawer() {
    body.classList.toggle('sidebar-open');
  }

  function setCollapsed(next, opts) {
    const persist = !(opts && opts.persist === false);
    if (next) body.classList.add('sidebar-collapsed');
    else body.classList.remove('sidebar-collapsed');

    if (persist) {
      try {
        localStorage.setItem('sidebarCollapsed', next ? '1' : '0');
        localStorage.setItem('sidebarUserSet', '1');
      } catch (e) {}
    }
  }

  function toggleCollapsed() {
    const next = !body.classList.contains('sidebar-collapsed');
    setCollapsed(next);
  }

  // Inicialização: preferência do usuário (se existir) ou auto-colapso em telas menores
  function initCollapsedState() {
    if (!hasSidebar) return;

    try {
      const userSet = localStorage.getItem('sidebarUserSet') === '1';
      const saved = localStorage.getItem('sidebarCollapsed');

      if (!isSmall()) {
        if (mqForceExpand.matches) {
          setCollapsed(false, { persist: false });
          try { localStorage.setItem('sidebarCollapsed', '0'); } catch (e) {}
        } else if (userSet) {
          setCollapsed(saved === '1', { persist: false });
        } else {
          setCollapsed(shouldAutoCollapse(), { persist: false });
        }
      } else {
        // No drawer, nunca deixa "recolhido"
        body.classList.remove('sidebar-collapsed');
      }
    } catch (e) {
      if (!isSmall()) setCollapsed(shouldAutoCollapse(), { persist: false });
    }
  }

  initCollapsedState();

  // Clique no botão dentro do sidebar
  if (btnToggleInside) {
    btnToggleInside.addEventListener('click', function () {
      if (isSmall()) toggleDrawer();
      else toggleCollapsed();
    });
  }

  // =========================================================
  // Floating menu button: DRAGGABLE (only fallback floating button)
  // =========================================================

  // Regra: só torna arrastável se for o botão flutuante (não o do header)
  const floatBtn = fallbackToggle; // só existe se não houver header toggle

  // Clique no botão (header ou fallback)
  // Regra: o botão flutuante NÃO usa click para toggle (pra não ativar ao arrastar)
  if (btnToggleMenu && btnToggleMenu !== floatBtn) {
    btnToggleMenu.addEventListener('click', function () {
      // Se estiver em drawer, abre/fecha. Se estiver em desktop, recolhe/expande.
      if (isSmall()) toggleDrawer();
      else toggleCollapsed();
    });
  }

  // Clique fora fecha
  if (overlay) {
    overlay.addEventListener('click', function () {
      closeDrawer();
    });
  }

  // ESC fecha drawer
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  const POS_KEY = 'menuTogglePos_v1';
  const RESET_KEY = 'resetMenuTogglePos_v1';

  function getBtnRect(btn) {
    return btn.getBoundingClientRect();
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function loadSavedPosition() {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return null;
      const pos = JSON.parse(raw);
      if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') return null;
      return pos;
    } catch (e) {
      return null;
    }
  }

  function savePosition(x, y) {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch (e) {}
  }

  function setBtnPosition(btn, x, y) {
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
  }

  function clampFloatingButtonToViewport() {
    if (!floatBtn) return;

    const rect = getBtnRect(floatBtn);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // margem segura
    const pad = 8;

    const maxX = vw - rect.width - pad;
    const maxY = vh - rect.height - pad;

    // Usa offset atual (pela posição computada)
    const currentLeft = parseFloat(floatBtn.style.left || rect.left);
    const currentTop = parseFloat(floatBtn.style.top || rect.top);

    const x = clamp(currentLeft, pad, maxX);
    const y = clamp(currentTop, pad, maxY);

    setBtnPosition(floatBtn, x, y);
    savePosition(x, y);
  }

  function shouldResetPosition() {
    try {
      return localStorage.getItem(RESET_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function clearResetFlag() {
    try { localStorage.removeItem(RESET_KEY); } catch (e) {}
  }

  function setDefaultProfessionalPosition() {
    if (!floatBtn) return;

    requestAnimationFrame(() => {
      const rect = getBtnRect(floatBtn);
      const pad = 14;

      // Posição padrão profissional: meio na vertical + esquerda
      const x = pad;
      const y = Math.max(pad, (window.innerHeight - rect.height) / 2);

      setBtnPosition(floatBtn, x, y);
      clampFloatingButtonToViewport();
      savePosition(x, y);
      clearResetFlag();
    });
  }

  // Aplica posição salva (se houver) OU reseta após login
  if (floatBtn) {
    // garante que seja posicionável
    floatBtn.style.position = 'fixed';

    const mustReset = shouldResetPosition();
    const saved = mustReset ? null : loadSavedPosition();

    if (saved) {
      setBtnPosition(floatBtn, saved.x, saved.y);
      // depois ajusta pra não ficar fora da tela
      requestAnimationFrame(clampFloatingButtonToViewport);
    } else {
      // Se veio de login, força padrão "meio-esquerda". Senão, default inicial também.
      setDefaultProfessionalPosition();
    }
  }

  // Arrasto com limiar para não "clicar" sem querer
  if (floatBtn) {
    let dragging = false;
    let pointerId = null;

    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    let moved = false;

    // ✅ Menos sensível: precisa mover mais pra considerar arrasto
    const MOVE_THRESHOLD = 10; // px

    floatBtn.addEventListener('pointerdown', function (e) {
      // Só arrasta com botão principal (mouse) ou toque
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      dragging = true;
      moved = false;
      pointerId = e.pointerId;

      const rect = getBtnRect(floatBtn);
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      // captura o ponteiro pra arrasto ficar estável
      try { floatBtn.setPointerCapture(pointerId); } catch (err) {}

      // evita selecionar texto/scroll durante arrasto
      e.preventDefault();
    });

    floatBtn.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!moved && (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD)) {
        moved = true;
      }

      // Só move visualmente se realmente virou arrasto
      if (!moved) return;

      const rect = getBtnRect(floatBtn);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 8;

      const maxX = vw - rect.width - pad;
      const maxY = vh - rect.height - pad;

      const x = clamp(startLeft + dx, pad, maxX);
      const y = clamp(startTop + dy, pad, maxY);

      setBtnPosition(floatBtn, x, y);
    });

    floatBtn.addEventListener('pointerup', function (e) {
      if (!dragging || e.pointerId !== pointerId) return;

      dragging = false;

      // solta captura
      try { floatBtn.releasePointerCapture(pointerId); } catch (err) {}

      pointerId = null;

      // salva posição final
      const rect = getBtnRect(floatBtn);
      savePosition(rect.left, rect.top);

      // ✅ Clique real (sem arrasto) abre/fecha aqui — não via "click"
      if (!moved) {
        if (isSmall()) toggleDrawer();
        else toggleCollapsed();
        return;
      }

      // Se foi arrasto, bloqueia o "click" fantasma subsequente
      floatBtn.dataset.justDragged = '1';
      setTimeout(() => { delete floatBtn.dataset.justDragged; }, 140);
    });

    // Bloqueia click fantasma após arrasto (em CAPTURA pra garantir)
    floatBtn.addEventListener('click', function (e) {
      if (floatBtn.dataset.justDragged === '1') {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
    }, true);

    window.addEventListener('resize', clampFloatingButtonToViewport);
  }

  // Ao mudar tamanho: fecha drawer, e aplica colapso só no desktop
  function handleResize() {
    if (isSmall()) {
      closeDrawer();
      // No mobile, não deixa ficar "recolhido"
      body.classList.remove('sidebar-collapsed');
    } else {
      closeDrawer();

      try {
        const userSet = localStorage.getItem('sidebarUserSet') === '1';
        const saved = localStorage.getItem('sidebarCollapsed');

        if (mqForceExpand.matches) {
          setCollapsed(false, { persist: false });
          try { localStorage.setItem('sidebarCollapsed', '0'); } catch (e) {}
        } else if (userSet) {
          setCollapsed(saved === '1', { persist: false });
        } else {
          setCollapsed(shouldAutoCollapse(), { persist: false });
        }
      } catch (e) {
        setCollapsed(shouldAutoCollapse(), { persist: false });
      }
    }

    // Se existir botão flutuante, reposiciona dentro da tela ao redimensionar
    clampFloatingButtonToViewport();
  }

  // matchMedia change event (compat)
  if (mqDrawer.addEventListener) mqDrawer.addEventListener('change', handleResize);
  else mqDrawer.addListener(handleResize);

  if (mqAutoCollapse.addEventListener) mqAutoCollapse.addEventListener('change', handleResize);
  else mqAutoCollapse.addListener(handleResize);

  if (mqForceExpand.addEventListener) mqForceExpand.addEventListener('change', handleResize);
  else mqForceExpand.addListener(handleResize);

})();
