 import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { Produto } from "../../produto/types/Produto";

type CartItem = {
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
};

export function PontoDeVenda() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState("");
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      const response = await fetch("http://localhost:3001/produtos");
      const data = (await response.json()) as unknown[];
      const produtosConvertidos: Produto[] = data.map((item: unknown) => {
        const produto = item as Record<string, unknown>;
        return {
          ...(item as Produto),
          id: String(produto.id),
          preco: Number(produto.preco),
          estoque: Number(produto.estoque),
          categoriaId: produto.categoriaId ? String(produto.categoriaId) : undefined,
          fornecedorId: produto.fornecedorId ? String(produto.fornecedorId) : undefined,
        } as unknown as Produto;
      });
      setProdutos(produtosConvertidos);
    } catch (error) {
      console.error("Falha ao buscar produtos", error);
    }
  }

  const produtoSelecionadoObj = produtoSelecionado;

  const total = useMemo(
    () => carrinho.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0),
    [carrinho]
  );

  const adicionarAoCarrinho = () => {
    setErro("");
    const qtd = Number(quantidade);

    if (!produtoSelecionadoObj) {
      setErro("Selecione um produto para adicionar ao carrinho.");
      return;
    }

    if (!quantidade || qtd < 1) {
      setErro("Digite uma quantidade válida.");
      return;
    }

    if (qtd > produtoSelecionadoObj.estoque) {
      setErro("Quantidade maior do que o estoque disponível.");
      return;
    }

    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.produto.id === produtoSelecionadoObj.id);

      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + qtd;
        if (novaQuantidade > produtoSelecionadoObj.estoque) {
          setErro("Quantidade total no carrinho excede o estoque disponível.");
          return prev;
        }

        return prev.map((item) =>
          item.produto.id === produtoSelecionadoObj.id
            ? { ...item, quantidade: item.quantidade + qtd }
            : item
        );
      }

      return [...prev, {
        produto: produtoSelecionadoObj,
        quantidade: qtd,
        precoUnitario: produtoSelecionadoObj.preco,
      }];
    });
  };

  const removerDoCarrinho = (produtoId: string | number) => {
    setCarrinho((prev) => prev.filter((item) => String(item.produto.id) !== String(produtoId)));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    setProdutoSelecionado(null);
    setQuantidade("");
  };

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      setErro("Adicione ao menos um item ao carrinho antes de finalizar a venda.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const responseVenda = await fetch("http://localhost:3001/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: new Date().toISOString(),
          total,
          itensId: [],
        }),
      });

      if (!responseVenda.ok) {
        throw new Error("Falha ao criar venda.");
      }

      const vendaCriada = await responseVenda.json();
      const itensIds: (string | number)[] = [];
      console.log("Venda criada com ID:", vendaCriada.id);

      for (const item of carrinho) {
        const responseItem = await fetch("http://localhost:3001/produtos_vendidos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendaId: vendaCriada.id,
            produtoId: item.produto.id,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          }),
        });

        if (!responseItem.ok) {
          throw new Error("Falha ao criar item vendido.");
        }

        const itemCriado = await responseItem.json();
        itensIds.push(String(itemCriado.id));

        const estoqueAtualizado = Number(item.produto.estoque) - item.quantidade;
        await fetch(`http://localhost:3001/produtos/${String(item.produto.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estoque: estoqueAtualizado }),
        });
      }

      await fetch(`http://localhost:3001/vendas/${String(vendaCriada.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itensId: itensIds }),
      });

      limparCarrinho();
      await buscarProdutos();
    } catch (error) {
      console.error("Erro ao finalizar venda", error);
      setErro("Ocorreu um erro ao finalizar a venda. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleProdutoChange = (_event: unknown, value: Produto | null) => {
    setProdutoSelecionado(value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Ponto de Venda
      </Typography>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Autocomplete
          fullWidth
          options={produtos}
          getOptionLabel={(option) =>
            `${option.nome} - ${option.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (Estoque: ${option.estoque})`
          }
          value={produtoSelecionado}
          onChange={handleProdutoChange}
          isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
          renderInput={(params) => <TextField {...params} label="Produto" />}
          noOptionsText="Nenhum produto encontrado"
          sx={{ flex: 2 }}
        />

        <TextField
          label="Quantidade"
          type="number"
          value={quantidade}
          sx={{ width: { xs: "100%", md: 140 } }}
          onChange={(event) => setQuantidade(event.target.value)}
        />

        <Button variant="contained" sx={{ width: { xs: "100%", md: "auto" } }} onClick={adicionarAoCarrinho}>
          Adicionar
        </Button>

        {erro && (
          <Typography color="error" sx={{ mt: { xs: 2, md: 0 } }}>
            {erro}
          </Typography>
        )}
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Preço Unitário</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carrinho.map((item) => (
                <TableRow key={item.produto.id}>
                  <TableCell>{item.produto.nome}</TableCell>
                  <TableCell>
                    {item.precoUnitario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>
                    {(item.precoUnitario * item.quantidade).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      color="error"
                      size="small"
                      onClick={() => removerDoCarrinho(item.produto.id)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {carrinho.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Carrinho vazio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Typography>
        <Button variant="contained" color="primary" onClick={finalizarVenda} disabled={carregando || carrinho.length === 0}>
          Finalizar Venda
        </Button>
      </Box>
    </Container>
  );
}
