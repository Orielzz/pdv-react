import type { ProdutoVendido } from "./Produto_Vendido";

export type Venda = {
  id: string;
  data: string;
  total: number;
  itens?: ProdutoVendido[];
  itensId?: string[];
};
