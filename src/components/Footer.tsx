import React from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 mt-auto">
      {/* Faixa de Benefícios / Diferenciais NexaCore */}
      <div className="border-b border-slate-900/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Envio Ágil e Rastreável</h4>
              <p className="text-xs text-slate-400">Embalagens seguras para hardware sensível.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Garantia Nacional</h4>
              <p className="text-xs text-slate-400">Produtos 100% autênticos e homologados.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Suporte Especializado</h4>
              <p className="text-xs text-slate-400">Time técnico pronto para orientar seu setup.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Compra Segura</h4>
              <p className="text-xs text-slate-400">Integridade transacional e estoque garantido.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seções de Links e Informações Institucionais */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Coluna 1: Marca e Resumo */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">NexaCore</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plataforma de e-commerce especializada em informática e tecnologia de ponta. Do entusiasta ao profissional de alto desempenho.
          </p>
        </div>

        {/* Coluna 2: Categorias */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white text-xs tracking-wider uppercase">Categorias</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/catalogo?categoria=processadores" className="hover:text-cyan-400 transition">
                Processadores
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=placas-de-video" className="hover:text-cyan-400 transition">
                Placas de Vídeo
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=memorias-ram" className="hover:text-cyan-400 transition">
                Memórias RAM
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=armazenamento" className="hover:text-cyan-400 transition">
                Armazenamento (SSDs e NVMe)
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=perifericos" className="hover:text-cyan-400 transition">
                Periféricos e Acessórios
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Links Úteis */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white text-xs tracking-wider uppercase">Navegação</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/catalogo" className="hover:text-cyan-400 transition">
                Catálogo Completo
              </Link>
            </li>
            <li>
              <Link href="/carrinho" className="hover:text-cyan-400 transition">
                Meu Carrinho
              </Link>
            </li>
            <li>
              <Link href="/pedidos" className="hover:text-cyan-400 transition">
                Meus Pedidos
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-cyan-400 transition">
                Área do Cliente
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-cyan-400 transition">
                Painel Administrativo
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Informações e Transparência */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white text-xs tracking-wider uppercase">Transparência</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Projeto acadêmico para fins didáticos de desenvolvimento de software full-stack. Todos os preços são expressos em Real (R$) e calculados de forma segura no servidor.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Ambiente Acadêmico Seguro</span>
          </div>
        </div>
      </div>

      {/* Direitos Autorais */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} <strong>NexaCore</strong> — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
