import type { Categoria } from "../../categoria/types/Categoria";
import type { Fornecedor } from "../../fornecedor/types/Fornecedor";

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  categoria: Categoria;
  estoque: number;
  categoriaId?: string;
  fornecedor?: Fornecedor;
  fornecedorId?: string;
};
