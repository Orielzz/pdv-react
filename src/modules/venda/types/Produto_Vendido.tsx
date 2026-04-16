import type { Produto } from "../../produto/types/Produto";

export type ProdutoVendido = {
  id: string;
  vendaId: string;
  quantidade: number;
  precoUnitario: number;
  produtoId?: string;
  produto?: Produto;
};
