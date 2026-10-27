import Link from "next/link";
import {
  Cpu,
  Monitor,
  HardDrive,
  Gamepad2,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { listarProdutos, listarCategorias } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

// Ícones dinâmicos para categorias
const iconesCategorias: Record<string, LucideIcon> = {
  processadores: Cpu,
  "placas-de-video": Sparkles,
  "memorias-ram": Zap,
  armazenamento: HardDrive,
  perifericos: Gamepad2,
  computadores: Monitor,
};

export default async function Home() {
  const [produtosDestaque, categorias] = await Promise.all([
    listarProdutos({ limite: 4 }),
    listarCategorias(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Principal / Hero */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 py-16 sm:py-24">
        {/* Efeito de Luz Decorativo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 mb-6">
            <Cpu className="w-3.5 h-3.5" />
            <span>NexaCore — Especialistas em Hardware de Alto Desempenho</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
            Construa o Setup dos Seus Sonhos com a{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              NexaCore
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plataforma moderna de informática e hardware. Processadores, placas de vídeo,
            memórias de alta frequência e periféricos selecionados para máximo desempenho.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalogo"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition flex items-center justify-center gap-2"
            >
              <span>Explorar Catálogo Completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#categorias"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-xl transition"
            >
              Ver Categorias
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Categorias de Informática */}
      <section id="categorias" className="py-16 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Departamentos
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Categorias em Destaque
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              <span>Ver todas as categorias</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.slice(0, 6).map((cat) => {
              const Icone = iconesCategorias[cat.slug] || Cpu;
              return (
                <Link
                  key={cat.slug}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-200 shadow-sm hover:shadow-cyan-500/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-slate-700/50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Icone className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition mb-1">
                      {cat.nome}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {cat.descricao || "Hardware de ponta e alta durabilidade."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition">
                    <span>Acessar departamento</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vitrine de Produtos em Destaque */}
      <section className="py-16 bg-slate-950/50 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Seleção Especial
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Hardware Recomendado
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtosDestaque.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção Institucional de Confiança NexaCore */}
      <section className="py-16 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-4">
            Por que escolher a NexaCore?
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Nossa plataforma combina tecnologia de ponta, verificação rigorosa de integridade
            e segurança no lado do servidor para garantir uma experiência de compra ágil e sem inconsistências.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Estoque em Tempo Real</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Validações no servidor garantem que nenhum cliente adquira itens indisponíveis ou esgotados.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Preços Auditados</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cálculos de subtotais e totais realizados pelo backend, prevenindo alterações no navegador.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Isolamento e Segurança</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Histórico e informações do cliente protegidos com sessões HttpOnly e prevenção de ataques IDOR.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
