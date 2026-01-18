(() => {

  function carregarBanco() {
      let banco = JSON.parse(localStorage.getItem("bancoTalentos") || "[]");
      if(!banco.length){
          banco.push({
              nome: "Candidato Teste",
              email: "teste@teste.com",
              telefone: "99999-9999",
              dataNascimento: "",
              documento: "",
              endereco: { rua:"", numero:"", bairro:"", cidade:"", estado:"", cep:"" },
              areaInteresse: "",
              cargoDesejado: "",
              nivelExperiencia: "",
              habilidades: "",
              resumo: "",
              documentos: [],
              candidaturas: [
                  { vaga: "Banco de Talentos 2025", data: new Date().toLocaleDateString("pt-BR"), status: "Em análise" }
              ],
              notificacoes: [
                  { texto: "Bem-vindo ao Banco de Talentos!", data: new Date().toLocaleDateString("pt-BR") }
              ]
          });
          localStorage.setItem("bancoTalentos", JSON.stringify(banco));
      }
      return banco;
  }

  // Calcula pontuação do perfil
  function calcularPontuacao(user){
      let pontos = 0;
      // Informações básicas
      if(user.nome && user.email && user.telefone) pontos += 20;
      // Endereço completo
      if(user.endereco.rua && user.endereco.numero && user.endereco.bairro && user.endereco.cidade && user.endereco.estado && user.endereco.cep) pontos += 20;
      // Área de interesse e objetivo
      if(user.areaInteresse && user.cargoDesejado && user.nivelExperiencia) pontos += 20;
      // Habilidades e resumo
      if(user.habilidades && user.resumo) pontos += 20;
      // Documentos
      if(user.documentos.length) pontos += 20;

      return pontos + "%";
  }

  function listarStatus(user){
      const lista = document.getElementById("listaStatus");
      lista.innerHTML = "";
      if(!user.candidaturas.length){
          lista.innerHTML = `<li class="status-item">Nenhuma candidatura registrada.</li>`;
          return;
      }
      user.candidaturas.forEach(c=>{
          const li = document.createElement("li");
          li.className = "status-item";
          li.innerHTML = `
              <div class="status-info">
                  <strong>${c.vaga}</strong>
                  <span>${c.data}</span>
              </div>
              <span class="badge ${c.status==="Aprovado"?"badge-success":c.status==="Reprovado"?"badge-danger":"badge-warning"}">${c.status}</span>
          `;
          lista.appendChild(li);
      });
  }

  function carregarDashboard(){
      const banco = carregarBanco();
      const user = banco[banco.length-1];

      document.getElementById("userNome").textContent = user.nome.split(" ")[0];
      document.getElementById("countVagas").textContent = user.candidaturas.length;
      document.getElementById("pontuacao").textContent = calcularPontuacao(user);
      document.getElementById("qtdNotificacoes").textContent = user.notificacoes.length;

      listarStatus(user);
  }

  carregarDashboard();

})();
