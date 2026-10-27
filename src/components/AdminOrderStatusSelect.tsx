"use client";

import React, { useState } from "react";
import { atualizarStatusPedidoAction } from "@/actions/admin";
import { StatusPedido } from "@/types";

interface AdminOrderStatusSelectProps {
  pedidoId: string;
  statusAtual: StatusPedido;
}

const statusOpcoes: { valor: StatusPedido; rotulo: string }[] = [
  { valor: "PENDENTE", rotulo: "Pendente" },
  { valor: "PAGO", rotulo: "Pago" },
  { valor: "EM_SEPARACAO", rotulo: "Em Separação" },
  { valor: "ENVIADO", rotulo: "Enviado" },
  { valor: "ENTREGUE", rotulo: "Entregue" },
  { valor: "CANCELADO", rotulo: "Cancelado" },
];

export function AdminOrderStatusSelect({
  pedidoId,
  statusAtual,
}: AdminOrderStatusSelectProps) {
  const [status, setStatus] = useState<StatusPedido>(statusAtual);
  const [atualizando, setAtualizando] = useState(false);

  const lidarComMudanca = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoStatus = e.target.value as StatusPedido;
    setStatus(novoStatus);
    setAtualizando(true);

    try {
      await atualizarStatusPedidoAction(pedidoId, novoStatus);
    } finally {
      setAtualizando(false);
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={lidarComMudanca}
        disabled={atualizando}
        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
      >
        {statusOpcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      {atualizando && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      )}
    </div>
  );
}
