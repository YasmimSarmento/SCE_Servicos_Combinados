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

  const session = JSON.parse(localStorage.getItem("session")) || null;

  const STORAGE_KEY = "documentos";

  // 1) Carrega do padrão novo
  let documentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // 2) Migra do padrão antigo (documentosCandidato -> documentos)
  const antigos = JSON.parse(localStorage.getItem("documentosCandidato")) || [];
  if (antigos.length) {
    const userId = session?.id ?? null;

    const migrados = antigos.map((d) => ({
      ...d,
      userId: d.userId ?? userId,
      id: d.id ?? (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
    }));

    const byId = new Map(documentos.map((d) => [d.id, d]));
    migrados.forEach((d) => byId.set(d.id, d));
    documentos = Array.from(byId.values());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos));
    localStorage.removeItem("documentosCandidato");
  }

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

  // ✅ Controle profissional do botão "Enviar"
  function isReadyToSend() {
    const file = uploadInput?.files?.[0];
    const tipo = tipoSelect?.value;
    return Boolean(file && tipo);
  }

  function updateSendButtonState() {
    if (!btnEnviar) return;

    const ready = isReadyToSend();

    btnEnviar.disabled = !ready;
    btnEnviar.classList.toggle("is-disabled", !ready);

    // Mensagens mais elegantes e úteis
    if (ready) {
      setMsg("✅ Pronto para enviar.", "success");
      return;
    }

    // Só mostra dica quando o usuário já interagiu (pra não poluir)
    const hasFile = Boolean(uploadInput?.files?.[0]);
    const hasTipo = Boolean(tipoSelect?.value);

    if (!hasTipo && !hasFile) {
      setMsg("Selecione o tipo e anexe um arquivo para liberar o envio.", "info");
    } else if (!hasTipo) {
      setMsg("Selecione o tipo de documento para liberar o envio.", "info");
    } else if (!hasFile) {
      setMsg("Anexe um arquivo para liberar o envio.", "info");
    }
  }

  function getDocsDoUsuario() {
    const userId = session?.id ?? null;
    if (!userId) return [];
    return documentos.filter((d) => d.userId === userId);
  }

  function salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos));
  }

  function formatarData(iso) {
    try {
      const dt = new Date(iso);
      return dt.toLocaleString("pt-BR");
    } catch {
      return iso;
    }
  }

  function renderizar() {
    if (!listaDocumentos) return;
    const docs = getDocsDoUsuario();

    if (!docs.length) {
      listaDocumentos.innerHTML = `<p class="vazio">Nenhum documento enviado ainda.</p>`;
      return;
    }

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
            <button class="btn-acao btn-preview" type="button">Visualizar</button>
            <button class="btn-acao btn-download" type="button">Baixar</button>
            <button class="btn-acao btn-excluir" type="button">Excluir</button>
          </div>
        </div>
      `
      )
      .join("");

    listaDocumentos.querySelectorAll(".doc-card").forEach((card) => {
      const id = card.getAttribute("data-id");
      const doc = documentos.find((x) => x.id === id);
      if (!doc) return;

      const btnPreview = card.querySelector(".btn-preview");
      const btnDownload = card.querySelector(".btn-download");
      const btnExcluir = card.querySelector(".btn-excluir");

      if (btnPreview) btnPreview.addEventListener("click", () => visualizarDocumento(doc));
      if (btnDownload) btnDownload.addEventListener("click", () => baixarDocumento(doc));
      if (btnExcluir) btnExcluir.addEventListener("click", () => excluirDocumento(doc));
    });
  }

  function baixarDocumento(doc) {
    const link = document.createElement("a");
    link.href = doc.base64;
    link.download = doc.nome || "documento";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function excluirDocumento(doc) {
    if (!confirm("Deseja realmente excluir este documento?")) return;
    documentos = documentos.filter((d) => d.id !== doc.id);
    salvar();
    renderizar();
    setMsg("Documento excluído.", "success");
  }

  function visualizarDocumento(doc) {
    if (!modal || !modalContent) return;

    const isPdf = doc.tipoArquivo?.includes("pdf");
    const isImage = doc.tipoArquivo?.startsWith("image/");

    let previewHTML = "";

    if (isPdf) {
      previewHTML = `<iframe src="${doc.base64}" frameborder="0" style="width:100%;height:70vh;border-radius:12px;"></iframe>`;
    } else if (isImage) {
      previewHTML = `<img src="${doc.base64}" alt="${doc.nome}" style="max-width:100%;max-height:70vh;border-radius:12px;" />`;
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
      if (file) {
        setSelectedFileUI(file);
      } else {
        clearSelectedFileUI();
      }
      updateSendButtonState();
    });
  }

  // ✅ Mudança no tipo: atualiza botão
  if (tipoSelect) {
    tipoSelect.addEventListener("change", () => {
      updateSendButtonState();
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
    dragDrop.addEventListener("click", () => uploadInput && uploadInput.click());

    dragDrop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        uploadInput && uploadInput.click();
      }
    });

    dragDrop.addEventListener("dragover", (e) => {
      e.preventDefault();
      dragDrop.classList.add("ativo");
    });

    dragDrop.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dragDrop.classList.remove("ativo");
    });

    dragDrop.addEventListener("drop", (e) => {
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
      const novo = {
        id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        userId,
        tipo,
        nome: file.name,
        data: new Date().toISOString(),
        tipoArquivo: file.type,
        base64,
      };

      documentos.push(novo);
      salvar();
      renderizar();

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
  renderizar();
  updateSendButtonState(); // ✅ já inicia com botão travado e dica
})();
