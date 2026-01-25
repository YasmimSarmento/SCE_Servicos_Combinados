(() => {
  const listaDocumentos = document.getElementById("listaDocumentos");
  const uploadInput = document.getElementById("arquivoDocumento");
  const tipoSelect = document.getElementById("tipoDocumento");
  const msg = document.getElementById("msgDocumento");
  const dragDrop = document.querySelector(".drag-drop");
  const modal = document.querySelector(".modal-preview");
  const modalContent = document.querySelector(".modal-preview-content");

  // ✅ UI: status do arquivo selecionado
  const fileStatus = document.getElementById("fileStatus");
  const fileNameEl = document.getElementById("fileName");
  const fileMetaEl = document.getElementById("fileMeta");
  const btnRemoverArquivo = document.getElementById("btnRemoverArquivo");

  // ✅ Botão enviar
  const btnEnviar = document.getElementById("btnEnviarDocumento");

  const session = (() => {
    try {
      return JSON.parse(localStorage.getItem("session")) || null;
    } catch {
      return null;
    }
  })();

  // ================================
  // PERFORMANCE (principal gargalo):
  //  - Antes: um único JSON gigante em localStorage contendo base64.
  //           JSON.parse ficava pesado e afetava a rolagem/performance.
  //  - Agora: salvamos APENAS metadados no array (leve) e guardamos o base64
  //           em chaves separadas por documento.
  //           Isso deixa o carregamento e a renderização MUITO mais rápidos.
  // ================================
  const STORAGE_KEY = "documentos"; // continua igual, mas agora só guarda metadados
  const LEGACY_KEY = "documentosCandidato";
  const BLOB_PREFIX = "documento_blob_";

  function safeParse(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }

  // 1) Carrega do padrão novo (leve)
  let documentos = safeParse(STORAGE_KEY, []);

  // 2) Migra do padrão antigo (documentosCandidato -> documentos)
  const antigos = safeParse(LEGACY_KEY, []);
  if (Array.isArray(antigos) && antigos.length) {
    const userId = session?.id ?? null;

    const migrados = antigos.map((d) => ({
      ...d,
      userId: d.userId ?? userId,
      id: d.id ?? (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
    }));

    const byId = new Map((Array.isArray(documentos) ? documentos : []).map((d) => [d.id, d]));
    migrados.forEach((d) => byId.set(d.id, d));
    documentos = Array.from(byId.values());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos));
    localStorage.removeItem(LEGACY_KEY);
  }

  // 3) Migração do padrão pesado: se algum doc ainda tiver base64 dentro do array,
  //    empurra o base64 para chaves separadas e deixa o array leve.
  (function migrateHeavyDocs() {
    if (!Array.isArray(documentos) || !documentos.length) return;

    let changed = false;

    documentos = documentos.map((d) => {
      if (!d || typeof d !== "object") return d;

      const id = String(d.id ?? "");
      const base64 = d.base64;

      if (id && base64 && typeof base64 === "string") {
        try {
          // só grava se ainda não existir (evita reescrever uma chave gigante)
          const k = BLOB_PREFIX + id;
          if (!localStorage.getItem(k)) localStorage.setItem(k, base64);
          changed = true;
        } catch {
          // localStorage cheio? mantém no objeto para não perder documento
          return d;
        }

        // remove do objeto para aliviar JSON
        const { base64: _omit, ...rest } = d;
        return rest;
      }
      return d;
    });

    if (changed) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos));
      } catch {
        // se falhar (quota), não quebra a página
      }
    }
  })();

  function setMsg(texto, tipo = "info") {
    if (!msg) return;
    msg.textContent = texto;
    msg.className = `msg ${tipo}`;
  }

  // ✅ Helpers (tamanho/tipo)
  function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    const val = bytes / Math.pow(1024, i);
    return `${val.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  }

  function getNiceType(file) {
    const t = (file.type || "").toLowerCase();
    if (t.includes("pdf")) return "PDF";
    if (t.startsWith("image/")) return "Imagem";
    if (t.includes("word")) return "Word";
    const ext = (file.name.split(".").pop() || "Arquivo").toUpperCase();
    return ext;
  }

  function setSelectedFileUI(file) {
    if (!fileStatus || !fileNameEl || !fileMetaEl) return;

    fileNameEl.textContent = file.name;
    fileMetaEl.textContent = `${getNiceType(file)} • ${formatFileSize(file.size)}`;
    fileStatus.style.display = "flex";

    if (dragDrop) dragDrop.classList.add("has-file");
  }

  function clearSelectedFileUI() {
    if (fileStatus) fileStatus.style.display = "none";
    if (fileNameEl) fileNameEl.textContent = "";
    if (fileMetaEl) fileMetaEl.textContent = "";

    if (uploadInput) uploadInput.value = "";
    if (dragDrop) dragDrop.classList.remove("has-file");
  }

  function getCurrentUserId() {
    return session?.id ?? null;
  }

  function getDocsDoUsuario() {
    const userId = getCurrentUserId();
    if (!userId) return [];
    return (Array.isArray(documentos) ? documentos : []).filter((d) => d.userId === userId);
  }

  function userHasTipo(tipo) {
    const userId = getCurrentUserId();
    if (!userId || !tipo) return false;
    return (Array.isArray(documentos) ? documentos : []).some((d) => d.userId === userId && d.tipo === tipo);
  }

  function applyTipoLock() {
    if (!dragDrop || !tipoSelect) return;

    const tipo = tipoSelect.value;
    const locked = Boolean(tipo && userHasTipo(tipo));

    dragDrop.classList.toggle("tipo-locked", locked);

    // Se já existe documento desse tipo, bloqueia novo envio até excluir na lista
    if (locked) {
      clearSelectedFileUI();
      if (uploadInput) uploadInput.value = "";
      setMsg("ℹ️ Você já enviou um documento deste tipo. Se precisar trocar, exclua o anterior na lista.", "info");
    }

    updateSendButtonState();
  }

  // ✅ Controle profissional do botão "Enviar"
  function isReadyToSend() {
    const file = uploadInput?.files?.[0];
    const tipo = tipoSelect?.value;

    // se o tipo já foi enviado, não permite reenviar (até excluir na lista)
    if (tipo && userHasTipo(tipo)) return false;

    return Boolean(file && tipo);
  }

  function updateSendButtonState() {
    if (!btnEnviar) return;

    const ready = isReadyToSend();

    btnEnviar.disabled = !ready;
    btnEnviar.classList.toggle("is-disabled", !ready);

    if (ready) {
      setMsg("✅ Pronto para enviar.", "success");
      return;
    }

    const hasFile = Boolean(uploadInput?.files?.[0]);
    const hasTipo = Boolean(tipoSelect?.value);
    const tipoLocked = Boolean(tipoSelect?.value && userHasTipo(tipoSelect.value));

    if (tipoLocked) {
      setMsg("ℹ️ Este tipo de documento já foi enviado. Exclua o anterior na lista para enviar outro.", "info");
    } else if (!hasTipo && !hasFile) {
      setMsg("Selecione o tipo e anexe um arquivo para liberar o envio.", "info");
    } else if (!hasTipo) {
      setMsg("Selecione o tipo de documento para liberar o envio.", "info");
    } else if (!hasFile) {
      setMsg("Anexe um arquivo para liberar o envio.", "info");
    }
  }

  function salvarMeta() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos));
    } catch {
      // quota cheia? evita travar a página
    }
  }

  function blobKey(id) {
    return BLOB_PREFIX + String(id);
  }

  function getBase64ById(id, fallbackBase64) {
    const k = blobKey(id);
    const v = localStorage.getItem(k);
    return v || fallbackBase64 || "";
  }

  function setBase64ById(id, base64) {
    try {
      localStorage.setItem(blobKey(id), base64);
      return true;
    } catch {
      return false;
    }
  }

  function removeBase64ById(id) {
    try {
      localStorage.removeItem(blobKey(id));
    } catch {
      // ignore
    }
  }

  function formatarData(iso) {
    try {
      const dt = new Date(iso);
      return dt.toLocaleString("pt-BR");
    } catch {
      return iso;
    }
  }

  // Map em memória (evita recriar Map a cada clique)
  let docMap = new Map();

  function rebuildMap() {
    docMap = new Map((Array.isArray(documentos) ? documentos : []).map((d) => [String(d.id), d]));
  }

  function renderizar() {
    if (!listaDocumentos) return;

    const docs = getDocsDoUsuario();
    if (!docs.length) {
      listaDocumentos.innerHTML = `<p class="vazio">Nenhum documento enviado ainda.</p>`;
      return;
    }

    // Render rápido (1 único innerHTML)
    listaDocumentos.innerHTML = docs
      .map(
        (d) => `
        <div class="doc-card" data-id="${d.id}">
          <div class="doc-info">
            <strong>${d.tipo}</strong>
            <span>${d.nome}</span>
            <small>${formatarData(d.data)}</small>
          </div>
          <div class="doc-acoes">
            <button class="btn-acao" data-action="preview" type="button">Visualizar</button>
            <button class="btn-acao" data-action="download" type="button">Baixar</button>
            <button class="btn-acao" data-action="delete" type="button">Excluir</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  // Delegação de eventos (evita criar dezenas de listeners e deixa a página mais leve)
  if (listaDocumentos && !listaDocumentos.__delegatedDocs) {
    listaDocumentos.__delegatedDocs = true;

    listaDocumentos.addEventListener("click", (e) => {
      const btn = e.target?.closest?.("button[data-action]");
      if (!btn) return;

      const card = btn.closest(".doc-card");
      const id = card?.getAttribute?.("data-id");
      if (!id) return;

      const doc = docMap.get(String(id));
      if (!doc) return;

      const action = btn.getAttribute("data-action");
      if (action === "preview") visualizarDocumento(doc);
      else if (action === "download") baixarDocumento(doc);
      else if (action === "delete") excluirDocumento(doc);
    });
  }

  function baixarDocumento(doc) {
    const base64 = getBase64ById(doc.id, doc.base64);
    if (!base64) {
      setMsg("Não foi possível localizar o arquivo deste documento.", "error");
      return;
    }

    const link = document.createElement("a");
    link.href = base64;
    link.download = doc.nome || "documento";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function excluirDocumento(doc) {
    if (!confirm("Deseja realmente excluir este documento?")) return;

    documentos = (Array.isArray(documentos) ? documentos : []).filter((d) => d.id !== doc.id);
    removeBase64ById(doc.id);
    salvarMeta();

    rebuildMap();
    requestAnimationFrame(renderizar);

    setMsg("Documento excluído.", "success");
    applyTipoLock(); // se estava travado por tipo, libera quando necessário
  }

  function visualizarDocumento(doc) {
    if (!modal || !modalContent) return;

    const base64 = getBase64ById(doc.id, doc.base64);
    if (!base64) {
      setMsg("Não foi possível localizar o arquivo deste documento.", "error");
      return;
    }

    const isPdf = (doc.tipoArquivo || "").includes("pdf");
    const isImage = (doc.tipoArquivo || "").startsWith("image/");

    let previewHTML = "";

    if (isPdf) {
      previewHTML = `<iframe src="${base64}" frameborder="0" style="width:100%;height:70vh;border-radius:12px;"></iframe>`;
    } else if (isImage) {
      previewHTML = `<img src="${base64}" alt="${doc.nome}" style="max-width:100%;max-height:70vh;border-radius:12px;" />`;
    } else {
      previewHTML = `<p>Pré-visualização indisponível para este tipo de arquivo.</p>`;
    }

    modalContent.innerHTML = `
      <button class="modal-close" type="button">&times;</button>
      <h3>${doc.nome}</h3>
      <div>${previewHTML}</div>
    `;
    modal.style.display = "flex";

    const closeBtn = modalContent.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => window.fecharModal && window.fecharModal());
  }

  window.fecharModal = function () {
    if (modal) modal.style.display = "none";
  };

  // ✅ Input change: mostra status do arquivo e atualiza botão
  if (uploadInput) {
    uploadInput.addEventListener("change", () => {
      const file = uploadInput.files?.[0];
      if (file) setSelectedFileUI(file);
      else clearSelectedFileUI();

      updateSendButtonState();
    });
  }

  // ✅ Mudança no tipo: atualiza botão
  if (tipoSelect) {
    tipoSelect.addEventListener("change", () => {
      applyTipoLock();
    });
  }

  // ✅ Botão remover arquivo
  if (btnRemoverArquivo) {
    btnRemoverArquivo.addEventListener("click", () => {
      clearSelectedFileUI();
      setMsg("Arquivo removido. Selecione outro para enviar.", "info");
      updateSendButtonState();
    });
  }

  // Drag & Drop + Clique
  if (dragDrop) {
    dragDrop.addEventListener("click", () => {
      if (dragDrop.classList.contains("has-file") || dragDrop.classList.contains("tipo-locked")) return;
      uploadInput && uploadInput.click();
    });

    dragDrop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (dragDrop.classList.contains("has-file") || dragDrop.classList.contains("tipo-locked")) return;
        uploadInput && uploadInput.click();
      }
    });

    dragDrop.addEventListener("dragover", (e) => {
      if (dragDrop.classList.contains("has-file") || dragDrop.classList.contains("tipo-locked")) return;
      e.preventDefault();
      dragDrop.classList.add("ativo");
    });

    dragDrop.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dragDrop.classList.remove("ativo");
    });

    dragDrop.addEventListener("drop", (e) => {
      if (dragDrop.classList.contains("has-file") || dragDrop.classList.contains("tipo-locked")) return;
      e.preventDefault();
      dragDrop.classList.remove("ativo");

      const file = e.dataTransfer?.files?.[0];
      if (file && uploadInput) {
        uploadInput.files = e.dataTransfer.files;
        setSelectedFileUI(file);
      }
      updateSendButtonState();
    });
  }

  function enviarDocumento() {
    const file = uploadInput?.files?.[0];
    const tipo = tipoSelect?.value;

    if (!file || !tipo) {
      updateSendButtonState();
      return;
    }

    const userId = session?.id ?? null;
    if (!userId) {
      setMsg("Você precisa estar logado para enviar documentos.", "error");
      return;
    }

    const max = 4 * 1024 * 1024; // 4MB
    if (file.size > max) {
      setMsg("Arquivo muito grande. Use até 4MB.", "error");
      clearSelectedFileUI();
      updateSendButtonState();
      return;
    }

    // botão em estado de envio (visual leve)
    if (btnEnviar) {
      btnEnviar.disabled = true;
      btnEnviar.textContent = "Enviando...";
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "");
      const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());

      const ok = setBase64ById(id, base64);
      if (!ok) {
        setMsg("Armazenamento cheio. Exclua algum documento antigo e tente novamente.", "error");
        if (btnEnviar) {
          btnEnviar.textContent = "Enviar Documento";
          updateSendButtonState();
        }
        return;
      }

      const novo = {
        id,
        userId,
        tipo,
        nome: file.name,
        data: new Date().toISOString(),
        tipoArquivo: file.type,
        // base64 propositalmente NÃO fica aqui (performance)
      };

      documentos = Array.isArray(documentos) ? documentos : [];
      documentos.push(novo);

      salvarMeta();
      rebuildMap();
      requestAnimationFrame(renderizar);

      setMsg("✅ Documento enviado com sucesso!", "success");

      clearSelectedFileUI();
      if (tipoSelect) tipoSelect.value = "";
      updateSendButtonState();

      if (btnEnviar) btnEnviar.textContent = "Enviar Documento";
    };

    reader.onerror = () => {
      setMsg("Erro ao ler o arquivo. Tente novamente.", "error");
      if (btnEnviar) {
        btnEnviar.textContent = "Enviar Documento";
        updateSendButtonState();
      }
    };

    reader.readAsDataURL(file);
  }

  // Botão enviar
  if (btnEnviar) btnEnviar.addEventListener("click", () => enviarDocumento());

  // Fecha modal clicando fora
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) window.fecharModal();
    });
  }

  // Init
  rebuildMap();
  renderizar();
  applyTipoLock();
  updateSendButtonState();
})();
