# SCE – Serviços Combinados de Escritório
## Banco de Talentos (Frontend)

O **SCE – Banco de Talentos** é uma aplicação frontend desenvolvida para conectar **candidatos** e **empresas** de forma organizada, moderna e profissional.  
O projeto estabelece uma base sólida para futura integração com backend, autenticação real e banco de dados.

---

## 🎯 Objetivo do Projeto

- Centralizar o **cadastro de currículos** e perfis profissionais;
- Exibir **vagas de emprego** com filtros e detalhamento completo;
- Oferecer **painéis separados** para candidatos e empresas;
- Organizar documentos, perfis e histórico de interações;
- Servir como base oficial do sistema de talentos da **SCE**.

---

## 🏗️ Estrutura Real do Projeto

```text
/
├── index.html                  # Página inicial
├── vagas.html                  # Listagem de vagas
├── detalhe-vaga.html           # Detalhes da vaga
├── cadastro.html               # Cadastro de candidato
├── documentos.html             # Upload e gestão de documentos
├── perfil.html                 # Perfil do candidato
│
├── login-candidato.html        # Login do candidato
├── login-empresa.html          # Login da empresa
├── painel-candidato.html       # Painel do candidato
├── painel-empresa.html         # Painel da empresa
├── recuperar-senha.html        # Recuperação de senha
│
├── css/
│   ├── style.css               # Arquivo principal de estilos
│   ├── base.css                # Reset, variáveis e tipografia
│   ├── layout.css              # Estrutura e layout global
│   ├── components.css          # Componentes reutilizáveis
│   ├── responsive.css          # Responsividade global
│   └── pages/                  # Estilos específicos por página
│       ├── home.css
│       ├── vagas.css
│       ├── cadastro.css
│       ├── detalhe-vaga.css
│       ├── login.css
│       ├── painel.css
│       ├── dashboard-candidato.css
│       ├── perfil.css
│       └── documentos.css
│
├── js/
│   ├── cadastro.js              # Validação e envio de cadastro
│   ├── documentos.js            # Gestão de documentos
│   ├── login.js                 # Autenticação simulada
│   ├── perfil.js                # Dados do perfil
│   ├── recuperar.js             # Recuperação de senha
│   │
│   ├── core/                    # Scripts centrais do sistema
│   │   ├── auth.js
│   │   ├── nav-auth.js
│   │   ├── sidebar.js
│   │   └── theme.js
│   │
│   └── pages/                   # Scripts específicos
│       ├── home.js
│       ├── vagas.js
│       ├── detalhe-vaga.js
│       └── painel/
│           └── candidato.js
│
├── imagem/
│   └── logo c&s.png             # Logotipo do sistema
│
└── README.md
```

---

## 🎨 Padrões Visuais

- Interface **limpa, moderna e institucional**
- Layout responsivo (desktop, tablet e mobile)
- CSS modularizado por responsabilidade
- Uso de animações suaves e microinterações

---

## 📌 Funcionalidades Implementadas

### 👤 Candidato
- Cadastro completo
- Upload e gerenciamento de documentos
- Visualização e candidatura a vagas
- Painel do candidato
- Perfil editável
- Histórico salvo em LocalStorage

### 🏢 Empresa
- Login dedicado
- Painel institucional (estrutura preparada)
- Base pronta para futura gestão de vagas

### 🔐 Autenticação
- Login simulado por tipo de usuário
- Controle de navegação autenticada
- Estrutura pronta para backend real

---

## 🧪 Tecnologias Utilizadas

- HTML5
- CSS3 (arquitetura modular)
- JavaScript ES6+
- LocalStorage
- Mobile-first
- Estrutura escalável

---

## 🚀 Execução do Projeto

### Execução direta
Abra qualquer arquivo `.html` no navegador.

### Servidor local (recomendado)
Utilize **Live Server** no VS Code.

---

## 🔮 Próximas Evoluções

- Backend (API)
- Autenticação real (JWT / Firebase / Node)
- Banco de dados
- Dashboard administrativo
- Exportação de currículos
- Publicação oficial

---

## 🤝 Contribuição

Projeto em evolução contínua.  
Sugestões e melhorias são bem-vindas.
