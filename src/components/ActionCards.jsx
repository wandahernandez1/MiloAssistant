import React from "react";

export default function ActionCards({ handleCardClick }) {
    const cards = [
        { key: "clima", icon: "fas fa-cloud", title: "Clima", desc: "Consulta el clima actual" },
        { key: "recordatorio", icon: "fas fa-bell", title: "Recordatorio", desc: "Crea un recordatorio" },
        { key: "tareas", icon: "fas fa-tasks", title: "Tareas", desc: "Organiza tus tareas" },
        { key: "noticias", icon: "fas fa-list-ul", title: "Novedades Locales", desc: "Ve noticias de hoy" },
        { key: "nota", icon: "fas fa-sticky-note", title: "Notas", desc: "Anota tus pendientes" },
    ];

    return (
        <section className="action-cards-section">
            {cards.map(c => (
                <div key={c.key} className="card" onClick={() => handleCardClick(c.key)}>
                    <i className={`${c.icon} icon`}></i>
                    <p className="card-title">{c.title}</p>
                    <p className="card-description">{c.desc}</p>
                </div>
            ))}
        </section>
    );
}
