import { Route, Routes } from "react-router-dom";
import { ListaFornecedores } from "../pages/ListaFornecedores";
import { CadastraFornecedor } from "../pages/CadastraFornecedor";

export function FornecedoresRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ListaFornecedores />} />
            <Route path="/cadastrar" element={<CadastraFornecedor />} />
        </Routes>
    )
}
