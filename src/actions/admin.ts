"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { obterSessaoAtual } from "@/lib/auth";
import { StatusPedido } from "@/types";

/**
 * Validação de segurança no servidor: Exige estritamente perfil de Administrador.
 */
async function exigirAdminNoServidor() {
  const usuario = await obterSessaoAtual();
  if (!usuario || usuario.perfil !== "ADMIN") {
    throw new Error("Acesso não autorizado. Apenas administradores podem executar esta operação.");
  }
  return usuario;
}

const esquemaProduto = z.object({
  nome: z.string().trim().min(3, "O nome do produto deve ter no mínimo 3 caracteres."),
  categoriaId: z.string().min(1, "Selecione uma categoria válida."),
  preco: z.coerce.number().positive("O preço deve ser maior que zero."),
  quantidadeEstoque: z.coerce.number().int().min(0, "A quantidade de estoque não pode ser negativa."),
  descricao: z.string().trim().min(10, "A descrição técnica deve ter no mínimo 10 caracteres."),
  imagemUrl: z.string().trim().url("Informe uma URL de imagem válida (HTTP/HTTPS)."),
});

export interface RespostaAcaoAdmin {
  sucesso: boolean;
  mensagem: string;
}

/**
 * Cadastrar novo produto de hardware no catálogo.
 */
export async function cadastrarProdutoAction(
  _estadoAnterior: RespostaAcaoAdmin | null,
  formData: FormData
): Promise<RespostaAcaoAdmin> {
  await exigirAdminNoServidor();

  const dadosBrutos = {
    nome: formData.get("nome"),
    categoriaId: formData.get("categoriaId"),
    preco: formData.get("preco"),
    quantidadeEstoque: formData.get("quantidadeEstoque"),
    descricao: formData.get("descricao"),
    imagemUrl: formData.get("imagemUrl"),
  };

  const validacao = esquemaProduto.safeParse(dadosBrutos);
  if (!validacao.success) {
    const primeiroErro = validacao.error.issues[0]?.message || "Dados inválidos.";
    return { sucesso: false, mensagem: primeiroErro };
  }

  const { nome, categoriaId, preco, quantidadeEstoque, descricao, imagemUrl } = validacao.data;

  // Gerar slug único a partir do nome
  const baseSlug = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  try {
    await prisma.produto.create({
      data: {
        nome,
        slug,
        categoriaId,
        preco,
        quantidadeEstoque,
        descricao,
        imagemUrl,
        ativo: true,
      },
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/catalogo");
    revalidatePath("/");
    return { sucesso: true, mensagem: `Produto "${nome}" cadastrado com sucesso!` };
  } catch (erro: unknown) {
    const msg = erro instanceof Error ? erro.message : "Falha ao gravar no banco";
    return { sucesso: false, mensagem: `Erro ao cadastrar produto: ${msg}` };
  }
}

/**
 * Ativar ou desativar produto no catálogo.
 */
export async function alternarStatusProdutoAction(produtoId: string): Promise<RespostaAcaoAdmin> {
  await exigirAdminNoServidor();

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      return { sucesso: false, mensagem: "Produto não encontrado." };
    }

    const novoStatus = !produto.ativo;
    await prisma.produto.update({
      where: { id: produtoId },
      data: { ativo: novoStatus },
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/catalogo");
    return {
      sucesso: true,
      mensagem: `Produto "${produto.nome}" agora está ${novoStatus ? "ativo" : "inativo"}.`,
    };
  } catch {
    return { sucesso: false, mensagem: "Não foi possível alterar o status do produto." };
  }
}

/**
 * Atualizar status do pedido (Fluxo administrativo).
 */
export async function atualizarStatusPedidoAction(
  pedidoId: string,
  novoStatus: StatusPedido
): Promise<RespostaAcaoAdmin> {
  await exigirAdminNoServidor();

  try {
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: { status: novoStatus },
    });

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    revalidatePath("/pedidos");
    return { sucesso: true, mensagem: `Status do pedido atualizado para "${novoStatus}".` };
  } catch {
    return { sucesso: false, mensagem: "Não foi possível atualizar o status do pedido." };
  }
}

/**
 * Bloquear ou ativar a conta de um usuário.
 */
export async function alternarStatusUsuarioAction(usuarioId: string): Promise<RespostaAcaoAdmin> {
  const adminLogado = await exigirAdminNoServidor();

  if (usuarioId === adminLogado.id) {
    return { sucesso: false, mensagem: "Você não pode bloquear a sua própria conta administradora." };
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      return { sucesso: false, mensagem: "Usuário não encontrado." };
    }

    const novoStatus = usuario.status === "ATIVO" ? "INATIVO" : "ATIVO";
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { status: novoStatus },
    });

    revalidatePath("/admin/usuarios");
    return {
      sucesso: true,
      mensagem: `Usuário "${usuario.nome}" agora está ${novoStatus.toLowerCase()}.`,
    };
  } catch {
    return { sucesso: false, mensagem: "Não foi possível alterar o status do usuário." };
  }
}
