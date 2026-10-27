"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Cpu, UserPlus, Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";
import { cadastrarClienteAction, RespostaAcaoAuth } from "@/actions/auth";

export default function PaginaCadastro() {
  const [estado, formAction, carregando] = useActionState<RespostaAcaoAuth | null, FormData>(
    cadastrarClienteAction,
    null
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-slate-900/80 p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
        {/* Cabeçalho do Card */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              NexaCore
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Criar sua conta</h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre-se para comprar componentes de hardware e acompanhar seus pedidos.
          </p>
        </div>

        {/* Mensagem de Erro Geral */}
        {estado?.mensagem && !estado.sucesso && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{estado.mensagem}</span>
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form action={formAction} className="space-y-5">
          {/* Campo Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="nome">
              Nome Completo
            </label>
            <div className="relative">
              <input
                id="nome"
                name="nome"
                type="text"
                required
                placeholder="Ex: Ana Clara Silva"
                className={`w-full bg-slate-950 border ${
                  estado?.erros?.nome ? "border-red-500" : "border-slate-800 focus:border-cyan-500"
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition`}
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            {estado?.erros?.nome && (
              <p className="text-[11px] text-red-400 mt-1">{estado.erros.nome}</p>
            )}
          </div>

          {/* Campo E-mail */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="email">
              E-mail
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                className={`w-full bg-slate-950 border ${
                  estado?.erros?.email ? "border-red-500" : "border-slate-800 focus:border-cyan-500"
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition`}
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            {estado?.erros?.email && (
              <p className="text-[11px] text-red-400 mt-1">{estado.erros.email}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="senha">
              Senha (mínimo de 6 caracteres)
            </label>
            <div className="relative">
              <input
                id="senha"
                name="senha"
                type="password"
                required
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${
                  estado?.erros?.senha ? "border-red-500" : "border-slate-800 focus:border-cyan-500"
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition`}
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            {estado?.erros?.senha && (
              <p className="text-[11px] text-red-400 mt-1">{estado.erros.senha}</p>
            )}
          </div>

          {/* Campo Confirmar Senha */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="confirmarSenha">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                required
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${
                  estado?.erros?.confirmarSenha ? "border-red-500" : "border-slate-800 focus:border-cyan-500"
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition`}
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            {estado?.erros?.confirmarSenha && (
              <p className="text-[11px] text-red-400 mt-1">{estado.erros.confirmarSenha}</p>
            )}
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {carregando ? (
              <span>Criando conta segura...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Criar Conta NexaCore</span>
              </>
            )}
          </button>
        </form>

        {/* Rodapé do Card com Link para Login */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Já tem uma conta cadastrada?{" "}
            <Link
              href="/login"
              className="font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition"
            >
              <span>Acessar minha conta</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
