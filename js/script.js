//script.js

document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active"); // Reset when out of view
            }
        });
    }, { threshold: 0.05 });

    elements.forEach(element => observer.observe(element));
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    toggleButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});