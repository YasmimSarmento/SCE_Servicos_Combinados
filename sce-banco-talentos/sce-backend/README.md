## **Restaurar o banco de dados PostgreSQL (Windows)**

O dump SQL do banco já está no projeto (`meu_banco.sql`). Cada desenvolvedor deve usar **seu próprio usuário e senha do PostgreSQL local**.

1. Criar o banco com o mesmo nome usado no dump (`SCE`):

```powershell
createdb -U SEU_USUARIO SCE
```

- Substitua `SEU_USUARIO` pelo usuário PostgreSQL local.
- Ele pedirá a senha do usuário local.

2. Restaurar o banco usando o dump:

```powershell
psql -U SEU_USUARIO -d SCE -f meu_banco.sql
```

- Também será solicitada a senha do usuário local.

---

## **Configurar variáveis de ambiente**

Crie um arquivo `.env` local (não enviado ao GitHub) baseado no `.env.example`.

> Substitua `SEU_USUARIO` e `SUA_SENHA` pelo usuário e senha PostgreSQL local.

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/SCE
PORT=3000
```

> `O .env.example` serve apenas como referência para cada dev preencher os dados corretos.

---

## **Instalar dependências**

```powershell
npm install
```

---

## **Rodar o projeto**

Acesse o pasta sce-backend

```powershell
npm run dev
```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida no `.env`).
