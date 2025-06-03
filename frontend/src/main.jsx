import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";

import Layout from './components/Layout.jsx';
import Map from './components/Map/Map.jsx';
import Index from './components/Index/Index.jsx';
import Register from './components/Account/Register.jsx';
import Login from './components/Account/Login.jsx';
import Account from './components/Account/Account.jsx';

import ProtectedRoutes from './ProtectedRoutes.jsx';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';




createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Index/>}/>
                    <Route path="/map" element={<Map />}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/account" element={<Account/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
