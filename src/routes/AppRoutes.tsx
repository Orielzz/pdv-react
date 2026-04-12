import { Route, Routes } from "react-router-dom";
import { CategoriasRoutes } from "../modules/categoria/routes/CategoriasRoutes";
import { ProdutosRoutes } from "../modules/produto/routes/ProdutosRoutes";
import { FornecedoresRoutes } from "../modules/fornecedor/routes/FornecedoresRoutes";

export function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/categorias/*" element={<CategoriasRoutes/>} />
            <Route path="/produtos/*" element={<ProdutosRoutes />} />
            <Route path="/fornecedores/*" element={<FornecedoresRoutes />} />
            <Route path="/pedidos" element={<h1>Pedidos</h1>} />
        </Routes>
    )
}