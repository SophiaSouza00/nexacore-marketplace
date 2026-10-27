"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { Produto } from "@/types";
import { formatarPreco } from "@/lib/formatters";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
  const { adicionarItem } = useCart();
  const [adicionado, setAdicionado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const emEstoque = produto.quantidadeEstoque > 0;

  const lidarComAdicionar = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!emEstoque) return;

    const resultado = adicionarItem({
      id: produto.id,
      nome: produto.nome,
      slug: produto.slug,
      preco: produto.preco,
      quantidadeEstoque: produto.quantidadeEstoque,
      imagemUrl: produto.imagemUrl,
    });

    if (resultado.sucesso) {
      setAdicionado(true);
      setAviso(null);
      setTimeout(() => setAdicionado(false), 2000);
    } else if (resultado.mensagem) {
      setAviso(resultado.mensagem);
      setTimeout(() => setAviso(null), 3500);
    }
  };

  return (
    <div className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col overflow-hidden relative">
      {/* Imagem do Produto */}
      <Link
        href={`/produto/${produto.slug}`}
        className="relative aspect-square w-full bg-slate-950 overflow-hidden block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={produto.imagemUrl}
          alt={produto.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {produto.categoria && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-950/80 text-cyan-400 border border-slate-800 backdrop-blur-sm">
            {produto.categoria.nome}
          </span>
        )}

        {!emEstoque && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold">
              Produto Esgotado
            </span>
          </div>
        )}
      </Link>

      {/* Dados do Produto */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/produto/${produto.slug}`} className="block">
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 leading-snug group-hover:text-cyan-300 transition">
              {produto.nome}
            </h3>
          </Link>

          {/* Status do Estoque */}
          <div className="flex items-center gap-1.5 mb-4">
            <span
              className={`w-2 h-2 rounded-full ${
                emEstoque ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <span className="text-[11px] text-slate-400">
              {emEstoque
                ? `${produto.quantidadeEstoque} unidade(s) em estoque`
                : "Indisponível no momento"}
            </span>
          </div>
        </div>

        <div>
          {/* Preço */}
          <div className="text-xs text-slate-400 mb-0.5">Por apenas</div>
          <div className="text-xl font-extrabold text-white mb-4">
            {formatarPreco(produto.preco)}
          </div>

          {/* Feedback de Alerta de Estoque */}
          {aviso && (
            <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{aviso}</span>
            </div>
          )}

          {/* Botão de Adicionar ao Carrinho */}
          <button
            onClick={lidarComAdicionar}
            disabled={!emEstoque}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              !emEstoque
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : adicionado
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 active:scale-95"
            }`}
          >
            {adicionado ? (
              <>
                <Check className="w-4 h-4" />
                <span>Adicionado ao Carrinho!</span>
              </>
            ) : !emEstoque ? (
              <span>Esgotado</span>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Adicionar ao Carrinho</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
