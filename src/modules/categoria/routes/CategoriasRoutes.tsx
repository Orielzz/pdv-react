import { Route, Routes } from "react-router-dom";
import { ListaCategorias } from "../pages/ListaCategorias";
import { CadastraCategoria } from "../pages/CadastraCategoria";

export function CategoriasRoutes(){
    return(
    <Routes>
        <Route path="/" element={<ListaCategorias/>}/>
        <Route path="/cadastrar" element={<CadastraCategoria/>}/>
    </Routes>
    )
    
}