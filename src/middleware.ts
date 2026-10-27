import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const NOME_COOKIE_SESSAO = "nexacore_session";

const SEGREDO_SESSAO = new TextEncoder().encode(
  process.env.SESSION_SECRET || "nexacore_chave_secreta_segura_desenvolvimento_minimo_32_chars_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(NOME_COOKIE_SESSAO)?.value;
  let usuario = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SEGREDO_SESSAO);
      usuario = payload as { id: string; nome: string; email: string; perfil: string };
    } catch {
      usuario = null;
    }
  }

  // 1. Proteção de Rotas Administrativas (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!usuario) {
      const urlLogin = new URL("/login", request.url);
      urlLogin.searchParams.set("redirecionar", pathname);
      urlLogin.searchParams.set("mensagem", "Acesso restrito. Faça login como administrador.");
      return NextResponse.redirect(urlLogin);
    }

    if (usuario.perfil !== "ADMIN") {
      // Bloqueio estrito: Cliente comum não tem permissão de administrador
      const urlNegado = new URL("/catalogo", request.url);
      urlNegado.searchParams.set("erro", "acesso_negado");
      return NextResponse.redirect(urlNegado);
    }
  }

  // 2. Proteção de Rotas de Cliente (/pedidos/* e /checkout)
  if (pathname.startsWith("/pedidos") || pathname.startsWith("/checkout")) {
    if (!usuario) {
      const urlLogin = new URL("/login", request.url);
      urlLogin.searchParams.set("redirecionar", pathname);
      urlLogin.searchParams.set("mensagem", "Faça login para continuar com seu pedido.");
      return NextResponse.redirect(urlLogin);
    }
  }

  // 3. Usuários já logados tentando acessar login ou cadastro
  if ((pathname === "/login" || pathname === "/cadastro") && usuario) {
    if (usuario.perfil === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/catalogo", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/pedidos/:path*",
    "/checkout/:path*",
    "/login",
    "/cadastro",
  ],
};
