import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ProfileMenu() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const { getCurrentUser, logout } = useAuth();

    useEffect(() => {
        getCurrentUser().then(setUser);
    }, [getCurrentUser]);

    if (!user) return null;

    return (
        <div className="profile-menu-container">
            <div className="profile-button" onClick={() => setOpen(!open)}>
                <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                <span>{user.username}</span>
            </div>
            {open && (
                <div className="dropdown-content">
                    <a href="/edit-profile">Editar Perfil</a>
                    <a href="#" onClick={logout}>Cerrar Sesión</a>
                </div>
            )}
        </div>
    );
}
