document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.querySelector(".contenedorCarrusel");
    const slides = contenedor.querySelector(".slides");
    const slideItems = contenedor.querySelectorAll(".slide");
    const prevBtn = contenedor.querySelector(".carousel-btn.prev");
    const nextBtn = contenedor.querySelector(".carousel-btn.next");
    const dotsContainer = contenedor.querySelector(".carousel-dots");

    let currentIndex = 0;
    const totalSlides = slideItems.length;
    let intervalId;

    // Crear dots dinámicamente
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("span");
        dot.classList.add("carousel-dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            currentIndex = i;
            updateSlidePosition();
            restartAutoplay();
        });
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    function updateSlidePosition() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    function moveToNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlidePosition();
    }

    function moveToPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
    }

    prevBtn.addEventListener("click", () => {
        moveToPrevSlide();
        restartAutoplay();
    });

    nextBtn.addEventListener("click", () => {
        moveToNextSlide();
        restartAutoplay();
    });

    function startAutoplay() {
        intervalId = setInterval(moveToNextSlide, 10000);
    }

    function stopAutoplay() {
        clearInterval(intervalId);
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    contenedor.addEventListener("mouseenter", stopAutoplay);
    contenedor.addEventListener("mouseleave", startAutoplay);

    // Iniciar carrusel
    updateSlidePosition();
    startAutoplay();
});
