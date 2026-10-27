import { PrismaClient, PerfilUsuario, StatusUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados da NexaCore...");

  // 1. Criar o Primeiro Administrador da NexaCore (Segurança Garantida)
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@nexacore.com.br";
  const adminSenha = process.env.ADMIN_INITIAL_PASSWORD || "Admin@NexaCore2026!";
  const adminNome = process.env.ADMIN_INITIAL_NAME || "Administrador NexaCore";

  const adminExistente = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (!adminExistente) {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(adminSenha, salt);

    const admin = await prisma.usuario.create({
      data: {
        nome: adminNome,
        email: adminEmail,
        senhaHash: senhaHash,
        perfil: PerfilUsuario.ADMIN,
        status: StatusUsuario.ATIVO,
      },
    });
    console.log(`✅ Administrador inicial criado com sucesso: ${admin.email}`);
  } else {
    console.log(`ℹ️ Administrador já existe no banco: ${adminExistente.email}`);
  }

  // 2. Criar Categorias Oficiais de Informática
  const categoriasDados = [
    {
      nome: "Processadores",
      slug: "processadores",
      descricao: "CPUs de alta performance para jogos, produtividade e servidores.",
    },
    {
      nome: "Placas de Vídeo",
      slug: "placas-de-video",
      descricao: "GPUs dedicadas para gráficos avançados, renderização e inteligência artificial.",
    },
    {
      nome: "Memórias RAM",
      slug: "memorias-ram",
      descricao: "Módulos de memória DDR4 e DDR5 de alta velocidade e baixa latência.",
    },
    {
      nome: "Armazenamento",
      slug: "armazenamento",
      descricao: "SSDs NVMe M.2 ultrarrápidos, SSDs SATA e unidades de alta capacidade.",
    },
    {
      nome: "Placas-Mãe",
      slug: "placas-mae",
      descricao: "Placas-mãe para plataformas Intel LGA1700/1851 e AMD AM4/AM5.",
    },
    {
      nome: "Fontes de Alimentação",
      slug: "fontes",
      descricao: "Fontes com certificação 80 Plus Bronze, Gold e Platinum.",
    },
    {
      nome: "Gabinetes",
      slug: "gabinetes",
      descricao: "Gabinetes com fluxo de ar otimizado e painéis de vidro temperado.",
    },
    {
      nome: "Periféricos",
      slug: "perifericos",
      descricao: "Teclados mecânicos, mouses de precisão, headsets e acessórios.",
    },
    {
      nome: "Computadores & Monitores",
      slug: "computadores",
      descricao: "Máquinas montadas de alta performance e monitores de alta taxa de atualização.",
    },
  ];

  const categoriasCriadas = new Map<string, string>();

  for (const cat of categoriasDados) {
    const registro = await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        nome: cat.nome,
        slug: cat.slug,
        descricao: cat.descricao,
        ativo: true,
      },
    });
    categoriasCriadas.set(cat.slug, registro.id);
  }
  console.log(`✅ ${categoriasDados.length} categorias cadastradas ou verificadas.`);

  // 3. Cadastrar Produtos Iniciais Realistas para Testes
  const produtosDados = [
    {
      nome: "Processador AMD Ryzen 7 7800X3D (8C/16T, 5.0GHz, Cache 104MB)",
      slug: "amd-ryzen-7-7800x3d",
      categoriaSlug: "processadores",
      descricao:
        "O melhor processador para jogos da atualidade com tecnologia 3D V-Cache de 104MB, 8 núcleos e 16 threads com consumo eficiente em soquete AM5.",
      preco: 2899.9,
      quantidadeEstoque: 15,
      imagemUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    },
    {
      nome: "Processador Intel Core i7-14700K (20C/28T, até 5.6GHz, Cache 33MB)",
      slug: "intel-core-i7-14700k",
      categoriaSlug: "processadores",
      descricao:
        "Processador de alto desempenho para criação de conteúdo pesado e multitarefa, com 20 núcleos híbridos e suporte a memórias DDR5.",
      preco: 2799.0,
      quantidadeEstoque: 10,
      imagemUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80",
    },
    {
      nome: "Placa de Vídeo RTX 4070 Ti Super 16GB GDDR6X",
      slug: "rtx-4070-ti-super-16gb",
      categoriaSlug: "placas-de-video",
      descricao:
        "Equipada com 16GB de VRAM GDDR6X, arquitetura Ada Lovelace, suporte a DLSS 3.5 com geração de quadros e excelente eficiência térmica.",
      preco: 5999.0,
      quantidadeEstoque: 8,
      imagemUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    },
    {
      nome: "Placa de Vídeo Radeon RX 7800 XT 16GB GDDR6",
      slug: "radeon-rx-7800-xt-16gb",
      categoriaSlug: "placas-de-video",
      descricao:
        "Potência pura para jogos em Quad HD (1440p) com arquitetura RDNA 3, tecnologia FSR 3 e 16GB de memória dedicada.",
      preco: 3799.0,
      quantidadeEstoque: 6,
      imagemUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80",
    },
    {
      nome: "Memória RAM Kingston Fury Beast 32GB (2x16GB) DDR5 6000MHz CL30",
      slug: "kingston-fury-32gb-ddr5-6000mhz",
      categoriaSlug: "memorias-ram",
      descricao:
        "Kit dual channel otimizado com perfis AMD EXPO e Intel XMP 3.0 para estabilidade e latências ultra baixas em plataformas modernas.",
      preco: 849.9,
      quantidadeEstoque: 25,
      imagemUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80",
    },
    {
      nome: "SSD NVMe Kingston KC3000 2TB PCIe 4.0 M.2 (Leitura 7000MB/s)",
      slug: "ssd-kingston-kc3000-2tb",
      categoriaSlug: "armazenamento",
      descricao:
        "Velocidades extremas com controlador Phison E18 de última geração, dissipador de grafeno e durabilidade para cargas pesadas de trabalho.",
      preco: 999.0,
      quantidadeEstoque: 14,
      imagemUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
    },
    {
      nome: "Fonte Corsair RM850x 850W 80 Plus Gold Modular",
      slug: "fonte-corsair-rm850x-850w",
      categoriaSlug: "fontes",
      descricao:
        "Alimentação estável com capacitores 100% japoneses, modo de ventoinha Zero RPM para operação silenciosa e cabos totalmente modulares.",
      preco: 899.9,
      quantidadeEstoque: 12,
      imagemUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop&q=80",
    },
    {
      nome: "Teclado Mecânico Gamer RGB Switch Red ABNT2",
      slug: "teclado-mecanico-gamer-rgb",
      categoriaSlug: "perifericos",
      descricao:
        "Switches lineares rápidos para jogos, iluminação RGB individual por tecla, teclas em Double Shot e padrão brasileiro ABNT2 com Ç.",
      preco: 349.9,
      quantidadeEstoque: 20,
      imagemUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    },
  ];

  for (const prod of produtosDados) {
    const catId = categoriasCriadas.get(prod.categoriaSlug);
    if (!catId) continue;

    await prisma.produto.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        nome: prod.nome,
        slug: prod.slug,
        descricao: prod.descricao,
        categoriaId: catId,
        preco: prod.preco,
        quantidadeEstoque: prod.quantidadeEstoque,
        imagemUrl: prod.imagemUrl,
        ativo: true,
      },
    });
  }
  console.log(`✅ ${produtosDados.length} produtos de hardware cadastrados no seed.`);
  console.log("🚀 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
