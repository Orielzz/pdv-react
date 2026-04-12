import {Container, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormCategoria } from "../components/FormCategoria";
import type { Categoria } from "../types/Categoria";

export function CadastraCategoria() {
  const navigate = useNavigate();

  const handleCadastrar = async (categoria: Omit<Categoria, "id">) => {
    const response = await fetch("http://localhost:3001/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });

    if (response.ok) {
      navigate("/categorias");
    } else {
      throw new Error("Falha ao cadastrar categoria. Tente novamente.");
    }
  };

  return (<Container>
      <h1>Cadastro de Categoria</h1>
        <FormCategoria onSubmit={handleCadastrar} textoBotao="Cadastrar" />
        </Container>
  );
}