import { ListaVenda } from "../pages/ListaVenda";
import { Routes, Route } from 'react-router-dom';

export function VendaRoutes(){
    return (
        <Routes>
            <Route path="/" element={<ListaVenda/>}/>
            {/* <Route path="/cadastrar" element={<CadastraVenda/>}/> */}
        </Routes>
    )
}