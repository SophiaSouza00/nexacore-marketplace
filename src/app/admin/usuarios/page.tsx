import React from "react";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import { listarTodosUsuariosAdmin } from "@/lib/admin";
import { obterSessaoAtual } from "@/lib/auth";
import { formatarData } from "@/lib/formatters";
import { AdminUserToggle } from "@/components/AdminUserToggle";

export default async function AdminUsuariosPage() {
  const [usuarios, adminAtual] = await Promise.all([
    listarTodosUsuariosAdmin(),
    obterSessaoAtual(),
  ]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="border-b border-slate-900 pb-6">
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
          <span>Admin</span>
          <span>/</span>
          <span>Contas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Gestão de Usuários
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Acompanhe clientes cadastrados, consulte perfis de acesso e gerencie o bloqueio de contas.
        </p>
      </div>

      {/* Caixa de Regra de Segurança */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-300 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Política Rigorosa de Acesso (RBAC):</strong>
          <span>
            Nenhuma rota pública ou botão administrativo permite a promoção arbitrária de clientes para administradores. O acesso ao painel é restrito à conta mestre inicial provisionada com chave criptografada via script de seed.
          </span>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Usuários Registrados na Plataforma ({usuarios.length})
            </h2>
          </div>
        </div>

        {usuarios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Perfil</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data de Cadastro</th>
                  <th className="p-4 text-right">Gerenciar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usuarios.map((u) => {
                  const ehMesmo = u.id === adminAtual?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{u.nome}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-300 font-mono text-[11px]">
                        {u.email}
                      </td>

                      <td className="p-4">
                        {u.perfil === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Administrador</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            <UserCheck className="w-3 h-3" />
                            <span>Cliente</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            u.status === "ATIVO"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === "ATIVO" ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          <span>{u.status}</span>
                        </span>
                      </td>

                      <td className="p-4 text-slate-400">
                        {formatarData(u.dataCadastro)}
                      </td>

                      <td className="p-4 text-right">
                        <AdminUserToggle
                          usuarioId={u.id}
                          statusInicial={u.status}
                          ehMesmoUsuario={ehMesmo}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-xs text-slate-400">
            Nenhum usuário cadastrado no banco de dados.
          </div>
        )}
      </div>
    </div>
  );
}
