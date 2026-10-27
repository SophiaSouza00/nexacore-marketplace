import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { PerfilUsuario } from "@/types";

export interface SessaoUsuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

const NOME_COOKIE_SESSAO = "nexacore_session";

// Chave secreta para assinatura dos tokens de sessão
const SEGREDO_SESSAO = new TextEncoder().encode(
  process.env.SESSION_SECRET || "nexacore_chave_secreta_segura_desenvolvimento_minimo_32_chars_2026"
);

/**
 * Gera um token JWT assinado para a sessão do usuário.
 */
export async function criarTokenSessao(usuario: SessaoUsuario): Promise<string> {
  return await new SignJWT({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SEGREDO_SESSAO);
}

/**
 * Valida o token JWT e retorna o payload com os dados do usuário.
 */
export async function verificarTokenSessao(token: string): Promise<SessaoUsuario | null> {
  try {
    const { payload } = await jwtVerify(token, SEGREDO_SESSAO);
    return {
      id: payload.id as string,
      nome: payload.nome as string,
      email: payload.email as string,
      perfil: payload.perfil as PerfilUsuario,
    };
  } catch {
    return null;
  }
}

/**
 * Recupera os dados da sessão do usuário autenticado atual a partir do cookie HTTP.
 */
export async function obterSessaoAtual(): Promise<SessaoUsuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOME_COOKIE_SESSAO)?.value;
  if (!token) return null;

  return await verificarTokenSessao(token);
}

/**
 * Grava o cookie seguro de sessão na resposta HTTP.
 */
export async function salvarSessaoCookie(usuario: SessaoUsuario): Promise<void> {
  const token = await criarTokenSessao(usuario);
  const cookieStore = await cookies();

  cookieStore.set(NOME_COOKIE_SESSAO, token, {
    httpOnly: true, // Impede acesso via JavaScript (anti-XSS)
    secure: process.env.NODE_ENV === "production", // Somente HTTPS em produção
    sameSite: "lax", // Previne ataques de CSRF
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

/**
 * Remove o cookie de sessão ao realizar logout.
 */
export async function destruirSessaoCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(NOME_COOKIE_SESSAO);
}
