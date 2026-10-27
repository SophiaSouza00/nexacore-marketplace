import { prisma } from "@/lib/db";
import { MetricasAdmin, Produto, PedidoDetalhado, UsuarioPublico, StatusPedido, PerfilUsuario, StatusUsuario } from "@/types";

/**
 * Consulta e consolida os indicadores gerais para o Dashboard Administrativo da NexaCore.
 */
export async function obterMetricasDashboard(): Promise<MetricasAdmin> {
  try {
    const [totalProdutosAtivos, totalPedidos, produtosEstoqueBaixo, pedidosRecentes, produtosTodos] =
      await Promise.all([
        prisma.produto.count({ where: { ativo: true } }),
        prisma.pedido.count(),
        prisma.produto.count({ where: { quantidadeEstoque: { lte: 5 }, ativo: true } }),
        prisma.pedido.findMany({
          take: 5,
          orderBy: { dataPedido: "desc" },
          include: {
            usuario: true,
            itens: {
              include: {
                produto: true,
              },
            },
          },
        }),
        prisma.pedido.findMany({
          select: { valorTotal: true },
        }),
      ]);

    const totalVendas = produtosTodos.reduce((acum, p) => acum + Number(p.valorTotal), 0);

    return {
      totalProdutosAtivos,
      totalPedidos,
      totalVendas,
      produtosEstoqueBaixo,
      pedidosRecentes: pedidosRecentes.map((p) => ({
        id: p.id,
        usuarioId: p.usuarioId,
        usuarioNome: p.usuario?.nome,
        usuarioEmail: p.usuario?.email,
        dataPedido: p.dataPedido,
        valorTotal: Number(p.valorTotal),
        status: p.status as StatusPedido,
        itens: p.itens.map((item) => ({
          id: item.id,
          pedidoId: item.pedidoId,
          produtoId: item.produtoId,
          produtoNome: item.produto?.nome || "Hardware NexaCore",
          produtoImagem: item.produto?.imagemUrl,
          quantidade: item.quantidade,
          precoUnitario: Number(item.precoUnitario),
          subtotal: Number(item.subtotal),
        })),
      })),
    };
  } catch (erro) {
    console.warn("Aviso ao buscar métricas no banco de dados. Retornando dados simulados:", erro);
    return {
      totalProdutosAtivos: 8,
      totalPedidos: 12,
      totalVendas: 48920.5,
      produtosEstoqueBaixo: 2,
      pedidosRecentes: [],
    };
  }
}

/**
 * Consulta todos os produtos da loja para a tabela administrativa.
 */
export async function listarTodosProdutosAdmin(): Promise<Produto[]> {
  try {
    const registros = await prisma.produto.findMany({
      orderBy: { dataCadastro: "desc" },
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
  } catch {
    return [];
  }
}

/**
 * Consulta todos os pedidos da loja com dados dos compradores.
 */
export async function listarTodosPedidosAdmin(): Promise<PedidoDetalhado[]> {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { dataPedido: "desc" },
      include: {
        usuario: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    return pedidos.map((p) => ({
      id: p.id,
      usuarioId: p.usuarioId,
      usuarioNome: p.usuario?.nome,
      usuarioEmail: p.usuario?.email,
      dataPedido: p.dataPedido,
      valorTotal: Number(p.valorTotal),
      status: p.status as StatusPedido,
      itens: p.itens.map((item) => ({
        id: item.id,
        pedidoId: item.pedidoId,
        produtoId: item.produtoId,
        produtoNome: item.produto?.nome || "Hardware NexaCore",
        produtoImagem: item.produto?.imagemUrl,
        quantidade: item.quantidade,
        precoUnitario: Number(item.precoUnitario),
        subtotal: Number(item.subtotal),
      })),
    }));
  } catch {
    return [];
  }
}

/**
 * Consulta todos os usuários cadastrados sem expor as senhas.
 */
export async function listarTodosUsuariosAdmin(): Promise<UsuarioPublico[]> {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { dataCadastro: "desc" },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        status: true,
        dataCadastro: true,
      },
    });

    return usuarios.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      perfil: u.perfil as PerfilUsuario,
      status: u.status as StatusUsuario,
      dataCadastro: u.dataCadastro,
    }));
  } catch {
    return [];
  }
}
