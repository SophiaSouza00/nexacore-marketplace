# Changelog — NexaCore

Todas as alterações notáveis, decisões de arquitetura e correções realizadas durante o desenvolvimento da **NexaCore** estão registradas neste documento.

Este documento evidencia o processo de **programação responsável com IA**, demonstrando a **revisão crítica humana**, as decisões técnicas fundamentadas e as correções efetuadas sobre as propostas iniciais do agente.

---

## [1.0.0] — 2026-11-06

### 🚀 Entrega Final do Sistema
- Sistema completo e funcional de comércio eletrônico de informática e hardware.
- Publicação e deploy contínuo configurados na Vercel e banco PostgreSQL na nuvem (Neon).
- Suíte com 27 testes de aceitação automatizados (`npm test`) com 100% de aprovação.
- Script SQL do banco de dados versionado em `database/schema.sql` e migrações do Prisma em `prisma/migrations/`.

---

## Registro Detalhado das Decisões, Revisões Humanas e Correções

### 1. Decisão de Arquitetura e Persistência de Dados
- **Proposta Inicial do Agente:** O agente sugeriu inicialmente utilizar armazenamento em memória ou SQLite local para acelerar o desenvolvimento, ou cogitou uma stack tradicional com PHP e MySQL.
- **Intervenção e Revisão Humana:** A proposta foi **rejeitada**. A estudante estabeleceu que a arquitetura deveria ser moderna e profissional, baseada em **Next.js 15 (App Router)**, **TypeScript estrito**, **PostgreSQL** real (hospedado no Neon) e **Prisma ORM**, garantindo integridade transacional ACID e compatibilidade direta com a Vercel.
- **Resultado:** Implementado esquema relacional robusto no PostgreSQL (`usuarios`, `categorias`, `produtos`, `pedidos`, `itens_pedido`) com tipos estritos e migrações reproduzíveis.

---

### 2. Segurança de Autenticação e Prevenção contra XSS
- **Proposta Inicial do Agente:** O agente propôs armazenar o token JWT de autenticação no `localStorage` do navegador para facilitar o consumo via componentes de cliente.
- **Intervenção e Revisão Humana:** **Rejeitado por violar o checklist de segurança (Anexo B)**. O armazenamento de tokens em `localStorage` expõe a aplicação a ataques de roubo de sessão via Cross-Site Scripting (XSS). Foi exigido que o token fosse armazenado em cookies com atributos de segurança obrigatórios: `HttpOnly` (inacessível via scripts de terceiros), `SameSite=Lax` (anti-CSRF) e `Secure` em produção.
- **Resultado:** Módulo `src/lib/auth.ts` implementado utilizando a biblioteca `jose`, gerando tokens assinados via `HS256` e gerenciando cookies `HttpOnly` criptografados.

---

### 3. Regra de Checkout: Cálculo Soberano e Transações Atômicas
- **Proposta Inicial do Agente:** O carrinho enviava os preços unitários e o valor total calculados pelo navegador para a API de finalização de pedido, apenas salvando os dados no banco.
- **Intervenção e Revisão Humana:** **Identificada vulnerabilidade grave de manipulação de preços**. O cliente poderia inspecionar o código e alterar o valor de uma placa de vídeo de R$ 5.999,00 para R$ 1,00. A estudante exigiu:
  1. O servidor ignora qualquer preço vindo do cliente e busca os preços vigentes diretamente no banco de dados.
  2. A conferência e o decremento do estoque devem ocorrer dentro de uma transação atômica (`prisma.$transaction`).
  3. Se o estoque for insuficiente para qualquer item do carrinho, a transação deve sofrer *rollback* imediato.
  4. O preço praticado no instante da compra deve ser copiado para `itens_pedido` (imutabilidade histórica).
- **Resultado:** Implementada a Server Action `finalizarPedidoAction` em `src/actions/orders.ts`, com trava de concorrência e preservação de preço histórico.

---

### 4. Controle de Acesso Baseado em Perfis (RBAC) e Prevenção Anti-IDOR
- **Proposta Inicial do Agente:** O agente havia deixado os endpoints de pedidos consultando apenas pelo ID do pedido informado na rota (`/pedidos/[id]`). Além disso, o formulário de cadastro aceitava o campo `perfil` opcionalmente.
- **Intervenção e Revisão Humana:**
  1. **Anti-IDOR:** A consulta foi refatorada para exigir que `pedido.usuario_id === usuario_logado.id`, impedindo que um cliente visualize ou altere pedidos de outro usuário trocando o identificador na URL.
  2. **Bloqueio de Escalação de Privilégios:** O cadastro público força estritamente o perfil `CLIENTE` no backend, ignorando qualquer tentativa de envio de `perfil: ADMIN`.
  3. O Administrador inicial só pode ser criado por script de seed local autenticado ou console do servidor.
- **Resultado:** Middleware de segurança em `src/middleware.ts` e isolamento completo no módulo `src/lib/orders.ts`.

---

### 5. Correções de Tipagem e Ajustes de Linter no Next.js
- **Problema Encontrado 1:** Durante a Etapa 5, a compilação de produção (`npm run build`) falhou devido ao uso de `@ts-ignore` e tipagens genéricas `any` em `src/lib/catalog.ts` e `src/app/page.tsx`.
  - **Correção Aplicada:** O `@ts-ignore` foi substituído pela criação de um componente de cliente desacoplado (`SortSelect.tsx`) envolvido em `Suspense`. Os tipos `any` foram substituídos por tipagens estritas do Prisma (`Prisma.ProdutoWhereInput` e `Prisma.ProdutoOrderByWithRelationInput`) e `LucideIcon`.
- **Problema Encontrado 2:** Na Etapa 6, o TypeScript apontou divergência de tipos no enum `StatusPedido` pela ausência do status `EM_SEPARACAO`.
  - **Correção Aplicada:** O tipo `StatusPedido` em `src/types/index.ts` foi atualizado para conter todos os 6 estados do ciclo de vida: `PENDENTE`, `PAGO`, `EM_SEPARACAO`, `ENVIADO`, `ENTREGUE` e `CANCELADO`.
- **Problema Encontrado 3:** Na Etapa 7, avisos do ESLint apontaram variáveis de erro não utilizadas em blocos `catch (erro: unknown)`.
  - **Correção Aplicada:** Refatorado para *optional catch binding* (`catch { ... }`), resultando em compilação limpa (`✔ No ESLint warnings or errors`).

---

### 6. Bateria de Testes Automatizados de Aceitação
- **Decisão:** Em vez de depender apenas de testes manuais, foi criada uma suíte dedicada em `tests/acceptance.test.ts`.
- **Resultado:** 27 testes cobrindo formatação em moeda brasileira (`R$`), datas em padrão nacional (`DD/MM/AAAA`), hash de senhas, integridade de tokens JWT, validações de esquemas Zod e auditoria do `.gitignore`.
