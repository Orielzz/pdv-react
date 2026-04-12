import { Button, FormControl, Stack, TextField } from "@mui/material";
import type { Categoria } from "../types/Categoria";
import { useEffect, useState } from "react";

type Props = {
  onSubmit: (categoria: Omit<Categoria, "id">) => Promise<void>;
  textoBotao: string;
  valorInicial?: Categoria;
};

export function FormCategoria({ onSubmit, textoBotao, valorInicial }: Props) {
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDescricao(valorInicial?.descricao || "");
    setErro(null); 
  }, [valorInicial]);

  const executeSubmit = async () => {
    if (descricao.trim() === "") {
      setErro("A descrição não pode estar vazia.");
      return;
    }
    setIsLoading(true);
    setErro(null);
    try {
      await onSubmit({ descricao });
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
          label="Descrição da Categoria"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          disabled={isLoading}
          error={!!erro}
          helperText={erro}
          fullWidth
        />
      </FormControl>
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? "Salvando..." : textoBotao}
      </Button>
    </Stack>
  );
}