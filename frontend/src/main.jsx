import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";
import Layout from './components/Layout.jsx';
import Map from './components/Map/Map.jsx';
import Index from './components/Index/Index.jsx';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Index/>}/>
                    <Route path="/map" element={<Map />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
