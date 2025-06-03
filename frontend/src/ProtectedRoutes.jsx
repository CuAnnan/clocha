import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { client } from "./tools/AxiosInterceptor.js";

const PrivateRoutes = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await client.getUser();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
                throw error;
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // or a spinner
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;