import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import type { Venda } from "../types/Venda";
import type { ProdutoVendido } from "../types/Produto_Vendido";

export function ListaVenda() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);
  const [filtro, setFiltro] = useState("");

  const buscarVendas = async () => {
    try {
      const response = await fetch("http://localhost:3001/vendas");
      const data = await response.json();
      setVendas(data);
    } catch (error) {
      console.error("Falha ao buscar vendas", error);
    }
  };

  useEffect(() => {
    buscarVendas();
  }, []);

  const excluirVenda = async (id: number) => {
    if (window.confirm("Deseja realmente excluir esta venda?")) {
      try {
        const response = await fetch(`http://localhost:3001/vendas/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setVendas((prev) => prev.filter((v) => v.id !== id));
        }
      } catch (error) {
        console.error("Erro ao excluir venda", error);
      }
    }
  };

  const fecharModal = () => {
    setVendaSelecionada(null);
  };

  const verDetalhes = async (id: number) => {
    try {
      const responseVenda = await fetch("http://localhost:3001/vendas/" + id);
      const venda = (await responseVenda.json()) as Venda;
      let itens: ProdutoVendido[] = [];

      if (venda.itensId && venda.itensId.length > 0) {
        itens = await Promise.all(
          venda.itensId.map(async (itemId: number) => {
            const responseItem = await fetch(
              `http://localhost:3001/produtos_vendidos/${itemId}`
            );
            const produtoVendido = (await responseItem.json()) as ProdutoVendido;
            const responseProduto = await fetch(
              `http://localhost:3001/produtos/${produtoVendido.produtoId}`
            );
            produtoVendido.produto = await responseProduto.json();
            return produtoVendido;
          })
        );
      }

      setVendaSelecionada({ ...venda, itens });
    } catch (error) {
      console.error("Erro ao buscar detalhes da venda", error);
    }
  };

  const filtradas = vendas.filter(
    (venda) =>
      venda.id.toString().includes(filtro) 
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        Vendas Realizadas
      </Typography>

      <TextField
        label="Filtrar por ID"
        variant="outlined"
        fullWidth
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtradas.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell>{venda.id}</TableCell>
                <TableCell>{new Date(venda.data).toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  {venda.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => verDetalhes(venda.id)}
                    sx={{ mr: 1 }}
                  >
                    Ver Detalhes
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => excluirVenda(venda.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhuma venda encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!vendaSelecionada}
        onClose={fecharModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalhes da Venda #{vendaSelecionada?.id}</DialogTitle>
        <DialogContent dividers>
          {vendaSelecionada && (
            <Box>
              <Typography>
                <strong>Data:</strong>{" "}
                {new Date(vendaSelecionada.data).toLocaleString("pt-BR")}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Itens Vendidos
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Qtd.</TableCell>
                      <TableCell align="right">Preço Unit.</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendaSelecionada.itens?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.produto?.nome ?? "Produto não encontrado"}
                        </TableCell>
                        <TableCell align="right">{item.quantidade}</TableCell>
                        <TableCell align="right">
                          {item.precoUnitario.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell align="right">
                          {(item.quantidade * item.precoUnitario).toLocaleString(
                            "pt-BR",
                            { style: "currency", currency: "BRL" }
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                <strong>Total da Venda:</strong>{" "}
                {vendaSelecionada.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
