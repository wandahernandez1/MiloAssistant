document.addEventListener('DOMContentLoaded', () => {
    tsParticles.load("particles-js", {
        fpsLimit: 60,
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false } },
            size: { value: 2, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_opacity: 0.5 }
            }
        },
        retina_detect: true
    });
});