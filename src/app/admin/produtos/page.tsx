import React from "react";
import Link from "next/link";
import { Package, ExternalLink } from "lucide-react";
import { listarTodosProdutosAdmin } from "@/lib/admin";
import { listarCategorias } from "@/lib/catalog";
import { formatarPreco, formatarData } from "@/lib/formatters";
import { AdminProductForm } from "@/components/AdminProductForm";
import { AdminProductToggle } from "@/components/AdminProductToggle";

export default async function AdminProdutosPage() {
  const [produtos, categorias] = await Promise.all([
    listarTodosProdutosAdmin(),
    listarCategorias(),
  ]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="border-b border-slate-900 pb-6">
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
          <span>Admin</span>
          <span>/</span>
          <span>Inventário</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Gestão de Produtos e Estoque
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Cadastre novos produtos, gerencie preços, acompanhe estoques e ative/desative componentes.
        </p>
      </div>

      {/* Formulário de Novo Produto */}
      <AdminProductForm categorias={categorias} />

      {/* Tabela de Produtos */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Todos os Produtos Cadastrados ({produtos.length})
            </h2>
          </div>
        </div>

        {produtos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Departamento</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4">Data Cadastro</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={produto.imagemUrl}
                            alt={produto.nome}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="max-w-xs">
                          <span className="font-semibold text-white block truncate">
                            {produto.nome}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {produto.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      {produto.categoria?.nome || "-"}
                    </td>

                    <td className="p-4 font-bold text-white">
                      {formatarPreco(produto.preco)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          produto.quantidadeEstoque <= 0
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : produto.quantidadeEstoque <= 5
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {produto.quantidadeEstoque} un.
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {formatarData(produto.dataCadastro)}
                    </td>

                    <td className="p-4 text-center">
                      <AdminProductToggle
                        produtoId={produto.id}
                        ativoInicial={produto.ativo}
                      />
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        href={`/produto/${produto.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition inline-block"
                        title="Ver página na loja"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-xs text-slate-400">
            Nenhum produto cadastrado no banco de dados.
          </div>
        )}
      </div>
    </div>
  );
}
