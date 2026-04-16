import { Route, Routes } from "react-router-dom";
import { ListaMarcas } from "../pages/ListaMarcas";
import { CadastraMarca } from "../pages/CadastraMarca";

export function MarcasRoutes(){
    return(
    <Routes>
        <Route path="/" element={<ListaMarcas/>}/>
        <Route path="/cadastrar" element={<CadastraMarca/>}/>
    </Routes>
    )

}