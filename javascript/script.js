// Observar seções para disparar animações e mudar tema do header
const observeSections = () => {
    const observerOptions = {
        threshold: 0.5 // Dispara quando 50% da seção estiver visível
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animações Stagger
                const staggerElements = entry.target.querySelectorAll('.stagger-up');
                staggerElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('appear');
                    }, index * 150);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .hero').forEach(section => {
        observer.observe(section);
    });
};

// Inicializar quando o DOM estiver pronto (mas após o loader)
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            observeSections(); // Começar a observar as seções
            
            // Disparar animação do menu de navegação que é fixo
            const headerLinks = document.querySelectorAll('.header .stagger-up');
            headerLinks.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('appear');
                }, index * 150);
            });
        }, 800);
    }, 500);

    // Lógica do Efeito Revista e Fases 1 & 2
    const pinStage = document.getElementById('magazine-pin');
    const informacoes = document.getElementById('informacoes');
    const informacoesStep2 = document.getElementById('informacoes-step2');
    const modelContainer = document.querySelector('.model-container');
    const headerEl = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (!pinStage || !informacoes || !informacoesStep2) return;

        const rect = pinStage.getBoundingClientRect();
        const windowH = window.innerHeight;
        
        // Fase 1: Entrada da tela (100vh de distância)
        const fase1Dist = windowH * 1.0; 
        
        let scrolledInPin = 0;
        if (rect.top <= 0) {
            scrolledInPin = Math.abs(rect.top);
        }

        // --- FASE 1: Slide In (0 até 100vh) ---
        let progress1 = scrolledInPin / fase1Dist;
        progress1 = Math.max(0, Math.min(1, progress1));
        
        const translateSlide = 100 - (progress1 * 100);
        informacoes.style.transform = `translateX(${translateSlide}%)`;
        
        // O modelo entra escorregando junto com o Painel 1
        let modelTranslateX = (1 - progress1) * 100;

        // --- FASE 2: Gatilho Automático (Após 125vh) ---
        // Aqui o usuário tem um "respiro" de 25% da tela pra ficar admirando a primeira parte.
        // Se cruzar essa linha (125vh), a Fase 2 assume automaticamente e viaja a camisa!
        const triggerPhase2 = windowH * 1.25; 
        
        if (scrolledInPin > triggerPhase2) {
            informacoesStep2.classList.add('active');
            informacoesStep2.style.opacity = ""; 
            
            // Oculta o Menu Principal para não poluir a tela escura
            if (headerEl) headerEl.classList.add('menu-hidden');

            // Camisa viaja pra direita
            modelTranslateX = 42; 
        } else {
            informacoesStep2.classList.remove('active');
            informacoesStep2.style.opacity = "";
            
            // Retorna o Menu Principal à tela
            if (headerEl) headerEl.classList.remove('menu-hidden');

            // Se já tiver completado a fase 1 e estiver apenas passeando na zona de respiro:
            if (scrolledInPin >= fase1Dist) {
                modelTranslateX = 0; // Fica cravado no losango 1
            }
        }

        modelContainer.style.transform = `translateY(-50%) translateX(${modelTranslateX}vw)`;
    });

    // Lógica para interceptar o Clique no Menu (Informações)
    const navInformacoes = document.querySelector('a[href="#informacoes"]');
    if (navInformacoes) {
        navInformacoes.addEventListener('click', (e) => {
            e.preventDefault();
            // Leva Exatamente para o ponto final onde a Fase 1 concluiu o slide. 
            // Neste ponto (100vh), o usuário cai na "zona de conforto", sem engatilhar o Step 2.
            const targetY = pinStage.offsetTop + window.innerHeight;
            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
        });
    }

    // Lógica para interceptar o Clique no Menu (Início)
    const navInicio = document.querySelector('a[href="#inicio"]');
    if (navInicio) {
        navInicio.addEventListener('click', (e) => {
            e.preventDefault();
            // Leva direto para o topo da página, que é onde a Fase 0 (K E T A) inicia
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

