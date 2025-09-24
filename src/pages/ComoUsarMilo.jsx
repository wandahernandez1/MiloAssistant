import Navbar from "../components/Navbar";
import "../styles/comoUsarMilo.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ComoUsarMilo() {
    const cardsRef = useRef([]);

    // Animaciones GSAP
    useEffect(() => {
        gsap.from(cardsRef.current, {
            duration: 0.8,
            opacity: 1,
            y: 60,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2,
        });

        cardsRef.current.forEach((card) => {
            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);

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

    const features = [
        {
            icon: "fas fa-comments",
            title: "Conversa de Forma Natural",
            description:
                "Interactúa con Milo a través de voz o texto, de manera natural y empática. Hazle preguntas, dale comandos o simplemente chatea como lo harías con una persona.",
        },
        {
            icon: "fas fa-calendar-check",
            title: "Organiza tus Días",
            description:
                "Centraliza tus tareas con recordatorios, notas y una agenda integrada. Nunca olvides lo importante y ten claridad en tu planificación.",
        },
        {
            icon: "fas fa-info-circle",
            title: "Consulta Información Relevante",
            description:
                "Accede al clima, noticias o eventos sin cambiar de aplicación. Obtén datos instantáneos y contextualizados para tu día.",
        },
        {
            icon: "fas fa-lightbulb",
            title: "Recibe Sugerencias Proactivas",
            description:
                "Milo puede ofrecerte sugerencias inteligentes para facilitar tus decisiones diarias, mejorando tu productividad y claridad mental.",
        },
        {
            icon: "fas fa-magic",
            title: "Experiencia Unificada",
            description:
                "Milo integra funciones dispersas en un solo espacio amigable, organizado y confiable, reduciendo la sobrecarga cognitiva.",
        },
        {
            icon: "fas fa-moon",
            title: "Diseño Amigable y Cómodo",
            description:
                "Disfruta de una interfaz limpia y un diseño que reduce la fatiga visual, ideal para uso prolongado o en ambientes con poca luz.",
        },
    ];

    return (
        <div>
            <Navbar />
            <main className="how-to-use-container">
                <a href="/" className="back-button">
                    <i className="fas fa-arrow-left"></i>
                    <span>Volver</span>
                </a>

                <section className="intro-section-how-to">
                    <h1>
                        Descubre cómo <span className="highlight">Milo</span> simplifica tu día.
                    </h1>
                    <p>
                        MiloAssistant es un asistente virtual inteligente, accesible por voz o texto, diseñado para
                        acompañarte en tu vida diaria, centralizando información y aportando tranquilidad.
                    </p>
                </section>

                <section className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            ref={(el) => (cardsRef.current[index] = el)}
                        >
                            <i className={`icon ${feature.icon}`}></i>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
