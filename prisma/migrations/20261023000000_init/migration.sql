-- NexaCore — Migração Inicial de Criação do Banco de Dados Relacional
-- Sistema de E-Commerce de Informática e Hardware
-- Tabelas: usuarios, categorias, produtos, pedidos, itens_pedido

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('CLIENTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'PAGO', 'EM_SEPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO');

-- CreateTable: USUARIOS
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'CLIENTE',
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CATEGORIAS
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PRODUTOS
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "quantidade_estoque" INTEGER NOT NULL DEFAULT 0,
    "imagem_url" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PEDIDOS
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ITENS_PEDIDO
CREATE TABLE "itens_pedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "itens_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unicidade e buscas rápidas
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");
CREATE UNIQUE INDEX "produtos_slug_key" ON "produtos"("slug");

CREATE INDEX "produtos_categoria_id_idx" ON "produtos"("categoria_id");
CREATE INDEX "produtos_ativo_idx" ON "produtos"("ativo");
CREATE INDEX "produtos_nome_idx" ON "produtos"("nome");

CREATE INDEX "pedidos_usuario_id_idx" ON "pedidos"("usuario_id");
CREATE INDEX "pedidos_status_idx" ON "pedidos"("status");

CREATE INDEX "itens_pedido_pedido_id_idx" ON "itens_pedido"("pedido_id");
CREATE INDEX "itens_pedido_produto_id_idx" ON "itens_pedido"("produto_id");

-- Foreign Keys com integridade referencial
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
