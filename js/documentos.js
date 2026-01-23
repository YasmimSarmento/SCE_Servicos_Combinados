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
      id: d.id ?? (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))
    }));

    // Junta sem perder o que já existe no novo formato
    documentos = [...documentos, ...migrados];

    // Salva no novo padrão e remove o antigo
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos));
    localStorage.removeItem("documentosCandidato");
  }

  // ===== SALVAR NO LOCALSTORAGE =====
  function salvarDocumentos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos));
  }

  // ===== CLASSE BADGE =====
  function statusClass(status) {
    switch ((status || "").toLowerCase()) {
      case "aprovado":
        return "aprovado";
      case "em análise":
        return "pendente";
      case "rejeitado":
        return "rejeitado";
      default:
        return "pendente";
    }
  }

  // ===== CARREGAR DOCUMENTOS =====
  function carregarDocumentos() {
    if (!listaDocumentos) return;

    listaDocumentos.innerHTML = "";

    const meusDocs = session?.id
      ? documentos.filter((d) => d.userId === session.id)
      : documentos;

    if (meusDocs.length === 0) {
      listaDocumentos.innerHTML = `<li class="status-item">Nenhum documento enviado até o momento.</li>`;
      return;
    }

    meusDocs.forEach((doc) => {
      const li = document.createElement("li");
      li.className = "documento-item";

      const ext = (doc.nome || "").split(".").pop().toLowerCase();
      let icon = "fa-file";
      if (ext === "pdf") icon = "fa-file-pdf";
      else if (["jpg", "jpeg", "png", "gif"].includes(ext)) icon = "fa-file-image";
      else if (["doc", "docx"].includes(ext)) icon = "fa-file-word";
      else if (["xls", "xlsx"].includes(ext)) icon = "fa-file-excel";

      // ID único (não depende de índice)
      const docId = doc.id ?? (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
      doc.id = docId; // garante que fica persistido

      li.innerHTML = `
        <div class="documento-info">
          <i class="fa-solid ${icon}"></i>
          <div>
            <strong>${doc.tipo || "Documento"}</strong>
            <span>${doc.nome || "Arquivo"} • ${doc.data || ""}</span>
          </div>
        </div>
        <div class="documento-actions">
          <span class="badge ${statusClass(doc.status)}">${doc.status || "Em análise"}</span>
          <button class="btn-preview" title="Visualizar" onclick="visualizarDocumento('${docId}')">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-download" title="Download" onclick="downloadDocumento('${docId}')">
            <i class="fa-solid fa-download"></i>
          </button>
          <button class="btn-excluir" title="Excluir" onclick="excluirDocumento('${docId}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      listaDocumentos.appendChild(li);
    });

    // Se criamos ids durante a renderização, persistimos pra evitar inconsistência
    salvarDocumentos();
  }

  // ===== ENVIAR DOCUMENTO =====
  async function enviarDocumento(files) {
    if (!msg) return;

    msg.textContent = "";
    msg.className = "msg-sucesso";

    const arquivos = files || (uploadInput ? uploadInput.files : null);

    if (!tipoSelect?.value || !arquivos || arquivos.length === 0) {
      msg.textContent = "Preencha todos os campos antes de enviar.";
      msg.classList.add("error");
      return;
    }

    for (const file of arquivos) {
      const base64 = await lerArquivoBase64(file);

      documentos.push({
        id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        userId: session?.id ?? null,
        tipo: tipoSelect.value,
        nome: file.name,
        data: new Date().toLocaleDateString("pt-BR"),
        status: "Em análise",
        base64: base64
      });
    }

    salvarDocumentos();
    carregarDocumentos();

    msg.textContent = "Documento(s) enviado(s) com sucesso!";
    msg.classList.add("success");

    if (tipoSelect) tipoSelect.value = "";
    if (uploadInput) uploadInput.value = "";
  }

  // ===== FUNÇÃO AUXILIAR PARA LER ARQUIVO =====
  function lerArquivoBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // ===== DOWNLOAD REAL =====
  window.downloadDocumento = function (id) {
    const doc = documentos.find((d) => d.id === id);
    if (!doc) return;

    const link = document.createElement("a");
    link.href = doc.base64;
    link.download = doc.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ===== EXCLUIR DOCUMENTO =====
  window.excluirDocumento = function (id) {
    const idx = documentos.findIndex((d) => d.id === id);
    if (idx === -1) return;

    if (confirm(`Deseja realmente excluir "${documentos[idx].nome}"?`)) {
      documentos.splice(idx, 1);
      salvarDocumentos();
      carregarDocumentos();
    }
  };

  // ===== VISUALIZAR DOCUMENTO =====
  window.visualizarDocumento = function (id) {
    const doc = documentos.find((d) => d.id === id);
    if (!doc || !modal || !modalContent) return;

    const ext = (doc.nome || "").split(".").pop().toLowerCase();
    let previewHTML = "";
    if (ext === "pdf")
      previewHTML = `<iframe src="${doc.base64}" style="width:100%;height:70vh;border:none;"></iframe>`;
    else if (["jpg", "jpeg", "png", "gif"].includes(ext))
      previewHTML = `<img src="${doc.base64}" alt="${doc.nome}" style="max-height:70vh;">`;
    else previewHTML = `<p>Não é possível visualizar este tipo de arquivo.</p>`;

    modalContent.innerHTML = `
      <button class="modal-close">&times;</button>
      <h3>${doc.nome}</h3>
      <div>${previewHTML}</div>
    `;
    modal.style.display = "flex";

    const closeBtn = modalContent.querySelector(".modal-close");
    closeBtn.addEventListener("click", fecharModal);
  };

  window.fecharModal = function () {
    if (modal) modal.style.display = "none";
  };

  // ===== DRAG & DROP =====
  if (dragDrop) {
    // Permite clicar na área para escolher arquivos (input está hidden no CSS)
    dragDrop.addEventListener("click", () => uploadInput && uploadInput.click());

    // Acessibilidade básica: Enter/Espaço também abre o seletor
    dragDrop.setAttribute("tabindex", "0");
    dragDrop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        uploadInput && uploadInput.click();
      }
    });

    dragDrop.addEventListener("dragover", (e) => {
      e.preventDefault();
      dragDrop.classList.add("drag-over");
    });

    dragDrop.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dragDrop.classList.remove("drag-over");
    });

    dragDrop.addEventListener("drop", (e) => {
      e.preventDefault();
      dragDrop.classList.remove("drag-over");
      enviarDocumento(e.dataTransfer.files);
    });
  }

  // ===== BOTÃO ENVIAR =====
  if (uploadInput) {
    const btnEnviar = document.querySelector(".btn-full");
    if (btnEnviar) btnEnviar.addEventListener("click", () => enviarDocumento());
  }

  carregarDocumentos();
})();
