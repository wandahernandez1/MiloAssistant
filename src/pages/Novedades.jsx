import Navbar from "../components/Navbar";
import "../styles/novedades.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Novedades() {
    const newsRef = useRef([]);

    useEffect(() => {
        // Animación inicial escalonada para las news cards
        gsap.from(newsRef.current, {
            duration: 0.8,
            opacity: 1,
            y: 60,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2,
        });

        // Efecto 3D y seguimiento de mouse para cada card
        newsRef.current.forEach((card) => {
            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const offsetX = x - rect.width / 2;
                const offsetY = y - rect.height / 2;
                const rotateX = -offsetY / 20;
                const rotateY = offsetX / 20;

                gsap.to(card, {
                    duration: 0.8,
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: "power1.out",
                });
            };

            const handleMouseEnter = () => {
                gsap.to(card, { duration: 0.4, scale: 1.02, ease: "power2.out" });
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    duration: 0.6,
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    ease: "elastic.out(1, 0.5)",
                });
            };

            card.addEventListener("mousemove", handleMouseMove);
            card.addEventListener("mouseenter", handleMouseEnter);
            card.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                card.removeEventListener("mousemove", handleMouseMove);
                card.removeEventListener("mouseenter", handleMouseEnter);
                card.removeEventListener("mouseleave", handleMouseLeave);
            };
        });
    }, []);

    const news = [
        {
            icon: "fas fa-magic",
            title: "IA Conversacional Mejorada",
            description:
                "Milo ahora es más natural y fluido en sus respuestas gracias a la integración de Gemini API, ofreciendo una asistencia más contextual y empática.",
        },
        {
            icon: "fas fa-cloud-sun",
            title: "Clima en Tiempo Real",
            description:
                "Mantente siempre informado. Milo ahora consulta el clima en tiempo real según tu ubicación, gracias a la API de OpenWeatherMap.",
        },
        {
            icon: "fas fa-newspaper",
            title: "Noticias Relevantes",
            description:
                "Accede a las noticias más importantes y actualizadas diariamente, con la posibilidad de filtrar por país y categoría, a través de NewsAPI.",
        },
        {
            icon: "fas fa-tasks",
            title: "Gestión de Tareas y Notas",
            description:
                "Hemos optimizado la forma en que organizas tus tareas. Disfruta de una gestión más intuitiva y centralizada para tus recordatorios.",
        },
        {
            icon: "fas fa-mobile-alt",
            title: "Próxima PWA Móvil",
            description:
                "Estamos trabajando para que Milo sea aún más accesible. Prepárate para la versión móvil con Progressive Web App (PWA) para una experiencia fluida.",
        },
        {
            icon: "fas fa-user-circle",
            title: "Perfiles de Usuario Optimizados",
            description:
                "La base de datos se ha optimizado para perfiles de usuario, abriendo camino a futuras personalizaciones basadas en tus hábitos y preferencias.",
        },
    ];

    return (
        <div>
            <Navbar />
            <main className="novedades-container">
                <a href="/" className="back-button">
                    <i className="fas fa-arrow-left"></i>
                    <span>Volver</span>
                </a>

                <section className="intro-section-novedades">
                    <h1>Entérate de las nuevas características y mejoras de Milo.</h1>
                </section>

                <section className="news-grid">
                    {news.map((item, index) => (
                        <div
                            key={index}
                            className="news-card"
                            ref={(el) => (newsRef.current[index] = el)}
                        >
                            <i className={`icon ${item.icon}`}></i>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
