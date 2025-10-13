// src/components/ProfileMenu.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function ProfileMenu() {
    const { currentUser, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    if (!currentUser) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="profile-menu-container">
            <div className="profile-button" onClick={() => setOpen(!open)}>
                <div className="avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
                <span className="profile-name">{currentUser.name}</span>
                <i className={`fas fa-caret-down dropdown-arrow ${open ? "open" : ""}`}></i>
            </div>

            {open && (
                <div className="dropdown-content">
                    {/* Botón de "Panel Personal" */}
                    <Link to="/panel" className="dropdown-link" onClick={() => setOpen(false)}>
                        Panel Personal
                    </Link>
                    <Link to="/edit-profile" className="dropdown-link" onClick={() => setOpen(false)}>
                        Editar Perfil
                    </Link>
                    <button onClick={handleLogout} className="dropdown-link logout-button">
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
}