import { ListaVenda } from "../pages/ListaVenda";
import { PontoDeVenda } from "../pages/PontoDeVenda";
import { Routes, Route } from 'react-router-dom';

export function VendaRoutes(){
    return (
        <Routes>
            <Route path="/" element={<ListaVenda/>}/>
            <Route path="/pdv" element={<PontoDeVenda/>}/>
        </Routes>
    )
}