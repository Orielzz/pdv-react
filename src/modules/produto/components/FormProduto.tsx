import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import type { Produto } from "../types/Produto";
import { useEffect, useState } from "react";
import type { Categoria } from "../../categoria/types/Categoria";

type Props = {
  onSubmit: (produto: Omit<Produto, "id" | "categoria">) => Promise<void>;
  textoBotao: string;
  valorInicial?: Produto;
};

export function FormProduto({ onSubmit, textoBotao, valorInicial }: Props) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | string>("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [estoque, setEstoque] = useState("");


  useEffect(() => {
    async function buscarCategorias() {
      try {
        const response = await fetch("http://localhost:3001/categorias");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Falha ao buscar categorias", error);
      }
    }
    buscarCategorias();
  }, []);

  useEffect(() => {
    setNome(valorInicial?.nome || "");
    setPreco(valorInicial?.preco ? valorInicial.preco.toString() : "");
    setEstoque(valorInicial?.estoque ? valorInicial.estoque.toString() : "");
    setCategoriaId(valorInicial?.categoria?.id || "");
    setErro(null);
  }, [valorInicial]);

  const executeSubmit = async () => {
    const categoriaSelecionada = categorias.find(cat => cat.id === categoriaId);
    const precoNumerico = parseFloat(preco);
    const estoqueNumerico = parseInt(estoque, 10);


    if (nome.trim() === "" || isNaN(precoNumerico) || precoNumerico <= 0 || !categoriaSelecionada || isNaN(estoqueNumerico) || estoqueNumerico < 0) {
      setErro("Todos os campos são obrigatórios. Preço e Estoque devem ser números positivos.");
      return;
    }
    setIsLoading(true);
    setErro(null);
    try {
      await onSubmit({ nome, preco: precoNumerico, categoriaId: categoriaSelecionada.id, estoque: estoqueNumerico });
      if (!valorInicial) {
        setNome("");
        setPreco("");
        setCategoriaId("");
        setEstoque("");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro.";
      setErro(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    executeSubmit();
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2} noValidate autoComplete="off">
      <FormControl>
        <TextField
          label="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={isLoading}
          error={!!erro}
          helperText={erro}
          fullWidth
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Preço"
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
          disabled={isLoading}
          fullWidth
        />
      </FormControl>
       <FormControl>
        <TextField
          label="Estoque"
          type="number"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
          required
          defaultValue={0}
          disabled={isLoading}
          fullWidth
        />
      </FormControl>
      <FormControl fullWidth disabled={isLoading}>
        <InputLabel id="categoria-select-label">Categoria</InputLabel>
        <Select
          labelId="categoria-select-label"
          id="categoria-select"
          value={categoriaId}
          label="Categoria"
          onChange={(e) => setCategoriaId(e.target.value as number)}
          required
        >
          {categorias.map((categoria) => (
            <MenuItem key={categoria.id} value={categoria.id}>
              {categoria.descricao}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
        {isLoading ? "Salvando..." : textoBotao}
      </Button>
    </Stack>
  );
}
