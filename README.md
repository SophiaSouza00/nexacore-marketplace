# NexaCore — Loja Virtual de Informática & Hardware

> Projeto acadêmico de desenvolvimento full-stack para e-commerce especializado em informática, peças de computador, periféricos e tecnologia de alto desempenho.

---

## 💻 Sobre a NexaCore

A **NexaCore** é uma plataforma moderna de comércio eletrônico projetada com foco em integridade transacional, arquitetura limpa, segurança rigorosa e experiência de usuário responsiva.

### Principais Destaques:
- **Catálogo Inteligente:** Navegação intuitiva por categorias de informática, busca em tempo real e visualização detalhada de especificações de hardware.
- **Carrinho e Checkout Confiáveis:** Controle rigoroso de estoque e cálculos de preços executados no servidor, impedindo manipulações pelo cliente.
- **Painel Administrativo Completo:** Gestão de produtos, controle de estoque, visualização de pedidos, atualização de status e acompanhamento de métricas de vendas.
- **Segurança de Nível Profissional:** Autenticação protegida com hash seguro de senhas (`bcryptjs`), cookies `HttpOnly`, prevenção de ataques IDOR e ausência total de credenciais no repositório.

---

## 🛠️ Tecnologias Utilizadas

- **Framework Web:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estática estrita)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (Compatível com Neon, Supabase e instâncias locais)
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **Validação de Dados:** [Zod](https://zod.dev/)
- **Segurança e Criptografia:** [bcryptjs](https://github.com/dcodeIO/bcrypt.js) e [jose](https://github.com/panva/jose)
- **Ícones:** [Lucide React](https://lucide.dev/)

---

## 📁 Estrutura do Projeto

```text
NexaCore/
├── .env.example              # Modelo seguro das variáveis de ambiente
├── .gitignore                # Regras de exclusão de arquivos privados/sensíveis
├── README.md                 # Documentação principal
├── spec.md                   # Especificação técnica do sistema
├── package.json              # Metadados e dependências
├── tsconfig.json             # Configuração do TypeScript
├── prisma/
│   ├── schema.prisma         # Esquema do banco de dados (tabelas, índices, enums)
│   ├── migrations/           # Migrações versionadas do PostgreSQL
│   └── seed.ts               # Carga inicial (Admin padrão e categorias)
└── src/
    ├── app/                  # Rotas e páginas (App Router)
    │   ├── layout.tsx        # Layout raiz com identidade visual da NexaCore
    │   ├── page.tsx          # Página inicial (vitrine e destaques)
    │   ├── catalogo/         # Catálogo com busca e filtros
    │   ├── produto/[slug]/   # Página de detalhes do produto
    │   ├── carrinho/         # Carrinho de compras
    │   ├── checkout/         # Finalização de compra
    │   ├── pedidos/          # Histórico de pedidos do cliente
    │   ├── login/            # Autenticação de usuários
    │   ├── cadastro/         # Registro de novos clientes
    │   └── admin/            # Painel administrativo protegido
    ├── components/           # Componentes modulares reutilizáveis
    ├── lib/                  # Conexão com banco, autenticação e formatadores BR
    └── types/                # Definições de tipos TypeScript compartilhados
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js:** Versão 20 ou superior (recomendado 22+)
- **npm:** Versão 10 ou superior
- **Git**
- Uma instância de banco de dados PostgreSQL (ex: conta gratuita no [Neon](https://neon.tech) ou PostgreSQL local)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SophiaSouza00/NexaCore.git
   cd NexaCore
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` criando um arquivo chamado `.env`:
   ```bash
   cp .env.example .env
   ```
   Preencha o valor de `DATABASE_URL` com a string de conexão do seu banco PostgreSQL.

4. **Execute as migrações do banco de dados:**
   ```bash
   npx prisma migrate dev
   ```

5. **Popule o banco com dados iniciais (Seed):**
   ```bash
   npx prisma db seed
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a loja em: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Scripts Disponíveis

- `npm run dev`: Inicia o servidor local em modo de desenvolvimento.
- `npm run build`: Compila a aplicação para produção e verifica integridade dos tipos.
- `npm run start`: Inicia o servidor em modo de produção após o build.
- `npm run lint`: Executa a verificação de código e boas práticas com ESLint.

---

## 📄 Licença
Projeto desenvolvido exclusivamente para fins acadêmicos e educacionais.
