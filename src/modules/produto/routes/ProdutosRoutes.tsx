import { Route, Routes } from "react-router-dom";
import { ListaProdutos } from "../pages/ListaProdutos";
import { CadastraProduto } from "../pages/CadastraProduto";

export function ProdutosRoutes(){
    return(
        <Routes>
            <Route path="/" element={<ListaProdutos/>}/>
            <Route path="/cadastrar" element={<CadastraProduto/>}/>
        </Routes>
    )
}
