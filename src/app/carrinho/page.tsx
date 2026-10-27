"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatarPreco } from "@/lib/formatters";

export default function PaginaCarrinho() {
  const {
    itens,
    quantidadeTotal,
    valorTotal,
    atualizarQuantidade,
    removerItem,
    limparCarrinho,
  } = useCart();

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Título da Página */}
      <div className="mb-8 border-b border-slate-900 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
            <span>NexaCore</span>
            <span>/</span>
            <span>Meu Carrinho</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Carrinho de Compras</h1>
        </div>

        {itens.length > 0 && (
          <button
            onClick={limparCarrinho}
            className="text-xs text-slate-400 hover:text-red-400 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Esvaziar carrinho</span>
          </button>
        )}
      </div>

      {itens.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lista de Itens do Carrinho (8 Colunas no Desktop) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
              {itens.map((item) => {
                const subtotal = item.preco * item.quantidade;
                return (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/90 transition"
                  >
                    {/* Imagem e Dados do Produto */}
                    <div className="flex items-center gap-4 flex-1">
                      <Link
                        href={`/produto/${item.slug}`}
                        className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center p-2"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imagemUrl}
                          alt={item.nome}
                          className="w-full h-full object-contain"
                        />
                      </Link>

                      <div className="space-y-1">
                        <Link
                          href={`/produto/${item.slug}`}
                          className="text-sm font-semibold text-white hover:text-cyan-400 transition line-clamp-2"
                        >
                          {item.nome}
                        </Link>
                        <div className="text-xs text-slate-400">
                          Preço unitário:{" "}
                          <strong className="text-slate-200">
                            {formatarPreco(item.preco)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Controles de Quantidade e Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Seletor de Quantidade */}
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                          className="p-2 text-slate-400 hover:text-white transition"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-white">
                          {item.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                          disabled={item.quantidade >= item.quantidadeEstoque}
                          className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal do Item */}
                      <div className="text-right min-w-[100px]">
                        <div className="text-xs text-slate-500">Subtotal</div>
                        <div className="text-base font-bold text-cyan-400">
                          {formatarPreco(subtotal)}
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button
                        type="button"
                        onClick={() => removerItem(item.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-950 rounded-lg transition"
                        title="Remover produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <Link
                href="/catalogo"
                className="hover:text-cyan-400 transition flex items-center gap-1.5"
              >
                <span>← Continuar comprando mais produtos</span>
              </Link>
              <span>{quantidadeTotal} item(ns) no carrinho</span>
            </div>
          </div>

          {/* Resumo do Pedido (4 Colunas no Desktop) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 sticky top-24">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">
                Resumo da Compra
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal ({quantidadeTotal} itens)</span>
                  <span>{formatarPreco(valorTotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Frete Especial Hardware</span>
                  <span className="text-emerald-400 font-semibold">Grátis</span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-white">Valor Total</span>
                  <span className="text-2xl font-extrabold text-cyan-400">
                    {formatarPreco(valorTotal)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 text-right">
                  Cálculo definitivo e verificação de estoque validados no servidor
                </div>
              </div>

              {/* Botão de Checkout */}
              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 text-sm text-center"
              >
                <span>Avançar para o Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Selo de Garantia */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Compra segura com integridade e reserva atômica de estoque.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Estado do Carrinho Vazio */
        <div className="py-24 text-center flex flex-col items-center justify-center bg-slate-900/30 rounded-3xl border border-slate-900">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-cyan-400/60" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8">
            Você ainda não adicionou nenhum componente de hardware ou acessório. Acesse nosso catálogo para encontrar os melhores produtos.
          </p>
          <Link
            href="/catalogo"
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Explorar Catálogo NexaCore</span>
          </Link>
        </div>
      )}
    </div>
  );
}
