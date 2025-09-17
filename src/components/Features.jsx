import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/Features.css"; // tu CSS actual

export default function Features() {
    const cardsRef = useRef([]);

    useEffect(() => {
        // Inicializamos la posición de las cards (solo y, no opacity)
        gsap.set(cardsRef.current, { y: 50 });

        // Animación de entrada escalonada
        gsap.to(cardsRef.current, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2
        });

        // Efectos de 3D y foco de luz
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
                    ease: "power1.out"
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
                    ease: "elastic.out(1, 0.5)"
                });
            };

            card.addEventListener("mousemove", handleMouseMove);
            card.addEventListener("mouseenter", handleMouseEnter);
            card.addEventListener("mouseleave", handleMouseLeave);

            // Limpiar eventos al desmontar
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
                "Interactúa con Milo a través de voz o texto, de manera natural y empática. Hazle preguntas, dale comandos o simplemente chatea como lo harías con una persona."
        },
        {
            icon: "fas fa-calendar-check",
            title: "Organiza tus Días",
            description:
                "Centraliza tus tareas con recordatorios, notas y una agenda integrada. Nunca olvides lo importante y ten claridad en tu planificación."
        },
        {
            icon: "fas fa-info-circle",
            title: "Consulta Información Relevante",
            description:
                "Accede al clima, noticias o eventos sin cambiar de aplicación. Obtén datos instantáneos y contextualizados para tu día."
        },
        {
            icon: "fas fa-lightbulb",
            title: "Recibe Sugerencias Proactivas",
            description:
                "Milo puede ofrecerte sugerencias inteligentes para facilitar tus decisiones diarias, mejorando tu productividad y claridad mental."
        },
        {
            icon: "fas fa-magic",
            title: "Experiencia Unificada",
            description:
                "Milo integra funciones dispersas en un solo espacio amigable, organizado y confiable, reduciendo la sobrecarga cognitiva."
        },
        {
            icon: "fas fa-moon",
            title: "Diseño Amigable y Cómodo",
            description:
                "Disfruta de una interfaz limpia y un diseño que reduce la fatiga visual, ideal para uso prolongado o en ambientes con poca luz."
        }
    ];

    return (
        <div className="how-to-use-container">
            <div className="intro-section-how-to">
                <h1>
                    Descubre cómo <span className="highlight">Milo</span> simplifica tu día.
                </h1>
                <p>MiloAssistant es un asistente virtual inteligente, accesible por voz o texto, diseñado para acompañarte en tu vida diaria, centralizando información y aportando tranquilidad.</p>
            </div>

            <div className="features-grid">
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
            </div>
        </div>
    );
}
