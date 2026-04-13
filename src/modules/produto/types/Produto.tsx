import type { Categoria } from "../../categoria/types/Categoria";
import type { Fornecedor } from "../../fornecedor/types/Fornecedor";

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria:Categoria;
  estoque: number;
  categoriaId?: number;
  fornecedor?: Fornecedor;
  fornecedorId?: number;
};
