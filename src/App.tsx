
import { BrowserRouter, Link } from 'react-router-dom'
import './App.css'
import { AppRoutes } from './routes/AppRoutes';
import { List, ListItem } from '@mui/material';

function App() {

  return (
    <BrowserRouter>
    <h1>Bem vindo!</h1>
            <List className='listaSemEstilo'>
                <ListItem><Link to="/categorias/cadastrar">Cadastrar Categoria</Link></ListItem>
                <ListItem><Link to="/categorias/">Listar Categorias</Link></ListItem>
                <ListItem><Link to="/produtos/cadastrar">Cadastrar Produto</Link></ListItem>
                <ListItem><Link to="/produtos/">Listar Produtos</Link></ListItem>
                <ListItem><Link to="/fornecedores/cadastrar">Cadastrar Fornecedor</Link></ListItem>
                <ListItem><Link to="/fornecedores/">Listar Fornecedores</Link></ListItem>
            </List>
    
    <AppRoutes />
    </BrowserRouter>
    
  )
}

export default App
