// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica del menú móvil
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // 2. Animación de aparición al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // 3. Header con sombra al hacer scroll
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        });
    }

    // 4. CARRUSELES REUTILIZABLES
    function initCarousel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const slides = container.querySelectorAll('.carousel-slide');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        const dotsContainer = container.querySelector('.carousel-dots');
        const currentCounter = container.querySelector('.carousel-current');
        
        let currentIndex = 0;
        let autoplayInterval;
        let touchStartX = 0;
        
        // Generar dots dinámicamente
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir a foto ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        
        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            
            currentIndex = (index + slides.length) % slides.length;
            
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
            
            if (currentCounter) {
                currentCounter.textContent = currentIndex + 1;
            }
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 6000);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }
        
        // Botones
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }
        
        // Pausar en hover
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
        
        // Swipe táctil
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        }, { passive: true });
        
        // Iniciar autoplay
        startAutoplay();
    }
    
    // Inicializar todos los carruseles
    initCarousel('carousel-cocinas');
    initCarousel('carousel-vestidores');
    initCarousel('carousel-banos');
    initCarousel('carousel-oficinas');
    initCarousel('carousel-racks');

        // =========================================
    // 5. LIGHTBOX (visor de fotos ampliado)
    // =========================================
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    
    let lightboxImages = [];
    let lightboxIndex = 0;
    
    // Abrir lightbox al hacer clic en un carrusel
    const carouselContainers = document.querySelectorAll('.carousel-container');
    
    carouselContainers.forEach(container => {
        const viewport = container.querySelector('.carousel-viewport');
        if (!viewport) return;
        
        viewport.addEventListener('click', () => {
            // Obtener todas las imágenes de este carrusel
            const slides = container.querySelectorAll('.carousel-slide img');
            lightboxImages = Array.from(slides).map(img => img.src);
            
            // Obtener el índice actual del carrusel
            const activeSlide = container.querySelector('.carousel-slide.active');
            const allSlides = Array.from(container.querySelectorAll('.carousel-slide'));
            lightboxIndex = allSlides.indexOf(activeSlide);
            
            // Mostrar lightbox
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
        });
    });
    
    function updateLightbox() {
        lightboxImg.src = lightboxImages[lightboxIndex];
        lightboxCurrent.textContent = lightboxIndex + 1;
        lightboxTotal.textContent = lightboxImages.length;
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
    
    function lightboxNextSlide() {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        updateLightbox();
    }
    
    function lightboxPrevSlide() {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightbox();
    }
    
    // Eventos del lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', lightboxNextSlide);
    lightboxPrev.addEventListener('click', lightboxPrevSlide);
    
    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNextSlide();
        if (e.key === 'ArrowLeft') lightboxPrevSlide();
    });
    
    // Swipe en el lightbox (móvil)
    let lbTouchStartX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        const lbTouchEndX = e.changedTouches[0].screenX;
        const diff = lbTouchStartX - lbTouchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                lightboxNextSlide();
            } else {
                lightboxPrevSlide();
            }
        }
    }, { passive: true });
});