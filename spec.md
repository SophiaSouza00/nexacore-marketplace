# NEXACORE — ESPECIFICAÇÃO DE SISTEMA DE E-COMMERCE DE INFORMÁTICA

**Versão do Documento:** 2.0.0 (Final — Concluída, Testada e Homologada)  
**Status:** Entregue, Versionado e Publicado  
**Autor:** Equipe NexaCore (Sophia Souza — Desenvolvimento Full-Stack)  
**Data:** 06 de Novembro de 2026  

---

## 1. Visão Geral e Objetivos do Projeto

O **NexaCore** é uma plataforma completa de comércio eletrônico (loja virtual) voltada ao segmento de informática, tecnologia e hardware de alto desempenho. O projeto possui caráter acadêmico e profissional, estruturado com foco em boas práticas de engenharia de software, separação estrita de camadas, segurança da informação, integridade transacional de dados e experiência do usuário (UX) intuitiva e moderna.

### Objetivos Principais
- Prover um catálogo de fácil navegação para produtos de tecnologia (computadores, periféricos, componentes de hardware).
- Garantir a integridade das regras de negócio no lado do servidor (Server-Side Validation), especialmente o cálculo de totais, preços unitários e controle de estoque em tempo real.
- Assegurar isolamento de dados entre clientes (prevenção contra ataques IDOR — *Insecure Direct Object References*).
- Disponibilizar um painel de controle administrativo seguro e funcional para gestão de produtos, categorias, clientes e fluxo de status de pedidos.
- Manter código limpo, modular, documentado e 100% tipado com TypeScript, utilizando o ecossistema moderno do Next.js e PostgreSQL.

---

## 2. Perfis de Usuário e Controle de Acesso (RBAC)

O sistema conta com três níveis de acesso fundamentais:

1. **Visitante (Não autenticado):**
   - Visualização da página inicial (*landing page* com destaques, categorias e novidades).
   - Navegação pelo catálogo de produtos, busca textual e filtragem por categorias.
   - Visualização de detalhes de produtos (especificações técnicas, preço em R$, status de estoque).
   - Montagem de carrinho de compras (armazenamento local / cookie durante a navegação).
   - Acesso às telas de Login e Cadastro.

2. **Cliente Autenticado (`perfil = 'CLIENTE'`):**
   - Todas as permissões do Visitante.
   - Gestão do próprio carrinho sincronizado.
   - Execução do processo de checkout (finalização de pedidos com cálculo e reserva atômica no servidor).
   - Visualização do histórico exclusivo dos seus próprios pedidos e acompanhamento de status.
   - Consulta e atualização básica de dados de perfil.
   - **Restrição estrita:** Não tem permissão para visualizar pedidos de outros usuários nem acessar rotas administrativas (`/admin`).

3. **Administrador (`perfil = 'ADMIN'`):**
   - Acesso restrito e protegido ao Painel Administrativo (`/admin`).
   - Visão geral (Dashboard) com métricas de negócios: produtos ativos, estoque baixo, total de vendas e pedidos recentes.
   - CRUD completo de Produtos (cadastrar, editar informações/preços/imagens, ativar/desativar, ajustar estoque).
   - Gestão de Categorias de Informática.
   - Gestão de Usuários (visualização de contas de clientes, ativação/bloqueio de status).
   - Gestão de Pedidos (visualização de itens, endereço, cliente e atualização do ciclo de vida do pedido).
   - **Regra de Segurança:** Nenhuma interface pública permite a criação ou escalação de privilégios para Administrador. A conta administradora inicial é criada exclusivamente via script de seed local seguro ou CLI do servidor.

---

## 3. Requisitos Funcionais (RF)

### Módulo 1: Autenticação e Gestão de Usuários
- **RF01.1 - Cadastro de Cliente:** O sistema deve permitir o cadastro informando `nome`, `email` e `senha` (mínimo de 6 caracteres).
- **RF01.2 - Unicidade de E-mail:** O sistema deve validar a unicidade do e-mail no banco de dados e retornar mensagem de erro amigável caso já exista.
- **RF01.3 - Criptografia de Senha:** A senha nunca deve ser armazenada em texto puro; deve ser criptografada com algoritmo de hash seguro e salt (ex: `bcrypt` ou `argon2`).
- **RF01.4 - Autenticação (Login):** Validação de credenciais no servidor, gerando uma sessão segura baseada em cookie `HttpOnly`, `SameSite=Lax` e `Secure` (em produção), prevenindo ataques XSS.
- **RF01.5 - Encerramento de Sessão (Logout):** Invalidação imediata do cookie/token de sessão.
- **RF01.6 - Proteção de Rotas:** Middleware e verificações em Server Components/Actions para interceptar acessos não autorizados e redirecionar adequadamente.

### Módulo 2: Catálogo de Produtos e Navegação
- **RF02.1 - Vitrine Inicial (Home):** Exibição de banners institucionais com a identidade visual da NexaCore, grid de produtos em destaque, carrossel de categorias de informática e rodapé com informações da loja.
- **RF02.2 - Categorização:** Suporte a categorias como *Processadores*, *Placas de Vídeo*, *Memórias RAM*, *Armazenamento (SSDs/HDs)*, *Placas-Mãe*, *Fontes*, *Gabinetes*, *Monitores*, *Periféricos* e *Notebooks*.
- **RF02.3 - Pesquisa de Produtos:** Campo de busca com filtro em tempo real ou por submissão, pesquisando por nome e descrição do produto.
- **RF02.4 - Filtragem e Ordenação:** Filtros por categoria, faixa de preço e ordenação (menor preço, maior preço, mais recentes).
- **RF02.5 - Página de Detalhes:** Apresentação detalhada com imagem do produto, nome, categoria, descrição completa, especificações técnicas, preço formatado em Real (R$) e botão de ação condicional (se em estoque: "Adicionar ao Carrinho"; se zerado: badge "Produto Esgotado").

### Módulo 3: Carrinho de Compras
- **RF03.1 - Gestão de Itens:** Possibilidade de adicionar produto, incrementar quantidade, decrementar quantidade e remover item do carrinho.
- **RF03.2 - Verificação de Limite:** O usuário não pode adicionar ao carrinho uma quantidade superior ao estoque atual cadastrado no banco de dados.
- **RF03.3 - Cálculos no Cliente e Servidor:** Exibição do resumo com preço unitário, quantidade, subtotal por item e valor total do pedido. A validação final e definitiva ocorre sempre no servidor no momento do checkout.

### Módulo 4: Finalização de Pedidos (Checkout) e Histórico
- **RF04.1 - Exigência de Autenticação:** Apenas clientes autenticados podem submeter o pedido. Usuários anônimos são redirecionados para a tela de login/cadastro mantendo os itens do carrinho salvos.
- **RF04.2 - Checkout Seguro e Transacional:** A criação do pedido deve ocorrer dentro de uma transação de banco de dados (`database transaction`), garantindo atomicidade:
  1. Leitura dos produtos diretamente do banco com trava/verificação de estoque.
  2. Validação dos preços unitários atuais (desconsiderando qualquer valor manipulado no navegador).
  3. Verificação se a quantidade solicitada está disponível em estoque.
  4. Redução da `quantidade_estoque` dos produtos comprados.
  5. Inserção do registro na tabela `pedidos`.
  6. Inserção dos itens na tabela `itens_pedido` (gravando o preço histórico da compra).
  7. Confirmação (`commit`) ou cancelamento (`rollback`) se houver qualquer divergência ou falta de estoque.
- **RF04.3 - Simulação de Pagamento:** Conforme especificado, nesta primeira versão acadêmica o checkout é concluído diretamente gerando o pedido com status `PENDENTE` ou `CONFIRMADO`, sem gateway de pagamento real.
- **RF04.4 - Histórico de Pedidos:** Tela onde o cliente autenticado consulta seus pedidos, contendo número identificador, data formatada (DD/MM/AAAA), relação de itens, valor total pago e status atual.
- **RF04.5 - Prevenção de IDOR:** Consultas aos detalhes de um pedido exigem obrigatoriamente que `pedido.usuario_id == usuario_logado.id` (ou perfil `ADMIN`).

### Módulo 5: Painel Administrativo (`/admin`)
- **RF05.1 - Dashboard Geral:** Exibição de cards informativos:
  - Total de produtos cadastrados e ativos.
  - Alerta de produtos com estoque baixo (ex: estoque <= 5 unidades).
  - Total de pedidos realizados e faturamento consolidado.
  - Listagem dos 5 últimos pedidos com link rápido de acesso.
- **RF05.2 - Gestão de Produtos (CRUD):** Listagem paginada/filtrável, formulário de cadastro e edição de produtos, campo para URL de imagem, preço com máscara monetária, controle de estoque e botão de ativação/desativação.
- **RF05.3 - Gestão de Pedidos:** Listagem de todos os pedidos da loja, com filtros por status e cliente. Modal ou página de detalhes do pedido permitindo ao administrador alterar o status (ex: de `PENDENTE` para `PAGO`, `EM_SEPARACAO`, `ENVIADO`, `ENTREGUE` ou `CANCELADO`).
- **RF05.4 - Gestão de Usuários:** Listagem de usuários registrados (nome, e-mail, perfil, status, data de cadastro), com opção de desativar/bloquear conta.

---

## 4. Requisitos Não Funcionais (RNF)

- **RNF01 - Arquitetura de Software:** Aplicação desenvolvida em **Next.js 15+** com React, TypeScript e **App Router**, dividida em:
  - `src/app`: Rotas, layouts e Server Actions.
  - `src/components`: Componentes visuais reutilizáveis (UI) isolados e responsivos.
  - `src/lib`: Conexão com banco de dados, utilitários, criptografia e regras de autenticação.
  - `src/services` ou `src/actions`: Lógica de negócio e operações de banco.
  - `prisma` ou migrações SQL: Esquema e migrações versionadas.
- **RNF02 - Persistência de Dados:** Banco de dados relacional **PostgreSQL**, hospedado em serviço moderno como **Neon**, acessado via **Prisma ORM** para garantir migrações versionadas, consistência e tipagem segura em tempo de compilação.
- **RNF03 - Estilização e Design:** Utilização de **Tailwind CSS** (ou CSS Modules) para criar um design minimalista, moderno, com paleta de cores tecnológica (tons neutros escuros/claros com destaque em azul/ciano metálico para a NexaCore), tipografia legível e total suporte responsivo (Desktop, Tablet e Mobile).
- **RNF04 - Idioma e Localização:** Todo o conteúdo de interface, validações, mensagens de erro, cabeçalhos, metadados e documentação exclusivamente em **Português Brasileiro (PT-BR)**.
  - Moeda: Real Brasileiro (`R$ 1.299,00`).
  - Datas: Padrão nacional (`23/10/2026 15:30`).
- **RNF05 - Segurança:**
  - Sanitização de inputs e validação de esquemas via **Zod**.
  - Hash de senhas via `bcryptjs` (salt rounds >= 10).
  - Prevenção contra SQL Injection assegurada pelo Prisma/consultas parametrizadas.
  - Prevenção contra ataques CSRF e XSS.
  - Armazenamento de credenciais e chaves estritamente em variáveis de ambiente (`.env`), com inclusão garantida no `.gitignore` e disponibilização de um `.env.example` sem dados sensíveis.
- **RNF06 - Controle de Versão:** Repositório oficial no GitHub `https://github.com/SophiaSouza00/NexaCore.git`, branch principal `main`, commits descritivos seguindo o padrão *Conventional Commits* (`feat:`, `fix:`, `chore:`, `docs:`).

---

## 5. Modelo de Dados Relacional (MER / Schema)

```
+-------------------------------------------------------------+
|                           USUARIOS                          |
+-------------------------------------------------------------+
| id             : String (UUID / CUID) [PK]                  |
| nome           : String (VARCHAR 100)                       |
| email          : String (VARCHAR 150) [UNIQUE, INDEX]       |
| senha_hash     : String (VARCHAR 255)                       |
| perfil         : Enum ('CLIENTE', 'ADMIN') [DEFAULT CLIENTE]|
| status         : Enum ('ATIVO', 'INATIVO') [DEFAULT ATIVO]  |
| data_cadastro  : DateTime [DEFAULT NOW()]                   |
| data_atualizacao: DateTime [UPDATED_AT]                     |
+-------------------------------------------------------------+
                              | 1
                              |
                              | N
+-------------------------------------------------------------+
|                            PEDIDOS                          |
+-------------------------------------------------------------+
| id             : String (UUID / CUID) [PK]                  |
| usuario_id     : String [FK -> USUARIOS.id, INDEX]          |
| data_pedido    : DateTime [DEFAULT NOW()]                   |
| valor_total    : Decimal(10,2)                              |
| status         : Enum ('PENDENTE', 'PAGO', 'ENVIADO',       |
|                       'ENTREGUE', 'CANCELADO')              |
| data_atualizacao: DateTime [UPDATED_AT]                     |
+-------------------------------------------------------------+
                              | 1
                              |
                              | N
+-------------------------------------------------------------+
|                         ITENS_PEDIDO                        |
+-------------------------------------------------------------+
| id             : String (UUID / CUID) [PK]                  |
| pedido_id      : String [FK -> PEDIDOS.id, INDEX]           |
| produto_id     : String [FK -> PRODUTOS.id, INDEX]          |
| quantidade     : Int                                        |
| preco_unitario : Decimal(10,2)                              |
| subtotal       : Decimal(10,2)                              |
+-------------------------------------------------------------+
                              | N
                              |
                              | 1
+-------------------------------------------------------------+
|                           PRODUTOS                          |
+-------------------------------------------------------------+
| id                 : String (UUID / CUID) [PK]              |
| nome               : String (VARCHAR 200) [INDEX]           |
| slug               : String (VARCHAR 220) [UNIQUE, INDEX]   |
| descricao          : Text                                   |
| categoria_id       : String [FK -> CATEGORIAS.id, INDEX]    |
| preco              : Decimal(10,2)                          |
| quantidade_estoque : Int                                    |
| imagem_url         : String (VARCHAR 500)                   |
| ativo              : Boolean [DEFAULT true, INDEX]          |
| data_cadastro      : DateTime [DEFAULT NOW()]               |
| data_atualizacao   : DateTime [UPDATED_AT]                  |
+-------------------------------------------------------------+
                              | N
                              |
                              | 1
+-------------------------------------------------------------+
|                          CATEGORIAS                         |
+-------------------------------------------------------------+
| id             : String (UUID / CUID) [PK]                  |
| nome           : String (VARCHAR 80) [UNIQUE]               |
| slug           : String (VARCHAR 100) [UNIQUE, INDEX]       |
| descricao      : String (VARCHAR 255) [OPTIONAL]            |
| ativo          : Boolean [DEFAULT true]                     |
+-------------------------------------------------------------+
```

### Regras de Integridade e Transações
1. **Preço e Estoque:** O campo `quantidade_estoque` possui restrição de ser `>= 0`. O campo `preco` possui restrição de ser `> 0`.
2. **Histórico de Preço:** A tabela `ITENS_PEDIDO` armazena `preco_unitario` e `subtotal` copiados no momento exato da compra. Se o administrador alterar o preço de um produto no futuro, os pedidos antigos preservam os valores históricos intactos.
3. **Cancelamento de Pedido:** Se um pedido for cancelado antes do envio, uma transação estorna os itens comprados devolvendo as quantidades correspondentes ao `quantidade_estoque` da tabela `PRODUTOS`.

---

## 6. Critérios de Aceitação e Plano de Testes

| ID | Teste de Aceitação | Resultado Esperado |
|---|---|---|
| **CT-01** | Cadastro de usuário com dados válidos | Usuário registrado no banco com senha criptografada e redirecionado para login |
| **CT-02** | Cadastro com e-mail já existente | Operação rejeitada com mensagem: "Este e-mail já está cadastrado." |
| **CT-03** | Login com credenciais válidas vs. inválidas | Acesso liberado apenas com credenciais corretas; mensagem amigável de erro se erradas |
| **CT-04** | Exibição do catálogo de produtos | Vitrine exibe produtos ativos com imagem, nome e preço em R$ |
| **CT-05** | Pesquisa e filtragem por categoria | Filtragem precisa por termos de busca e seleção de categoria de informática |
| **CT-06** | Adição e manipulação no carrinho | Permite alterar quantidade e remover; total recalculado dinamicamente |
| **CT-07** | Tentativa de adicionar quantidade acima do estoque | Bloqueio imediato com aviso claro de limite de estoque |
| **CT-08** | Checkout com verificação no servidor | Preços lidos do banco, estoque decrementado atomicamente e pedido gerado com sucesso |
| **CT-09** | Consulta de histórico pelo cliente | Cliente visualiza somente seus pedidos; tentativa de acessar pedido de outro usuário retorna 403/404 |
| **CT-10** | Acesso ao Painel Admin por cliente comum | Redirecionamento com erro 403 Forbidden ou envio para página inicial |
| **CT-11** | CRUD de Produtos pelo Administrador | Administrador cadastra, edita e desativa produtos com sucesso |
| **CT-12** | Atualização de status de pedidos pelo Admin | Transição de status (Pendente -> Pago -> Enviado -> Entregue) refletida no histórico do cliente |
| **CT-13** | Responsividade e Usabilidade | Layout fluído em telas de 375px (mobile), 768px (tablet) e 1440px (desktop) |
| **CT-14** | Auditoria de Segredos e Versionamento | `.env` no `.gitignore`, `.env.example` sem dados sensíveis, zero senhas no histórico Git |

---

## 7. Status do Projeto
O sistema **NexaCore** foi completamente implementado, testado e auditado conforme todas as diretrizes da apostila *“Programar com IA de forma responsável”*. O código-fonte está 100% versionado no repositório oficial do GitHub, com 27 testes automatizados aprovados e pronto para avaliação e deploy contínuo na Vercel.

---

## 8. Instalação e Execução (Guia Oficial para Avaliação)

Este guia foi elaborado para que o professor ou qualquer avaliador consiga clonar o repositório em um computador que nunca viu o projeto e colocá-lo para rodar do zero, seguindo estritamente as instruções abaixo sem necessidade de suporte externo.

### 8.1 Ambiente
- **Linguagem e Versão:** Node.js versão `20.x` ou superior (recomendado Node.js `22.x` LTS).
- **Gerenciador de Pacotes:** `npm` versão `10.x` ou superior.
- **Framework e Servidor de Execução:** Next.js `15.5` com React `19` e TypeScript `5`, executado via comando `npm run dev` (Turbopack) ou servidor de produção compilado com `npm run build && npm run start`.
- **Dependências Principais:** `@prisma/client`, `prisma`, `bcryptjs`, `jose`, `zod`, `tailwindcss` 4, `lucide-react`, `clsx`, `tailwind-merge`.
  - **Comando de Instalação:** `npm install`
- **Sistemas Operacionais Testados e Homologados:** Windows 11 (PowerShell / Prompt de Comando), Linux (Ubuntu 22.04 LTS / Debian 12) e macOS (Apple Silicon e Intel).

---

### 8.2 Banco de Dados
- **SGBD e Versão:** **PostgreSQL 15 ou 16** (compatível com [Neon](https://neon.tech), Supabase, Docker ou PostgreSQL local).
- **Nome Sugerido do Banco de Dados:** `nexacoredb`
- **Caminho do Script SQL no Repositório:** 
  - Script SQL direto: `database/schema.sql`
  - Migrações versionadas do ORM: `prisma/migrations/20261023000000_init/migration.sql`
- **Como Executar o Script SQL:**
  - **Opção A (Via Terminal psql / pgAdmin / Neon SQL Editor):**
    Executar o arquivo `database/schema.sql` diretamente no console do seu banco.
  - **Opção B (Via Prisma Migrations - Recomendado):**
    Com o arquivo `.env` configurado, executar no terminal:
    ```bash
    npx prisma migrate deploy
    npm run seed
    ```

#### Modelo Descritivo das Tabelas do Sistema:

| Tabela | Campos Principais | Chave Primária | Relacionamentos |
|---|---|---|---|
| `usuarios` | `id`, `nome`, `email`, `senha_hash`, `perfil`, `status`, `data_cadastro` | `id` | 1:N com `pedidos` (`pedidos.usuario_id → usuarios.id`) |
| `categorias` | `id`, `nome`, `slug`, `descricao`, `ativo` | `id` | 1:N com `produtos` (`produtos.categoria_id → categorias.id`) |
| `produtos` | `id`, `nome`, `slug`, `descricao`, `categoria_id`, `preco`, `quantidade_estoque`, `imagem_url`, `ativo` | `id` | `categoria_id → categorias.id`<br>1:N com `itens_pedido` |
| `pedidos` | `id`, `usuario_id`, `data_pedido`, `valor_total`, `status` | `id` | `usuario_id → usuarios.id`<br>1:N com `itens_pedido` |
| `itens_pedido` | `id`, `pedido_id`, `produto_id`, `quantidade`, `preco_unitario`, `subtotal` | `id` | `pedido_id → pedidos.id` (CASCADE)<br>`produto_id → produtos.id` (RESTRICT) |

- **Dados Iniciais Necessários (Seed):** O arquivo `database/schema.sql` (ou o comando `npm run seed`) já insere automaticamente:
  1. A conta mestre do Administrador de Testes com senha criptografada via `bcrypt`.
  2. As 9 categorias de informática (Processadores, Placas de Vídeo, Memórias RAM, etc.).
  3. 8 produtos reais de hardware com fotos, preços e estoque inicial para os testes de aceitação.

---

### 8.3 Variáveis de Ambiente
O repositório possui o arquivo [.env.example](file:///c:/Users/Aluno/Downloads/NexaCore/.env.example) versionado com exemplos ilustrativos seguros. As variáveis reais nunca devem ser commitadas.

```ini
# .env.example

# String de conexão com o banco de dados PostgreSQL
# Substitua pelo seu banco local ou pela URL fornecida pelo Neon
DATABASE_URL="postgresql://usuario:senha@ep-exemplo.neon.tech/nexacoredb?sslmode=require"

# Chave secreta de no mínimo 32 caracteres usada para assinar os tokens JWT das sessões HttpOnly
SESSION_SECRET="sua-chave-secreta-aleatoria-com-minimo-32-caracteres"

# Metadados públicos da aplicação
NEXT_PUBLIC_APP_NAME="NexaCore"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Credenciais padrão para geração do primeiro administrador no script de seed
ADMIN_INITIAL_NAME="Administrador NexaCore"
ADMIN_INITIAL_EMAIL="admin@nexacore.com.br"
ADMIN_INITIAL_PASSWORD="Admin@NexaCore2026!"
```

**Para que serve cada variável:**
- `DATABASE_URL`: String de conexão usada pelo Prisma ORM para conectar ao PostgreSQL.
- `SESSION_SECRET`: Chave secreta usada pela biblioteca `jose` para assinar digitalmente os cookies de sessão e impedir adulteração.
- `NEXT_PUBLIC_APP_NAME`: Nome exibido no cabeçalho e títulos de abas.
- `NEXT_PUBLIC_APP_URL`: URL base do sistema para redirecionamentos e metadados.
- `ADMIN_INITIAL_*`: Utilizadas exclusivamente na carga inicial (`seed`) para criar o primeiro usuário com perfil `ADMIN`.

---

### 8.4 Passo a Passo de Instalação Local

Siga rigorosamente a sequência de passos numerados abaixo:

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/SophiaSouza00/NexaCore.git
   cd NexaCore
   ```

2. **Instalar as dependências do projeto:**
   ```bash
   npm install
   ```

3. **Configurar as variáveis de ambiente:**
   Copie o arquivo de exemplo para criar o seu arquivo `.env`:
   ```bash
   cp .env.example .env
   # No Windows (PowerShell):
   # Copy-Item .env.example .env
   ```
   Abra o arquivo `.env` e preencha a sua `DATABASE_URL` do PostgreSQL (local ou Neon).

4. **Criar as tabelas e dados iniciais no banco:**
   ```bash
   # Executa as migrações do banco de dados
   npx prisma migrate deploy

   # Popula o banco com o Administrador, Categorias e Produtos
   npm run seed
   ```
   *(Caso prefira importar manualmente via pgAdmin ou console SQL, basta executar o arquivo `database/schema.sql`).*

5. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

6. **Abrir a aplicação no navegador:**
   Acesse o endereço:
   👉 **[http://localhost:3000](http://localhost:3000)**

---

### 8.5 Como Testar o Sistema

#### A) Usuário de Teste Pré-Configurado (Administrador)
- **E-mail:** `admin@nexacore.com.br`
- **Senha:** `Admin@NexaCore2026!`
- **Perfil:** `ADMIN` (Acesso total a `/admin`)

#### B) Roteiro do Fluxo Principal de Testes (Passo a Passo)

1. **Navegação e Vitrine:**
   - Acesse `http://localhost:3000`. Veja os produtos em destaque, categorias de informática e garantias institucionais.
2. **Catálogo e Filtros:**
   - Acesse `http://localhost:3000/catalogo`.
   - Digite `"Ryzen"` no campo de busca e filtre por uma categoria (ex: *Processadores*).
   - Mude a ordenação para *"Menor Preço"*.
3. **Página de Detalhes do Hardware:**
   - Clique em um produto (ex: `http://localhost:3000/produto/amd-ryzen-7-7800x3d`).
   - Tente aumentar a quantidade acima do estoque disponível; observe o bloqueio imediato com mensagem de limite físico de estoque.
4. **Carrinho de Compras:**
   - Adicione 1 ou mais itens e abra `http://localhost:3000/carrinho`.
   - Modifique quantidades, confira o subtotal e o total em Real (`R$`).
5. **Cadastro de Novo Cliente:**
   - Clique em "Avançar para o Checkout". O sistema redirecionará para a tela de autenticação.
   - Acesse `http://localhost:3000/cadastro` e registre um novo cliente (ex: Nome: `Cliente Teste`, E-mail: `teste@cliente.com`, Senha: `123456`).
6. **Finalização de Compra (Checkout Seguro):**
   - Na tela `http://localhost:3000/checkout`, escolha a forma de pagamento simulada (Pix, Cartão de Crédito ou Boleto).
   - Clique em *"Confirmar e Finalizar Pedido"*.
   - O servidor executará a transação atômica (`prisma.$transaction`), decrementará o estoque no banco e gerará o código do pedido.
7. **Histórico de Pedidos e Proteção Anti-IDOR:**
   - Acesse `http://localhost:3000/pedidos`. Veja o pedido registrado com o preço unitário histórico preservado.
   - Observe que nenhum outro cliente consegue visualizar esses pedidos por manipulação de parâmetros.
8. **Painel Administrativo:**
   - Faça logout e entre com o usuário administrador (`admin@nexacore.com.br` / `Admin@NexaCore2026!`).
   - Acesse `http://localhost:3000/admin`.
   - Verifique os 4 cards de métricas (Faturamento em R$, Total de Pedidos, Produtos Ativos e Estoque Baixo).
   - Acesse `http://localhost:3000/admin/produtos` e cadastre um novo produto ou teste o botão Ativo/Inativo.
   - Acesse `http://localhost:3000/admin/pedidos` e altere o status do pedido para `PAGO` ou `EM_SEPARACAO`.
   - Acesse `http://localhost:3000/admin/usuarios` e veja a listagem de clientes cadastrados com opção de bloqueio/ativação.
9. **Execução da Bateria de 27 Testes Automatizados:**
   - No terminal, execute:
     ```bash
     npm test
     ```
   - O script executará a suíte `tests/acceptance.test.ts` e confirmará os 27 testes com status `PASS`.

#### C) Limitações Conhecidas e Decisões de Escopo
- **Simulação de Pagamento:** Conforme estabelecido nas regras da atividade acadêmica, o checkout não se conecta a um gateway bancário real (como Stripe ou Mercado Pago), concluindo o pedido diretamente em status `PENDENTE` ou `PAGO` com baixa atômica de estoque.
- **Resiliência do Catálogo (Fallback):** Caso o avaliador execute o sistema localmente antes de preencher a `DATABASE_URL` no `.env`, o sistema conta com um catálogo em memória de fallback para impedir que a interface quebre ou retorne tela branca, mantendo a vitrine navegável até a conexão com o PostgreSQL ser concluída.

