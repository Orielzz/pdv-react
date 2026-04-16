import { useEffect, useState } from "react";
import { Button,  Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { FormMarca } from '../components/FormMarca';
import type { Marca } from '../types/Marca';

export function ListaMarcas() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaASerMudada, setMarcaASerMudada] = useState<Marca | null>(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function buscar(){
    try {
      const response = await fetch("http://localhost:3001/marcas");
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error(error);
    }
    }
   buscar()
  }, []);

  const filtrados = marcas.filter((marca) =>
    marca.nome.toLowerCase().includes(filtro.toLowerCase()) || marca.id.toString().includes(filtro)
  );

  const alterar = async (dadosFormulario: Omit<Marca, "id">) => {
    if (!marcaASerMudada) return;

    const marcaAtualizada = {
      ...marcaASerMudada,
      nome: dadosFormulario.nome,
    };

    const response = await fetch(
      `http://localhost:3001/marcas/${marcaASerMudada.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(marcaAtualizada),
      }
    );

    if (response.ok) {
      const marcasAtualizadas = marcas.map((marca) =>
        marca.id === marcaAtualizada.id ? marcaAtualizada: marca
      );
      setMarcas(marcasAtualizadas);
      fecharModal();
    } else {
      throw new Error("Falha ao alterar marca.");
    }
  };

  function abrirModal(marca: Marca) {
    setMarcaASerMudada(marca);
  }

  function fecharModal() {
    setMarcaASerMudada(null);
  }

  async function excluir(id: string){
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta marca?");
    if(confirmacao){
        try {
        const response = await fetch(
            `http://localhost:3001/marcas/${id}`,
            {
                method: "DELETE",
            }
         );
         if(!response.ok){
            throw new Error("Falha ao excluir marca");
         }
         const marcasAtualizadas = marcas.filter((marca) => marca.id !== id);
         setMarcas(marcasAtualizadas);
        } catch (error) {
            console.error(error);
        }
    }
}

  return (
    <>
      <Typography variant="h4" gutterBottom align="center">
        Lista de Marcas
      </Typography>
      <TextField
        label="Pesquisar"
        variant="outlined"
        fullWidth
        onChange={event => setFiltro(event.target.value)}
        sx={{ mb: 2 }}
      />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de marcas">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrados.map((marca) => (
                <TableRow key={marca.id}>
                  <TableCell>{marca.id}</TableCell>
                  <TableCell>{marca.nome}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" size="small" onClick={() => abrirModal(marca)}>Editar</Button>
                    <Button variant="contained" size="small" color="error" onClick = {() => excluir(marca.id)} sx={{ ml: 1 }}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      <Dialog open={!!marcaASerMudada} onClose={fecharModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Marca</DialogTitle>
        <DialogContent dividers>
          <FormMarca onSubmit={alterar} textoBotao="Salvar Alterações" valorInicial={marcaASerMudada ?? undefined} />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}