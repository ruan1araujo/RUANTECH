// Sistema Simples de Fluxo de Partículas
class SimpleParticleFlow {
    constructor() {
        this.isActive = true;
        this.container = null;
        this.particles = [];

        console.log('🚀 Iniciando Sistema de Partículas Simples...');
        this.init();
    }

    init() {
        // Aguardar carregamento da página
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.setup(), 2000);
            });
        } else {
            setTimeout(() => this.setup(), 2000);
        }
    }

    setup() {
        console.log('🔧 Configurando sistema de partículas...');

        // Criar container
        this.createContainer();

        // Verificar elementos
        const hub = document.getElementById('central-hub');
        if (!hub) {
            console.error('❌ Hub central não encontrado');
            return;
        }

        console.log('✅ Hub encontrado, iniciando fluxo...');

        // Iniciar fluxo
        this.startFlow();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'simple-particle-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 30;
        `;

        document.body.appendChild(this.container);
        console.log('✅ Container criado');
    }

    startFlow() {
        // Criar primeira partícula imediatamente
        this.createParticle();

        // Criar partículas a cada 2 segundos
        setInterval(() => {
            if (this.isActive) {
                this.createParticle();
            }
        }, 2000);
    }

    createParticle() {
        const hub = document.getElementById('central-hub');
        if (!hub || !this.container) return;

        // Pegar posição do hub
        const hubRect = hub.getBoundingClientRect();
        const hubCenter = {
            x: hubRect.left + hubRect.width / 2,
            y: hubRect.top + hubRect.height / 2
        };

        // Escolher um destino aleatório na tela
        const target = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        };

        // Criar partícula
        const particle = document.createElement('div');
        particle.className = 'simple-particle';
        particle.style.cssText = `
            position: fixed;
            left: ${hubCenter.x}px;
            top: ${hubCenter.y}px;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #00ffff, #0080ff);
            border-radius: 50%;
            box-shadow: 0 0 10px #00ffff, 0 0 20px #0080ff;
            transform: translate(-50%, -50%);
            z-index: 35;
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);

        console.log(`✨ Partícula criada em (${hubCenter.x}, ${hubCenter.y})`);

        // Animar
        this.animateParticle(particle, hubCenter, target);
    }

    animateParticle(particle, start, end) {
        const duration = 3000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing
            const easeProgress = 1 - Math.pow(1 - progress, 2);

            // Posição
            const x = start.x + (end.x - start.x) * easeProgress;
            const y = start.y + (end.y - start.y) * easeProgress;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            // Opacidade
            if (progress > 0.7) {
                particle.style.opacity = (1 - progress) * 3.33;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.removeParticle(particle);
            }
        };

        requestAnimationFrame(animate);
    }

    removeParticle(particle) {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }

        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
    }

    pause() {
        this.isActive = false;
    }

    resume() {
        this.isActive = true;
    }
}

// Inicializar automaticamente
window.simpleParticleFlow = new SimpleParticleFlow();