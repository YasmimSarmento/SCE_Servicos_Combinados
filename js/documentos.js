(() => {
  const listaDocumentos = document.getElementById("listaDocumentos");
  const uploadInput = document.getElementById("arquivoDocumento");
  const tipoSelect = document.getElementById("tipoDocumento");
  const msg = document.getElementById("msgDocumento");
  const dragDrop = document.querySelector(".drag-drop");
  const modal = document.querySelector(".modal-preview");
  const modalContent = document.querySelector(".modal-preview-content");

  const session = JSON.parse(localStorage.getItem("session")) || null;

  const STORAGE_KEY = "documentos";

  // 1) Carrega do padrão novo
  let documentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // 2) Migra do padrão antigo (documentosCandidato -> documentos)
  const antigos = JSON.parse(localStorage.getItem("documentosCandidato")) || [];
  if (antigos.length) {
    const userId = session?.id ?? null;

    // Se o doc antigo não tinha userId, atribui ao usuário atual (se existir)
    const migrados = antigos.map((d) => ({
      ...d,
      userId: d.userId ?? userId,
      // garante id (pra poder excluir/baixar/preview sem depender de índice)
      id: d.id ?? (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
    }));

    // Mescla evitando duplicados (por id)
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

  function getDocsDoUsuario() {
    const userId = session?.id ?? null;
    // se não tem sessão, mostra nada (proteção extra)
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

    // ações
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
      <button class="modal-close">&times;</button>
      <h3>${doc.nome}</h3>
      <div>${previewHTML}</div>
    `;
    modal.style.display = "flex";

    const closeBtn = modalContent.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => window.fecharModal && window.fecharModal());
  };

  window.fecharModal = function () {
    if (modal) modal.style.display = "none";
  };

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
        setMsg(`Arquivo selecionado: ${file.name}`, "info");
      }
    });
  }

  function enviarDocumento() {
    const file = uploadInput?.files?.[0];
    const tipo = tipoSelect?.value;

    if (!file) {
      setMsg("Selecione um arquivo para enviar.", "error");
      return;
    }
    if (!tipo) {
      setMsg("Selecione o tipo de documento.", "error");
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
      uploadInput.value = "";
      return;
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

      setMsg("Documento enviado com sucesso!", "success");
      if (uploadInput) uploadInput.value = "";
      if (tipoSelect) tipoSelect.value = "";
    };

    reader.onerror = () => {
      setMsg("Erro ao ler o arquivo. Tente novamente.", "error");
    };

    reader.readAsDataURL(file);
  }

  // Botão enviar
  const btnEnviar = document.getElementById("btnEnviarDocumento");
  if (btnEnviar) btnEnviar.addEventListener("click", () => enviarDocumento());

  // Fecha modal clicando fora
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) window.fecharModal();
    });
  }

  // Init
  renderizar();
})();
