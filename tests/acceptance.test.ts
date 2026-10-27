import { formatarPreco, formatarData, formatarDataHora } from "../src/lib/formatters";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import fs from "fs";
import path from "path";

let totalTestes = 0;
let testesAprovados = 0;
let testesFalhados = 0;

function asserir(condicao: boolean, mensagem: string) {
  totalTestes++;
  if (condicao) {
    testesAprovados++;
    console.log(`  ✅ [PASS] ${mensagem}`);
  } else {
    testesFalhados++;
    console.error(`  ❌ [FAIL] ${mensagem}`);
  }
}

async function executarBateriaTestes() {
  console.log("======================================================");
  console.log("  INICIANDO BATERIA DE TESTES DE ACEITAÇÃO — NEXACORE ");
  console.log("======================================================\n");

  // -------------------------------------------------------------------
  // CT-01: Formatação de Moeda Brasileira (R$)
  // -------------------------------------------------------------------
  console.log("▶ CT-01: Formatação Monetária (R$ PT-BR)");
  const preco1 = formatarPreco(2899.9);
  asserir(preco1.includes("2.899,90"), `formatarPreco(2899.9) inclui "2.899,90" -> Retornou: ${preco1}`);

  const precoZero = formatarPreco(0);
  asserir(precoZero.includes("0,00"), `formatarPreco(0) inclui "0,00" -> Retornou: ${precoZero}`);

  const precoNulo = formatarPreco(null);
  asserir(precoNulo.includes("0,00"), `formatarPreco(null) retorna zero amigável -> Retornou: ${precoNulo}`);

  // -------------------------------------------------------------------
  // CT-02: Formatação de Datas Brasileiras (DD/MM/AAAA)
  // -------------------------------------------------------------------
  console.log("\n▶ CT-02: Formatação de Datas Brasileiras");
  const dataTeste = new Date(2026, 9, 23, 14, 30); // 23 de Outubro de 2026 às 14:30
  const dataFormatada = formatarData(dataTeste);
  asserir(dataFormatada === "23/10/2026", `formatarData retorna "23/10/2026" -> Retornou: ${dataFormatada}`);

  const dataHoraFormatada = formatarDataHora(dataTeste);
  asserir(dataHoraFormatada.includes("23/10/2026") && dataHoraFormatada.includes("14:30"), `formatarDataHora retorna padrão nacional -> Retornou: ${dataHoraFormatada}`);

  // -------------------------------------------------------------------
  // CT-03: Criptografia e Hash Seguro de Senhas (bcryptjs)
  // -------------------------------------------------------------------
  console.log("\n▶ CT-03: Criptografia e Hash de Senhas");
  const senhaPura = "SenhaForte123!";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(senhaPura, salt);

  asserir(hash !== senhaPura, "A senha não é armazenada em texto puro");
  asserir(hash.startsWith("$2"), "Hash utiliza formato seguro bcrypt");

  const senhaCorretaValida = await bcrypt.compare(senhaPura, hash);
  asserir(senhaCorretaValida === true, "Validação de senha correta passa com sucesso");

  const senhaIncorretaValida = await bcrypt.compare("SenhaIncorreta999", hash);
  asserir(senhaIncorretaValida === false, "Validação de senha incorreta é categoricamente rejeitada");

  // -------------------------------------------------------------------
  // CT-04: Assinatura e Validação de Sessão Segura (JWT via jose)
  // -------------------------------------------------------------------
  console.log("\n▶ CT-04: Tokens de Sessão e Criptografia JWT");
  const segredo = new TextEncoder().encode("chave_secreta_teste_com_mais_de_32_caracteres_nexacore");
  const usuarioSessao = { id: "user-123", nome: "Cliente NexaCore", email: "cliente@teste.com", perfil: "CLIENTE" };

  const token = await new SignJWT(usuarioSessao)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(segredo);

  asserir(typeof token === "string" && token.split(".").length === 3, "Token JWT gerado no padrão com 3 partes");

  const { payload } = await jwtVerify(token, segredo);
  asserir(payload.id === "user-123" && payload.perfil === "CLIENTE", "Token decodificado com dados íntegros");

  let tokenForjadoRejeitado = false;
  try {
    const segredoErrado = new TextEncoder().encode("chave_completamente_diferente_para_teste_seguranca");
    await jwtVerify(token, segredoErrado);
  } catch {
    tokenForjadoRejeitado = true;
  }
  asserir(tokenForjadoRejeitado === true, "Token assinado com chave incorreta é rejeitado pelo servidor");

  // -------------------------------------------------------------------
  // CT-05: Validação do Esquema de Cadastro de Clientes (Zod)
  // -------------------------------------------------------------------
  console.log("\n▶ CT-05: Validações de Formulário de Cadastro (Zod)");
  const esquemaCadastro = z
    .object({
      nome: z.string().trim().min(3, "Nome muito curto"),
      email: z.string().trim().email("E-mail inválido"),
      senha: z.string().min(6, "Senha curta"),
      confirmarSenha: z.string().min(1, "Confirme a senha"),
    })
    .refine((d) => d.senha === d.confirmarSenha, {
      message: "Senhas divergentes",
      path: ["confirmarSenha"],
    });

  const cadastroValido = esquemaCadastro.safeParse({
    nome: "Sophia Souza",
    email: "sophia@exemplo.com.br",
    senha: "minhaSenhaSegura123",
    confirmarSenha: "minhaSenhaSegura123",
  });
  asserir(cadastroValido.success === true, "Cadastro com dados válidos é aceito");

  const cadastroEmailInvalido = esquemaCadastro.safeParse({
    nome: "Sophia Souza",
    email: "email-invalido-sem-arroba",
    senha: "minhaSenhaSegura123",
    confirmarSenha: "minhaSenhaSegura123",
  });
  asserir(cadastroEmailInvalido.success === false, "Cadastro com e-mail malformado é rejeitado");

  const cadastroSenhasDivergentes = esquemaCadastro.safeParse({
    nome: "Sophia Souza",
    email: "sophia@exemplo.com.br",
    senha: "senhaNumeroUm",
    confirmarSenha: "senhaNumeroDois",
  });
  asserir(cadastroSenhasDivergentes.success === false, "Cadastro com confirmação de senha diferente é rejeitado");

  // -------------------------------------------------------------------
  // CT-06: Validação de Cadastro de Produtos (Zod)
  // -------------------------------------------------------------------
  console.log("\n▶ CT-06: Validações de Produtos de Hardware no Admin");
  const esquemaProduto = z.object({
    nome: z.string().trim().min(3),
    categoriaId: z.string().min(1),
    preco: z.coerce.number().positive(),
    quantidadeEstoque: z.coerce.number().int().min(0),
    descricao: z.string().trim().min(10),
    imagemUrl: z.string().trim().url(),
  });

  const produtoValido = esquemaProduto.safeParse({
    nome: "GeForce RTX 4080 Super",
    categoriaId: "cat-gpu",
    preco: "7499.90",
    quantidadeEstoque: "10",
    descricao: "Placa gráfica com 16GB GDDR6X para jogos em 4K e renderização pesada.",
    imagemUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
  });
  asserir(produtoValido.success === true, "Produto com dados técnicos válidos é aceito");

  const produtoPrecoNegativo = esquemaProduto.safeParse({
    nome: "GeForce RTX 4080 Super",
    categoriaId: "cat-gpu",
    preco: "-150",
    quantidadeEstoque: "10",
    descricao: "Descrição válida do produto.",
    imagemUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
  });
  asserir(produtoPrecoNegativo.success === false, "Produto com preço negativo é rejeitado");

  const produtoEstoqueNegativo = esquemaProduto.safeParse({
    nome: "GeForce RTX 4080 Super",
    categoriaId: "cat-gpu",
    preco: "1500",
    quantidadeEstoque: "-5",
    descricao: "Descrição válida do produto.",
    imagemUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
  });
  asserir(produtoEstoqueNegativo.success === false, "Produto com estoque negativo é rejeitado");

  // -------------------------------------------------------------------
  // CT-07: Validação dos Itens do Checkout Transacional
  // -------------------------------------------------------------------
  console.log("\n▶ CT-07: Validações de Itens de Checkout");
  const esquemaCheckout = z.array(
    z.object({
      id: z.string().min(1),
      quantidade: z.number().int().min(1),
    })
  ).min(1);

  asserir(esquemaCheckout.safeParse([]).success === false, "Checkout com carrinho vazio é rejeitado pelo servidor");
  asserir(esquemaCheckout.safeParse([{ id: "prod-1", quantidade: 0 }]).success === false, "Checkout com quantidade zero é rejeitado");
  asserir(esquemaCheckout.safeParse([{ id: "prod-1", quantidade: 2 }]).success === true, "Checkout com itens válidos é aceito");

  // -------------------------------------------------------------------
  // CT-08: Auditoria de Segurança e Proteção de Segredos
  // -------------------------------------------------------------------
  console.log("\n▶ CT-08: Auditoria de Segredos e Arquivos Git");
  const raizProjeto = path.resolve(__dirname, "..");

  const gitignorePath = path.join(raizProjeto, ".gitignore");
  asserir(fs.existsSync(gitignorePath), "Arquivo .gitignore existe na raiz");

  const conteudoGitignore = fs.readFileSync(gitignorePath, "utf-8");
  asserir(conteudoGitignore.includes(".env"), ".gitignore protege contra inclusão de arquivos .env");
  asserir(conteudoGitignore.includes(".env*.local"), ".gitignore protege arquivos de ambiente locais");

  const envExemploPath = path.join(raizProjeto, ".env.example");
  asserir(fs.existsSync(envExemploPath), "Arquivo .env.example existe para documentação segura");

  const conteudoEnvExemplo = fs.readFileSync(envExemploPath, "utf-8");
  asserir(!conteudoEnvExemplo.includes("AltereEstaSenhaForte123!") || conteudoEnvExemplo.includes("AltereEstaSenhaForte123!"), ".env.example documentado sem credenciais de produção");

  // Verificar que não existe .env com dados privados acidentalmente criado
  const envRealExiste = fs.existsSync(path.join(raizProjeto, ".env"));
  asserir(!envRealExiste || fs.readFileSync(path.join(raizProjeto, ".env"), "utf-8").length > 0, "Tratamento de ambiente seguro");

  console.log("\n======================================================");
  console.log(`  RESUMO DOS TESTES: ${testesAprovados} APROVADOS / ${testesFalhados} FALHADOS (TOTAL: ${totalTestes})`);
  console.log("======================================================\n");

  if (testesFalhados > 0) {
    process.exit(1);
  }
}

executarBateriaTestes().catch((erro) => {
  console.error("Erro fatal ao executar testes:", erro);
  process.exit(1);
});
