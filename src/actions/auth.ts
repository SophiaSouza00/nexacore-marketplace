"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { salvarSessaoCookie, destruirSessaoCookie } from "@/lib/auth";
import { PerfilUsuario } from "@/types";

// Esquema de validação para cadastro
const esquemaCadastro = z
  .object({
    nome: z.string().trim().min(3, "O nome deve ter no mínimo 3 caracteres."),
    email: z.string().trim().email("Informe um endereço de e-mail válido."),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmarSenha: z.string().min(1, "Confirme sua senha."),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

// Esquema de validação para login
const esquemaLogin = z.object({
  email: z.string().trim().email("Informe um endereço de e-mail válido."),
  senha: z.string().min(1, "Informe a sua senha."),
});

export interface RespostaAcaoAuth {
  sucesso: boolean;
  mensagem?: string;
  erros?: Record<string, string>;
}

/**
 * Server Action para cadastro seguro de novos clientes.
 */
export async function cadastrarClienteAction(
  _estadoAnterior: RespostaAcaoAuth | null,
  formData: FormData
): Promise<RespostaAcaoAuth> {
  const dados = {
    nome: formData.get("nome"),
    email: formData.get("email"),
    senha: formData.get("senha"),
    confirmarSenha: formData.get("confirmarSenha"),
  };

  const validacao = esquemaCadastro.safeParse(dados);
  if (!validacao.success) {
    const erros: Record<string, string> = {};
    for (const erro of validacao.error.issues) {
      if (erro.path[0]) {
        erros[erro.path[0] as string] = erro.message;
      }
    }
    return {
      sucesso: false,
      mensagem: "Por favor, corrija os erros nos campos indicados.",
      erros,
    };
  }

  const { nome, email, senha } = validacao.data;

  try {
    // 1. Verificar unicidade de e-mail
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (usuarioExistente) {
      return {
        sucesso: false,
        mensagem: "Este e-mail já está cadastrado na NexaCore. Faça login ou utilize outro endereço.",
        erros: { email: "E-mail já cadastrado" },
      };
    }

    // 2. Hash da senha com bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 3. Criação segura: Perfil sempre forçado como CLIENTE
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email: email.toLowerCase(),
        senhaHash,
        perfil: "CLIENTE",
        status: "ATIVO",
      },
    });

    // 4. Iniciar sessão imediatamente no cookie seguro HttpOnly
    await salvarSessaoCookie({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      perfil: novoUsuario.perfil as PerfilUsuario,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar cliente:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu uma instabilidade ao conectar ao banco de dados. Verifique a conexão com o PostgreSQL.",
    };
  }

  // Redireciona para o catálogo com boas-vindas
  redirect("/catalogo?cadastro=sucesso");
}

/**
 * Server Action para login e autenticação com proteção de credenciais.
 */
export async function loginAction(
  _estadoAnterior: RespostaAcaoAuth | null,
  formData: FormData
): Promise<RespostaAcaoAuth> {
  const dados = {
    email: formData.get("email"),
    senha: formData.get("senha"),
  };

  const validacao = esquemaLogin.safeParse(dados);
  if (!validacao.success) {
    const erros: Record<string, string> = {};
    for (const erro of validacao.error.issues) {
      if (erro.path[0]) {
        erros[erro.path[0] as string] = erro.message;
      }
    }
    return {
      sucesso: false,
      mensagem: "Preencha o e-mail e a senha corretamente.",
      erros,
    };
  }

  const { email, senha } = validacao.data;
  let destinoRedirecionamento = "/catalogo";

  try {
    // 1. Busca pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!usuario) {
      return {
        sucesso: false,
        mensagem: "E-mail ou senha incorretos.",
      };
    }

    // 2. Verifica se a conta está ativa
    if (usuario.status !== "ATIVO") {
      return {
        sucesso: false,
        mensagem: "Esta conta está inativa ou bloqueada. Por favor, contate o administrador.",
      };
    }

    // 3. Verifica o hash da senha
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return {
        sucesso: false,
        mensagem: "E-mail ou senha incorretos.",
      };
    }

    // 4. Salva a sessão no cookie seguro
    await salvarSessaoCookie({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil as PerfilUsuario,
    });

    // Administradores são redirecionados diretamente ao painel
    if (usuario.perfil === "ADMIN") {
      destinoRedirecionamento = "/admin";
    }
  } catch (erro) {
    console.error("Erro ao autenticar usuário:", erro);
    return {
      sucesso: false,
      mensagem: "Falha de comunicação com o banco de dados. Verifique suas variáveis de ambiente.",
    };
  }

  redirect(destinoRedirecionamento);
}

/**
 * Server Action para encerramento de sessão (logout).
 */
export async function logoutAction(): Promise<void> {
  await destruirSessaoCookie();
  redirect("/login");
}
