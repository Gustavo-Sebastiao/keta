// Remover loader assim que a página carregar
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            triggerEntranceAnimations();
        }, 800);
    }, 500);
});

// Efeito na Navbar ao rolar a página
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Disparar animações de entrada sequencialmente
function triggerEntranceAnimations() {
    const elements = document.querySelectorAll('.stagger-up');
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('appear');
        }, index * 150); // delay gradativo
    });
}
