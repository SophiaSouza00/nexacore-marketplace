"use client";

import React, { useState } from "react";
import { alternarStatusProdutoAction } from "@/actions/admin";

interface AdminProductToggleProps {
  produtoId: string;
  ativoInicial: boolean;
}

export function AdminProductToggle({ produtoId, ativoInicial }: AdminProductToggleProps) {
  const [ativo, setAtivo] = useState(ativoInicial);
  const [carregando, setCarregando] = useState(false);

  const lidarComAlternancia = async () => {
    setCarregando(true);
    try {
      const res = await alternarStatusProdutoAction(produtoId);
      if (res.sucesso) {
        setAtivo(!ativo);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <button
      type="button"
      onClick={lidarComAlternancia}
      disabled={carregando}
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
        ativo
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
      }`}
    >
      {carregando ? "..." : ativo ? "Ativo" : "Inativo"}
    </button>
  );
}
