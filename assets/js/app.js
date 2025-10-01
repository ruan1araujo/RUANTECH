// Global state management
const appState = {
    currentTheme: 'dark',
    soundEnabled: true,
    visitCount: parseInt(localStorage.getItem('ruantech_visits') || '0'),
    interactionCount: 0,
    sessionStartTime: Date.now(),
    achievements: JSON.parse(localStorage.getItem('ruantech_achievements') || '[]'),
    settings: JSON.parse(localStorage.getItem('ruantech_settings') || '{}')
};

// Service definitions with enhanced metadata
const services = {
    // Frontend Services
    'sites-responsivos': {
        title: 'Sites Responsivos',
        category: 'frontend',
        description: 'Sites web responsivos com Progressive Web App (PWA), design mobile-first e performance otimizada.',
        features: ['PWA', 'Mobile-First', 'SEO Otimizado', 'Performance 90+', 'Offline Support'],
        demo: 'https://ruantech.example.com/demos/responsive-site',
        details: 'Desenvolvimento de sites completamente responsivos usando tecnologias modernas como HTML5, CSS3, JavaScript ES6+ e frameworks como Tailwind CSS.',
        icon: '📱'
    },
    'landing-pages': {
        title: 'Landing Pages',
        category: 'frontend',
        description: 'Landing pages otimizadas para conversão com analytics integrado e testes A/B.',
        features: ['Conversão Alta', 'Analytics', 'A/B Testing', 'Loading Rápido', 'CRO'],
        demo: 'https://ruantech.example.com/demos/landing-page',
        details: 'Criação de landing pages focadas em conversão com design persuasivo, otimização de performance e integração com ferramentas de analytics.',
        icon: '🚀'
    },
    'pwa': {
        title: 'Progressive Web Apps',
        category: 'frontend',
        description: 'Aplicações web progressivas com funcionalidades nativas, offline-first e instalação.',
        features: ['Offline First', 'Push Notifications', 'Instalável', 'Native Feel', 'Sync Background'],
        demo: 'https://ruantech.example.com/demos/pwa',
        details: 'Desenvolvimento de PWAs com Service Workers, Cache API, Background Sync e todas as funcionalidades nativas modernas.',
        icon: '⚡'
    },
    // Backend Services
    'api-rest': {
        title: 'API REST',
        category: 'backend',
        description: 'APIs RESTful robustas com CRUD completo, autenticação JWT e documentação Swagger.',
        features: ['RESTful Design', 'JWT Auth', 'Swagger Docs', 'Rate Limiting', 'Error Handling'],
        demo: 'https://ruantech.example.com/demos/api-rest',
        details: 'Desenvolvimento de APIs REST seguindo melhores práticas, com documentação automática, versionamento e testes automatizados.',
        icon: '🔗'
    },
    // Add more services as needed...
};

// CPU Hub Interactions
class CPUHub {
    constructor() {
        this.isExpanded = false;
        this.activeConnections = new Set();
        this.init();
    }

    init() {
        this.bindEvents();
        this.startCPUAnimation();
    }

    bindEvents() {
        const hub = document.getElementById('central-hub');
        const expansionMenu = document.getElementById('expansion-menu');

        // Hub hover events
        hub.addEventListener('mouseenter', () => {
            this.expandHub();
        });

        hub.addEventListener('mouseleave', () => {
            this.collapseHub();
        });

        // CPU option clicks
        document.querySelectorAll('.cpu-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleCPUAction(action);
            });

            // Add hover tooltips
            option.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.currentTarget);
            });

            option.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.currentTarget);
            });
        });
    }

    expandHub() {
        this.isExpanded = true;
        const hub = document.getElementById('central-hub');
        hub.classList.add('expanded');

        // Animate CPU processing
        this.activateProcessing();

        // Show connection lines to relevant sections
        this.activateConnections();

        // Trigger achievement
        this.checkAchievement('hub_explorer');
    }

    collapseHub() {
        this.isExpanded = false;
        const hub = document.getElementById('central-hub');
        hub.classList.remove('expanded');

        // Deactivate processing
        this.deactivateProcessing();

        // Hide connection lines
        this.deactivateConnections();
    }

    activateProcessing() {
        // Add processing effects to CPU grid
        const gridItems = document.querySelectorAll('.cpu-core .grid > div');
        gridItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('processing');
            }, index * 100);
        });
    }

    deactivateProcessing() {
        const gridItems = document.querySelectorAll('.cpu-core .grid > div');
        gridItems.forEach(item => {
            item.classList.remove('processing');
        });
    }

    activateConnections() {
        // Highlight connection lines to categories
        const connectionLines = document.querySelectorAll('#connection-lines path');
        connectionLines.forEach(line => {
            line.classList.add('active');
        });
    }

    deactivateConnections() {
        const connectionLines = document.querySelectorAll('#connection-lines path');
        connectionLines.forEach(line => {
            line.classList.remove('active');
        });
    }

    handleCPUAction(action) {
        appState.interactionCount++;
        this.updateStats();

        switch (action) {
            case 'frontend':
                this.scrollToSection('.service-category[data-category="frontend"]');
                this.highlightCategory('frontend');
                break;
            case 'backend':
                this.scrollToSection('.service-category[data-category="backend"]');
                this.highlightCategory('backend');
                break;
            case 'ecommerce':
                this.scrollToSection('.service-category[data-category="ecommerce"]');
                this.highlightCategory('ecommerce');
                break;
            case 'systems':
                this.scrollToSection('.service-category[data-category="systems"]');
                this.highlightCategory('systems');
                break;
            case 'content':
                this.scrollToSection('.service-category[data-category="content"]');
                this.highlightCategory('content');
                break;
            case 'automation':
                this.scrollToSection('.service-category[data-category="automation"]');
                this.highlightCategory('automation');
                break;
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'contact':
                this.scrollToSection('footer');
                break;
            default:
                console.log('CPU Action:', action);
        }

        // Play interaction sound
        this.playInteractionSound();
    }

    scrollToSection(selector) {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    highlightCategory(category) {
        // Remove previous highlights
        document.querySelectorAll('.service-category').forEach(cat => {
            cat.classList.remove('highlighted');
        });

        // Add highlight to selected category
        const targetCategory = document.querySelector(`.service-category[data-category="${category}"]`);
        if (targetCategory) {
            targetCategory.classList.add('highlighted');

            // Remove highlight after 3 seconds
            setTimeout(() => {
                targetCategory.classList.remove('highlighted');
            }, 3000);
        }
    }

    showTooltip(element) {
        const action = element.dataset.action;
        const tooltips = {
            'frontend': 'Serviços Frontend - Sites, PWAs, SPAs',
            'backend': 'Serviços Backend - APIs, Auth, Database',
            'ecommerce': 'E-commerce - Lojas virtuais completas',
            'systems': 'Sistemas - CRM, ERP, Gestão',
            'content': 'Conteúdo - CMS, Blog, Media',
            'automation': 'Automação - IA, Marketing, Analytics',
            'home': 'Início - Voltar ao topo',
            'contact': 'Contato - Fale conosco'
        };

        if (tooltips[action]) {
            const tooltip = document.createElement('div');
            tooltip.className = 'cpu-tooltip';
            tooltip.textContent = tooltips[action];
            element.appendChild(tooltip);
        }
    }

    hideTooltip(element) {
        const tooltip = element.querySelector('.cpu-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    startCPUAnimation() {
        // Continuous CPU animation
        setInterval(() => {
            if (this.isExpanded) {
                this.processingPulse();
            }
        }, 2000);
    }

    processingPulse() {
        const gridItems = document.querySelectorAll('.cpu-core .grid > div');
        const randomIndex = Math.floor(Math.random() * gridItems.length);

        if (gridItems[randomIndex]) {
            gridItems[randomIndex].style.transform = 'scale(1.2)';
            gridItems[randomIndex].style.filter = 'brightness(1.5)';

            setTimeout(() => {
                gridItems[randomIndex].style.transform = '';
                gridItems[randomIndex].style.filter = '';
            }, 300);
        }
    }

    playInteractionSound() {
        if (!appState.soundEnabled) return;

        // Create audio context for CPU click sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    checkAchievement(achievementId) {
        if (!appState.achievements.includes(achievementId)) {
            appState.achievements.push(achievementId);
            localStorage.setItem('ruantech_achievements', JSON.stringify(appState.achievements));
            this.showAchievement(achievementId);
        }
    }

    showAchievement(achievementId) {
        const achievements = {
            'hub_explorer': 'Hub Explorer - Primeira exploração do CPU Hub!'
        };

        const toast = document.getElementById('achievement-toast');
        const text = document.getElementById('achievement-text');

        if (toast && text && achievements[achievementId]) {
            text.textContent = achievements[achievementId];
            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 4000);
        }
    }

    updateStats() {
        const visitCount = document.getElementById('visit-count');
        const interactionCount = document.getElementById('interaction-count');

        if (visitCount) visitCount.textContent = appState.visitCount;
        if (interactionCount) interactionCount.textContent = appState.interactionCount;
    }
}

// Initialize CPU Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Update visit count
    appState.visitCount++;
    localStorage.setItem('ruantech_visits', appState.visitCount.toString());

    // Initialize CPU Hub
    const cpuHub = new CPUHub();

    // Initialize other existing functionality
    initializeApp();

    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 2000);
});

// Rest of existing JavaScript functions...
function initializeApp() {
    // Theme management
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            document.body.setAttribute('data-theme', e.target.value);
            appState.currentTheme = e.target.value;
        });
    }

    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            appState.soundEnabled = !appState.soundEnabled;
            soundToggle.textContent = appState.soundEnabled ? '🔊' : '🔇';
        });
    }

    // Service node interactions
    document.querySelectorAll('.service-node').forEach(node => {
        node.addEventListener('click', function () {
            const serviceId = this.getAttribute('data-service');
            if (services[serviceId]) {
                showServiceModal(services[serviceId]);
            }
            appState.interactionCount++;
        });
    });

    // Modal functionality
    initializeModals();

    // Particle system
    createParticleSystem();

    // Connection lines
    drawConnectionLines();

    // Session timer
    updateSessionTimer();
    setInterval(updateSessionTimer, 1000);
}

function showServiceModal(service) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');

    if (modal && title && content) {
        title.textContent = `${service.icon} ${service.title}`;
        content.innerHTML = `
                    <p class="text-gray-300 mb-4">${service.description}</p>
                    <div class="mb-4">
                        <h4 class="font-semibold mb-2 text-ruantech-400">🚀 Recursos Principais:</h4>
                        <div class="grid grid-cols-2 gap-2">
                            ${service.features.map(feature => `
                                <div class="bg-gray-800 px-3 py-1 rounded text-sm">${feature}</div>
                            `).join('')}
                        </div>
                    </div>
                    <p class="text-sm text-gray-400">${service.details}</p>
                `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function initializeModals() {
    // Close modal buttons
    document.querySelectorAll('#close-modal, #close-search, #close-settings').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.modal').classList.add('hidden');
            this.closest('.modal').classList.remove('flex');
        });
    });

    // Demo button
    const demoBtn = document.getElementById('demo-btn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            console.log('Opening demo...');
            // Add demo functionality
        });
    }
}

function createParticleSystem() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    // Reduce particles for better performance
    const particleCount = window.innerWidth < 768 ? 20 : 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            container.appendChild(particle);
        });
    }
}

function drawConnectionLines() {
    // Throttled function for better performance
    return;
}

// Performance throttling utilities
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// SISTEMA DE ANIMAÇÃO SEQUENCIAL OTIMIZADO
class SequentialAnimator {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.observedElements = new Set();
        this.animatedCategories = new Set();
        this.setupIntersectionObserver();
        this.initializeCards();
    }

    initializeCards() {
        // Preparar todos os cards com estado inicial
        const allCards = document.querySelectorAll('.service-node');
        allCards.forEach(card => {
            card.style.willChange = 'transform, opacity';
            card.classList.add('card-hidden');
        });
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Skip animation if scrolling too fast
                if (isScrollingFast) return;

                if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
                    this.observedElements.add(entry.target);

                    if (entry.target.classList.contains('service-category')) {
                        // Pequeno delay para scroll suave
                        setTimeout(() => {
                            if (!isScrollingFast) {
                                this.animateCategory(entry.target);
                            }
                        }, 50);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
    }

    animateCategory(category) {
        // Prevenir animação duplicada
        if (this.animatedCategories.has(category)) return;
        this.animatedCategories.add(category);

        // Animar título da categoria
        const title = category.querySelector('h3');
        if (title) {
            title.classList.add('category-visible');
        }

        // Animar cards com RequestAnimationFrame para melhor performance
        const cards = category.querySelectorAll('.service-node');
        this.animateCardsOptimized(cards);
    }

    animateCardsOptimized(cards) {
        // Adicionar efeito de scan inicial na categoria
        const category = cards[0]?.closest('.service-category');
        if (category) {
            category.classList.add('tech-loading');
        }

        cards.forEach((card, index) => {
            // Usar requestAnimationFrame para animações mais suaves
            setTimeout(() => {
                requestAnimationFrame(() => {
                    card.classList.remove('card-hidden');
                    card.classList.add('card-visible');

                    // Efeito de conexão após a animação inicial
                    setTimeout(() => {
                        card.classList.add('connected');

                        // Ativar linha de conexão se existir
                        const connectionLine = card.querySelector('.connection-line');
                        if (connectionLine) {
                            connectionLine.classList.add('active');
                        }

                        // Adicionar efeito de glitch ocasional para feel tecnológico
                        if (Math.random() < 0.3) { // 30% chance
                            setTimeout(() => {
                                card.style.animation = 'glitch 0.3s ease-in-out';
                                setTimeout(() => {
                                    card.style.animation = '';
                                }, 300);
                            }, Math.random() * 1000);
                        }
                    }, 300);
                });
            }, index * 80); // Reduzido para 80ms para animação mais rápida
        });

        // Remover classe de loading após todas as animações
        setTimeout(() => {
            if (category) {
                category.classList.remove('tech-loading');
            }
        }, cards.length * 80 + 500);
    }

    observeElement(element) {
        this.observer.observe(element);
    }

    // Limpar recursos quando necessário
    disconnect() {
        this.observer.disconnect();
        this.observedElements.clear();
    }
}

// Advanced performance optimization
let scrollTimeout;
let animationFrameId;

// Optimized scroll handler with fast scroll detection
let lastScrollTime = 0;
let scrollVelocity = 0;
let isScrollingFast = false;

const handleScroll = () => {
    // Cancel previous animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Use RAF for smooth updates
    animationFrameId = requestAnimationFrame(() => {
        // Calculate scroll velocity
        const now = Date.now();
        const currentScrollY = window.pageYOffset;
        const timeDiff = now - lastScrollTime;

        if (timeDiff > 0) {
            const scrollDiff = Math.abs(currentScrollY - (window.lastScrollY || 0));
            scrollVelocity = scrollDiff / timeDiff;

            // If scrolling faster than 1.5 pixels per millisecond, disable animations
            isScrollingFast = scrollVelocity > 1.5;

            if (isScrollingFast) {
                document.body.classList.add('fast-scrolling');
                // Clear fast scrolling flag after 150ms of no scroll
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    document.body.classList.remove('fast-scrolling');
                    isScrollingFast = false;
                }, 150);
            }
        }

        lastScrollTime = now;
        window.lastScrollY = currentScrollY;

        // Simplified scroll handler - only update critical elements
        if (window.innerWidth < 768) return;

        // Update only visible viewport
        if (currentScrollY > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
};

// Add scroll listener with passive option
window.addEventListener('scroll', handleScroll, { passive: true });

function updateSessionTimer() {
    const sessionTime = document.getElementById('session-time');
    if (!sessionTime) return;

    const elapsed = Math.floor((Date.now() - appState.sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    sessionTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}