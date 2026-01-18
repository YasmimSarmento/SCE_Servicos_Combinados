(() => {

  // ===============================
  // FUNÇÕES AUXILIARES
  // ===============================
  function carregarBanco() {
      let banco = JSON.parse(localStorage.getItem("bancoTalentos") || "[]");
      if(!banco.length){
          banco.push({
              nome: "Candidato Teste",
              email: "teste@teste.com",
              telefone: "99999-9999",
              dataNascimento: "",
              documento: "",
              foto: "imagem/avatar.png",
              endereco: { rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" },
              areaInteresse: "",
              cargoDesejado: "",
              nivelExperiencia: "",
              habilidades: "",
              resumo: "",
              documentos: [],
              candidaturas: [],
              notificacoes: []
          });
          localStorage.setItem("bancoTalentos", JSON.stringify(banco));
      }
      return banco;
  }

  function getUsuarioAtual() {
      const banco = carregarBanco();
      return banco[banco.length-1];
  }

  // ===============================
  // ATUALIZAÇÃO DO TOPO E BARRA DE PROGRESSO
  // ===============================
  function atualizarTopo(user) {
      // Informações do topo
      document.getElementById("userNomeTopo").textContent = user.nome.split(" ")[0] || "Candidato";
      document.getElementById("areaResumo").textContent = user.areaInteresse || "---";
      document.getElementById("cargoResumo").textContent = user.cargoDesejado || "---";
      document.getElementById("fotoUsuario").src = user.foto || "imagem/avatar.png";

      // Campos obrigatórios para progresso
      const campos = [
          user.nome, user.email, user.telefone, user.dataNascimento, user.documento,
          user.endereco.rua, user.endereco.numero, user.endereco.bairro, user.endereco.cidade,
          user.endereco.estado, user.endereco.cep, user.areaInteresse, user.cargoDesejado,
          user.nivelExperiencia, user.habilidades, user.resumo
      ];

      // Contar preenchidos
      let preenchidos = campos.filter(c => c && c.trim() !== "").length;
      let percentual = Math.round((preenchidos / campos.length) * 100);

      // Atualizar barra e texto
      const barra = document.getElementById("barraProgresso");
      const texto = document.getElementById("percentualProgresso");
      if(barra) barra.style.width = percentual + "%";
      if(texto) texto.textContent = percentual + "% Completo";
  }

  // ===============================
  // PREENCHER CAMPOS DO FORMULÁRIO
  // ===============================
  function preencherCampos(user) {
      document.getElementById("userNomeCompleto").value = user.nome || "";
      document.getElementById("userEmail").value = user.email || "";
      document.getElementById("userTelefone").value = user.telefone || "";
      document.getElementById("userDataNascimento").value = user.dataNascimento || "";
      document.getElementById("userDocumento").value = user.documento || "";

      document.getElementById("userRua").value = user.endereco.rua || "";
      document.getElementById("userNumero").value = user.endereco.numero || "";
      document.getElementById("userBairro").value = user.endereco.bairro || "";
      document.getElementById("userCidade").value = user.endereco.cidade || "";
      document.getElementById("userEstado").value = user.endereco.estado || "";
      document.getElementById("userCEP").value = user.endereco.cep || "";

      document.getElementById("areaInteresse").value = user.areaInteresse || "";
      document.getElementById("cargoDesejado").value = user.cargoDesejado || "";
      document.getElementById("nivelExperiencia").value = user.nivelExperiencia || "";
      document.getElementById("habilidades").value = user.habilidades || "";
      document.getElementById("resumoProfissional").value = user.resumo || "";

      atualizarTopo(user);
  }

  // ===============================
  // SALVAR PERFIL
  // ===============================
  function salvarPerfil() {
      const banco = carregarBanco();
      const user = banco[banco.length-1];

      // Atualizar dados
      user.nome = document.getElementById("userNomeCompleto").value.trim();
      user.email = document.getElementById("userEmail").value.trim();
      user.telefone = document.getElementById("userTelefone").value.trim();
      user.dataNascimento = document.getElementById("userDataNascimento").value;
      user.documento = document.getElementById("userDocumento").value.trim();

      user.endereco.rua = document.getElementById("userRua").value.trim();
      user.endereco.numero = document.getElementById("userNumero").value.trim();
      user.endereco.bairro = document.getElementById("userBairro").value.trim();
      user.endereco.cidade = document.getElementById("userCidade").value.trim();
      user.endereco.estado = document.getElementById("userEstado").value.trim();
      user.endereco.cep = document.getElementById("userCEP").value.trim();

      user.areaInteresse = document.getElementById("areaInteresse").value;
      user.cargoDesejado = document.getElementById("cargoDesejado").value.trim();
      user.nivelExperiencia = document.getElementById("nivelExperiencia").value;
      user.habilidades = document.getElementById("habilidades").value.trim();
      user.resumo = document.getElementById("resumoProfissional").value.trim();

      localStorage.setItem("bancoTalentos", JSON.stringify(banco));

      const msg = document.getElementById("msgPerfil");
      msg.textContent = "Perfil atualizado com sucesso!";
      msg.className = "msg-sucesso success";

      preencherCampos(user); // Atualiza topo e barra
      setTimeout(()=> msg.textContent = "", 3000);
  }

  // ===============================
  // UPLOAD DE FOTO
  // ===============================
  const uploadFoto = document.getElementById("uploadFoto");
  uploadFoto.addEventListener("change", e => {
      const file = e.target.files[0];
      if(file){
          const reader = new FileReader();
          reader.onload = function(ev){
              const user = getUsuarioAtual();
              user.foto = ev.target.result;
              document.getElementById("fotoUsuario").src = ev.target.result;
              localStorage.setItem("bancoTalentos", JSON.stringify(carregarBanco()));
          }
          reader.readAsDataURL(file);
          atualizarTopo(getUsuarioAtual());
      }
  });

  // ===============================
  // ATUALIZAÇÃO AO DIGITAR (BARRA DE PROGRESSO EM TEMPO REAL)
  // ===============================
  const camposInputs = document.querySelectorAll(
      "#userNomeCompleto, #userEmail, #userTelefone, #userDataNascimento, #userDocumento," +
      "#userRua, #userNumero, #userBairro, #userCidade, #userEstado, #userCEP," +
      "#areaInteresse, #cargoDesejado, #nivelExperiencia, #habilidades, #resumoProfissional"
  );

  camposInputs.forEach(input => {
      input.addEventListener("input", () => {
          const user = getUsuarioAtual();
          atualizarTopo(user);
      });
  });

  // ===============================
  // INICIALIZAÇÃO
  // ===============================
  document.getElementById("btnSalvar").addEventListener("click", salvarPerfil);
  preencherCampos(getUsuarioAtual());

})();
