document.addEventListener('DOMContentLoaded', () => {

    //  Animacion escalonada para las Tarj
    gsap.from(".feature-card", {
        duration: 0.8,
        opacity: 0,
        y: 60,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2 // Tarda para que cargue la pagina
    });


    const cards = document.querySelectorAll('.feature-card');

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
            const rotateX = -y / 20; // Controla la inclinacion vertical
            const rotateY = x / 20;  // Controla la inclinacion horizontal

            gsap.to(card, {
                duration: 0.8,
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: "power1.out"
            });
        });


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