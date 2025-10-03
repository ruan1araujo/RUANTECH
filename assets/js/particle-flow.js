// Sistema de Fibra Óptica - Dados correndo exatamente nas linhas SVG
class FiberOpticDataFlow {
    constructor() {
        this.isActive = true;
        this.isPaused = false; // Para controle de scroll
        this.lightPulses = [];
        this.particleContainer = null;
        this.animationFrames = []; // Para cancelar animações durante scroll
        this.pulseInterval = null; // Para controlar intervalos
        this.sequenceInterval = null; // Para controlar intervalos
        
        // Detecção de mobile para otimização
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         window.innerWidth <= 768;

        console.log(`💡 Iniciando Sistema de Fibra Óptica (Mobile: ${this.isMobile})...`);
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.setup(), 2000);
            });
        } else {
            setTimeout(() => this.setup(), 2000);
        }
    }

    setup() {
        console.log('🔧 Configurando sistema de fibra óptica...');

        // Criar container para as partículas de luz
        this.createParticleContainer();

        // Aguardar conexões estarem prontas
        this.waitForConnections();
    }

    createParticleContainer() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.id = 'fiber-optic-container';
        this.particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 15;
        `;

        // Adicionar ao mesmo container das linhas SVG
        const svgContainer = document.getElementById('connection-lines');
        if (svgContainer && svgContainer.parentElement) {
            svgContainer.parentElement.appendChild(this.particleContainer);
            console.log('✅ Container de fibra óptica criado');
        }
    }

    waitForConnections() {
        const checkConnections = () => {
            const connections = document.querySelectorAll('.connection-line');
            if (connections.length > 0) {
                console.log(`✅ ${connections.length} linhas de fibra encontradas`);
                this.startFiberOpticFlow();
            } else {
                setTimeout(checkConnections, 500);
            }
        };

        checkConnections();
    }

    startFiberOpticFlow() {
        // Criar primeira sequência de pulsos luminosos
        this.createLightSequence();

        // Mobile: intervalos maiores para melhor performance
        const pulseInterval = this.isMobile ? 4000 : 3000;
        const sequenceInterval = this.isMobile ? 15000 : 12000;

        // Pulsos periódicos individuais - armazenar para controle
        this.pulseInterval = setInterval(() => {
            if (this.isActive && !this.isPaused) {
                this.createRandomLightPulse();
            }
        }, pulseInterval);

        // Sequências completas ocasionais - armazenar para controle
        this.sequenceInterval = setInterval(() => {
            if (this.isActive && !this.isPaused) {
                this.createLightSequence();
            }
        }, sequenceInterval);
    }

    createLightSequence() {
        const connections = document.querySelectorAll('.connection-line');
        if (connections.length === 0) return;

        console.log('💫 Criando sequência de pulsos luminosos...');

        // Mobile: menos conexões simultâneas
        const maxConnections = this.isMobile ? 2 : 4;
        
        // Selecionar conexões aleatórias
        const selectedConnections = Array.from(connections)
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(maxConnections, connections.length));

        // Mobile: delay maior entre partículas
        const delay = this.isMobile ? 600 : 400;

        selectedConnections.forEach((connection, index) => {
            setTimeout(() => {
                this.createLightPulseOnPath(connection);
            }, index * delay);
        });
    }

    createRandomLightPulse() {
        const connections = document.querySelectorAll('.connection-line');
        if (connections.length === 0) return;

        const randomConnection = connections[Math.floor(Math.random() * connections.length)];
        this.createLightPulseOnPath(randomConnection);
    }

    createLightPulseOnPath(pathElement) {
        if (!pathElement || !this.particleContainer) return;

        // Mobile: limite menor de partículas simultâneas
        const MAX_PARTICLES = this.isMobile ? 8 : 12;
        if (this.lightPulses.length >= MAX_PARTICLES) return;

        try {
            // Verificar se o elemento tem getTotalLength (é um path/line SVG)
            let pathLength = 0;
            if (pathElement.getTotalLength) {
                pathLength = pathElement.getTotalLength();
            } else if (pathElement.tagName === 'line') {
                // Para elementos line, calcular distância
                const x1 = parseFloat(pathElement.getAttribute('x1')) || 0;
                const y1 = parseFloat(pathElement.getAttribute('y1')) || 0;
                const x2 = parseFloat(pathElement.getAttribute('x2')) || 0;
                const y2 = parseFloat(pathElement.getAttribute('y2')) || 0;
                pathLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            }

            if (pathLength === 0) return;

            // Mobile: chance menor de partículas grandes
            const largeChance = this.isMobile ? 0.2 : 0.4;
            const isLarge = Math.random() < largeChance;
            
            // Mobile: tamanhos menores
            const size = this.isMobile 
                ? (isLarge ? (8 + Math.random() * 6) : 3)  // Mobile: 3px ou 8-14px
                : (isLarge ? (12 + Math.random() * 12) : 4); // Desktop: 4px ou 12-24px
                
            // Mobile: sombras mais leves
            const shadow = this.isMobile
                ? (isLarge 
                    ? '0 0 8px #00ffff, 0 0 16px #0080ff' 
                    : '0 0 4px #00ffff, 0 0 8px #0080ff')
                : (isLarge
                    ? '0 0 16px #00ffff, 0 0 32px #0080ff, 0 0 48px #00ffff'
                    : '0 0 6px #00ffff, 0 0 12px #0080ff, 0 0 18px #00ffff');

            // Criar partícula de luz
            const lightPulse = document.createElement('div');
            lightPulse.className = 'fiber-optic-pulse';
            lightPulse.dataset.large = isLarge ? '1' : '0';

            // Estilo da partícula de luz - alternância de tamanho
            lightPulse.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: radial-gradient(circle, #00ffff 0%, #0080ff 60%, transparent 100%);
                    border-radius: 50%;
                    box-shadow: ${shadow};
                    z-index: 20;
                    pointer-events: none;
                    will-change: left, top, opacity, filter;
                    transition: opacity 0.2s linear;
                `;

            this.particleContainer.appendChild(lightPulse);
            this.lightPulses.push(lightPulse);

            // Animar ao longo do caminho SVG
            this.animateLightAlongPath(lightPulse, pathElement, pathLength, size, isLarge);

        } catch (error) {
            console.warn('❌ Erro ao criar pulso de luz:', error);
        }
    }

    animateLightAlongPath(lightPulse, pathElement, pathLength, size = 4, isLarge = false) {
        // Partículas grandes se movem mais devagar
        const baseDuration = isLarge ? 3200 : 2000;
        const duration = baseDuration + Math.random() * 800;
        const startTime = performance.now();
        let animationId = null;

        const animate = (currentTime) => {
            // Pausar durante scroll
            if (this.isPaused || !this.isActive) {
                // Aguardar retomada
                animationId = requestAnimationFrame(animate);
                return;
            }

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            try {
                let point = { x: 0, y: 0 };

                // Obter ponto atual no caminho SVG
                if (pathElement.getPointAtLength) {
                    point = pathElement.getPointAtLength(progress * pathLength);
                } else if (pathElement.tagName === 'line') {
                    // Para elementos line, interpolar posição
                    const x1 = parseFloat(pathElement.getAttribute('x1')) || 0;
                    const y1 = parseFloat(pathElement.getAttribute('y1')) || 0;
                    const x2 = parseFloat(pathElement.getAttribute('x2')) || 0;
                    const y2 = parseFloat(pathElement.getAttribute('y2')) || 0;

                    point.x = x1 + (x2 - x1) * progress;
                    point.y = y1 + (y2 - y1) * progress;
                }

                // Posicionar a partícula EXATAMENTE no caminho
                lightPulse.style.left = `${point.x}px`;
                lightPulse.style.top = `${point.y}px`;
                lightPulse.style.transform = 'translate(-50%, -50%)';

                // Controlar opacidade suavemente
                if (progress < 0.1) {
                    lightPulse.style.opacity = progress * 10;
                } else if (progress > 0.9) {
                    lightPulse.style.opacity = (1 - progress) * 10;
                } else {
                    lightPulse.style.opacity = 1;
                }

                // Variar intensidade do brilho para simular fibra óptica
                const glowIntensity = isLarge
                    ? 1.1 + Math.sin(progress * Math.PI * 6) * 0.3
                    : 0.8 + Math.sin(progress * Math.PI * 6) * 0.2;
                lightPulse.style.filter = `brightness(${glowIntensity}) saturate(1.2)`;

                if (progress < 1 && this.isActive) {
                    animationId = requestAnimationFrame(animate);
                    this.animationFrames.push(animationId);
                } else {
                    this.removeLightPulse(lightPulse);
                }

            } catch (error) {
                console.warn('❌ Erro na animação do pulso:', error);
                this.removeLightPulse(lightPulse);
            }
        };

        animationId = requestAnimationFrame(animate);
        this.animationFrames.push(animationId);
    }

    removeLightPulse(lightPulse) {
        if (lightPulse.parentNode) {
            lightPulse.parentNode.removeChild(lightPulse);
        }

        const index = this.lightPulses.indexOf(lightPulse);
        if (index > -1) {
            this.lightPulses.splice(index, 1);
        }
    }

    pause() {
        this.isActive = false;
        this.isPaused = true;

        // Cancelar todas as animações ativas
        this.animationFrames.forEach(id => cancelAnimationFrame(id));
        this.animationFrames = [];

        // Pausar intervalos
        if (this.pulseInterval) {
            clearInterval(this.pulseInterval);
            this.pulseInterval = null;
        }
        if (this.sequenceInterval) {
            clearInterval(this.sequenceInterval);
            this.sequenceInterval = null;
        }

        // Reduzir opacidade das partículas durante scroll
        if (this.particleContainer) {
            this.particleContainer.style.opacity = '0.3';
        }

        console.log('⏸️ Sistema de fibra óptica pausado (scroll)');
    }

    resume() {
        this.isActive = true;
        this.isPaused = false;

        // Restaurar opacidade
        if (this.particleContainer) {
            this.particleContainer.style.opacity = '1';
        }

        // Reiniciar sistema após um pequeno delay
        setTimeout(() => {
            if (this.isActive && !this.isPaused) {
                this.startFiberOpticFlow();
            }
        }, 300);

        console.log('▶️ Sistema de fibra óptica retomado');
    }
}

// Inicializar sistema de fibra óptica
window.fiberOpticDataFlow = new FiberOpticDataFlow();