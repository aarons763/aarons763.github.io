// background-script.js

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

// Mouse interaction
const mouse = {
    x: undefined,
    y: undefined,
    radius: 100, // Interaction radius
};

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle class
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Update particle position
    update() {
        this.draw();
        // Natural random movement (like small water currents)
        /*this.velocity.x += (Math.random() - 0.5) * 0.1;
        this.velocity.y += (Math.random() - 0.5) * 0.1;*/

        if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0.1 * Math.sign(this.velocity.x);
        if (Math.abs(this.velocity.y) < 0.1) this.velocity.y = 0.1 * Math.sign(this.velocity.y);

        // Distance from mouse
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            // Water ripple effect - slight push away from the mouse
            let force = (mouse.radius - distance) / mouse.radius;
            let angle = Math.atan2(dy, dx);

            this.velocity.x += Math.cos(angle) * force * 1.2;
            this.velocity.y += Math.sin(angle) * force * 1.2;
        }

        // Apply movement with damping
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.velocity.x *= 0.99; // Slight damping for smooth movement
        this.velocity.y *= 0.99;

        // Wrap-around effect (teleport to opposite side)
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

// Create particles
const particles = [];
function createParticles() {
    const radius = Math.random() * 3 + 1; // Random radius between 1 and 4
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = '#ffffff'; // White color
    const velocity = {
        x: (Math.random() - 0.5) * 0.5, // Random horizontal speed
        y: (Math.random() - 0.5) * 0.5, // Random vertical speed
    };
    particles.push(new Particle(x, y, radius, color, velocity));
}

// Initialize particles
for (let i = 0; i < 100; i++) {
    createParticles();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    particles.forEach((particle) => particle.update()); // Update particles
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Mouse interaction event listener
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Function to make particles react like water around the mouse
function interactWithMouse() {
    particles.forEach((particle) => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            // Water-like effect using attraction
            const force = (mouse.radius - distance) / mouse.radius; // Strength decreases with distance
            const angle = Math.atan2(dy, dx); // Direction of movement

            // Apply force with damping for smooth motion
            particle.velocity.x -= Math.cos(angle) * force * 0.5;
            particle.velocity.y -= Math.sin(angle) * force * 0.5;

            // Introduce damping to prevent endless movement
            particle.velocity.x *= 0.92;
            particle.velocity.y *= 0.92;
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        particle.update();
    });
    interactWithMouse();
}

// Start animation
animate();