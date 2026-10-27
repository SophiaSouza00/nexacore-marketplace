import React from "react";
import { ShoppingBag, Package } from "lucide-react";
import { listarTodosPedidosAdmin } from "@/lib/admin";
import { formatarPreco, formatarDataHora } from "@/lib/formatters";
import { AdminOrderStatusSelect } from "@/components/AdminOrderStatusSelect";

export default async function AdminPedidosPage() {
  const pedidos = await listarTodosPedidosAdmin();

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="border-b border-slate-900 pb-6">
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
          <span>Admin</span>
          <span>/</span>
          <span>Vendas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Gestão de Pedidos da Loja
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Acompanhe o fluxo de pedidos e atualize o ciclo de vida (Pendente ➔ Pago ➔ Em Separação ➔ Enviado ➔ Entregue).
        </p>
      </div>

      {/* Caixa Informativa sobre o Ciclo de Vida */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1">
        <strong className="text-white block">Status Oficiais Homologados:</strong>
        <p>
          • <span className="text-amber-400 font-semibold">PENDENTE</span>: Pedido criado aguardando confirmação.
          • <span className="text-emerald-400 font-semibold">PAGO</span>: Pagamento aprovado.
          • <span className="text-cyan-400 font-semibold">EM_SEPARACAO</span>: Hardware sendo testado e embalado.
          • <span className="text-purple-400 font-semibold">ENVIADO</span>: Postado para transporte com seguro.
          • <span className="text-green-400 font-semibold">ENTREGUE</span>: Concluído com sucesso.
          • <span className="text-red-400 font-semibold">CANCELADO</span>: Pedido estornado.
        </p>
      </div>

      {/* Tabela de Pedidos */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Histórico Geral de Pedidos ({pedidos.length})
            </h2>
          </div>
        </div>

        {pedidos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">ID Pedido</th>
                  <th className="p-4">Cliente Comprador</th>
                  <th className="p-4">Data e Hora</th>
                  <th className="p-4">Itens Comprados</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status / Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white">
                      {pedido.id}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-white">
                        {pedido.usuarioNome || "Cliente NexaCore"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {pedido.usuarioEmail}
                      </div>
                    </td>

                    <td className="p-4 text-slate-400">
                      {formatarDataHora(pedido.dataPedido)}
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        {pedido.itens.map((item) => (
                          <div
                            key={item.id}
                            className="text-[11px] text-slate-300 flex items-center gap-1.5 truncate"
                          >
                            <Package className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>
                              {item.quantidade}x {item.produtoNome} (
                              {formatarPreco(item.precoUnitario)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-cyan-400 text-sm">
                      {formatarPreco(pedido.valorTotal)}
                    </td>

                    <td className="p-4">
                      <AdminOrderStatusSelect
                        pedidoId={pedido.id}
                        statusAtual={pedido.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-xs text-slate-400">
            Nenhum pedido registrado no banco de dados até o momento.
          </div>
        )}
      </div>
    </div>
  );
}
