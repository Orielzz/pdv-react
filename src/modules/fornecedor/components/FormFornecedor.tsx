import { Button, FormControl, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { Fornecedor } from "../types/Fornecedor";

type Props = {
  onSubmit: (fornecedor: Omit<Fornecedor, "id">) => Promise<void>;
  textoBotao: string;
  valorInicial?: Fornecedor;
};

export function FormFornecedor({ onSubmit, textoBotao, valorInicial }: Props) {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNome(valorInicial?.nome ?? "");
    setCnpj(valorInicial?.cnpj ?? "");
    setTelefone(valorInicial?.telefone ?? "");
    setErro(null);
  }, [valorInicial]);

  const executeSubmit = async () => {
    if (!nome || !cnpj || !telefone) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }
    setIsLoading(true);
    setErro(null);
    try {
      await onSubmit({ nome, cnpj, telefone });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro.";
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
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={isLoading}
          error={!!erro}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="CNPJ"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          required
          disabled={isLoading}
          error={!!erro}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
          disabled={isLoading}
          error={!!erro}
          helperText={erro}
        />
      </FormControl>
      <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
        {isLoading ? "Salvando..." : textoBotao}
      </Button>
    </Stack>
  );
}
