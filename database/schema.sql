-- ==============================================================================
-- NEXACORE — SCRIPT OFICIAL DO BANCO DE DADOS (PostgreSQL)
-- Sistema E-Commerce de Informática e Hardware
-- Arquivo: database/schema.sql
-- ==============================================================================

-- 1. CRIAÇÃO DE SCHEMAS E ENUMS
CREATE SCHEMA IF NOT EXISTS "public";

DO $$ BEGIN
    CREATE TYPE "PerfilUsuario" AS ENUM ('CLIENTE', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'PAGO', 'EM_SEPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABELA: USUARIOS
CREATE TABLE IF NOT EXISTS "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'CLIENTE',
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- 3. TABELA: CATEGORIAS
CREATE TABLE IF NOT EXISTS "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- 4. TABELA: PRODUTOS
CREATE TABLE IF NOT EXISTS "produtos" (
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
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- 5. TABELA: PEDIDOS
CREATE TABLE IF NOT EXISTS "pedidos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- 6. TABELA: ITENS_PEDIDO
CREATE TABLE IF NOT EXISTS "itens_pedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "itens_pedido_pkey" PRIMARY KEY ("id")
);

-- 7. ÍNDICES DE DESEMPENHO E RESTRIÇÕES DE UNICIDADE
CREATE UNIQUE INDEX IF NOT EXISTS "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "categorias_nome_key" ON "categorias"("nome");
CREATE UNIQUE INDEX IF NOT EXISTS "categorias_slug_key" ON "categorias"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "produtos_slug_key" ON "produtos"("slug");

CREATE INDEX IF NOT EXISTS "produtos_categoria_id_idx" ON "produtos"("categoria_id");
CREATE INDEX IF NOT EXISTS "produtos_ativo_idx" ON "produtos"("ativo");
CREATE INDEX IF NOT EXISTS "produtos_nome_idx" ON "produtos"("nome");

CREATE INDEX IF NOT EXISTS "pedidos_usuario_id_idx" ON "pedidos"("usuario_id");
CREATE INDEX IF NOT EXISTS "pedidos_status_idx" ON "pedidos"("status");

CREATE INDEX IF NOT EXISTS "itens_pedido_pedido_id_idx" ON "itens_pedido"("pedido_id");
CREATE INDEX IF NOT EXISTS "itens_pedido_produto_id_idx" ON "itens_pedido"("produto_id");

-- 8. RESTRIÇÕES DE INTEGRIDADE REFERENCIAL (FOREIGN KEYS)
DO $$ BEGIN
    ALTER TABLE "produtos" ADD CONSTRAINT "produtos_categoria_id_fkey" 
    FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" 
    FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_pedido_id_fkey" 
    FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_produto_id_fkey" 
    FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- DADOS INICIAIS OBRIGATÓRIOS (SEED)
-- ==============================================================================

-- A) Usuário Administrador de Testes
-- E-mail: admin@nexacore.com.br
-- Senha pura: Admin@NexaCore2026! (armazenada com hash bcrypt)
INSERT INTO "usuarios" ("id", "nome", "email", "senha_hash", "perfil", "status")
VALUES (
    'usr_admin_inicial_nexacore',
    'Administrador NexaCore',
    'admin@nexacore.com.br',
    '$2b$10$Fiz706azsq7rbEcQGlNVJe.OPSraZ1z4KwccJh0t7Yugp5/qcI7pW',
    'ADMIN',
    'ATIVO'
) ON CONFLICT ("email") DO NOTHING;

-- B) Categorias Oficiais de Informática
INSERT INTO "categorias" ("id", "nome", "slug", "descricao", "ativo") VALUES
('cat_proc', 'Processadores', 'processadores', 'CPUs de alta performance para jogos, produtividade e servidores.', true),
('cat_gpu', 'Placas de Vídeo', 'placas-de-video', 'GPUs dedicadas para gráficos avançados, renderização e inteligência artificial.', true),
('cat_ram', 'Memórias RAM', 'memorias-ram', 'Módulos de memória DDR4 e DDR5 de alta velocidade e baixa latência.', true),
('cat_arm', 'Armazenamento', 'armazenamento', 'SSDs NVMe M.2 ultrarrápidos, SSDs SATA e unidades de alta capacidade.', true),
('cat_mobo', 'Placas-Mãe', 'placas-mae', 'Placas-mãe para plataformas Intel LGA1700/1851 e AMD AM4/AM5.', true),
('cat_fonte', 'Fontes de Alimentação', 'fontes', 'Fontes com certificação 80 Plus Bronze, Gold e Platinum.', true),
('cat_gab', 'Gabinetes', 'gabinetes', 'Gabinetes com fluxo de ar otimizado e painéis de vidro temperado.', true),
('cat_perif', 'Periféricos', 'perifericos', 'Teclados mecânicos, mouses de precisão, headsets e acessórios.', true),
('cat_pc', 'Computadores & Monitores', 'computadores', 'Máquinas montadas de alta performance e monitores de alta taxa de atualização.', true)
ON CONFLICT ("slug") DO NOTHING;

-- C) Produtos Iniciais de Hardware
INSERT INTO "produtos" ("id", "nome", "slug", "descricao", "categoria_id", "preco", "quantidade_estoque", "imagem_url", "ativo") VALUES
(
    'prod_ryzen7',
    'Processador AMD Ryzen 7 7800X3D (8C/16T, 5.0GHz, Cache 104MB)',
    'amd-ryzen-7-7800x3d',
    'O melhor processador para jogos da atualidade com tecnologia 3D V-Cache de 104MB, 8 núcleos e 16 threads com consumo eficiente em soquete AM5.',
    'cat_proc',
    2899.90,
    15,
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
    true
),
(
    'prod_i7',
    'Processador Intel Core i7-14700K (20C/28T, até 5.6GHz, Cache 33MB)',
    'intel-core-i7-14700k',
    'Processador de alto desempenho para criação de conteúdo pesado e multitarefa, com 20 núcleos híbridos e suporte a memórias DDR5.',
    'cat_proc',
    2799.00,
    10,
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80',
    true
),
(
    'prod_rtx4070ti',
    'Placa de Vídeo RTX 4070 Ti Super 16GB GDDR6X',
    'rtx-4070-ti-super-16gb',
    'Equipada com 16GB de VRAM GDDR6X, arquitetura Ada Lovelace, suporte a DLSS 3.5 com geração de quadros e excelente eficiência térmica.',
    'cat_gpu',
    5999.00,
    8,
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    true
),
(
    'prod_rx7800xt',
    'Placa de Vídeo Radeon RX 7800 XT 16GB GDDR6',
    'radeon-rx-7800-xt-16gb',
    'Potência pura para jogos em Quad HD (1440p) com arquitetura RDNA 3, tecnologia FSR 3 e 16GB de memória dedicada.',
    'cat_gpu',
    3799.00,
    6,
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80',
    true
),
(
    'prod_ram_fury',
    'Memória RAM Kingston Fury Beast 32GB (2x16GB) DDR5 6000MHz CL30',
    'kingston-fury-32gb-ddr5-6000mhz',
    'Kit dual channel otimizado com perfis AMD EXPO e Intel XMP 3.0 para estabilidade e latências ultra baixas em plataformas modernas.',
    'cat_ram',
    849.90,
    25,
    'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80',
    true
),
(
    'prod_ssd_kc3000',
    'SSD NVMe Kingston KC3000 2TB PCIe 4.0 M.2 (Leitura 7000MB/s)',
    'ssd-kingston-kc3000-2tb',
    'Velocidades extremas com controlador Phison E18 de última geração, dissipador de grafeno e durabilidade para cargas pesadas de trabalho.',
    'cat_arm',
    999.00,
    14,
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    true
),
(
    'prod_fonte_rm850x',
    'Fonte Corsair RM850x 850W 80 Plus Gold Modular',
    'fonte-corsair-rm850x-850w',
    'Alimentação estável com capacitores 100% japoneses, modo de ventoinha Zero RPM para operação silenciosa e cabos totalmente modulares.',
    'cat_fonte',
    899.90,
    12,
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop&q=80',
    true
),
(
    'prod_teclado_gamer',
    'Teclado Mecânico Gamer RGB Switch Red ABNT2',
    'teclado-mecanico-gamer-rgb',
    'Switches lineares rápidos para jogos, iluminação RGB individual por tecla, teclas em Double Shot e padrão brasileiro ABNT2 com Ç.',
    'cat_perif',
    349.90,
    20,
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    true
)
ON CONFLICT ("slug") DO NOTHING;
