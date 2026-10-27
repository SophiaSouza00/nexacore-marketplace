"use client";

import React, { useState } from "react";
import { ShoppingCart, Check, Plus, Minus, AlertCircle } from "lucide-react";
import { Produto } from "@/types";
import { formatarPreco } from "@/lib/formatters";
import { useCart } from "./CartProvider";

interface ProductPurchaseSectionProps {
  produto: Produto;
}

export function ProductPurchaseSection({ produto }: ProductPurchaseSectionProps) {
  const { adicionarItem } = useCart();
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const emEstoque = produto.quantidadeEstoque > 0;

  const incrementar = () => {
    if (quantidade < produto.quantidadeEstoque) {
      setQuantidade((prev) => prev + 1);
      setMensagemErro(null);
    } else {
      setMensagemErro(`Estoque máximo disponível: ${produto.quantidadeEstoque} unidades.`);
    }
  };

  const decrementar = () => {
    if (quantidade > 1) {
      setQuantidade((prev) => prev - 1);
      setMensagemErro(null);
    }
  };

  const lidarComAdicionar = () => {
    if (!emEstoque) return;

    const resultado = adicionarItem(
      {
        id: produto.id,
        nome: produto.nome,
        slug: produto.slug,
        preco: produto.preco,
        quantidadeEstoque: produto.quantidadeEstoque,
        imagemUrl: produto.imagemUrl,
      },
      quantidade
    );

    if (resultado.sucesso) {
      setAdicionado(true);
      setMensagemErro(null);
      setTimeout(() => setAdicionado(false), 2500);
    } else if (resultado.mensagem) {
      setMensagemErro(resultado.mensagem);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preço em Destaque */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="text-xs text-slate-400 mb-1">Preço à vista no NexaCore</div>
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {formatarPreco(produto.preco)}
        </div>
        <div className="text-xs text-cyan-400 mt-1">
          Em até 12x sem juros ou desconto especial à vista
        </div>
      </div>

      {/* Seletor de Quantidade e Ação de Compra */}
      {emEstoque ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-300">Quantidade:</span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={decrementar}
                disabled={quantidade <= 1}
                className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-bold text-white">
                {quantidade}
              </span>
              <button
                type="button"
                onClick={incrementar}
                disabled={quantidade >= produto.quantidadeEstoque}
                className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-slate-500">
              ({produto.quantidadeEstoque} disponíveis)
            </span>
          </div>

          {mensagemErro && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{mensagemErro}</span>
            </div>
          )}

          <button
            type="button"
            onClick={lidarComAdicionar}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-3 shadow-lg ${
              adicionado
                ? "bg-emerald-500 text-slate-950 shadow-emerald-500/20"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 active:scale-98"
            }`}
          >
            {adicionado ? (
              <>
                <Check className="w-5 h-5" />
                <span>{quantidade} item(ns) adicionado(s) com sucesso!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Adicionar ao Carrinho</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <div className="text-sm font-bold text-red-400 mb-1">Produto Indisponível</div>
          <p className="text-xs text-slate-400">
            Este item está temporariamente esgotado em nosso estoque. Volte em breve para novas reposições.
          </p>
        </div>
      )}
    </div>
  );
}
