(() => {
  const listaDocumentos = document.getElementById("listaDocumentos");
  const uploadInput = document.getElementById("arquivoDocumento");
  const tipoSelect = document.getElementById("tipoDocumento");
  const msg = document.getElementById("msgDocumento");
  const dragDrop = document.querySelector(".drag-drop");
  const modal = document.querySelector(".modal-preview");
  const modalContent = document.querySelector(".modal-preview-content");

  let documentos = JSON.parse(localStorage.getItem("documentosCandidato")) || [];

  // ===== SALVAR NO LOCALSTORAGE =====
  function salvarDocumentos() {
    localStorage.setItem("documentosCandidato", JSON.stringify(documentos));
  }

  // ===== CLASSE BADGE =====
  function statusClass(status) {
    switch (status.toLowerCase()) {
      case "aprovado": return "aprovado";
      case "em análise": return "pendente";
      case "rejeitado": return "rejeitado";
      default: return "pendente";
    }
  }

  // ===== CARREGAR DOCUMENTOS =====
  function carregarDocumentos() {
    listaDocumentos.innerHTML = "";

    if (documentos.length === 0) {
      listaDocumentos.innerHTML = `<li class="status-item">Nenhum documento enviado até o momento.</li>`;
      return;
    }

    documentos.forEach((doc, index) => {
      const li = document.createElement("li");
      li.className = "documento-item";

      const ext = doc.nome.split('.').pop().toLowerCase();
      let icon = "fa-file";
      if (ext === "pdf") icon = "fa-file-pdf";
      else if (["jpg","jpeg","png","gif"].includes(ext)) icon = "fa-file-image";
      else if (["doc","docx"].includes(ext)) icon = "fa-file-word";
      else if (["xls","xlsx"].includes(ext)) icon = "fa-file-excel";

      li.innerHTML = `
        <div class="documento-info">
          <i class="fa-solid ${icon}"></i>
          <div>
            <strong>${doc.tipo}</strong>
            <span>${doc.nome} • ${doc.data}</span>
          </div>
        </div>
        <div class="documento-actions">
          <span class="badge ${statusClass(doc.status)}">${doc.status}</span>
          <button class="btn-preview" title="Visualizar" onclick="visualizarDocumento(${index})">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-download" title="Download" onclick="downloadDocumento(${index})">
            <i class="fa-solid fa-download"></i>
          </button>
          <button class="btn-excluir" title="Excluir" onclick="excluirDocumento(${index})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      listaDocumentos.appendChild(li);
    });
  }

  // ===== ENVIAR DOCUMENTO =====
  async function enviarDocumento(files) {
    msg.textContent = "";
    msg.className = "msg-sucesso";

    const arquivos = files || uploadInput.files;

    if (!tipoSelect.value || arquivos.length === 0) {
      msg.textContent = "Preencha todos os campos antes de enviar.";
      msg.classList.add("error");
      return;
    }

    for (const file of arquivos) {
      const base64 = await lerArquivoBase64(file);
      documentos.push({
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

    tipoSelect.value = "";
    uploadInput.value = "";
  }

  // ===== FUNÇÃO AUXILIAR PARA LER ARQUIVO =====
  function lerArquivoBase64(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // ===== DOWNLOAD REAL =====
  window.downloadDocumento = function(index) {
    const doc = documentos[index];
    const link = document.createElement("a");
    link.href = doc.base64;
    link.download = doc.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ===== EXCLUIR DOCUMENTO =====
  window.excluirDocumento = function(index) {
    if (confirm(`Deseja realmente excluir "${documentos[index].nome}"?`)) {
      documentos.splice(index, 1);
      salvarDocumentos();
      carregarDocumentos();
    }
  };

  // ===== VISUALIZAR DOCUMENTO =====
  window.visualizarDocumento = function(index) {
    const doc = documentos[index];
    if(!modal || !modalContent) return;

    const ext = doc.nome.split('.').pop().toLowerCase();
    let previewHTML = "";
    if (ext === "pdf") previewHTML = `<iframe src="${doc.base64}" style="width:100%;height:70vh;border:none;"></iframe>`;
    else if (["jpg","jpeg","png","gif"].includes(ext)) previewHTML = `<img src="${doc.base64}" alt="${doc.nome}" style="max-height:70vh;">`;
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

  window.fecharModal = function() {
    if(modal) modal.style.display = "none";
  };

  // ===== DRAG & DROP =====
  if(dragDrop){
    dragDrop.addEventListener("dragover", e => {
      e.preventDefault();
      dragDrop.classList.add("drag-over");
    });
    dragDrop.addEventListener("dragleave", e => {
      e.preventDefault();
      dragDrop.classList.remove("drag-over");
    });
    dragDrop.addEventListener("drop", e => {
      e.preventDefault();
      dragDrop.classList.remove("drag-over");
      enviarDocumento(e.dataTransfer.files);
    });
  }

  // ===== BOTÃO ENVIAR =====
  if(uploadInput){
    const btnEnviar = document.querySelector(".btn-full");
    btnEnviar.addEventListener("click", () => enviarDocumento());
  }

  carregarDocumentos();
})();
