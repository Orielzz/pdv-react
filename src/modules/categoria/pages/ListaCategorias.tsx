import { useEffect, useState } from "react";
import { Button,  Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { FormCategoria } from '../components/FormCategoria';
import type { Categoria } from '../types/Categoria';

export function ListaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaASerMudada, setCategoriaASerMudada] = useState<Categoria | null>(null);
  const [filtro, setFiltro] = useState("");

  







  useEffect(() => {
    async function buscar(){
    try {
      const response = await fetch("http://localhost:3001/categorias");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
    }
   buscar()
  }, []);


  const filtrados = categorias.filter((categoria) =>
    categoria.descricao.toLowerCase().includes(filtro.toLowerCase()) || categoria.id.toString().includes(filtro)
  );




  const alterar = async (dadosFormulario: Omit<Categoria, "id">) => {
    if (!categoriaASerMudada) return;

    const categoriaAtualizada = {
      ...categoriaASerMudada,
      descricao: dadosFormulario.descricao, 
    };

    const response = await fetch(
      `http://localhost:3001/categorias/${categoriaASerMudada.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoriaAtualizada),
      }
    );

    if (response.ok) {
      const categoriasAtualizadas = categorias.map((categoria) =>
        categoria.id === categoriaAtualizada.id ? categoriaAtualizada: categoria
      );
      setCategorias(categoriasAtualizadas);
      fecharModal();
    } else {
      throw new Error("Falha ao alterar categoria.");
    }
  };

  function abrirModal(categoria: Categoria) {
    setCategoriaASerMudada(categoria);
  }

  function fecharModal() {
    setCategoriaASerMudada(null);
  }

  async function excluir(id: number){
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta categoria?");
    if(confirmacao){
        try {
        const response = await fetch(
            `http://localhost:3001/categorias/${id}`,
            {
                method: "DELETE",
            }
         );
         if(!response.ok){
            throw new Error("Falha ao excluir categoria");
         }
         const categoriasAtualizadas = categorias.filter((categoria) => categoria.id !== id);
         setCategorias(categoriasAtualizadas);
        } catch (error) {
            console.error(error);
        }
    }
}

  return (
    <>
      <Typography variant="h4" gutterBottom align="center">
        Lista de Categorias
      </Typography>
      <TextField
        label="Pesquisar"
        variant="outlined"
        fullWidth
        onChange={event => setFiltro(event.target.value)}
        sx={{ mb: 2 }}
      />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de categorias">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrados.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell>{categoria.descricao}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" size="small" onClick={() => abrirModal(categoria)}>Editar</Button>
                    <Button variant="contained" size="small" color="error" onClick = {() => excluir(categoria.id)} sx={{ ml: 1 }}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      

      <Dialog open={!!categoriaASerMudada} onClose={fecharModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Categoria</DialogTitle>
        <DialogContent dividers>
          <FormCategoria onSubmit={alterar} textoBotao="Salvar Alterações" valorInicial={categoriaASerMudada ?? undefined} />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
