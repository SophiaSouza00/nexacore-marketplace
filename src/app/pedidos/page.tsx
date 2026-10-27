import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { obterSessaoAtual } from "@/lib/auth";
import { listarPedidosUsuario } from "@/lib/orders";
import { formatarPreco, formatarDataHora } from "@/lib/formatters";
import { StatusPedido } from "@/types";

interface PedidosPageProps {
  searchParams: Promise<{
    sucesso?: string;
  }>;
}

// Configuração visual para cada status do pedido
const statusConfig: Record<
  StatusPedido,
  { rotulo: string; classe: string; icone: React.ComponentType<{ className?: string }> }
> = {
  PENDENTE: {
    rotulo: "Aguardando Confirmação",
    classe: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icone: Clock,
  },
  PAGO: {
    rotulo: "Pagamento Confirmado",
    classe: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icone: CheckCircle2,
  },
  EM_SEPARACAO: {
    rotulo: "Em Separação no Estoque",
    classe: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    icone: Package,
  },
  ENVIADO: {
    rotulo: "Em Transporte",
    classe: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    icone: Truck,
  },
  ENTREGUE: {
    rotulo: "Pedido Entregue",
    classe: "bg-green-500/10 text-green-400 border-green-500/30",
    icone: CheckCircle2,
  },
  CANCELADO: {
    rotulo: "Pedido Cancelado",
    classe: "bg-red-500/10 text-red-400 border-red-500/30",
    icone: XCircle,
  },
};

export default async function PaginaPedidos({ searchParams }: PedidosPageProps) {
  const usuario = await obterSessaoAtual();

  if (!usuario) {
    redirect("/login?redirecionar=/pedidos&mensagem=Faca+login+para+ver+seus+pedidos");
  }

  const parametros = await searchParams;
  const pedidos = await listarPedidosUsuario(usuario.id);

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Cabeçalho da Página */}
      <div className="mb-8 border-b border-slate-900 pb-6">
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
          <span>NexaCore</span>
          <span>/</span>
          <span>Minha Conta</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Meus Pedidos</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Olá, <strong className="text-slate-200">{usuario.nome}</strong>. Acompanhe o status e histórico de todas as suas compras de hardware.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Ir para o Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Alerta de Pedido Realizado com Sucesso */}
      {parametros.sucesso && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Seu pedido foi registrado com sucesso e já está sendo processado!</span>
        </div>
      )}

      {/* Lista de Pedidos do Cliente */}
      {pedidos.length > 0 ? (
        <div className="space-y-6">
          {pedidos.map((pedido) => {
            const config = statusConfig[pedido.status] || statusConfig.PENDENTE;
            const IconeStatus = config.icone;

            return (
              <div
                key={pedido.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl"
              >
                {/* Barra de Informações do Pedido */}
                <div className="p-5 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
                    <div>
                      <span className="block text-[11px] text-slate-500">Número do Pedido</span>
                      <strong className="text-white font-mono text-sm">{pedido.id}</strong>
                    </div>

                    <div className="hidden sm:block h-8 w-px bg-slate-800" />

                    <div>
                      <span className="block text-[11px] text-slate-500">Data da Compra</span>
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{formatarDataHora(pedido.dataPedido)}</span>
                      </div>
                    </div>

                    <div className="hidden sm:block h-8 w-px bg-slate-800" />

                    <div>
                      <span className="block text-[11px] text-slate-500">Total Pago</span>
                      <strong className="text-cyan-400 font-extrabold text-sm">
                        {formatarPreco(pedido.valorTotal)}
                      </strong>
                    </div>
                  </div>

                  {/* Badge de Status */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.classe}`}
                  >
                    <IconeStatus className="w-4 h-4" />
                    <span>{config.rotulo}</span>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="p-5 sm:p-6 divide-y divide-slate-800/60">
                  {pedido.itens.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {item.produtoImagem ? (
                          <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.produtoImagem}
                              alt={item.produtoNome}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center text-slate-600">
                            <Package className="w-6 h-6" />
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-semibold text-white leading-snug">
                            {item.produtoNome}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Quantidade: <strong className="text-slate-200">{item.quantidade}x</strong>{" "}
                            • Preço unitário histórico:{" "}
                            <strong className="text-slate-200">
                              {formatarPreco(item.precoUnitario)}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                        <span className="text-[11px] text-slate-500 block">Subtotal</span>
                        <span className="text-sm font-bold text-white">
                          {formatarPreco(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rodapé com Garantia */}
                <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Garantia de 12 meses ativa para todos os componentes deste pedido.</span>
                  </div>
                  <span className="text-slate-500 hidden sm:inline">Preços históricos protegidos</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado Vazio de Pedidos */
        <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-900/30 rounded-3xl border border-slate-900">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-cyan-400/60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Você ainda não realizou nenhum pedido</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
            Quando você realizar suas compras de hardware na NexaCore, o histórico completo e o rastreio aparecerão aqui.
          </p>
          <Link
            href="/catalogo"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
          >
            Começar a Comprar
          </Link>
        </div>
      )}
    </div>
  );
}
