import { Navigate, Outlet } from 'react-router-dom'
import {client} from "./tools/AxiosInterceptor.js";

const PrivateRoutes = () => {
    const user = client.user;
    return (
        user ? (<Outlet/>) : (<Navigate to='/login'/>)
    );
}

export default PrivateRoutes;