import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateSession } from "../../services/auth";

interface ProtectedRouteProps {
    children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    
    useEffect(() => {
        async function checkAuthentification() {
            try{
                await validateSession();
                setIsAuthenticated(true);
            } catch (error) {
            console.error("Invalid session:", error);

            setIsAuthenticated(false)
            }
        }

        checkAuthentification();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default ProtectedRoute