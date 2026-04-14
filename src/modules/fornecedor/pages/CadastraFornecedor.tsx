import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormFornecedor } from "../components/FormFornecedor";
import type { Fornecedor } from "../types/Fornecedor";

export function CadastraFornecedor() {
  const navigate = useNavigate();

  const handleCadastrar = async (fornecedor: Omit<Fornecedor, "id">) => {
    const response = await fetch("http://localhost:3001/fornecedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fornecedor),
    });

    if (response.ok) {
      navigate("/fornecedores");
    } else {
      throw new Error("Falha ao cadastrar fornecedor. Tente novamente.");
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align="center">
        Cadastro de Fornecedor
      </Typography>
      <FormFornecedor onSubmit={handleCadastrar} textoBotao="Cadastrar" />
    </>
  );
}
