import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormProduto } from "../components/FormProduto";
import type { Produto } from "../types/Produto";

export function CadastraProduto() {
  const navigate = useNavigate();

  const cadastrar = async (dadosFormulario: Omit<Produto, "id" | "categoria" | "fornecedor">) => {
    const produtoParaApi = {
      nome: dadosFormulario.nome,
      preco: dadosFormulario.preco,
      categoriaId: dadosFormulario.categoriaId,
      estoque: dadosFormulario.estoque,
      fornecedorId: dadosFormulario.fornecedorId,
    };

    const response = await fetch("http://localhost:3001/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produtoParaApi),
    });

    if (response.ok) {
      navigate("/produtos");
    } else {
      throw new Error("Falha ao cadastrar produto. Tente novamente.");
    }
  };

  return (
    <Container>
      <h1>Cadastro de Produto</h1>
      <FormProduto onSubmit={cadastrar} textoBotao="Cadastrar" />
    </Container>
  );
}
