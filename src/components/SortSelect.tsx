"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

export function SortSelect({ ordenacaoAtual }: { ordenacaoAtual: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lidarComMudanca = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ordenacao", e.target.value);
    router.push(`/catalogo?${params.toString()}`);
  };

  return (
    <div className="relative flex items-center">
      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
      <select
        value={ordenacaoAtual}
        onChange={lidarComMudanca}
        className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-6 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
      >
        <option value="recentes">Mais Recentes</option>
        <option value="menor-preco">Menor Preço</option>
        <option value="maior-preco">Maior Preço</option>
        <option value="nome">Ordem Alfabética</option>
      </select>
    </div>
  );
}
