import type { Produto } from "../../produto/types/Produto";

export type ProdutoVendido = {
  id: number;
  vendaId: number;
  quantidade: number;
  precoUnitario: number;
  produtoId?: number;
  produto?:Produto;
};
