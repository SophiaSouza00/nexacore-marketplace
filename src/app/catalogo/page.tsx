import React, { Suspense } from "react";
import Link from "next/link";
import { Search, PackageSearch, X } from "lucide-react";
import { listarProdutos, listarCategorias } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";

interface CatalogoPageProps {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    ordenacao?: "recentes" | "menor-preco" | "maior-preco" | "nome";
  }>;
}

export default async function PaginaCatalogo({ searchParams }: CatalogoPageProps) {
  const parametros = await searchParams;
  const termo = parametros.q || "";
  const categoriaSlug = parametros.categoria || "todas";
  const ordenacao = parametros.ordenacao || "recentes";

  const [produtos, categorias] = await Promise.all([
    listarProdutos({ termo, categoriaSlug, ordenacao }),
    listarCategorias(),
  ]);

  const categoriaAtiva = categorias.find((c) => c.slug === categoriaSlug);

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Cabeçalho do Catálogo */}
      <div className="mb-8 border-b border-slate-900 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
              <span>NexaCore</span>
              <span>/</span>
              <span>Catálogo Geral</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              {categoriaAtiva ? categoriaAtiva.nome : "Hardware & Informática"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {produtos.length} {produtos.length === 1 ? "produto encontrado" : "produtos encontrados"}
              {termo ? ` para a busca "${termo}"` : ""}
            </p>
          </div>

          {/* Barra de Busca e Ordenação */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form action="/catalogo" method="GET" className="relative">
              <input
                type="text"
                name="q"
                defaultValue={termo}
                placeholder="Filtrar por nome..."
                className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              {categoriaSlug !== "todas" && (
                <input type="hidden" name="categoria" value={categoriaSlug} />
              )}
            </form>

            {/* Seletor de Ordenação */}
            <Suspense fallback={<div className="w-36 h-8 bg-slate-900 rounded-xl" />}>
              <SortSelect ordenacaoAtual={ordenacao} />
            </Suspense>
          </div>
        </div>

        {/* Pílulas de Filtro de Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
          <Link
            href={`/catalogo?${termo ? `q=${termo}&` : ""}ordenacao=${ordenacao}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              categoriaSlug === "todas"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
            }`}
          >
            Todos os Produtos
          </Link>

          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${cat.slug}${termo ? `&q=${termo}` : ""}&ordenacao=${ordenacao}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                categoriaSlug === cat.slug
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              {cat.nome}
            </Link>
          ))}
        </div>

        {/* Filtros Ativos (Remoção Rápida) */}
        {(termo || categoriaSlug !== "todas") && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-900/60 text-xs">
            <span className="text-slate-500">Filtros aplicados:</span>
            {termo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                Termo: &quot;{termo}&quot;
                <Link
                  href={`/catalogo?${categoriaSlug !== "todas" ? `categoria=${categoriaSlug}&` : ""}ordenacao=${ordenacao}`}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {categoriaSlug !== "todas" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                Categoria: {categoriaAtiva?.nome}
                <Link
                  href={`/catalogo?${termo ? `q=${termo}&` : ""}ordenacao=${ordenacao}`}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            <Link
              href="/catalogo"
              className="text-xs text-slate-400 hover:text-red-400 underline ml-2"
            >
              Limpar todos
            </Link>
          </div>
        )}
      </div>

      {/* Grade de Produtos ou Estado Vazio */}
      {produtos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-900/30 rounded-3xl border border-slate-900">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mb-4">
            <PackageSearch className="w-8 h-8 text-cyan-400/60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Nenhum produto de hardware encontrado
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
            Não encontramos itens correspondentes aos filtros selecionados. Tente buscar por outros termos ou explore todos os departamentos.
          </p>
          <Link
            href="/catalogo"
            className="px-6 py-2.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition"
          >
            Ver Todos os Produtos
          </Link>
        </div>
      )}
    </div>
  );
}
