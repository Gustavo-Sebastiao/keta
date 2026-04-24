// =========================================================================
// Dados dos Produtos
// =========================================================================
const products = {
    masculino: [
        {
            id: 'm1',
            name: 'Camiseta Essencial Preta',
            category: 'Masculino',
            price: 'R$ 189,00',
            priceVal: 189,
            badge: 'Bestseller',
            img: 'keta/assets/imagens/roupas_loja/roupa_preta.png',
            desc: 'O básico perfeito. Algodão de alta gramatura com corte anatômico que garante estrutura e durabilidade superior. A escolha certa para quem valoriza qualidade acima de tudo.',
            sizes: ['P', 'M', 'G', 'GG']
        },
        {
            id: 'm2',
            name: 'Moletom Urbano Cinza',
            category: 'Masculino',
            price: 'R$ 349,00',
            priceVal: 349,
            badge: 'Novo',
            img: 'keta/assets/imagens/roupas_loja/moletom_urbano_cinza.png',
            desc: 'Conforto redefinido. Moletom oversized com tecido dupla-face, acabamento de alfaiataria e caimento impecável para o dia a dia urbano.',
            sizes: ['P', 'M', 'G', 'GG', 'XGG']
        },
        {
            id: 'm3',
            name: 'Calça Estruturada Preta',
            category: 'Masculino',
            price: 'R$ 429,00',
            priceVal: 429,
            badge: null,
            img: 'keta/assets/imagens/roupas_loja/calça_preta.png',
            desc: 'Corte moderno e versátil. Tecido com resistência térmica que permite respirabilidade total. Transita facilmente entre o casual e o sofisticado.',
            sizes: ['38', '40', '42', '44', '46']
        },
        {
            id: 'm4',
            name: 'Jaqueta Street Minimal',
            category: 'Masculino',
            price: 'R$ 589,00',
            priceVal: 589,
            badge: 'Exclusivo',
            img: 'keta/assets/imagens/roupas_loja/jaqueta_preta.png',
            desc: 'Estética urbana no mais alto nível. Jaqueta com costura reforçada, detalhes invisíveis e forro interno premium que elevam o padrão de qualquer look.',
            sizes: ['P', 'M', 'G', 'GG']
        }
    ],
    feminino: [
        {
            id: 'f1',
            name: 'Cropped',
            category: 'Feminino',
            price: 'R$ 219,00',
            priceVal: 219,
            badge: 'Bestseller',
            img: 'keta/assets/imagens/roupas_loja/croped_feminino.png',
            desc: 'Sofisticação em cada detalhe. Tecido com processo de lavagem especial que garante suavidade desde o primeiro uso. Modelagem que valoriza a silhueta.',
            sizes: ['PP', 'P', 'M', 'G', 'GG']
        },
        {
            id: 'f2',
            name: 'Vestido Essencial Keta',
            category: 'Feminino',
            price: 'R$ 459,00',
            priceVal: 459,
            badge: 'Novo',
            img: 'keta/assets/imagens/roupas_loja/vestido.png',
            desc: 'Design limpo, qualidade máxima. Fibras naturais certificadas que preservam a cor por muito mais tempo, mantendo a intensidade do preto com uso contínuo.',
            sizes: ['PP', 'P', 'M', 'G']
        },
        {
            id: 'f3',
            name: 'Moletom Feminino',
            category: 'Feminino',
            price: 'R$ 649,00',
            priceVal: 649,
            badge: 'Exclusivo',
            img: 'keta/assets/imagens/roupas_loja/moletom_feminino.png',
            desc: 'Uma peça atemporal. Produção com baixo impacto ambiental, matérias-primas certificadas e acabamento de luxo que dura anos sem perder o caimento original.',
            sizes: ['P', 'M', 'G', 'GG']
        },
        {
            id: 'f4',
            name: 'Casaco Oversized Clássico',
            category: 'Feminino',
            price: 'R$ 379,00',
            priceVal: 379,
            badge: null,
            img: 'keta/assets/imagens/roupas_loja/casaco_oversized.png',
            desc: 'Versatilidade absoluta. Do casual ao sofisticado sem esforço. Corte anatômico que se adapta ao corpo com total liberdade de movimento.',
            sizes: ['PP', 'P', 'M', 'G', 'GG']
        }
    ]
};

// =========================================================================
// Estado
// =========================================================================
let currentCat = 'masculino';
let cartItems = [];
let selectedSize = null;
let currentProductId = null;

// =========================================================================
// Inicialização
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Lê parâmetro de URL ?cat=...
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam === 'feminino' || catParam === 'masculino') {
        currentCat = catParam;
    }

    // Carrega carrinho salvo
    try {
        cartItems = JSON.parse(localStorage.getItem('ketaCart')) || [];
    } catch(e) {
        cartItems = [];
    }
    updateCartBadge(false);

    // Renderiza
    renderCategory(currentCat);
    updateHero(currentCat);
    setActiveNav(currentCat);

    // Event Listeners – Tabs removidas

    // Modal - fechar
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) closeModal();
    });

    // Adicionar ao carrinho (no modal)
    document.getElementById('addCartBtn').addEventListener('click', addToCart);

    // Sort
    document.getElementById('sortSelect').addEventListener('change', handleSort);

    // Cart Drawer
    document.getElementById('cartIcon').addEventListener('click', openCartDrawer);
    document.getElementById('cartClose').addEventListener('click', closeCartDrawer);
    document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);

    // Teclado Esc para fechar modal ou carrinho
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeCartDrawer();
        }
    });
});

// =========================================================================
// Renderização dos produtos
// =========================================================================
function renderCategory(cat, list) {
    const grid = document.getElementById('productGrid');
    const items = list || products[cat];

    // Animação de saída
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';

    setTimeout(() => {
        grid.innerHTML = '';
        items.forEach((p, idx) => {
            const card = createCard(p, idx);
            grid.appendChild(card);
        });

        document.getElementById('resultsCount').textContent = `${items.length} peça${items.length !== 1 ? 's' : ''}`;

        // Animação de entrada
        grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
    }, 200);
}

function createCard(product, idx) {
    const card = document.createElement('div');
    card.className = 'mp-product-card';
    card.style.animationDelay = `${idx * 0.07}s`;

    card.innerHTML = `
        <div class="mp-card-img-wrap">
            <img src="${product.img}" alt="${product.name}" loading="lazy">
            ${product.badge ? `<span class="mp-card-badge">${product.badge}</span>` : ''}
            <button class="mp-card-quick-add" data-id="${product.id}">Ver Produto</button>
        </div>
        <div class="mp-card-info">
            <p class="mp-card-cat">${product.category}</p>
            <h3 class="mp-card-name">${product.name}</h3>
            <div class="mp-card-bottom">
                <span class="mp-card-price">${product.price}</span>
                <span class="mp-card-sizes">${product.sizes.join(' · ')}</span>
            </div>
        </div>
    `;

    // Clique no card ou no botão abre o modal
    card.addEventListener('click', (e) => {
        openModal(product.id);
    });

    return card;
}

// =========================================================================
// Troca de Categoria
// =========================================================================
function switchCategory(cat) {
    if (cat === currentCat) return;
    currentCat = cat;

    // Atualiza tabs (removidas)

    // Atualiza URL sem reload
    const url = new URL(window.location);
    url.searchParams.set('cat', cat);
    window.history.pushState({}, '', url);

    updateHero(cat);
    setActiveNav(cat);
    renderCategory(cat);

    // Reset sort
    document.getElementById('sortSelect').value = 'default';
}

function updateHero(cat) {
    const heroTitle = document.getElementById('heroTitle');
    const heroSub = document.getElementById('heroSubtitle');

    heroTitle.style.opacity = '0';
    setTimeout(() => {
        if (cat === 'masculino') {
            heroTitle.textContent = 'Masculino';
            heroSub.textContent = 'Estilo urbano. Qualidade que persiste.';
        } else {
            heroTitle.textContent = 'Feminino';
            heroSub.textContent = 'Elegância sem esforço. Essencial por definição.';
        }
        heroTitle.style.opacity = '1';
    }, 200);
}

function setActiveNav(cat) {
    document.querySelectorAll('.mp-nav-link[data-cat]').forEach(link => {
        link.classList.toggle('active', link.dataset.cat === cat);
    });
}

// =========================================================================
// Modal
// =========================================================================
function openModal(productId) {
    const allProducts = [...products.masculino, ...products.feminino];
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;
    selectedSize = null;

    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalImg').alt = product.name;
    document.getElementById('modalCat').textContent = product.category;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalPrice').textContent = product.price;
    document.getElementById('modalDesc').textContent = product.desc;

    // Tamanhos
    const sizesGrid = document.getElementById('sizesGrid');
    sizesGrid.innerHTML = '';
    product.sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'mp-size-btn';
        btn.textContent = size;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            sizesGrid.querySelectorAll('.mp-size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = size;
        });
        sizesGrid.appendChild(btn);
    });

    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    currentProductId = null;
    selectedSize = null;
}

// =========================================================================
// Carrinho e Drawer
// =========================================================================
function addToCart() {
    if (!selectedSize) {
        document.querySelectorAll('.mp-size-btn').forEach(btn => {
            btn.style.border = '1px solid rgba(255,255,255,0.5)';
            setTimeout(() => btn.style.border = '', 600);
        });
        return;
    }

    const allProducts = [...products.masculino, ...products.feminino];
    const product = allProducts.find(p => p.id === currentProductId);

    cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        priceVal: product.priceVal,
        size: selectedSize,
        img: product.img
    });

    saveCart();
    updateCartBadge(true);
    closeModal();
    showToast();
}

function saveCart() {
    localStorage.setItem('ketaCart', JSON.stringify(cartItems));
}

function updateCartBadge(animate) {
    const badge = document.getElementById('cartCount');
    badge.textContent = cartItems.length;
    if (animate) {
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 400);
    }
}

function openCartDrawer() {
    renderCartDrawer();
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartDrawer').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartDrawer').classList.remove('open');
    document.body.style.overflow = '';
}

function renderCartDrawer() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotalValue');
    
    container.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        container.innerHTML = '<p class="mp-cart-empty">Sua sacola está vazia.</p>';
        totalEl.textContent = 'R$ 0,00';
        return;
    }

    cartItems.forEach((item, index) => {
        total += item.priceVal;
        const itemEl = document.createElement('div');
        itemEl.className = 'mp-cart-item';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="mp-cart-item-img">
            <div class="mp-cart-item-info">
                <h4 class="mp-cart-item-name">${item.name}</h4>
                <p class="mp-cart-item-size">Tam: ${item.size}</p>
                <p class="mp-cart-item-price">${item.price}</p>
                <button class="mp-cart-item-remove" onclick="removeFromCart(${index})">Remover</button>
            </div>
        `;
        container.appendChild(itemEl);
    });

    totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

window.removeFromCart = function(index) {
    cartItems.splice(index, 1);
    saveCart();
    updateCartBadge(false);
    renderCartDrawer();
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// =========================================================================
// Sort
// =========================================================================
function handleSort(e) {
    const val = e.target.value;
    let items = [...products[currentCat]];

    if (val === 'price-asc') {
        items.sort((a, b) => a.priceVal - b.priceVal);
    } else if (val === 'price-desc') {
        items.sort((a, b) => b.priceVal - a.priceVal);
    } else if (val === 'name') {
        items.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderCategory(currentCat, items);
}
