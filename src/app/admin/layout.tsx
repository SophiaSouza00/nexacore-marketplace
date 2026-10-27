import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Cpu,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { obterSessaoAtual } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await obterSessaoAtual();

  // Verificação estrita de segurança: somente perfil ADMIN
  if (!usuario || usuario.perfil !== "ADMIN") {
    redirect("/login?redirecionar=/admin&mensagem=Acesso+restrito+a+administradores");
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Barra Lateral Administrativa (Desktop) */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Admin */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">NexaCore</span>
              <span className="text-[10px] block font-bold text-cyan-400 uppercase tracking-wider">
                Painel Admin
              </span>
            </div>
          </div>

          {/* Navegação Administrativa */}
          <nav className="mt-6 space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Visão Geral</span>
            </Link>

            <Link
              href="/admin/produtos"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            >
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Produtos & Estoque</span>
            </Link>

            <Link
              href="/admin/pedidos"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>Gestão de Pedidos</span>
            </Link>

            <Link
              href="/admin/usuarios"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Gestão de Usuários</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-slate-800">
              <Link
                href="/catalogo"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition text-[11px]"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Loja NexaCore</span>
                </span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Rodapé da Barra Lateral com Perfil do Administrador */}
        <div className="pt-6 border-t border-slate-800 mt-6">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="font-semibold text-white truncate">{usuario.nome}</p>
                <p className="text-[10px] text-cyan-400">Administrador</p>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Sair do painel"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal do Painel */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
