import { Navigate, Route, Routes } from "react-router-dom";
import { CategoriasRoutes } from "../modules/categoria/routes/CategoriasRoutes";
import { ProdutosRoutes } from "../modules/produto/routes/ProdutosRoutes";
import { FornecedoresRoutes } from "../modules/fornecedor/routes/FornecedoresRoutes";
import { VendaRoutes } from '../modules/venda/routes/VendaRoutes';
import { MarcasRoutes } from '../modules/marca/routes/MarcasRoutes';

export function AppRoutes(){
    return (
        <Routes>
            <Route path="/categorias/*" element={<CategoriasRoutes/>} />
            <Route path="/produtos/*" element={<ProdutosRoutes />} />
            <Route path="/fornecedores/*" element={<FornecedoresRoutes />} />
            <Route path="/marcas/*" element={<MarcasRoutes />} />
            <Route path="/vendas/*" element={<VendaRoutes />} />
            <Route path="*" element={<Navigate to="/vendas/pdv" />} />
        </Routes>
    )
}