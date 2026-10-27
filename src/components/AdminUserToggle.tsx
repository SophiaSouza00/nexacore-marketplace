"use client";

import React, { useState } from "react";
import { alternarStatusUsuarioAction } from "@/actions/admin";
import { StatusUsuario } from "@/types";

interface AdminUserToggleProps {
  usuarioId: string;
  statusInicial: StatusUsuario;
  ehMesmoUsuario: boolean;
}

export function AdminUserToggle({
  usuarioId,
  statusInicial,
  ehMesmoUsuario,
}: AdminUserToggleProps) {
  const [status, setStatus] = useState<StatusUsuario>(statusInicial);
  const [carregando, setCarregando] = useState(false);

  const lidarComAlternancia = async () => {
    if (ehMesmoUsuario) return;
    setCarregando(true);

    try {
      const res = await alternarStatusUsuarioAction(usuarioId);
      if (res.sucesso) {
        setStatus(status === "ATIVO" ? "INATIVO" : "ATIVO");
      }
    } finally {
      setCarregando(false);
    }
  };

  if (ehMesmoUsuario) {
    return (
      <span className="text-[10px] text-slate-500 italic">Sua conta atual</span>
    );
  }

  return (
    <button
      type="button"
      onClick={lidarComAlternancia}
      disabled={carregando}
      className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition ${
        status === "ATIVO"
          ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
      }`}
    >
      {carregando ? "..." : status === "ATIVO" ? "Bloquear Conta" : "Ativar Conta"}
    </button>
  );
}
