document.addEventListener('DOMContentLoaded', () => {

    // Se oculta antes de animarla 
    gsap.set(".news-card", { opacity: 0, y: 50 });

    // Animacion de entrada para que aparezcan
    gsap.to(".news-card", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.15, // Aparece una por una
        ease: "power3.out",
        delay: 0.2
    });

    //  Efecto 3D y Foco de Luz 
    const cards = document.querySelectorAll('.news-card');

    cards.forEach(card => {
        // Efecto de Foco de Luz
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Efecto de Inclinacion 3D
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.4,
                scale: 1.02,
                ease: "power2.out"
            });
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = -y / 20;
            const rotateY = x / 20;

            gsap.to(card, {
                duration: 0.8,
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: "power1.out"
            });
        });

        // Resetea al salir el mousse
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.6,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
});