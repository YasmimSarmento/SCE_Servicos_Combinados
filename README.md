SCE - Serviços Combinados de Escritório

O SCE Banco de Talentos é um sistema voltado para conectar candidatos a oportunidades de emprego de forma simples, rápida e organizada.
O projeto está sendo desenvolvido inicialmente com foco no frontend, garantindo uma base sólida para futuras integrações com backend.

🚀 Objetivo do Projeto

O sistema tem como missão:

Facilitar o cadastro de currículos (agora com upload de arquivos e links).

Exibir vagas abertas de forma clara e filtrável.

Permitir detalhamento completo de cada vaga.

Criar um ambiente profissional e rápido para triagem de candidatos.

Servir futuramente como plataforma oficial da SCE para gestão de talentos.

🏗 Estrutura Atual do Projeto

/ (raiz)
│
├── index.html → Página inicial
├── vagas.html → Lista de vagas disponíveis
├── cadastro.html → Formulário de cadastro de candidatos (com upload de arquivos e links)
├── detalhe-vaga.html → Página de detalhes de cada vaga
│
├── css/
│ ├── style.css → Arquivo que importa TODOS os demais
│ ├── base.css → Reset, variáveis, tipografia, cores
│ ├── layout.css → Header, footer, containers, grids
│ ├── components.css → Botões, cards, inputs, feedbacks
│ ├── responsive.css → Responsividade global
│ └── pages/
│ ├── home.css → Estilos da página inicial
│ ├── vagas.css → Estilos da lista de vagas
│ ├── cadastro.css → Estilos do formulário de cadastro (upload incluído)
│ └── detalhe-vaga.css → Estilos da página de detalhes da vaga
│
├── js/
│ ├── vagas.js → Listagem e filtros de vagas
│ ├── cadastro.js → Validação, envio de formulários, upload de arquivos e histórico de candidaturas
│ └── detalhe-vaga.js → Renderização da vaga selecionada
│
└── img/
├── logo-sce.png → Logotipo principal
└── (...outras imagens)

🎨 Padrões Visuais

O sistema segue uma identidade visual profissional e moderna:

Verde escuro (#1A3D2E) – cor corporativa principal, usada em cabeçalhos, títulos e elementos de destaque.

Dourado fosco (#C9A961) – ações, botões secundários e hover.

Cinza claro (#F5F5F5) – fundo neutro para leitura, cards e seções.

Branco (#FFFFFF) – áreas principais, formulários e destaques de conteúdo.

Layout com bordas arredondadas (4px–8px), sombras suaves para profundidade e tipografia limpa com fontes sans-serif.

📌 Status do Desenvolvimento

Estrutura completa de frontend

Divisão modular de CSS

Responsividade global criada

Páginas principais prontas

Scripts revisados para vagas e cadastro (upload de arquivos + links, histórico de candidaturas)

Integração com backend (futuro)

Sistema de login do RH

Dashboard administrativo

Conexão com banco de dados (SCE – Fase 2)

📂 Fluxo Atual do Sistema

Usuário acessa o site

Visualiza informações iniciais sobre o projeto

Pode:

Cadastrar currículo (upload de arquivos e links)

Ver lista de vagas

Filtrar por cidade ou palavra-chave

Ao clicar em uma vaga:

Vai para a página de detalhes

No futuro:

RH poderá cadastrar vagas e gerenciar candidatos

🧪 Tecnologias Usadas

HTML5

CSS3 modularizado

JavaScript (ES6+)

Responsividade mobile-first

LocalStorage para histórico de candidaturas

Arquitetura escalável para integração futura com backend

💼 Futuras Melhorias Planejadas

Autenticação do RH

Área administrativa completa:

Cadastro de vagas

Edição de vagas

Banco de currículos (com download de arquivos)

Exportação de currículos em PDF

Painel com indicadores (dashboard)

API ou integração com banco de dados

Hospedagem oficial do sistema

📎 Como rodar o projeto

Não precisa instalar nada.
Basta abrir qualquer arquivo .html no navegador.

Exemplo:

Abra o arquivo: index.html

Se preferir usar um servidor local (recomendado):

VSCode → Live Server

📂 Histórico de Candidaturas

Agora o cadastro de currículos permite arquivos e links, e todas as candidaturas são listadas na página de cadastro, incluindo:

Nome do candidato

Área de interesse

Data/hora de envio

Link do currículo (quando fornecido)

Arquivos enviados (nomes listados)

🤝 Contribuição

Este projeto está em desenvolvimento contínuo.
Sugestões e melhorias são sempre bem-vindas.

📜 Licença

Uso interno autorizado para o projeto SCE – Banco de Talentos.
