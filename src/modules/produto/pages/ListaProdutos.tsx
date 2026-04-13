import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { FormProduto } from '../components/FormProduto';
import type { Produto } from '../types/Produto';

export function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoASerMudado, setProdutoASerMudado] = useState<Produto | null>(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function buscar(){
      try {
        const response = await fetch("http://localhost:3001/produtos");
        const data = await response.json();
        const produtosComDados = await Promise.all(data.map(async (produto: Produto) => {
         const responseCategoria = await fetch(`http://localhost:3001/categorias/${Number(produto.categoriaId)}`);
         const responseFornecedor = await fetch(`http://localhost:3001/fornecedores/${Number(produto.fornecedorId)}`);
         return {
          ...produto,
          categoria: await responseCategoria.json(),
          fornecedor: await responseFornecedor.json()
         }
        
        }))
        setProdutos(produtosComDados);
      } catch (error) {
        console.error("Falha ao buscar produtos", error);
      }
    }
    buscar();
  }, []);

  const filtrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase()) || 
    produto.id.toString().includes(filtro) ||
    produto.preco.toString().includes(filtro) ||
    (produto.categoria && produto.categoria.descricao.toLowerCase().includes(filtro.toLowerCase())) ||
    (produto.fornecedor && produto.fornecedor.nome.toLowerCase().includes(filtro.toLowerCase()))
  );

  const alterar = async (dadosFormulario: Omit<Produto, "id" | "categoria" | "fornecedor">) => {
    if (!produtoASerMudado) return;

    const produtoParaApi = {
      nome: dadosFormulario.nome,
      preco: dadosFormulario.preco,
      categoriaId: dadosFormulario.categoriaId,
      estoque: dadosFormulario.estoque,
      fornecedorId: dadosFormulario.fornecedorId,
    };

    const response = await fetch(
      `http://localhost:3001/produtos/${produtoASerMudado.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoParaApi),
      }
    );

    if (response.ok) {
      const categoriaDoProdutoAlterado = produtoASerMudado.categoria;
      const fornecedorDoProdutoAlterado = produtoASerMudado.fornecedor;
      const produtoAtualizadoNaUi = {
        id: produtoASerMudado.id,
        nome: dadosFormulario.nome,
        preco: dadosFormulario.preco,
        estoque: dadosFormulario.estoque,
        categoria: categoriaDoProdutoAlterado,
        fornecedor: fornecedorDoProdutoAlterado,
      };
      setProdutos((produtosAnteriores) =>
        produtosAnteriores.map((prod) =>
          prod.id === produtoAtualizadoNaUi.id ? produtoAtualizadoNaUi : prod
        )
      );
      fecharModal();
    } else {
      throw new Error("Falha ao alterar produto.");
    }
  };

  async function excluir(id: number){
    const confirmacao = window.confirm("Tem certeza que deseja excluir este produto?");
    if(confirmacao){
        try {
          const response = await fetch(
              `http://localhost:3001/produtos/${id}`,
              {
                  method: "DELETE",
              }
          );
          if(!response.ok){
              throw new Error("Falha ao excluir produto");
          }
          setProdutos((produtosAnteriores) => produtosAnteriores.filter((produto) => produto.id !== id));
        } catch (error) {
            console.error(error);
        }
    }
  }

  function abrirModal(produto: Produto) {
    setProdutoASerMudado(produto);
  }

  function fecharModal() {
    setProdutoASerMudado(null);
  }

  return (
    <>
      <TextField placeholder="Pesquisa" focused onChange={event => setFiltro(event.target.value)} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de produtos">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell>{produto.categoria?.descricao}</TableCell>
                <TableCell>{produto.fornecedor?.nome}</TableCell>
                <TableCell>{produto.estoque}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" size="small" onClick={() => abrirModal(produto)}>Editar</Button>
                  <Button variant="contained" size="small" color="error" onClick={() => excluir(produto.id)} sx={{ ml: 1 }}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!produtoASerMudado} onClose={fecharModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogContent dividers>
          <FormProduto onSubmit={alterar} textoBotao="Salvar Alterações" valorInicial={produtoASerMudado ?? undefined} />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}