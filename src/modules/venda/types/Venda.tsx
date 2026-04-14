import type { ProdutoVendido } from "./Produto_Vendido";

export type Venda = {
  id: number;
  data: string;
  total: number;
  itens?: ProdutoVendido[];
  itensId?: number[];
};
