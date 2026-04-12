import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { FormFornecedor } from '../components/FormFornecedor';
import type { Fornecedor } from '../types/Fornecedor';

export function ListaFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [fornecedorASerMudado, setFornecedorASerMudado] = useState<Fornecedor | null>(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function buscar(){
      try {
        const response = await fetch("http://localhost:3001/fornecedores");
        const data = await response.json();
        setFornecedores(data);
      } catch (error) {
        console.error("Falha ao buscar fornecedores", error);
      }
    }
    buscar();
  }, []);

  const filtrados = fornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(filtro.toLowerCase()) || 
    fornecedor.id.toString().includes(filtro) ||
    fornecedor.cnpj.includes(filtro) ||
    fornecedor.telefone.includes(filtro)
  );

  const alterar = async (dadosFormulario: Omit<Fornecedor, "id">) => {
    if (!fornecedorASerMudado) return;

    const fornecedorParaApi = {
      nome: dadosFormulario.nome,
      cnpj: dadosFormulario.cnpj,
      telefone: dadosFormulario.telefone,
    };

    const response = await fetch(
      `http://localhost:3001/fornecedores/${fornecedorASerMudado.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedorParaApi),
      }
    );

    if (response.ok) {
      const fornecedorAtualizadoNaUi = {
        id: fornecedorASerMudado.id,
        nome: dadosFormulario.nome,
        cnpj: dadosFormulario.cnpj,
        telefone: dadosFormulario.telefone,
      };
      setFornecedores((fornecedoresAnteriores) =>
        fornecedoresAnteriores.map((f) =>
          f.id === fornecedorAtualizadoNaUi.id ? fornecedorAtualizadoNaUi : f
        )
      );
      fecharModal();
    } else {
      throw new Error("Falha ao alterar fornecedor.");
    }
  };

  async function excluir(id: number){
    const confirmacao = window.confirm("Tem certeza que deseja excluir este fornecedor?");
    if(confirmacao){
        try {
          const response = await fetch(
              `http://localhost:3001/fornecedores/${id}`,
              {
                  method: "DELETE",
              }
          );
          if(!response.ok){
              throw new Error("Falha ao excluir fornecedor");
          }
          setFornecedores((fornecedoresAnteriores) => fornecedoresAnteriores.filter((fornecedor) => fornecedor.id !== id));
        } catch (error) {
            console.error(error);
        }
    }
  }

  function abrirModal(fornecedor: Fornecedor) {
    setFornecedorASerMudado(fornecedor);
  }

  function fecharModal() {
    setFornecedorASerMudado(null);
  }

  return (
    <>
      <TextField placeholder="Pesquisa" focused onChange={event => setFiltro(event.target.value)} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de fornecedores">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map((fornecedor) => (
              <TableRow key={fornecedor.id}>
                <TableCell>{fornecedor.id}</TableCell>
                <TableCell>{fornecedor.nome}</TableCell>
                <TableCell>{fornecedor.cnpj}</TableCell>
                <TableCell>{fornecedor.telefone}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" size="small" onClick={() => abrirModal(fornecedor)}>Editar</Button>
                  <Button variant="contained" size="small" color="error" onClick={() => excluir(fornecedor.id)} sx={{ ml: 1 }}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!fornecedorASerMudado} onClose={fecharModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Fornecedor</DialogTitle>
        <DialogContent dividers>
          <FormFornecedor onSubmit={alterar} textoBotao="Salvar Alterações" valorInicial={fornecedorASerMudado ?? undefined} />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
