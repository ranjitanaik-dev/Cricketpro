// ===================================
// State Management
// ===================================
const state = {
    cart: [],
    currentSlide: 0,
    totalSlides: 3,
    isCartOpen: false,
    isMobileMenuOpen: false
};

// ===================================
// DOM Elements
// ===================================
const elements = {
    // Header
    header: document.getElementById('header'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    navMenu: document.getElementById('nav-menu'),
    searchInput: document.getElementById('search-input'),

    // Hero Slider
    heroSlides: document.querySelectorAll('.hero-slide'),
    heroPrev: document.getElementById('hero-prev'),
    heroNext: document.getElementById('hero-next'),
    heroDots: document.getElementById('hero-dots'),

    // Cart
    cartBtn: document.getElementById('cart-btn'),
    cartSidebar: document.getElementById('cart-sidebar'),
    cartClose: document.getElementById('cart-close'),
    cartOverlay: document.getElementById('cart-overlay'),
    cartItems: document.getElementById('cart-items'),
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total'),

    // Products
    addToCartBtns: document.querySelectorAll('.add-to-cart-btn'),
    quickViewBtns: document.querySelectorAll('.quick-view-btn'),

    // Newsletter
    newsletterForm: document.getElementById('newsletter-form'),
    newsletterEmail: document.getElementById('newsletter-email')
};

// ===================================
// Hero Slider Functionality
// ===================================
function initHeroSlider() {
    // Create dots
    for (let i = 0; i < state.totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        elements.heroDots.appendChild(dot);
    }

    // Auto-rotate slides
    setInterval(() => {
        nextSlide();
    }, 5000);

    // Navigation buttons
    elements.heroPrev.addEventListener('click', prevSlide);
    elements.heroNext.addEventListener('click', nextSlide);
}

function goToSlide(index) {
    // Remove active class from current slide
    elements.heroSlides[state.currentSlide].classList.remove('active');
    document.querySelectorAll('.hero-dot')[state.currentSlide].classList.remove('active');

    // Update current slide
    state.currentSlide = index;

    // Add active class to new slide
    elements.heroSlides[state.currentSlide].classList.add('active');
    document.querySelectorAll('.hero-dot')[state.currentSlide].classList.add('active');
}

function nextSlide() {
    const nextIndex = (state.currentSlide + 1) % state.totalSlides;
    goToSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (state.currentSlide - 1 + state.totalSlides) % state.totalSlides;
    goToSlide(prevIndex);
}

// ===================================
// Mobile Menu
// ===================================
function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    elements.navMenu.classList.toggle('active');

    // Change icon
    const icon = elements.mobileMenuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
}

elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (state.isMobileMenuOpen) {
            toggleMobileMenu();
        }
    });
});

// ===================================
// Smooth Scroll Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = elements.header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Header Scroll Effect
// ===================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        elements.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        elements.header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===================================
// Search Functionality
// ===================================
elements.searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const brand = card.querySelector('.product-brand').textContent.toLowerCase();

        if (title.includes(searchTerm) || brand.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            card.style.display = 'none';
        }
    });

    // If search is empty, show all products
    if (searchTerm === '') {
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

// ===================================
// Cart Functionality
// ===================================
function openCart() {
    state.isCartOpen = true;
    elements.cartSidebar.classList.add('active');
    elements.cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    state.isCartOpen = false;
    elements.cartSidebar.classList.remove('active');
    elements.cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

elements.cartBtn.addEventListener('click', openCart);
elements.cartClose.addEventListener('click', closeCart);
elements.cartOverlay.addEventListener('click', closeCart);

// ===================================
// Add to Cart
// ===================================
elements.addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productId = btn.getAttribute('data-product-id');
        const productCard = btn.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productBrand = productCard.querySelector('.product-brand').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;
        const productImage = productCard.querySelector('.product-image img').src;

        // Add to cart
        const cartItem = {
            id: productId,
            title: productTitle,
            brand: productBrand,
            price: parseFloat(productPrice.replace('$', '')),
            image: productImage,
            quantity: 1
        };

        // Check if item already exists in cart
        const existingItem = state.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push(cartItem);
        }

        updateCart();

        // Visual feedback
        btn.textContent = 'Added!';
        btn.style.background = 'linear-gradient(135deg, #00d084 0%, #00f59b 100%)';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.background = '';
        }, 1500);

        // Show cart
        setTimeout(() => {
            openCart();
        }, 500);
    });
});

function updateCart() {
    // Update cart count
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;

    // Update cart total
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    // Update cart items display
    if (state.cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        elements.cartItems.innerHTML = state.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-brand">${item.brand}</p>
                    <div class="cart-item-controls">
                        <button class="cart-item-decrease" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="cart-item-increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to cart item controls
        document.querySelectorAll('.cart-item-increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = state.cart.find(item => item.id === id);
                if (item) {
                    item.quantity++;
                    updateCart();
                }
            });
        });

        document.querySelectorAll('.cart-item-decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = state.cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    updateCart();
                }
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                state.cart = state.cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
}

// Add cart item styles dynamically
const cartItemStyles = document.createElement('style');
cartItemStyles.textContent = `
    .cart-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-lg);
        margin-bottom: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all var(--transition-base);
    }
    
    .cart-item:hover {
        border-color: var(--color-primary);
    }
    
    .cart-item-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: var(--radius-md);
    }
    
    .cart-item-info {
        flex: 1;
    }
    
    .cart-item-title {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .cart-item-brand {
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
        margin-bottom: 0.5rem;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cart-item-increase,
    .cart-item-decrease {
        width: 28px;
        height: 28px;
        background: var(--color-bg-primary);
        border-radius: var(--radius-sm);
        color: var(--color-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        transition: all var(--transition-base);
    }
    
    .cart-item-increase:hover,
    .cart-item-decrease:hover {
        background: var(--color-primary);
    }
    
    .cart-item-quantity {
        min-width: 30px;
        text-align: center;
        font-weight: 600;
    }
    
    .cart-item-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
    }
    
    .cart-item-price p {
        font-weight: 700;
        color: var(--color-primary);
    }
    
    .cart-item-remove {
        color: var(--color-secondary);
        padding: 0.5rem;
        transition: all var(--transition-base);
    }
    
    .cart-item-remove:hover {
        color: #ff4444;
        transform: scale(1.2);
    }
`;
document.head.appendChild(cartItemStyles);

// ===================================
// Quick View Modal
// ===================================
elements.quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = btn.getAttribute('data-product');
        // In a real application, this would open a modal with product details
        alert(`Quick view for product ${productId} - This would open a detailed modal in production`);
    });
});

// ===================================
// Newsletter Form
// ===================================
elements.newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = elements.newsletterEmail.value;

    if (email) {
        // Simulate newsletter signup
        alert(`Thank you for subscribing with ${email}! You'll receive exclusive deals and cricket tips.`);
        elements.newsletterEmail.value = '';

        // Visual feedback
        const submitBtn = elements.newsletterForm.querySelector('.newsletter-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribed! ✓';
        submitBtn.style.background = 'var(--color-primary)';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
        }, 3000);
    }
});

// ===================================
// Category Card Interactions
// ===================================
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        // Scroll to featured products section
        const featuredSection = document.getElementById('featured');
        const headerHeight = elements.header.offsetHeight;
        const targetPosition = featuredSection.offsetTop - headerHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Filter products by category (simplified version)
        console.log(`Filtering by category: ${category}`);
    });
});

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.category-card, .product-card, .trust-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===================================
// Checkout Button
// ===================================
document.getElementById('cart-checkout').addEventListener('click', () => {
    if (state.cart.length === 0) {
        alert('Your cart is empty! Add some items first.');
        return;
    }

    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Proceeding to checkout with ${state.cart.length} items. Total: $${totalPrice.toFixed(2)}\n\nIn production, this would redirect to the checkout page.`);
});

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initScrollAnimations();
    updateCart();
    checkUserLogin();

    console.log('🏏 CricketPro Homepage Loaded Successfully!');
    console.log('Features: Hero Slider ✓ | Cart System ✓ | Search ✓ | Responsive ✓');
});

// ===================================
// User Profile Management
// ===================================
function checkUserLogin() {
    const userDataString = localStorage.getItem('cricketpro_user');

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        displayUserProfile(userData);
    }
}

function displayUserProfile(user) {
    const accountBtn = document.getElementById('account-btn');

    // Replace account button with user profile
    accountBtn.outerHTML = `
        <div class="user-profile" id="user-profile">
            <img src="${user.picture}" alt="${user.name}" class="user-avatar">
            <div class="user-dropdown">
                <div class="user-info">
                    <p class="user-name">${user.name}</p>
                    <p class="user-email">${user.email}</p>
                </div>
                <div class="dropdown-divider"></div>
                <a href="#orders" class="dropdown-item">
                    <i class="fas fa-box"></i>
                    My Orders
                </a>
                <a href="#wishlist" class="dropdown-item">
                    <i class="fas fa-heart"></i>
                    Wishlist
                </a>
                <a href="#settings" class="dropdown-item">
                    <i class="fas fa-cog"></i>
                    Settings
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout-btn" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>
    `;

    // Add styles for user profile
    const profileStyles = document.createElement('style');
    profileStyles.textContent = `
        .user-profile {
            position: relative;
            cursor: pointer;
        }
        
        .user-avatar {
            width: 44px;
            height: 44px;
            border-radius: var(--radius-full);
            border: 2px solid var(--color-primary);
            object-fit: cover;
            transition: all var(--transition-base);
        }
        
        .user-avatar:hover {
            transform: scale(1.1);
            box-shadow: var(--shadow-glow);
        }
        
        .user-dropdown {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            background: var(--color-bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-xl);
            padding: var(--spacing-md);
            min-width: 250px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all var(--transition-base);
            z-index: var(--z-dropdown);
            box-shadow: var(--shadow-2xl);
        }
        
        .user-profile:hover .user-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .user-info {
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-sm);
        }
        
        .user-name {
            font-weight: 700;
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-xs);
        }
        
        .user-email {
            font-size: var(--font-size-sm);
            color: var(--color-text-tertiary);
        }
        
        .dropdown-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: var(--spacing-sm) 0;
        }
        
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            transition: all var(--transition-base);
            color: var(--color-text-primary);
            width: 100%;
            text-align: left;
        }
        
        .dropdown-item:hover {
            background: rgba(0, 208, 132, 0.1);
            color: var(--color-primary);
        }
        
        .dropdown-item i {
            width: 20px;
            text-align: center;
        }
        
        .logout-btn {
            color: var(--color-secondary);
        }
        
        .logout-btn:hover {
            background: rgba(255, 107, 53, 0.1);
            color: var(--color-secondary);
        }
    `;
    document.head.appendChild(profileStyles);

    // Add logout functionality
    setTimeout(() => {
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('cricketpro_user');
            window.location.reload();
        });
    }, 100);
}


// ===================================
// Keyboard Navigation
// ===================================
document.addEventListener('keydown', (e) => {
    // Close cart with Escape key
    if (e.key === 'Escape' && state.isCartOpen) {
        closeCart();
    }

    // Navigate hero slider with arrow keys
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// ===================================
// Performance Optimization
// ===================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
