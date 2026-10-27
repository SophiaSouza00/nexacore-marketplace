"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
} from "lucide-react";
import { useCart } from "./CartProvider";
import { logoutAction } from "@/actions/auth";
import { SessaoUsuario } from "@/lib/auth";

interface HeaderProps {
  usuario?: SessaoUsuario | null;
}

export function Header({ usuario }: HeaderProps) {
  const router = useRouter();
  const { quantidadeTotal } = useCart();
  const [termoBusca, setTermoBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  const lidarComBusca = (e: React.FormEvent) => {
    e.preventDefault();
    if (termoBusca.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(termoBusca.trim())}`);
      setMenuAberto(false);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 transition-all">
      {/* Barra Superior Informativa */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-slate-800/80 text-xs text-slate-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Hardware de alta performance com garantia e procedência na{" "}
            <strong className="text-cyan-400">NexaCore</strong>
          </p>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <Link href="/pedidos" className="hover:text-cyan-400 transition flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              <span>Acompanhar Pedido</span>
            </Link>
            {usuario?.perfil === "ADMIN" && (
              <>
                <span className="text-slate-700">|</span>
                <Link
                  href="/admin"
                  className="hover:text-cyan-400 text-cyan-400 font-semibold transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Painel do Administrador</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal do Cabeçalho */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Marca / Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              NexaCore
            </span>
            <span className="text-[11px] block text-slate-400 font-medium -mt-1 tracking-wider uppercase">
              Informática & Hardware
            </span>
          </div>
        </Link>

        {/* Barra de Pesquisa (Desktop) */}
        <form
          onSubmit={lidarComBusca}
          className="hidden md:flex flex-1 max-w-lg mx-6 relative"
        >
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar processadores, placas de vídeo, periféricos..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3 py-1 bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-300 rounded-lg text-xs font-semibold transition"
          >
            Buscar
          </button>
        </form>

        {/* Navegação e Ações Rápidas (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/catalogo"
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition"
          >
            Catálogo
          </Link>

          {/* Autenticação / Perfil */}
          {usuario ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white max-w-[120px] truncate">
                    {usuario.nome}
                  </span>
                  <span className="text-[10px] text-cyan-400">
                    {usuario.perfil === "ADMIN" ? "Administrador" : "Cliente"}
                  </span>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Sair da conta"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Entrar</span>
            </Link>
          )}

          {/* Botão do Carrinho */}
          <Link
            href="/carrinho"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 transition active:scale-95 relative"
            aria-label="Carrinho de Compras"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Carrinho</span>
            {quantidadeTotal > 0 && (
              <span className="bg-slate-950 text-cyan-400 text-xs font-extrabold px-2 py-0.5 rounded-full border border-cyan-400/30">
                {quantidadeTotal}
              </span>
            )}
          </Link>
        </div>

        {/* Botões Mobile (Carrinho e Menu Hambúrguer) */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/carrinho"
            className="relative p-2.5 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            aria-label="Carrinho de Compras"
          >
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            {quantidadeTotal > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {quantidadeTotal}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2.5 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            aria-label="Alternar Menu"
          >
            {menuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Aberto em Dispositivos Móveis */}
      {menuAberto && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={lidarComBusca} className="relative">
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          <div className="flex flex-col space-y-2 pt-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMenuAberto(false)}
              className="p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-cyan-400"
            >
              Página Inicial
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMenuAberto(false)}
              className="p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-cyan-400"
            >
              Catálogo de Produtos
            </Link>
            <Link
              href="/pedidos"
              onClick={() => setMenuAberto(false)}
              className="p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-cyan-400"
            >
              Meus Pedidos
            </Link>

            {usuario ? (
              <div className="pt-2 border-t border-slate-800">
                <div className="p-2.5 text-xs text-slate-400 flex items-center justify-between">
                  <span>Logado como: <strong className="text-white">{usuario.nome}</strong></span>
                  <span className="text-cyan-400 uppercase text-[10px] font-bold">
                    {usuario.perfil}
                  </span>
                </div>
                {usuario.perfil === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuAberto(false)}
                    className="block p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-semibold mb-2"
                  >
                    Painel do Administrador
                  </Link>
                )}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-left p-2.5 rounded-lg text-red-400 hover:bg-slate-900 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuAberto(false)}
                className="p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-cyan-400 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Entrar ou Cadastrar</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
