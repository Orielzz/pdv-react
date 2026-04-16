import type { Categoria } from "../../categoria/types/Categoria";
import type { Fornecedor } from "../../fornecedor/types/Fornecedor";
import type { Marca } from "../../marca/types/Marca";

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  categoria: Categoria;
  estoque: number;
  categoriaId?: string;
  fornecedor?: Fornecedor;
  fornecedorId?: string;
  marca?: Marca;
  marcaId?: string;
};
