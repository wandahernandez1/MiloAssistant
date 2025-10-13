import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/functionalities-menu.css";

export default function FunctionalitiesMenu() {
    const [open, setOpen] = useState(false);

    const funcionalidades = [
        { name: "Gestiona tu calendario", path: "/calendar" },
        { name: "Habla con Milo", path: "/chat" },
        { name: "Crea recordatorios", path: "/reminders" },
        { name: "Noticias de hoy", path: "/news" },
        { name: "Clima en tiempo real", path: "/weather" },
        { name: "Gestiona tareas y notas", path: "/tasks-notes" },
    ];

    return (
        <div className="functionalities-menu-container">
            <div className="functionalities-button" onClick={() => setOpen(!open)}>
                <span className="functionalities-title">Funcionalidades</span>
                <i className={`fas fa-caret-down dropdown-arrow ${open ? "open" : ""}`}></i>
            </div>

            {open && (
                <div className="dropdown-content">
                    {funcionalidades.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.path}
                            className="dropdown-link"
                            onClick={() => setOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
