
import { BrowserRouter, Link } from 'react-router-dom';
import './App.css'
import { AppRoutes } from './routes/AppRoutes';
import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, ListSubheader, Toolbar, Typography } from '@mui/material';

const drawerWidth = '20%';

const menuItems = [
  { text: 'PDV', path: '/vendas/pdv' },
  { text: 'Listar Vendas', path: '/vendas/' },
  { text: 'Cadastrar Categoria', path: '/categorias/cadastrar' },
  { text: 'Listar Categorias', path: '/categorias/' },
  { text: 'Cadastrar Produto', path: '/produtos/cadastrar' },
  { text: 'Listar Produtos', path: '/produtos/' },
  { text: 'Cadastrar Fornecedor', path: '/fornecedores/cadastrar' },
  { text: 'Listar Fornecedores', path: '/fornecedores/' },
  { text: 'Cadastrar Marca', path: '/marcas/cadastrar' },
  { text: 'Listar Marcas', path: '/marcas/' },
];

const menuGroups = [
  {
    title: 'Vendas',
    items: menuItems.slice(0, 2)
  },
  {
    title: 'Categorias',
    items: menuItems.slice(2, 4)
  },
  {
    title: 'Produtos',
    items: menuItems.slice(4, 6)
  },
  {
    title: 'Fornecedores',
    items: menuItems.slice(6, 8)
  },
  {
    title: 'Marcas',
    items: menuItems.slice(8, 10)
  }
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
              {menuGroups.map((group) => (
                <div key={group.title}>
                  <ListSubheader sx={{ bgcolor: 'primary.dark', color: 'white', fontWeight: 'bold' }}>{group.title}</ListSubheader>
                  {group.items.map((item) => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton component={Link} to={item.path}>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </div>
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
