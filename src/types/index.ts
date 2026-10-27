/**
 * Definições de Tipos TypeScript Compartilhados — NexaCore
 */

export type PerfilUsuario = "CLIENTE" | "ADMIN";
export type StatusUsuario = "ATIVO" | "INATIVO";

export interface UsuarioPublico {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
  dataCadastro: Date | string;
}

export type StatusPedido = "PENDENTE" | "PAGO" | "EM_SEPARACAO" | "ENVIADO" | "ENTREGUE" | "CANCELADO";

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string | null;
  ativo: boolean;
}

export interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  categoriaId: string;
  categoria?: Categoria;
  preco: number;
  quantidadeEstoque: number;
  imagemUrl: string;
  ativo: boolean;
  dataCadastro: Date | string;
  dataAtualizacao?: Date | string;
}

export interface ItemCarrinho {
  id: string; // ID do produto
  nome: string;
  slug: string;
  preco: number;
  quantidade: number;
  quantidadeEstoque: number;
  imagemUrl: string;
}

export interface ResumoCarrinho {
  itens: ItemCarrinho[];
  quantidadeTotal: number;
  valorTotal: number;
}

export interface ItemPedidoDetalhado {
  id: string;
  pedidoId: string;
  produtoId: string;
  produtoNome: string;
  produtoImagem?: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface PedidoDetalhado {
  id: string;
  usuarioId: string;
  usuarioNome?: string;
  usuarioEmail?: string;
  dataPedido: Date | string;
  valorTotal: number;
  status: StatusPedido;
  itens: ItemPedidoDetalhado[];
}

export interface MetricasAdmin {
  totalProdutosAtivos: number;
  totalPedidos: number;
  totalVendas: number;
  produtosEstoqueBaixo: number;
  pedidosRecentes: PedidoDetalhado[];
}
