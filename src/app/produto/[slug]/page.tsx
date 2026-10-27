import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Cpu,
  Layers,
} from "lucide-react";
import { buscarProdutoPorSlug } from "@/lib/catalog";
import { ProductPurchaseSection } from "@/components/ProductPurchaseSection";

interface ProdutoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProdutoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const produto = await buscarProdutoPorSlug(slug);

  if (!produto) {
    return {
      title: "Produto não encontrado",
    };
  }

  return {
    title: produto.nome,
    description: produto.descricao,
  };
}

export default async function PaginaProdutoDetalhes({ params }: ProdutoPageProps) {
  const { slug } = await params;
  const produto = await buscarProdutoPorSlug(slug);

  if (!produto) {
    notFound();
  }

  const emEstoque = produto.quantidadeEstoque > 0;

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb de Navegação */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-cyan-400 transition">
          Início
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <Link href="/catalogo" className="hover:text-cyan-400 transition">
          Catálogo
        </Link>
        {produto.categoria && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <Link
              href={`/catalogo?categoria=${produto.categoria.slug}`}
              className="hover:text-cyan-400 transition"
            >
              {produto.categoria.nome}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-slate-200 font-medium truncate max-w-xs">
          {produto.nome}
        </span>
      </nav>

      {/* Grid Principal de Apresentação */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna da Imagem (5 colunas no Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={produto.imagemUrl}
              alt={produto.nome}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-3">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Produto original lacrado com garantia direta da NexaCore.</span>
          </div>
        </div>

        {/* Coluna de Informações e Compra (7 colunas no Desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          <div>
            {/* Categoria e Status */}
            <div className="flex items-center gap-3 mb-3">
              {produto.categoria && (
                <Link
                  href={`/catalogo?categoria=${produto.categoria.slug}`}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 hover:border-cyan-600 transition"
                >
                  {produto.categoria.nome}
                </Link>
              )}

              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    emEstoque ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span className={emEstoque ? "text-emerald-400" : "text-red-400"}>
                  {emEstoque
                    ? `${produto.quantidadeEstoque} unidades disponíveis`
                    : "Produto Esgotado"}
                </span>
              </div>
            </div>

            {/* Nome do Produto */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-6">
              {produto.nome}
            </h1>

            {/* Componente Interativo de Compra */}
            <ProductPurchaseSection produto={produto} />
          </div>

          {/* Selos de Benefício do Produto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-900">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-white">Pronta Entrega</div>
                <div className="text-slate-400">Envio com rastreio</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-white">Garantia Nacional</div>
                <div className="text-slate-400">12 meses de cobertura</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <RotateCcw className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-white">Compra Segura</div>
                <div className="text-slate-400">Suporte especializado</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição e Especificações Técnicas */}
      <div className="mt-16 pt-10 border-t border-slate-900">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white">Descrição e Especificações Técnicas</h2>
        </div>

        <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 sm:p-8 text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
          <p>{produto.descricao}</p>
          <p className="text-xs text-slate-400">
            Todos os produtos comercializados pela <strong>NexaCore</strong> passam por rigoroso controle de procedência, sendo entregues em embalagens reforçadas para a proteção de componentes eletrônicos sensíveis.
          </p>
        </div>
      </div>
    </div>
  );
}
