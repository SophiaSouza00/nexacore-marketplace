import { prisma } from "@/lib/db";
import { PedidoDetalhado, StatusPedido } from "@/types";

/**
 * Consulta os pedidos de um usuário garantindo isolamento total de dados (Prevenção contra IDOR).
 */
export async function listarPedidosUsuario(usuarioId: string): Promise<PedidoDetalhado[]> {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId,
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        dataPedido: "desc",
      },
    });

    return pedidos.map((p) => ({
      id: p.id,
      usuarioId: p.usuarioId,
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
  } catch (erro) {
    console.warn("Aviso ao buscar pedidos no banco de dados. Retornando lista resiliente:", erro);
    return [];
  }
}

/**
 * Busca os detalhes de um pedido específico com verificação de autorização (Anti-IDOR).
 * Se o requisitante não for ADMIN, o pedido só é retornado se pertencer ao próprio usuário.
 */
export async function buscarPedidoPorId(
  pedidoId: string,
  usuarioId: string,
  isAdmin: boolean = false
): Promise<PedidoDetalhado | null> {
  try {
    const whereClause: { id: string; usuarioId?: string } = { id: pedidoId };
    if (!isAdmin) {
      whereClause.usuarioId = usuarioId;
    }

    const pedido = await prisma.pedido.findFirst({
      where: whereClause,
      include: {
        usuario: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!pedido) return null;

    return {
      id: pedido.id,
      usuarioId: pedido.usuarioId,
      usuarioNome: pedido.usuario?.nome,
      usuarioEmail: pedido.usuario?.email,
      dataPedido: pedido.dataPedido,
      valorTotal: Number(pedido.valorTotal),
      status: pedido.status as StatusPedido,
      itens: pedido.itens.map((item) => ({
        id: item.id,
        pedidoId: item.pedidoId,
        produtoId: item.produtoId,
        produtoNome: item.produto?.nome || "Hardware NexaCore",
        produtoImagem: item.produto?.imagemUrl,
        quantidade: item.quantidade,
        precoUnitario: Number(item.precoUnitario),
        subtotal: Number(item.subtotal),
      })),
    };
  } catch (erro) {
    console.warn("Aviso ao buscar pedido por id:", erro);
    return null;
  }
}
