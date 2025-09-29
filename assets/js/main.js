class RuantechApp {
    constructor() {
        this.settings = this.loadSettings();
        this.analytics = new AnalyticsManager();
        this.audio = new AudioManager();
        this.particles = new ParticleSystem();
        this.achievements = new AchievementSystem();
        this.search = new SearchSystem();
        this.modal = new ModalManager();
        this.theme = new ThemeManager();
        this.network = new NetworkManager();

        this.init();
    }

    async init() {
        await this.initializeApp();
        this.setupEventListeners();
        this.startParticleSystem();
        this.hideLoadingScreen();
        this.analytics.trackPageView();
    }

    async initializeApp() {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Aplicar configurações
        this.applySettings();

        // Inicializar componentes
        await Promise.all([
            this.audio.initialize(),
            this.particles.initialize(),
            this.achievements.initialize()
        ]);
    }

    setupEventListeners() {
        // Service Node Clicks
        document.querySelectorAll('.service-node').forEach(node => {
            node.addEventListener('click', (e) => this.handleServiceClick(e));
            node.addEventListener('mouseenter', (e) => this.handleServiceHover(e));
        });

        // Navigation Nodes
        document.querySelectorAll('.nav-node').forEach(node => {
            node.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Central Hub
        document.getElementById('central-hub')?.addEventListener('click', () => {
            this.modal.showCentralHub();
            this.achievements.unlock('hub_explorer');
        });

        // Theme Selector
        document.getElementById('theme-selector')?.addEventListener('change', (e) => {
            this.theme.setTheme(e.target.value);
        });

        // Sound Toggle
        document.getElementById('sound-toggle')?.addEventListener('click', () => {
            this.audio.toggle();
        });

        // Search
        document.getElementById('search-btn')?.addEventListener('click', () => {
            this.search.show();
        });

        // Settings
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.modal.showSettings();
        });

        // FAB Menu
        this.setupFabMenu();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch gestures
        this.setupTouchGestures();

        // Window resize
        window.addEventListener('resize', () => {
            this.network.resize();
        });
    }

    handleServiceClick(e) {
        const service = e.currentTarget.dataset.service;
        const category = e.currentTarget.closest('.service-category')?.dataset.category;

        this.analytics.trackServiceClick(service, category);
        this.audio.playClick();
        this.modal.showService(service);
        this.achievements.checkServiceExploration(service);

        // Visual feedback
        e.currentTarget.classList.add('animate-scale-pulse');
        setTimeout(() => {
            e.currentTarget.classList.remove('animate-scale-pulse');
        }, 600);
    }

    handleServiceHover(e) {
        const service = e.currentTarget.dataset.service;
        this.audio.playHover();
        this.analytics.trackHover(service);

        // Show preview tooltip
        this.showServicePreview(e.currentTarget, service);
    }

    handleNavClick(e) {
        const page = e.currentTarget.dataset.page;
        this.analytics.trackNavigation(page);
        this.audio.playNavigation();
        this.modal.showPage(page);
    }

    handleKeyboard(e) {
        // Ctrl/Cmd + K = Search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.search.show();
        }

        // Escape = Close modals
        if (e.key === 'Escape') {
            this.modal.closeAll();
            this.search.hide();
        }

        // Space = Random demo
        if (e.key === ' ' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            this.launchRandomDemo();
        }
    }

    setupTouchGestures() {
        let startX, startY;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Swipe detection
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.navigateNext();
                    } else {
                        this.navigatePrev();
                    }
                }
            }

            startX = startY = null;
        });
    }

    setupFabMenu() {
        const fabMain = document.getElementById('fab-main');
        const fabOptions = document.getElementById('fab-options');

        let fabOpen = false;

        fabMain?.addEventListener('click', () => {
            fabOpen = !fabOpen;
            fabOptions.classList.toggle('hidden', !fabOpen);
            fabMain.style.transform = fabOpen ? 'rotate(135deg)' : 'rotate(0deg)';
        });

        document.querySelectorAll('.fab-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.executeFabAction(action);
            });
        });
    }

    executeFabAction(action) {
        switch (action) {
            case 'random-demo':
                this.launchRandomDemo();
                break;
            case 'full-tour':
                this.startGuidedTour();
                break;
            case 'feedback':
                this.modal.showFeedback();
                break;
        }
    }

    launchRandomDemo() {
        const services = document.querySelectorAll('.service-node');
        const randomService = services[Math.floor(Math.random() * services.length)];
        randomService.click();
        this.achievements.unlock('random_explorer');
    }

    startGuidedTour() {
        this.achievements.unlock('guided_tour');
        // Implementar tour guiado
        console.log('Iniciando tour guiado...');
    }

    showServicePreview(element, service) {
        // Criar tooltip dinâmico
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute z-50 glass rounded-lg p-3 text-xs max-w-xs';
        tooltip.innerHTML = this.getServicePreview(service);

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;

        element.addEventListener('mouseleave', () => {
            tooltip.remove();
        }, { once: true });
    }

    getServicePreview(service) {
        const previews = {
            'sites-responsivos': '🎨 Design adaptativo, Performance otimizada, SEO avançado',
            'api-rest': '⚡ Endpoints seguros, Documentação Swagger, Rate limiting',
            'loja-virtual': '🛒 Carrinho inteligente, Gateway de pagamento, Gestão de estoque',
            // ... mais previews
        };
        return previews[service] || '✨ Demo interativo disponível';
    }

    startParticleSystem() {
        if (this.settings.particleDensity > 0) {
            this.particles.start(this.settings.particleDensity);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    applySettings() {
        document.documentElement.style.setProperty('--animation-speed', `${this.settings.animationSpeed}s`);

        if (this.settings.reduceMotion) {
            document.documentElement.classList.add('reduce-motion');
        }

        if (this.settings.highContrast) {
            document.documentElement.classList.add('high-contrast');
        }
    }

    loadSettings() {
        const defaultSettings = {
            animationSpeed: 1,
            particleDensity: 50,
            soundEnabled: true,
            theme: 'dark',
            reduceMotion: false,
            highContrast: false
        };

        const saved = localStorage.getItem('ruantech_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('ruantech_settings', JSON.stringify(this.settings));
    }
}

// Network Connection Manager
class NetworkManager {
    constructor() {
        this.svg = document.getElementById('connection-lines');
        this.connections = [];
        this.nodes = [];
        this.isInitialized = false;

        // Mapeamento de cores por categoria
        this.categoryColors = {
            'frontend': '#3B82F6',      // Azul
            'backend': '#06B6D4',       // Ciano
            'ecommerce': '#DC2626',     // Vermelho
            'systems': '#8B5CF6',       // Roxo
            'content': '#F59E0B',       // Amarelo Dourado
            'automation': '#10B981',    // Verde
            'hub': '#7c3aed'            // Cor do hub central
        };

        // Aguardar carregamento completo
        setTimeout(() => this.init(), 3000);

        // Event listener para resize com debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.isInitialized) {
                    this.handleResize();
                }
            }, 300);
        });

        console.log('NetworkManager responsivo iniciado');
    }

    init() {
        console.log('Iniciando conexões...');
        this.setupSVG();
        this.calculateNodePositions();
        this.createConnections();
        this.setupHoverEffects();
        this.startAnimations();
        this.isInitialized = true;
        console.log('Conexões criadas:', this.connections.length);
    }

    setupSVG() {
        // Configurar SVG para ser responsivo
        const section = this.svg.closest('section');
        const sectionRect = section.getBoundingClientRect();

        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', `0 0 ${Math.round(sectionRect.width)} ${Math.round(sectionRect.height)}`);
        this.svg.setAttribute('preserveAspectRatio', 'none');

        console.log('SVG responsivo configurado:', Math.round(sectionRect.width), 'x', Math.round(sectionRect.height));
    }

    calculateNodePositions() {
        console.log('Calculando posições responsivas...');

        // Obter posição da seção container
        const section = this.svg.closest('section');
        const sectionRect = section.getBoundingClientRect();

        // Hub central
        const hubElement = document.getElementById('central-hub');
        if (hubElement) {
            const hubRect = hubElement.getBoundingClientRect();
            this.hubPosition = {
                x: hubRect.left - sectionRect.left + hubRect.width / 2,
                y: hubRect.top - sectionRect.top + hubRect.height / 2,
                element: hubElement
            };
            console.log('Hub position:', this.hubPosition);
        }

        // Service nodes
        this.nodes = [];
        document.querySelectorAll('.service-node').forEach((node, index) => {
            const rect = node.getBoundingClientRect();
            const nodeData = {
                element: node,
                id: node.dataset.service,
                category: node.closest('.service-category')?.dataset.category,
                x: rect.left - sectionRect.left + rect.width / 2,
                y: rect.top - sectionRect.top + rect.height / 2,
                index
            };
            this.nodes.push(nodeData);
        });

        console.log('Total nodes:', this.nodes.length);
    }

    createConnections() {
        if (!this.svg || !this.hubPosition || this.nodes.length === 0) {
            console.log('SVG, Hub ou Nodes não encontrados!');
            return;
        }

        console.log('Criando conexões responsivas...');

        // Limpar conexões anteriores
        this.svg.querySelectorAll('path, line').forEach(el => el.remove());
        this.connections = [];

        // Conectar hub central com todos os nós (linhas primárias)
        this.nodes.forEach(node => {
            this.createConnection(this.hubPosition, node, 'primary');
        });

        // Conectar nós dentro de cada categoria (linhas secundárias)
        const categories = {};
        this.nodes.forEach(node => {
            if (!categories[node.category]) categories[node.category] = [];
            categories[node.category].push(node);
        });

        Object.values(categories).forEach(categoryNodes => {
            for (let i = 0; i < categoryNodes.length - 1; i++) {
                this.createConnection(categoryNodes[i], categoryNodes[i + 1], 'secondary');
            }
        });

        // Conexões especiais entre categorias relacionadas
        this.createCrossConnections();

        console.log('Total conexões criadas:', this.connections.length);
    }

    createConnection(nodeA, nodeB, type = 'primary') {
        // Usar linha simples (mais confiável)
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        line.setAttribute('x1', nodeA.x);
        line.setAttribute('y1', nodeA.y);
        line.setAttribute('x2', nodeB.x);
        line.setAttribute('y2', nodeB.y);

        // Determinar cor baseada na categoria do serviço
        let connectionColor;
        if (type === 'primary') {
            // Para conexões primárias (hub -> nó), usar a cor da categoria do nó de destino
            connectionColor = this.categoryColors[nodeB.category] || this.categoryColors.hub;
        } else if (type === 'secondary') {
            // Para conexões secundárias (nó -> nó da mesma categoria), usar a cor da categoria
            connectionColor = this.categoryColors[nodeA.category] || this.categoryColors[nodeB.category] || '#06b6d4';
        } else {
            // Para conexões terciárias (entre categorias diferentes), usar gradiente ou cor mista
            connectionColor = '#10b981';
        }

        // Estilos baseados no tipo
        const styles = {
            primary: { width: '3', opacity: '0.9' },
            secondary: { width: '2.5', opacity: '0.8' },
            tertiary: { width: '2', opacity: '0.7' }
        };

        const style = styles[type] || styles.primary;
        line.setAttribute('stroke', connectionColor);
        line.setAttribute('stroke-width', style.width);
        line.setAttribute('stroke-opacity', style.opacity);
        line.setAttribute('fill', 'none');
        line.setAttribute('filter', 'url(#glow)');

        line.classList.add('connection-line');
        line.classList.add(`connection-${type}`);
        line.classList.add(`category-${nodeB.category || 'hub'}`);

        this.svg.appendChild(line);

        // Criar linha de corrente elétrica separada
        const electricLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        electricLine.setAttribute('x1', nodeA.x);
        electricLine.setAttribute('y1', nodeA.y);
        electricLine.setAttribute('x2', nodeB.x);
        electricLine.setAttribute('y2', nodeB.y);
        electricLine.setAttribute('stroke', connectionColor);
        electricLine.setAttribute('stroke-width', parseFloat(style.width) + 1);
        electricLine.setAttribute('fill', 'none');
        electricLine.setAttribute('opacity', '0');
        electricLine.classList.add('electric-current-overlay');

        // Adicionar efeito elétrico com delay aleatório
        setTimeout(() => {
            electricLine.style.opacity = '0.25';
        }, Math.random() * 1500);

        this.svg.appendChild(electricLine);

        // Criar faíscas elétricas ao longo da linha
        this.createElectricSparks(nodeA, nodeB, connectionColor, type);

        this.connections.push({
            element: line,
            electricElement: electricLine,
            nodeA: nodeA.id || 'hub',
            nodeB: nodeB.id,
            category: nodeB.category,
            color: connectionColor,
            type
        });

        console.log(`Conexão ${connectionColor} criada: ${nodeA.id || 'hub'} -> ${nodeB.id} (${nodeB.category})`);
    }

    createElectricSparks(nodeA, nodeB, color, type) {
        const numSparks = type === 'primary' ? 3 : type === 'secondary' ? 2 : 1;
        const lineLength = Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));

        for (let i = 0; i < numSparks; i++) {
            const sparkPosition = (i + 1) / (numSparks + 1);
            const sparkX = nodeA.x + (nodeB.x - nodeA.x) * sparkPosition;
            const sparkY = nodeA.y + (nodeB.y - nodeA.y) * sparkPosition;

            // Criar faísca circular
            const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            spark.setAttribute('cx', sparkX);
            spark.setAttribute('cy', sparkY);
            spark.setAttribute('r', type === 'primary' ? '2' : '1.2');
            spark.setAttribute('fill', color);
            spark.setAttribute('opacity', '0');
            spark.classList.add('electric-spark');

            // Delay escalonado para cada faísca
            setTimeout(() => {
                spark.style.opacity = '0.3';
                this.svg.appendChild(spark);

                // Remover faísca após animação completa
                setTimeout(() => {
                    if (spark.parentNode) {
                        spark.parentNode.removeChild(spark);
                    }
                }, 1500 + Math.random() * 1000);
            }, i * 200 + Math.random() * 1000);
        }
    }

    createCrossConnections() {
        // Conectar serviços relacionados entre categorias
        const relatedServices = [
            ['sites-responsivos', 'api-rest'],
            ['loja-virtual', 'pagamentos'],
            ['crm', 'database'],
            ['pwa', 'mobile-apps'],
            ['auth-system', 'api-rest']
        ];

        relatedServices.forEach(([serviceA, serviceB]) => {
            const nodeA = this.nodes.find(n => n.id === serviceA);
            const nodeB = this.nodes.find(n => n.id === serviceB);

            if (nodeA && nodeB) {
                this.createConnection(nodeA, nodeB, 'tertiary');
            }
        });
    }

    setupHoverEffects() {
        console.log('Configurando hover effects...');

        // Hover nos service nodes
        document.querySelectorAll('.service-node').forEach(node => {
            node.addEventListener('mouseenter', () => {
                console.log('Hover em:', node.dataset.service);
                this.highlightConnections(node.dataset.service);
            });

            node.addEventListener('mouseleave', () => {
                this.resetConnections();
            });
        });

        // Hover no hub central
        const hub = document.getElementById('central-hub');
        if (hub) {
            hub.addEventListener('mouseenter', () => {
                console.log('Hover no hub');
                this.highlightConnections('hub');
            });

            hub.addEventListener('mouseleave', () => {
                this.resetConnections();
            });
        }
    }

    highlightConnections(serviceId) {
        this.connections.forEach(conn => {
            if (conn.nodeA === serviceId || conn.nodeB === serviceId) {
                conn.element.style.strokeWidth = '4';
                conn.element.style.strokeOpacity = '1';
                // Manter a cor original mas com brilho intensificado
                conn.element.style.stroke = conn.color;
                conn.element.style.filter = 'url(#pulseGlow)';

                // Adicionar efeito de pulso ativo
                conn.element.classList.add('pulse-active');

                // Criar efeito de onda de dados
                this.createDataPulse(conn.element, serviceId);
            } else {
                conn.element.style.strokeOpacity = '0.15';
            }
        });
    }

    createDataPulse(lineElement, sourceId) {
        // Remover pulsos anteriores
        const existingPulses = lineElement.querySelectorAll('.electric-pulse');
        existingPulses.forEach(pulse => pulse.remove());

        // Criar múltiplas faíscas elétricas intensas
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const electricPulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                electricPulse.setAttribute('r', '4');
                electricPulse.setAttribute('fill', lineElement.getAttribute('stroke'));
                electricPulse.setAttribute('opacity', '0');
                electricPulse.classList.add('electric-pulse');
                electricPulse.style.filter = `drop-shadow(0 0 2px ${lineElement.getAttribute('stroke')}) drop-shadow(0 0 4px ${lineElement.getAttribute('stroke')})`;

                // Animar a faísca ao longo da linha
                this.animateElectricPulse(electricPulse, lineElement, sourceId);

                this.svg.appendChild(electricPulse);
            }, i * 100);
        }
    }

    animateElectricPulse(pulse, lineElement, sourceId) {
        const x1 = parseFloat(lineElement.getAttribute('x1'));
        const y1 = parseFloat(lineElement.getAttribute('y1'));
        const x2 = parseFloat(lineElement.getAttribute('x2'));
        const y2 = parseFloat(lineElement.getAttribute('y2'));

        // Determinar direção baseada na fonte
        let startX, startY, endX, endY;
        if (sourceId === 'hub') {
            // Do hub para o nó
            startX = x1; startY = y1;
            endX = x2; endY = y2;
        } else {
            // Do nó para o hub
            startX = x2; startY = y2;
            endX = x1; endY = y1;
        }

        pulse.setAttribute('cx', startX);
        pulse.setAttribute('cy', startY);

        // Animar usando requestAnimationFrame para suavidade
        let progress = 0;
        const duration = 1500; // 1.5 segundos
        const startTime = performance.now();

        const animate = (currentTime) => {
            progress = (currentTime - startTime) / duration;

            if (progress >= 1) {
                pulse.remove();
                return;
            }

            // Easing elétrico com variações
            const baseProgress = 1 - Math.pow(1 - progress, 2);

            // Adicionar tremor elétrico
            const electricJitter = Math.sin(progress * 20) * 1.5;
            const randomJitter = (Math.random() - 0.5) * 2;

            const currentX = startX + (endX - startX) * baseProgress + electricJitter;
            const currentY = startY + (endY - startY) * baseProgress + randomJitter;

            pulse.setAttribute('cx', currentX);
            pulse.setAttribute('cy', currentY);

            // Variação de tamanho e brilho simulando faíscas
            const sparkIntensity = 0.2 + Math.sin(progress * 15) * 0.1 + Math.random() * 0.05;
            const radius = 1.5 + sparkIntensity * 1.5;
            pulse.setAttribute('r', radius);

            // Opacity com efeito de faísca - reduzido
            const opacity = sparkIntensity * 0.6 * (progress > 0.9 ? (1 - progress) * 10 : 1);
            pulse.setAttribute('opacity', Math.max(0, Math.min(1, opacity)));

            requestAnimationFrame(animate);
        };

        // Iniciar com opacity reduzida para efeito de faísca sutil
        pulse.setAttribute('opacity', '0.5');
        requestAnimationFrame(animate);
    }

    resetConnections() {
        this.connections.forEach(conn => {
            // Reset da linha principal
            conn.element.style.strokeWidth = '';
            conn.element.style.strokeOpacity = '';
            conn.element.style.stroke = '';
            conn.element.style.filter = 'url(#glow)';

            // Reset da linha elétrica
            if (conn.electricElement) {
                conn.electricElement.style.opacity = '1';
            }

            // Remover classes de efeitos ativos
            conn.element.classList.remove('pulse-active');
        });

        // Remover todas as partículas de dados ativas e faíscas
        const activeEffects = this.svg.querySelectorAll('.data-pulse, .electric-spark');
        activeEffects.forEach(effect => effect.remove());
    }

    startAnimations() {
        console.log('Iniciando animações coloridas...');

        // Mostrar todas as linhas gradualmente com suas cores
        this.connections.forEach((conn, index) => {
            setTimeout(() => {
                conn.element.style.opacity = '0.6';
                conn.element.style.stroke = conn.color;
            }, index * 50);
        });

        // Pulsos periódicos na rede com cores originais
        setInterval(() => {
            if (this.connections.length > 0) {
                const randomConnection = this.connections[Math.floor(Math.random() * this.connections.length)];
                const originalWidth = randomConnection.element.getAttribute('stroke-width');
                const originalOpacity = randomConnection.element.getAttribute('stroke-opacity');

                // Aplicar pulso com cor original
                randomConnection.element.style.strokeWidth = '4';
                randomConnection.element.style.strokeOpacity = '1';
                randomConnection.element.style.stroke = randomConnection.color;
                randomConnection.element.style.filter = 'url(#pulseGlow)';

                setTimeout(() => {
                    randomConnection.element.style.strokeWidth = originalWidth;
                    randomConnection.element.style.strokeOpacity = originalOpacity;
                    randomConnection.element.style.filter = 'url(#glow)';
                }, 1500);
            }
        }, 3000);

        // Pulsos automáticos de dados saindo do hub
        this.startAutomaticDataFlow();

        console.log('Animações coloridas iniciadas!');
    }

    startAutomaticDataFlow() {
        // Pulsos de dados saindo do hub a cada 5 segundos
        setInterval(() => {
            const hubConnections = this.connections.filter(conn =>
                conn.nodeA === 'hub' || conn.nodeB === 'hub'
            );

            if (hubConnections.length > 0) {
                // Selecionar algumas conexões aleatórias
                const numPulses = Math.min(3, hubConnections.length);
                const selectedConnections = this.shuffleArray([...hubConnections]).slice(0, numPulses);

                selectedConnections.forEach((conn, index) => {
                    setTimeout(() => {
                        this.createDataPulse(conn.element, 'hub');
                    }, index * 300);
                });
            }
        }, 5000);

        // Pulsos secundários entre nós a cada 8 segundos
        setInterval(() => {
            const nonHubConnections = this.connections.filter(conn =>
                conn.nodeA !== 'hub' && conn.nodeB !== 'hub'
            );

            if (nonHubConnections.length > 0) {
                const randomConnection = nonHubConnections[Math.floor(Math.random() * nonHubConnections.length)];
                this.createDataPulse(randomConnection.element, randomConnection.nodeA);
            }
        }, 8000);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    handleResize() {
        console.log('Redimensionando conexões...');
        this.setupSVG();
        this.calculateNodePositions();
        this.createConnections();
    }

    // Reposicionar conexões quando a tela redimensiona (método legado)
    resize() {
        this.handleResize();
    }
}

// Analytics Manager
class AnalyticsManager {
    constructor() {
        this.startTime = Date.now();
        this.interactions = 0;
        this.visits = parseInt(localStorage.getItem('ruantech_visits')) || 0;
        this.sessionData = {
            pageViews: [],
            serviceClicks: [],
            hoverEvents: [],
            searchQueries: []
        };
    }

    trackPageView() {
        this.visits++;
        localStorage.setItem('ruantech_visits', this.visits);
        this.updateStatsPanel();
        this.sessionData.pageViews.push({ timestamp: Date.now(), page: location.pathname });
    }

    trackServiceClick(service, category) {
        this.interactions++;
        this.sessionData.serviceClicks.push({ service, category, timestamp: Date.now() });
        this.updateStatsPanel();
    }

    trackHover(service) {
        this.sessionData.hoverEvents.push({ service, timestamp: Date.now() });
    }

    trackNavigation(page) {
        this.interactions++;
        this.updateStatsPanel();
    }

    trackSearch(query) {
        this.sessionData.searchQueries.push({ query, timestamp: Date.now() });
    }

    updateStatsPanel() {
        const visitCount = document.getElementById('visit-count');
        const interactionCount = document.getElementById('interaction-count');
        const sessionTime = document.getElementById('session-time');

        if (visitCount) visitCount.textContent = this.visits;
        if (interactionCount) interactionCount.textContent = this.interactions;
        if (sessionTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            sessionTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    exportData() {
        return {
            ...this.sessionData,
            visits: this.visits,
            sessionDuration: Date.now() - this.startTime
        };
    }
}

// Audio Manager  
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.sounds = {};
    }

    async initialize() {
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.warn('Web Audio API não suportada');
            return;
        }

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await this.loadSounds();
    }

    async loadSounds() {
        const soundUrls = {
            click: this.generateTone(800, 0.1),
            hover: this.generateTone(600, 0.05),
            navigation: this.generateTone(1000, 0.2),
            achievement: this.generateTone(1200, 0.3)
        };

        for (const [name, generator] of Object.entries(soundUrls)) {
            this.sounds[name] = generator;
        }
    }

    generateTone(frequency, duration) {
        return () => {
            if (!this.enabled || !this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    playClick() { this.sounds.click?.(); }
    playHover() { this.sounds.hover?.(); }
    playNavigation() { this.sounds.navigation?.(); }
    playAchievement() { this.sounds.achievement?.(); }

    toggle() {
        this.enabled = !this.enabled;
        const button = document.getElementById('sound-toggle');
        if (button) {
            button.textContent = this.enabled ? '🔊' : '🔇';
        }
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.animationId = null;
    }

    initialize() {
        this.container = document.getElementById('particle-container');
        return Promise.resolve();
    }

    start(density) {
        if (!this.container) return;

        this.stop();
        this.createParticles(Math.floor(density / 10));
        this.animate();
    }

    createParticles(count) {
        this.particles = [];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';

            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animate() {
        this.particles.forEach(particle => {
            const x = parseFloat(particle.style.left);
            const y = parseFloat(particle.style.top);

            if (y < -10) {
                particle.style.top = '110vh';
                particle.style.left = Math.random() * 100 + 'vw';
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }
}

// Achievement System
class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlocked = new Set(JSON.parse(localStorage.getItem('ruantech_achievements') || '[]'));
    }

    initialize() {
        this.defineAchievements();
        return Promise.resolve();
    }

    defineAchievements() {
        this.achievements.set('first_visit', {
            title: 'Primeira Visita',
            description: 'Welcome to the infinite web!',
            icon: '👋'
        });

        this.achievements.set('service_explorer', {
            title: 'Explorador de Serviços',
            description: 'Explorou 5 serviços diferentes',
            icon: '🔍'
        });

        this.achievements.set('demo_master', {
            title: 'Mestre das Demos',
            description: 'Testou 10 demos interativas',
            icon: '🎮'
        });

        this.achievements.set('theme_switcher', {
            title: 'Mudador de Temas',
            description: 'Experimentou todos os temas',
            icon: '🎨'
        });

        this.achievements.set('speed_runner', {
            title: 'Velocista',
            description: 'Navegou por toda a teia em menos de 2 minutos',
            icon: '⚡'
        });

        // Auto-unlock primeira visita
        if (!this.unlocked.has('first_visit')) {
            setTimeout(() => this.unlock('first_visit'), 3000);
        }
    }

    unlock(achievementId) {
        if (this.unlocked.has(achievementId)) return;

        const achievement = this.achievements.get(achievementId);
        if (!achievement) return;

        this.unlocked.add(achievementId);
        this.saveProgress();
        this.showAchievementToast(achievement);

        // Play sound
        if (window.ruantechApp?.audio) {
            window.ruantechApp.audio.playAchievement();
        }
    }

    showAchievementToast(achievement) {
        const toast = document.getElementById('achievement-toast');
        const text = document.getElementById('achievement-text');

        if (toast && text) {
            text.innerHTML = `<strong>${achievement.title}</strong><br>${achievement.description}`;
            toast.classList.remove('hidden');
            toast.classList.add('animate-slide-in');

            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('animate-slide-in');
            }, 4000);
        }
    }

    checkServiceExploration(service) {
        // Implementar lógica de conquistas baseadas em exploração
    }

    saveProgress() {
        localStorage.setItem('ruantech_achievements', JSON.stringify([...this.unlocked]));
    }
}

// Search System  
class SearchSystem {
    constructor() {
        this.services = this.buildServiceIndex();
        this.modal = document.getElementById('search-modal');
        this.input = document.getElementById('search-input');
        this.results = document.getElementById('search-results');
    }

    buildServiceIndex() {
        return [
            { id: 'sites-responsivos', name: 'Sites Responsivos', category: 'Frontend', keywords: ['mobile', 'responsive', 'pwa'] },
            { id: 'api-rest', name: 'API REST', category: 'Backend', keywords: ['api', 'rest', 'json', 'crud'] },
            { id: 'loja-virtual', name: 'Loja Virtual', category: 'E-commerce', keywords: ['loja', 'ecommerce', 'vendas'] },
            // ... índice completo
        ];
    }

    show() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        this.input.focus();

        this.input.addEventListener('input', (e) => this.search(e.target.value));
        document.getElementById('close-search').addEventListener('click', () => this.hide());
    }

    hide() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        this.input.value = '';
        this.results.innerHTML = '';
    }

    search(query) {
        if (!query.trim()) {
            this.results.innerHTML = '';
            return;
        }

        const results = this.services.filter(service =>
            service.name.toLowerCase().includes(query.toLowerCase()) ||
            service.category.toLowerCase().includes(query.toLowerCase()) ||
            service.keywords.some(k => k.includes(query.toLowerCase()))
        );

        this.displayResults(results);
    }

    displayResults(results) {
        if (results.length === 0) {
            this.results.innerHTML = '<p class="text-gray-400 text-center py-4">Nenhum serviço encontrado</p>';
            return;
        }

        this.results.innerHTML = results.map(service => `
                    <div class="search-result p-3 hover:bg-gray-700 rounded cursor-pointer" data-service="${service.id}">
                        <h4 class="font-semibold">${service.name}</h4>
                        <p class="text-xs text-gray-400">${service.category}</p>
                    </div>
                `).join('');

        this.results.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', (e) => {
                const service = e.currentTarget.dataset.service;
                this.hide();
                // Trigger service click
                document.querySelector(`[data-service="${service}"]`)?.click();
            });
        });
    }
}

// Modal Manager
class ModalManager {
    constructor() {
        this.serviceModal = document.getElementById('service-modal');
        this.settingsModal = document.getElementById('settings-modal');
        this.setupModals();
    }

    setupModals() {
        // Service Modal
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.hideService();
        });

        // Settings Modal
        document.getElementById('close-settings')?.addEventListener('click', () => {
            this.hideSettings();
        });

        // Click outside to close
        [this.serviceModal, this.settingsModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAll();
                }
            });
        });
    }

    showService(serviceId) {
        const serviceData = this.getServiceData(serviceId);

        document.getElementById('modal-title').textContent = serviceData.title;
        document.getElementById('modal-content').innerHTML = serviceData.content;

        this.serviceModal.classList.remove('hidden');
        this.serviceModal.classList.add('flex');

        // Setup demo button
        document.getElementById('demo-btn').onclick = () => {
            this.launchDemo(serviceId);
        };
    }

    getServiceData(serviceId) {
        const services = {
            'sites-responsivos': {
                title: '📱 Sites Responsivos',
                content: `
                            <div class="space-y-4">
                                <p>Sites web adaptativos com design mobile-first e performance otimizada.</p>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="glass p-3 rounded">
                                        <h5 class="font-semibold mb-2">🎨 Design</h5>
                                        <ul class="text-sm text-gray-300 space-y-1">
                                            <li>• Mobile-first approach</li>
                                            <li>• Breakpoints inteligentes</li>
                                            <li>• Typography fluida</li>
                                        </ul>
                                    </div>
                                    <div class="glass p-3 rounded">
                                        <h5 class="font-semibold mb-2">⚡ Performance</h5>
                                        <ul class="text-sm text-gray-300 space-y-1">
                                            <li>• Lazy loading</li>
                                            <li>• Critical CSS</li>
                                            <li>• Asset optimization</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="bg-green-900/20 p-3 rounded border border-green-500/20">
                                    <h6 class="text-green-400 font-semibold mb-1">✅ Demo Funcional Disponível</h6>
                                    <p class="text-sm">Experimente um site completo com todas as funcionalidades.</p>
                                </div>
                            </div>
                        `
            },
            // ... mais dados de serviços
        };

        return services[serviceId] || {
            title: 'Serviço em Desenvolvimento',
            content: '<p>Este serviço está sendo preparado. Demo em breve!</p>'
        };
    }

    showSettings() {
        this.settingsModal.classList.remove('hidden');
        this.settingsModal.classList.add('flex');
        this.loadCurrentSettings();
    }

    loadCurrentSettings() {
        const settings = window.ruantechApp?.settings || {};

        const animationSpeed = document.getElementById('animation-speed');
        const particleDensity = document.getElementById('particle-density');
        const performanceMode = document.getElementById('performance-mode');
        const reduceMotion = document.getElementById('reduce-motion');
        const highContrast = document.getElementById('high-contrast');

        if (animationSpeed) animationSpeed.value = settings.animationSpeed || 1;
        if (particleDensity) particleDensity.value = settings.particleDensity || 50;
        if (performanceMode) performanceMode.checked = settings.performanceMode || false;
        if (reduceMotion) reduceMotion.checked = settings.reduceMotion || false;
        if (highContrast) highContrast.checked = settings.highContrast || false;
    }

    showCentralHub() {
        // Implementar modal do hub central
        console.log('🕷️ Central Hub accessed - navigating through 28 interconnected services');
    }

    launchDemo(serviceId) {
        // Simular lançamento de demo
        console.log(`🚀 Launching demo: ${serviceId} - opening functional demo in new tab`);
        // Em uma implementação real, isso abriria o demo funcional em nova aba
    }

    hideService() {
        this.serviceModal.classList.add('hidden');
        this.serviceModal.classList.remove('flex');
    }

    hideSettings() {
        this.settingsModal.classList.add('hidden');
        this.settingsModal.classList.remove('flex');
    }

    closeAll() {
        this.hideService();
        this.hideSettings();
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('ruantech_theme') || 'dark';
        this.applyTheme(this.currentTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('ruantech_theme', theme);
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;

        // Update theme selector
        const selector = document.getElementById('theme-selector');
        if (selector) selector.value = theme;
    }
}

// Initialize Application with performance optimizations
document.addEventListener('DOMContentLoaded', function () {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 300);
        }
    }, 1000);

    // Initialize responsive header
    initializeResponsiveHeader();

    // Initialize sequential animator
    const sequentialAnimator = new SequentialAnimator();

    // Observe all service categories for sequential animation
    document.querySelectorAll('.service-category').forEach(category => {
        sequentialAnimator.observeElement(category);
    });

    // Initialize app with delayed heavy operations
    setTimeout(() => {
        window.ruantechApp = new RuantechApp();
    }, 500);

    // Fix all demo badges - substituir bolinhas por texto laranja
    const oldBadges = document.querySelectorAll('div.w-4.h-4.bg-red-500.rounded-full.mx-auto.mb-2.animate-pulse');
    oldBadges.forEach(badge => {
        const newBadge = document.createElement('span');
        newBadge.className = 'demo-badge mx-auto mb-2';
        newBadge.textContent = 'DEMO';
        badge.parentNode.replaceChild(newBadge, badge);
    });

    // Optimize animations based on device capabilities
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        document.documentElement.style.setProperty('--animation-scale', '1.02');
    }

    // Performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();

    function checkPerformance() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

            // Auto-optimize if FPS is low
            if (fps < 30) {
                document.documentElement.classList.add('low-performance');
                console.log('Performance mode activated - FPS:', fps);
            }

            frameCount = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(checkPerformance);
    }

    checkPerformance();
});

// Responsive Header Management
function initializeResponsiveHeader() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const mobileThemeSelector = document.getElementById('mobile-theme-selector');
    const themeSelector = document.getElementById('theme-selector');
    const mobileSoundToggle = document.getElementById('mobile-sound-toggle');
    const mobileSettingsBtn = document.getElementById('mobile-settings-btn');
    const soundToggle = document.getElementById('sound-toggle');
    const settingsBtn = document.getElementById('settings-btn');

    // Mobile menu toggle
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            }
        });
    }

    // Mobile sound toggle (for very small screens)
    if (mobileSoundToggle && soundToggle) {
        mobileSoundToggle.addEventListener('click', function () {
            soundToggle.click(); // Reuse existing sound toggle logic
        });
    }

    // Mobile settings button (for very small screens)
    if (mobileSettingsBtn && settingsBtn) {
        mobileSettingsBtn.addEventListener('click', function () {
            settingsBtn.click(); // Reuse existing settings logic
            // Close mobile menu after opening settings
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            }
        });
    }

    // Sync theme selectors
    function syncThemeSelectors(selectedTheme) {
        if (themeSelector) themeSelector.value = selectedTheme;
        if (mobileThemeSelector) mobileThemeSelector.value = selectedTheme;
        if (mobileThemeToggle) {
            const themeIcons = { dark: '🌙', light: '☀️', cyberpunk: '🤖' };
            mobileThemeToggle.textContent = themeIcons[selectedTheme] || '🌙';
        }

        // Apply theme
        document.body.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('ruantech-theme', selectedTheme);
    }

    // Theme selector events
    if (themeSelector) {
        themeSelector.addEventListener('change', function () {
            syncThemeSelectors(this.value);
        });
    }

    if (mobileThemeSelector) {
        mobileThemeSelector.addEventListener('change', function () {
            syncThemeSelectors(this.value);
        });
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function () {
            const themes = ['dark', 'light', 'cyberpunk'];
            const currentTheme = document.body.getAttribute('data-theme') || 'dark';
            const currentIndex = themes.indexOf(currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            syncThemeSelectors(nextTheme);
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('ruantech-theme') || 'dark';
    syncThemeSelectors(savedTheme);

    // Handle window resize
    window.addEventListener('resize', debounce(function () {
        // Close mobile menu on resize to larger screens
        if (window.innerWidth >= 640 && mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
        }
    }, 250));
}

// Desabilitar OFFLINE: garantir que nenhum Service Worker fique ativo
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(reg => reg.unregister());
            console.log('SW: todos os service workers desregistrados');
        })
        .catch(() => {/* noop */ });

    // Opcional: limpar caches criados por SWs anteriores
    if (window.caches && caches.keys) {
        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
            .then(() => console.log('SW: caches limpos'))
            .catch(() => {/* noop */ });
    }
}

// Performance Monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
    }
});
