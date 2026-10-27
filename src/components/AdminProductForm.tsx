"use client";

import React, { useActionState, useState } from "react";
import { Plus, Check, AlertCircle, Cpu, Image as ImageIcon } from "lucide-react";
import { cadastrarProdutoAction, RespostaAcaoAdmin } from "@/actions/admin";
import { Categoria } from "@/types";

interface AdminProductFormProps {
  categorias: Categoria[];
}

export function AdminProductForm({ categorias }: AdminProductFormProps) {
  const [aberto, setAberto] = useState(false);
  const [estado, formAction, carregando] = useActionState<RespostaAcaoAdmin | null, FormData>(
    cadastrarProdutoAction,
    null
  );

  return (
    <div id="novo" className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Cadastrar Novo Produto de Hardware</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adicione novos processadores, placas de vídeo e memórias ao catálogo da NexaCore.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{aberto ? "Ocultar Formulário" : "Abrir Formulário"}</span>
        </button>
      </div>

      {aberto && (
        <form action={formAction} className="mt-6 pt-6 border-t border-slate-800 space-y-4">
          {estado?.mensagem && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                estado.sucesso
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {estado.sucesso ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{estado.mensagem}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome do Produto */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="nome">
                Nome Completo do Produto
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                placeholder="Ex: Processador AMD Ryzen 9 7900X (12C/24T, 5.4GHz)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="categoriaId">
                Categoria / Departamento
              </label>
              <select
                id="categoriaId"
                name="categoriaId"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="preco">
                Preço em Reais (R$)
              </label>
              <input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="Ex: 3499.90"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Quantidade em Estoque */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="quantidadeEstoque">
                Quantidade Inicial em Estoque
              </label>
              <input
                id="quantidadeEstoque"
                name="quantidadeEstoque"
                type="number"
                min="0"
                required
                defaultValue="10"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="imagemUrl">
                URL da Foto do Hardware
              </label>
              <div className="relative">
                <input
                  id="imagemUrl"
                  name="imagemUrl"
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <ImageIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Descrição e Especificações */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="descricao">
                Especificações Técnicas e Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={3}
                required
                placeholder="Detalhes de frequência, TDP, soquete, memória de vídeo, conexões e certificações."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {carregando ? (
              <span>Gravando produto no banco...</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Salvar Produto no Catálogo</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
