import {Container, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormMarca } from "../components/FormMarca";
import type { Marca } from "../types/Marca";

export function CadastraMarca() {
  const navigate = useNavigate();

  const handleCadastrar = async (marca: Omit<Marca, "id">) => {
    const response = await fetch("http://localhost:3001/marcas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marca),
    });

    if (response.ok) {
      navigate("/marcas");
    } else {
      throw new Error("Falha ao cadastrar marca. Tente novamente.");
    }
  };

  return (<Container>
      <Typography variant="h4" gutterBottom align="center">
        Cadastro de Marca
      </Typography>
        <FormMarca onSubmit={handleCadastrar} textoBotao="Cadastrar" />
        </Container>
  );
}