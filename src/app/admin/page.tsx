import React from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";
import { obterMetricasDashboard } from "@/lib/admin";
import { formatarPreco, formatarDataHora } from "@/lib/formatters";

export default async function AdminDashboardPage() {
  const metricas = await obterMetricasDashboard();

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Visão Geral */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Painel de Controle NexaCore
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visão consolidada de inventário de hardware, vendas e métricas operacionais.
          </p>
        </div>

        <Link
          href="/admin/produtos#novo"
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Produto</span>
        </Link>
      </div>

      {/* Grid com 4 Indicadores Chave (Métricas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Produtos Ativos */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Produtos Ativos</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {metricas.totalProdutosAtivos}
            </div>
            <span className="text-[11px] text-cyan-400 font-medium">Disponíveis na loja</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total de Pedidos */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total de Pedidos</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {metricas.totalPedidos}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">Compras registradas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Faturamento Total */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Faturamento Bruto</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">
              {formatarPreco(metricas.totalVendas)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Receita acumulada</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Estoque Baixo */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Estoque Baixo</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
              {metricas.produtosEstoqueBaixo}
            </div>
            <span className="text-[11px] text-amber-500 font-medium">Itens com ≤ 5 unidades</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos Recentes */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Pedidos Recentes</h2>
            <p className="text-xs text-slate-400">Últimas transações realizadas na plataforma.</p>
          </div>
          <Link
            href="/admin/pedidos"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
          >
            <span>Ver todos os pedidos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metricas.pedidosRecentes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Identificador</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metricas.pedidosRecentes.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white">{pedido.id}</td>
                    <td className="p-4 text-slate-300">
                      <div className="font-semibold text-white">{pedido.usuarioNome || "Cliente"}</div>
                      <div className="text-[10px] text-slate-500">{pedido.usuarioEmail}</div>
                    </td>
                    <td className="p-4 text-slate-400">{formatarDataHora(pedido.dataPedido)}</td>
                    <td className="p-4 font-bold text-cyan-400">
                      {formatarPreco(pedido.valorTotal)}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {pedido.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 text-slate-600 mb-2" />
            <span>Nenhum pedido recente registrado ainda.</span>
          </div>
        )}
      </div>
    </div>
  );
}
