import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        // Si no hay token, redirige al login
        return <Navigate to="/login" replace />;
    }

    return children; // Si hay token, renderiza el contenido
}
