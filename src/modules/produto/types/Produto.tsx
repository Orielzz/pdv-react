import type { Categoria } from "../../categoria/types/Categoria";

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria:Categoria;
  estoque: number;
  categoriaId?: number;
};
