document.addEventListener('DOMContentLoaded', () => {

    //  Configuración del Fondo de body 
    tsParticles.load("particles-js", {
        fpsLimit: 60,
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 2, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1, direction: "none", random: false, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_opacity: 1 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });

    // animación de texto 
    const title = new SplitType('#hero-title', { types: 'chars' });

    // oculta los elementos con GSAP para evitar parpadeos
    gsap.set(['.hero-avatar', '.hero-text', '.cta-button', '.navbar'], { autoAlpha: 0 });
    gsap.set(title.chars, { y: 120 });

    // animacion principal GSAP 
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to('.navbar', { duration: 1, y: 0, autoAlpha: 1, delay: 0.2 })
        .to('.hero-avatar', { duration: 1.2, scale: 1, autoAlpha: 1, ease: "elastic.out(1, 0.5)" }, "-=0.8")
        .to(title.chars, {
            duration: 0.8,
            y: 0,
            ease: "back.out",
            stagger: 0.04
        }, "-=1")
        .to('.hero-text', { duration: 1, y: 0, autoAlpha: 1 }, "-=0.8")
        .to('.cta-button', { duration: 1, y: 0, autoAlpha: 1 }, "-=0.8");

    // efecto parallax con el movimiento del mouse  
    const avatar = document.querySelector('.hero-avatar');
    const particles = document.querySelector('#particles-js');

    document.body.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        // movimiento  del avatar
        gsap.to(avatar, {
            duration: 0.8,
            x: -x * 25,
            y: -y * 25,
            rotationY: -x * 10,
            rotationX: y * 10,
            ease: "power1.out"
        });

        // movimiento opuesto del fondo 
        gsap.to(particles, {
            duration: 1.2,
            x: x * 15,
            y: y * 15,
            ease: "power1.out"
        });
    });
});