"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatarPreco } from "@/lib/formatters";
import { finalizarPedidoAction } from "@/actions/orders";

export default function PaginaCheckout() {
  const { itens, valorTotal, quantidadeTotal, limparCarrinho } = useCart();

  const [formaPagamento, setFormaPagamento] = useState<"pix" | "cartao" | "boleto">("pix");
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pedidoConcluidoId, setPedidoConcluidoId] = useState<string | null>(null);

  const lidarComFinalizacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itens.length === 0) return;

    setProcessando(true);
    setErro(null);

    try {
      const payloadItens = itens.map((item) => ({
        id: item.id,
        quantidade: item.quantidade,
      }));

      const resultado = await finalizarPedidoAction(payloadItens);

      if (resultado.sucesso && resultado.pedidoId) {
        limparCarrinho();
        setPedidoConcluidoId(resultado.pedidoId);
      } else {
        setErro(resultado.mensagem || "Não foi possível finalizar o pedido.");
      }
    } catch {
      setErro("Ocorreu uma instabilidade na comunicação com o servidor.");
    } finally {
      setProcessando(false);
    }
  };

  // Se o pedido acabou de ser finalizado com sucesso
  if (pedidoConcluidoId) {
    return (
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full text-center">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Compra Confirmada
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1 mb-3">
            Obrigado pelo seu pedido!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Seu pedido foi registrado com sucesso em nosso sistema com reserva atômica de estoque e preservação dos preços de compra.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 inline-block text-xs text-slate-300 mb-8 font-mono">
            Código do Pedido: <strong className="text-cyan-400">{pedidoConcluidoId}</strong>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pedidos"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              Acompanhar Meus Pedidos
            </Link>
            <Link
              href="/catalogo"
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Se o carrinho estiver vazio ao acessar checkout
  if (itens.length === 0) {
    return (
      <div className="flex-1 py-20 px-4 max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
        <p className="text-xs text-slate-400 mb-6">
          Adicione itens ao seu carrinho antes de prosseguir para o checkout.
        </p>
        <Link
          href="/catalogo"
          className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl inline-block"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b border-slate-900 pb-6">
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
          <span>NexaCore</span>
          <span>/</span>
          <span>Finalização de Compra</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Checkout Seguro</h1>
      </div>

      {erro && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      <form onSubmit={lidarComFinalizacao} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Etapas de Checkout (7 Colunas no Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Box de Forma de Pagamento Simulado */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Forma de Pagamento (Ambiente Acadêmico)</span>
              </h2>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Simulação Ativa
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Conforme as diretrizes acadêmicas, não há cobrança real nesta versão. O pedido será processado com verificação e baixa do estoque.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFormaPagamento("pix")}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  formaPagamento === "pix"
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <QrCode className="w-5 h-5 mb-3" />
                <div>
                  <div className="text-xs font-bold text-white">PIX</div>
                  <div className="text-[10px] text-slate-500">Aprovação imediata</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormaPagamento("cartao")}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  formaPagamento === "cartao"
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <CreditCard className="w-5 h-5 mb-3" />
                <div>
                  <div className="text-xs font-bold text-white">Cartão de Crédito</div>
                  <div className="text-[10px] text-slate-500">Até 12x sem juros</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormaPagamento("boleto")}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  formaPagamento === "boleto"
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <FileText className="w-5 h-5 mb-3" />
                <div>
                  <div className="text-xs font-bold text-white">Boleto Bancário</div>
                  <div className="text-[10px] text-slate-500">Compensação em 1 dia</div>
                </div>
              </button>
            </div>
          </div>

          {/* Garantias de Segurança */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Transação protegida por criptografia de ponta a ponta e cálculo verificado no servidor.
            </span>
          </div>
        </div>

        {/* Resumo Lateral do Pedido (5 Colunas no Desktop) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 sticky top-24">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-4">
              Itens do Pedido ({quantidadeTotal})
            </h2>

            {/* Lista simplificada de itens */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 divide-y divide-slate-800/60">
              {itens.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {item.quantidade}x
                    </span>
                    <span className="text-white truncate">{item.nome}</span>
                  </div>
                  <span className="font-semibold text-slate-300 shrink-0">
                    {formatarPreco(item.preco * item.quantidade)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totalizadores */}
            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatarPreco(valorTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Frete Especial</span>
                <span className="text-emerald-400 font-semibold">Grátis</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-base font-bold text-white">Total a Pagar</span>
                <span className="text-2xl font-extrabold text-cyan-400">
                  {formatarPreco(valorTotal)}
                </span>
              </div>
            </div>

            {/* Botão de Conclusão */}
            <button
              type="submit"
              disabled={processando}
              className="w-full py-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processando ? (
                <span>Validando estoque e gravando pedido...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirmar e Finalizar Pedido</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
