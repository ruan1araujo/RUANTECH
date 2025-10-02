// Sistema Simples de Fluxo de Partículas - DESABILITADO
// Este sistema foi desabilitado em favor do DataFlowAnimator no main.js
// para evitar redundância e melhorar a performance

class SimpleParticleFlow {
    constructor() {
        this.isActive = false;
        console.log('🔇 SimpleParticleFlow desabilitado - usando DataFlowAnimator');
    }

    init() {
        // Desabilitado
    }

    setup() {
        // Desabilitado
    }

    createContainer() {
        // Desabilitado
    }

    startFlow() {
        // Desabilitado
    }

    createParticle() {
        // Desabilitado
    }

    animateParticle(particle, start, end) {
        // Desabilitado
    }

    removeParticle(particle) {
        // Desabilitado
    }

    pause() {
        this.isActive = false;
    }

    resume() {
        this.isActive = false;
    }
}

// Inicializar automaticamente
window.simpleParticleFlow = new SimpleParticleFlow();