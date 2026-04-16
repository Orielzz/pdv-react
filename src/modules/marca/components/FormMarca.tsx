import { Button, FormControl, Stack, TextField } from "@mui/material";
import type { Marca } from "../types/Marca";
import { useEffect, useState } from "react";

type Props = {
  onSubmit: (marca: Omit<Marca, "id">) => Promise<void>;
  textoBotao: string;
  valorInicial?: Marca;
};

export function FormMarca({ onSubmit, textoBotao, valorInicial }: Props) {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNome(valorInicial?.nome || "");
    setErro(null);
  }, [valorInicial]);

  const executeSubmit = async () => {
    if (nome.trim() === "") {
      setErro("O nome não pode estar vazio.");
      return;
    }
    setIsLoading(true);
    setErro(null);
    try {
      await onSubmit({ nome });
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
          label="Nome da Marca"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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