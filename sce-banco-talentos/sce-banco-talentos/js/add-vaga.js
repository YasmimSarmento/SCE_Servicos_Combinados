const form = document.getElementById("form-vaga");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const vaga = {
    titulo: document.getElementById("titulo").value,
    local: document.getElementById("local").value,
    tipo: document.getElementById("tipo").value,
    descricao: document.getElementById("descricao").value,
  };

  try {
    const resposta = await fetch("http://localhost:3000/vagas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vaga),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao enviar");
    }

    msg.textContent = "Vaga publicada com sucesso!";
    msg.style.color = "green";
    form.reset();
  } catch (err) {
    msg.textContent = "Erro ao publicar vaga.";
    msg.style.color = "red";
  }
});
