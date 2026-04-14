
import { BrowserRouter, Link } from 'react-router-dom';
import './App.css'
import { AppRoutes } from './routes/AppRoutes';
import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';

const drawerWidth = '20%';

const menuItems = [
  { text: 'Cadastrar Categoria', path: '/categorias/cadastrar' },
  { text: 'Listar Categorias', path: '/categorias/' },
  { text: 'Cadastrar Produto', path: '/produtos/cadastrar' },
  { text: 'Listar Produtos', path: '/produtos/' },
  { text: 'Cadastrar Fornecedor', path: '/fornecedores/cadastrar' },
  { text: 'Listar Fornecedores', path: '/fornecedores/' },
  {text: 'Listar Vendas', path: '/vendas/'}
];

function App() {

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ width: `calc(100% - ${drawerWidth})`, ml: `${drawerWidth}` }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Sistema PDV
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              PDV
            </Typography>
          </Toolbar>
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton component={Link} to={item.path}>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Toolbar />
          <AppRoutes />
        </Box>
      </Box>
    </BrowserRouter>
  )
}

export default App
