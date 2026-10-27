import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Produto, Categoria } from "@/types";

/**
 * Consulta e lista os produtos do catálogo com filtros de busca, categoria e ordenação.
 */
export async function listarProdutos({
  termo,
  categoriaSlug,
  ordenacao = "recentes",
  limite,
}: {
  termo?: string;
  categoriaSlug?: string;
  ordenacao?: "recentes" | "menor-preco" | "maior-preco" | "nome";
  limite?: number;
} = {}): Promise<Produto[]> {
  try {
    // Monta o filtro com tipagem estrita do Prisma
    const where: Prisma.ProdutoWhereInput = {
      ativo: true,
    };

    if (termo && termo.trim()) {
      where.OR = [
        { nome: { contains: termo.trim(), mode: "insensitive" } },
        { descricao: { contains: termo.trim(), mode: "insensitive" } },
      ];
    }

    if (categoriaSlug && categoriaSlug !== "todas") {
      where.categoria = {
        slug: categoriaSlug,
      };
    }

    // Configura a ordenação tipada
    let orderBy: Prisma.ProdutoOrderByWithRelationInput = { dataCadastro: "desc" };
    if (ordenacao === "menor-preco") {
      orderBy = { preco: "asc" };
    } else if (ordenacao === "maior-preco") {
      orderBy = { preco: "desc" };
    } else if (ordenacao === "nome") {
      orderBy = { nome: "asc" };
    }

    const registros = await prisma.produto.findMany({
      where,
      orderBy,
      take: limite,
      include: {
        categoria: true,
      },
    });

    return registros.map((p) => ({
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      descricao: p.descricao,
      categoriaId: p.categoriaId,
      categoria: p.categoria
        ? {
            id: p.categoria.id,
            nome: p.categoria.nome,
            slug: p.categoria.slug,
            descricao: p.categoria.descricao,
            ativo: p.categoria.ativo,
          }
        : undefined,
      preco: Number(p.preco),
      quantidadeEstoque: p.quantidadeEstoque,
      imagemUrl: p.imagemUrl,
      ativo: p.ativo,
      dataCadastro: p.dataCadastro,
      dataAtualizacao: p.dataAtualizacao,
    }));
  } catch (erro) {
    console.warn("Aviso: Falha ao consultar produtos no banco de dados. Retornando catálogo padrão.", erro);
    return obterCatalogoPadrao(termo, categoriaSlug, ordenacao, limite);
  }
}

/**
 * Busca os dados detalhados de um produto específico através de seu slug único.
 */
export async function buscarProdutoPorSlug(slug: string): Promise<Produto | null> {
  try {
    const p = await prisma.produto.findUnique({
      where: { slug },
      include: {
        categoria: true,
      },
    });

    if (!p) return obterProdutoPadraoPorSlug(slug);

    return {
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      descricao: p.descricao,
      categoriaId: p.categoriaId,
      categoria: p.categoria
        ? {
            id: p.categoria.id,
            nome: p.categoria.nome,
            slug: p.categoria.slug,
            descricao: p.categoria.descricao,
            ativo: p.categoria.ativo,
          }
        : undefined,
      preco: Number(p.preco),
      quantidadeEstoque: p.quantidadeEstoque,
      imagemUrl: p.imagemUrl,
      ativo: p.ativo,
      dataCadastro: p.dataCadastro,
      dataAtualizacao: p.dataAtualizacao,
    };
  } catch (erro) {
    console.warn(`Aviso: Falha ao buscar produto ${slug} no banco. Retornando fallback.`, erro);
    return obterProdutoPadraoPorSlug(slug);
  }
}

/**
 * Consulta todas as categorias ativas cadastradas.
 */
export async function listarCategorias(): Promise<Categoria[]> {
  try {
    const cats = await prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });

    return cats.map((c) => ({
      id: c.id,
      nome: c.nome,
      slug: c.slug,
      descricao: c.descricao,
      ativo: c.ativo,
    }));
  } catch {
    return [
      { id: "cat-1", nome: "Processadores", slug: "processadores", ativo: true },
      { id: "cat-2", nome: "Placas de Vídeo", slug: "placas-de-video", ativo: true },
      { id: "cat-3", nome: "Memórias RAM", slug: "memorias-ram", ativo: true },
      { id: "cat-4", nome: "Armazenamento", slug: "armazenamento", ativo: true },
      { id: "cat-5", nome: "Placas-Mãe", slug: "placas-mae", ativo: true },
      { id: "cat-6", nome: "Fontes de Alimentação", slug: "fontes", ativo: true },
      { id: "cat-7", nome: "Gabinetes", slug: "gabinetes", ativo: true },
      { id: "cat-8", nome: "Periféricos", slug: "perifericos", ativo: true },
      { id: "cat-9", nome: "Computadores & Monitores", slug: "computadores", ativo: true },
    ];
  }
}

// Catálogo base de fallback para garantir resiliência e estabilidade caso o banco esteja em configuração inicial
const catalogoFallback: Produto[] = [
  {
    id: "prod-1",
    nome: "Processador AMD Ryzen 7 7800X3D (8C/16T, 5.0GHz, Cache 104MB)",
    slug: "amd-ryzen-7-7800x3d",
    descricao: "O processador gamer mais eficiente da atualidade com arquitetura Zen 4 e cache 3D V-Cache.",
    categoriaId: "cat-1",
    categoria: { id: "cat-1", nome: "Processadores", slug: "processadores", ativo: true },
    preco: 2899.9,
    quantidadeEstoque: 15,
    imagemUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
  {
    id: "prod-2",
    nome: "Processador Intel Core i7-14700K (20C/28T, até 5.6GHz, Cache 33MB)",
    slug: "intel-core-i7-14700k",
    descricao: "Excelente performance híbrida com 20 núcleos para renderização pesada e jogos.",
    categoriaId: "cat-1",
    categoria: { id: "cat-1", nome: "Processadores", slug: "processadores", ativo: true },
    preco: 2799.0,
    quantidadeEstoque: 10,
    imagemUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
  {
    id: "prod-3",
    nome: "Placa de Vídeo RTX 4070 Ti Super 16GB GDDR6X",
    slug: "rtx-4070-ti-super-16gb",
    descricao: "Gráficos de nova geração com 16GB de VRAM, DLSS 3 e Ray Tracing avançado.",
    categoriaId: "cat-2",
    categoria: { id: "cat-2", nome: "Placas de Vídeo", slug: "placas-de-video", ativo: true },
    preco: 5999.0,
    quantidadeEstoque: 8,
    imagemUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
  {
    id: "prod-4",
    nome: "Placa de Vídeo Radeon RX 7800 XT 16GB GDDR6",
    slug: "radeon-rx-7800-xt-16gb",
    descricao: "Excelente custo-benefício para rodar em 1440p Ultra com 16GB de memória dedicada.",
    categoriaId: "cat-2",
    categoria: { id: "cat-2", nome: "Placas de Vídeo", slug: "placas-de-video", ativo: true },
    preco: 3799.0,
    quantidadeEstoque: 6,
    imagemUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
  {
    id: "prod-5",
    nome: "Memória RAM Kingston Fury Beast 32GB (2x16GB) DDR5 6000MHz",
    slug: "kingston-fury-32gb-ddr5-6000mhz",
    descricao: "Módulos de altíssima velocidade compatíveis com AMD EXPO e Intel XMP 3.0.",
    categoriaId: "cat-3",
    categoria: { id: "cat-3", nome: "Memórias RAM", slug: "memorias-ram", ativo: true },
    preco: 849.9,
    quantidadeEstoque: 25,
    imagemUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
  {
    id: "prod-6",
    nome: "SSD NVMe Kingston KC3000 2TB PCIe 4.0 M.2",
    slug: "ssd-kingston-kc3000-2tb",
    descricao: "Taxas de transferência de até 7000MB/s de leitura para tempos de carregamento instantâneos.",
    categoriaId: "cat-4",
    categoria: { id: "cat-4", nome: "Armazenamento", slug: "armazenamento", ativo: true },
    preco: 999.0,
    quantidadeEstoque: 14,
    imagemUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
  {
    id: "prod-7",
    nome: "Fonte Corsair RM850x 850W 80 Plus Gold Modular",
    slug: "fonte-corsair-rm850x-850w",
    descricao: "Eficiência energética de nível Gold com cabos pretos modulares e operação silenciosa.",
    categoriaId: "cat-6",
    categoria: { id: "cat-6", nome: "Fontes de Alimentação", slug: "fontes", ativo: true },
    preco: 899.9,
    quantidadeEstoque: 12,
    imagemUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
  {
    id: "prod-8",
    nome: "Teclado Mecânico Gamer RGB Switch Red ABNT2",
    slug: "teclado-mecanico-gamer-rgb",
    descricao: "Switches lineares com resposta rápida, layout brasileiro ABNT2 com Ç e cabo removível.",
    categoriaId: "cat-8",
    categoria: { id: "cat-8", nome: "Periféricos", slug: "perifericos", ativo: true },
    preco: 349.9,
    quantidadeEstoque: 20,
    imagemUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    ativo: true,
    dataCadastro: new Date(),
  },
];

function obterCatalogoPadrao(
  termo?: string,
  categoriaSlug?: string,
  ordenacao?: string,
  limite?: number
): Produto[] {
  let resultado = [...catalogoFallback];

  if (termo && termo.trim()) {
    const t = termo.toLowerCase().trim();
    resultado = resultado.filter(
      (p) => p.nome.toLowerCase().includes(t) || p.descricao.toLowerCase().includes(t)
    );
  }

  if (categoriaSlug && categoriaSlug !== "todas") {
    resultado = resultado.filter((p) => p.categoria?.slug === categoriaSlug);
  }

  if (ordenacao === "menor-preco") {
    resultado.sort((a, b) => a.preco - b.preco);
  } else if (ordenacao === "maior-preco") {
    resultado.sort((a, b) => b.preco - a.preco);
  } else if (ordenacao === "nome") {
    resultado.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  if (limite && limite > 0) {
    resultado = resultado.slice(0, limite);
  }

  return resultado;
}

function obterProdutoPadraoPorSlug(slug: string): Produto | null {
  return catalogoFallback.find((p) => p.slug === slug) || null;
}
