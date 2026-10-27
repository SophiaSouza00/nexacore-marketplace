"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ItemCarrinho } from "@/types";

interface CartContextType {
  itens: ItemCarrinho[];
  quantidadeTotal: number;
  valorTotal: number;
  adicionarItem: (item: Omit<ItemCarrinho, "quantidade">, quantidade?: number) => { sucesso: boolean; mensagem?: string };
  removerItem: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => { sucesso: boolean; mensagem?: string };
  limparCarrinho: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "nexacore_carrinho_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (salvo) {
        setItens(JSON.parse(salvo));
      }
    } catch (erro) {
      console.error("Erro ao carregar carrinho local:", erro);
    } finally {
      setCarregado(true);
    }
  }, []);

  // Salvar no localStorage sempre que houver alteração
  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(itens));
    } catch (erro) {
      console.error("Erro ao salvar carrinho:", erro);
    }
  }, [itens, carregado]);

  const quantidadeTotal = itens.reduce((acum, item) => acum + item.quantidade, 0);
  const valorTotal = itens.reduce((acum, item) => acum + item.preco * item.quantidade, 0);

  const adicionarItem = (
    produto: Omit<ItemCarrinho, "quantidade">,
    quantidadeAdicional: number = 1
  ): { sucesso: boolean; mensagem?: string } => {
    const itemExistente = itens.find((i) => i.id === produto.id);
    const quantidadeAtual = itemExistente ? itemExistente.quantidade : 0;
    const novaQuantidade = quantidadeAtual + quantidadeAdicional;

    if (novaQuantidade > produto.quantidadeEstoque) {
      return {
        sucesso: false,
        mensagem: `Desculpe, só temos ${produto.quantidadeEstoque} unidade(s) de "${produto.nome}" em estoque.`,
      };
    }

    if (itemExistente) {
      setItens((prev) =>
        prev.map((i) =>
          i.id === produto.id ? { ...i, quantidade: novaQuantidade } : i
        )
      );
    } else {
      setItens((prev) => [
        ...prev,
        { ...produto, quantidade: quantidadeAdicional },
      ]);
    }

    return { sucesso: true };
  };

  const removerItem = (id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const atualizarQuantidade = (
    id: string,
    quantidade: number
  ): { sucesso: boolean; mensagem?: string } => {
    const item = itens.find((i) => i.id === id);
    if (!item) return { sucesso: false, mensagem: "Item não encontrado." };

    if (quantidade <= 0) {
      removerItem(id);
      return { sucesso: true };
    }

    if (quantidade > item.quantidadeEstoque) {
      return {
        sucesso: false,
        mensagem: `A quantidade máxima disponível para este item é ${item.quantidadeEstoque}.`,
      };
    }

    setItens((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantidade } : i))
    );
    return { sucesso: true };
  };

  const limparCarrinho = () => {
    setItens([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (erro) {
      console.error("Erro ao limpar carrinho:", erro);
    }
  };

  return (
    <CartContext.Provider
      value={{
        itens,
        quantidadeTotal,
        valorTotal,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser utilizado dentro de um CartProvider");
  }
  return context;
}
