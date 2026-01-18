# SCE – Serviços Combinados de Escritório  
## Banco de Talentos (Frontend)

O **SCE – Banco de Talentos** é um sistema desenvolvido para conectar candidatos a oportunidades de emprego de forma **simples, rápida e organizada**.  
Nesta fase, o projeto está focado exclusivamente no **frontend**, estabelecendo uma base sólida, escalável e preparada para futuras integrações com backend e banco de dados.

---

## 🎯 Objetivo do Projeto

O sistema tem como principais objetivos:

- Facilitar o **cadastro de currículos**, com suporte a **upload de arquivos** e **links externos**;
- Exibir **vagas abertas** de forma clara, organizada e filtrável;
- Permitir o **detalhamento completo** de cada vaga;
- Criar um ambiente profissional para **triagem inicial de candidatos**;
- Servir futuramente como a **plataforma oficial da SCE** para gestão de talentos.

---

## 🏗️ Estrutura do Projeto

```text
/
├── index.html            # Página inicial
├── vagas.html            # Listagem de vagas disponíveis
├── cadastro.html         # Cadastro de candidatos (upload de arquivos e links)
├── detalhe-vaga.html     # Detalhes da vaga selecionada
│
├── css/
│   ├── style.css         # Arquivo principal que importa os demais estilos
│   ├── base.css          # Reset, variáveis globais, tipografia e cores
│   ├── layout.css        # Header, footer, grids e containers
│   ├── components.css   # Botões, cards, inputs e feedbacks
│   ├── responsive.css   # Responsividade global
│   └── pages/
│       ├── home.css
│       ├── vagas.css
│       ├── cadastro.css
│       └── detalhe-vaga.css
│
├── js/
│   ├── vagas.js          # Listagem e filtros de vagas
│   ├── cadastro.js       # Validação, envio de formulários e upload de arquivos
│   └── detalhe-vaga.js   # Renderização da vaga selecionada
│
└── img/
    ├── logo-sce.png      # Logotipo principal
    └── ...               # Outras imagens

```
## 🎨 Padrões Visuais

O sistema segue uma identidade visual **profissional e moderna**, alinhada ao posicionamento institucional da **SCE**.

### 🎯 Paleta de Cores

- **Verde escuro (`#1A3D2E`)**  
  Cor corporativa principal, utilizada em títulos, cabeçalhos e elementos de destaque.

- **Dourado fosco (`#C9A961`)**  
  Aplicado em botões, ações secundárias e efeitos *hover*.

- **Cinza claro (`#F5F5F5`)**  
  Fundo neutro para leitura, cards e seções.

- **Branco (`#FFFFFF`)**  
  Áreas principais, formulários e destaques de conteúdo.

### 📐 Outros Padrões Adotados

- Bordas arredondadas (4px–8px)
- Sombras suaves para profundidade visual
- Tipografia limpa com fontes *sans-serif*
- Layout responsivo e organizado

---

## 📌 Status do Desenvolvimento

### ✔ Funcionalidades Concluídas

- Estrutura completa de frontend
- CSS modularizado e organizado
- Responsividade global
- Páginas principais finalizadas
- Scripts revisados para:
  - Listagem e filtros de vagas
  - Cadastro de candidatos
  - Upload de arquivos e links
  - Histórico de candidaturas

### 🔄 Em Desenvolvimento Futuro

- Integração com backend
- Sistema de login do RH
- Dashboard administrativo
- Conexão com banco de dados (**SCE – Fase 2**)

---

## 🔄 Fluxo Atual do Sistema

1. O usuário acessa o site
2. Visualiza informações iniciais
3. Pode:
   - Cadastrar currículo (upload de arquivos e links)
   - Visualizar vagas disponíveis
   - Filtrar vagas por cidade ou palavra-chave
4. Ao clicar em uma vaga:
   - É direcionado para a página de detalhes

### 🔮 Fluxo Futuro Planejado

- O RH poderá cadastrar vagas
- Gerenciar candidatos
- Analisar currículos diretamente pela plataforma

---

## 🧪 Tecnologias Utilizadas

- **HTML5**
- **CSS3** (arquitetura modular)
- **JavaScript (ES6+)**
- **Responsividade mobile-first**
- **LocalStorage** para histórico de candidaturas
- Arquitetura preparada para integração com backend

---

## 🚀 Como Executar o Projeto

Não é necessário instalar dependências.

### Opção 1 – Execução Direta

Abra qualquer arquivo `.html` diretamente no navegador.

**Exemplo:**
```text
index.html
```
### Opção 2 – Servidor Local (Recomendado)

Utilize a extensão **Live Server** no **VS Code**.

---

## 📂 Histórico de Candidaturas

O sistema registra localmente todas as candidaturas realizadas, exibindo:

- Nome do candidato
- Área de interesse
- Data e hora do envio
- Link do currículo (quando informado)
- Arquivos enviados (listagem de nomes)

---

## 💼 Melhorias Planejadas

- Autenticação do RH
- Área administrativa completa:
  - Cadastro e edição de vagas
  - Banco de currículos com download de arquivos
  - Exportação de currículos em PDF
- Painel de indicadores (*dashboard*)
- Integração com API ou banco de dados
- Hospedagem oficial do sistema

---

## 🤝 Contribuição

Este projeto está em desenvolvimento contínuo.  
Sugestões, melhorias e contribuições são sempre bem-vindas.
