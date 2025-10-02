/* SISTEMA DE ANIMAÇÃO INTELIGENTE - RUANTECH V2.0 */

class OptimizedAnimationController {
    constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.velocityThreshold = {
            low: 10,
            medium: 25,
            high: 50,
            extreme: 100
        };

        this.currentVelocity = 0;
        this.gestureStartTime = 0;
        this.lastTouchPosition = { x: 0, y: 0 };
        this.animationQuality = 'high';

        this.throttleTimeout = null;
        this.cooldownElements = new Set();

        this.init();
    }

    init() {
        this.setupPerformanceMonitoring();
        this.setupGestureDetection();
        this.setupIntersectionObserver();
        this.setupServiceNodeOptimizations();
        this.startAdaptiveQualityControl();

        console.log('🚀 Sistema de animação otimizada inicializado');
    }

    /* ========================================
       MONITORAMENTO DE PERFORMANCE EM TEMPO REAL
    ======================================== */
    setupPerformanceMonitoring() {
        const monitor = () => {
            this.frameCount++;
            const currentTime = performance.now();

            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.adjustAnimationQuality();

                this.frameCount = 0;
                this.lastTime = currentTime;
            }

            requestAnimationFrame(monitor);
        };

        requestAnimationFrame(monitor);
    }

    adjustAnimationQuality() {
        const body = document.body;

        // Remover classes de qualidade anteriores
        body.classList.remove('high-performance', 'medium-performance', 'low-performance');

        if (this.fps < 20) {
            this.animationQuality = 'low';
            body.classList.add('low-performance');
            console.log('⚠️ Modo de baixa performance ativado (FPS:', this.fps, ')');
        } else if (this.fps < 45) {
            this.animationQuality = 'medium';
            body.classList.add('medium-performance');
        } else {
            this.animationQuality = 'high';
            body.classList.add('high-performance');
        }
    }

    /* ========================================
       DETECÇÃO INTELIGENTE DE GESTOS RÁPIDOS
    ======================================== */
    setupGestureDetection() {
        let isScrolling = false;
        let scrollTimeout;

        // Touch/Mouse gesture detection
        document.addEventListener('touchstart', (e) => this.handleGestureStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.handleGestureMove(e), { passive: true });
        document.addEventListener('touchend', () => this.handleGestureEnd(), { passive: true });

        document.addEventListener('mousedown', (e) => this.handleGestureStart(e));
        document.addEventListener('mousemove', (e) => this.handleGestureMove(e));
        document.addEventListener('mouseup', () => this.handleGestureEnd());

        // Scroll detection
        document.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
                this.enableScrollMode();
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                this.disableScrollMode();
            }, 150);
        }, { passive: true });
    }

    handleGestureStart(e) {
        this.gestureStartTime = performance.now();
        const touch = e.touches ? e.touches[0] : e;
        this.lastTouchPosition = { x: touch.clientX, y: touch.clientY };
        this.currentVelocity = 0;
    }

    handleGestureMove(e) {
        if (!this.gestureStartTime) return;

        const touch = e.touches ? e.touches[0] : e;
        const currentPosition = { x: touch.clientX, y: touch.clientY };
        const currentTime = performance.now();

        const distance = Math.sqrt(
            Math.pow(currentPosition.x - this.lastTouchPosition.x, 2) +
            Math.pow(currentPosition.y - this.lastTouchPosition.y, 2)
        );

        const timeDelta = currentTime - this.gestureStartTime;
        this.currentVelocity = distance / timeDelta * 1000; // pixels per second

        this.applyVelocityBasedOptimizations();

        this.lastTouchPosition = currentPosition;
        this.gestureStartTime = currentTime;
    }

    handleGestureEnd() {
        // Gradual return to normal
        this.currentVelocity = 0;
        setTimeout(() => {
            this.resetVelocityOptimizations();
        }, 300);
    }

    /* ========================================
       OTIMIZAÇÕES BASEADAS EM VELOCIDADE
    ======================================== */
    applyVelocityBasedOptimizations() {
        const serviceNodes = document.querySelectorAll('.service-node, .service-node-optimized');
        const body = document.body;

        // Remover classes de throttling anteriores
        body.classList.remove('velocity-throttle-1', 'velocity-throttle-2', 'velocity-throttle-3', 'velocity-throttle-4');

        if (this.currentVelocity > this.velocityThreshold.extreme) {
            body.classList.add('velocity-throttle-4');
            this.disableAllAnimations();
        } else if (this.currentVelocity > this.velocityThreshold.high) {
            body.classList.add('velocity-throttle-3');
            this.setMinimalAnimations();
        } else if (this.currentVelocity > this.velocityThreshold.medium) {
            body.classList.add('velocity-throttle-2');
            this.setReducedAnimations();
        } else if (this.currentVelocity > this.velocityThreshold.low) {
            body.classList.add('velocity-throttle-1');
        }
    }

    resetVelocityOptimizations() {
        const body = document.body;
        body.classList.remove('velocity-throttle-1', 'velocity-throttle-2', 'velocity-throttle-3', 'velocity-throttle-4');
        body.classList.add('velocity-reset');

        setTimeout(() => {
            body.classList.remove('velocity-reset');
        }, 300);

        this.enableAllAnimations();
    }

    /* ========================================
       CONTROLE ADAPTATIVO DE ANIMAÇÕES
    ======================================== */
    disableAllAnimations() {
        document.documentElement.style.setProperty('--animation-speed', '0.01');
        this.pauseNonEssentialAnimations();
    }

    setMinimalAnimations() {
        document.documentElement.style.setProperty('--animation-speed', '0.1');
        this.pauseDecorationAnimations();
    }

    setReducedAnimations() {
        document.documentElement.style.setProperty('--animation-speed', '0.5');
    }

    enableAllAnimations() {
        document.documentElement.style.setProperty('--animation-speed', '1');
        this.resumeAllAnimations();
    }

    pauseNonEssentialAnimations() {
        const animations = document.querySelectorAll('.smooth-pulse, .contained-glow, [class*="animate-"]');
        animations.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.classList.add('animation-paused');
        });
    }

    pauseDecorationAnimations() {
        const decorations = document.querySelectorAll('.demo-badge, .particle, .connection-line');
        decorations.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    resumeAllAnimations() {
        const animations = document.querySelectorAll('.animation-paused, [style*="animation-play-state"]');
        animations.forEach(el => {
            el.style.animationPlayState = 'running';
            el.classList.remove('animation-paused');
        });
    }

    /* ========================================
       SCROLL MODE OTIMIZADO
    ======================================== */
    enableScrollMode() {
        document.body.classList.add('scroll-velocity-high');
        this.throttleHoverEffects();
    }

    disableScrollMode() {
        document.body.classList.remove('scroll-velocity-high');
        this.enableHoverEffects();
    }

    throttleHoverEffects() {
        const serviceNodes = document.querySelectorAll('.service-node, .service-node-optimized');
        serviceNodes.forEach(node => {
            node.classList.add('gesture-throttled');
        });
    }

    enableHoverEffects() {
        const serviceNodes = document.querySelectorAll('.service-node, .service-node-optimized');
        serviceNodes.forEach(node => {
            node.classList.remove('gesture-throttled');
        });
    }

    /* ========================================
       OTIMIZAÇÕES DOS SERVICE NODES
    ======================================== */
    setupServiceNodeOptimizations() {
        const serviceNodes = document.querySelectorAll('.service-node');

        serviceNodes.forEach(node => {
            // Adicionar classes de otimização
            node.classList.add('service-node-optimized', 'performance-optimized');

            // Debounce para clicks rápidos
            this.addClickDebounce(node);

            // Hover inteligente
            this.addIntelligentHover(node);

            // Touch feedback otimizado
            this.addOptimizedTouchFeedback(node);
        });
    }

    addClickDebounce(element) {
        let lastClickTime = 0;
        const debounceTime = 200; // ms

        element.addEventListener('click', (e) => {
            const currentTime = performance.now();

            if (currentTime - lastClickTime < debounceTime) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }

            lastClickTime = currentTime;
            this.addClickCooldown(element);
        }, true);
    }

    addClickCooldown(element) {
        if (this.cooldownElements.has(element)) return;

        this.cooldownElements.add(element);
        element.classList.add('click-cooldown');

        setTimeout(() => {
            element.classList.remove('click-cooldown');
            this.cooldownElements.delete(element);
        }, 500);
    }

    addIntelligentHover(element) {
        let hoverTimeout;
        let isHovering = false;

        element.addEventListener('mouseenter', () => {
            if (this.currentVelocity > this.velocityThreshold.medium) return;

            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                if (!isHovering) {
                    isHovering = true;
                    this.applyHoverEffect(element);
                }
            }, this.animationQuality === 'low' ? 100 : 50);
        });

        element.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            isHovering = false;
            this.removeHoverEffect(element);
        });
    }

    applyHoverEffect(element) {
        if (this.animationQuality === 'low') {
            element.style.transform = 'translate3d(0, -2px, 0) scale(1.01)';
        } else {
            element.style.transform = 'translate3d(0, -8px, 0) scale(1.05)';
        }
    }

    removeHoverEffect(element) {
        element.style.transform = '';
    }

    addOptimizedTouchFeedback(element) {
        element.addEventListener('touchstart', () => {
            element.classList.add('touch-active');
        }, { passive: true });

        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
    }

    /* ========================================
       INTERSECTION OBSERVER PARA LAZY ANIMATIONS
    ======================================== */
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                    this.enableElementAnimations(entry.target);
                } else {
                    entry.target.classList.remove('in-viewport');
                    this.disableElementAnimations(entry.target);
                }
            });
        }, options);

        // Observar todos os service nodes
        document.querySelectorAll('.service-node, .service-category').forEach(el => {
            observer.observe(el);
        });
    }

    enableElementAnimations(element) {
        element.style.animationPlayState = 'running';
        element.style.willChange = 'transform, opacity';
    }

    disableElementAnimations(element) {
        if (element.getBoundingClientRect().top > window.innerHeight + 200) {
            element.style.animationPlayState = 'paused';
            element.style.willChange = 'auto';
        }
    }

    /* ========================================
       CONTROLE ADAPTATIVO DE QUALIDADE
    ======================================== */
    startAdaptiveQualityControl() {
        // Monitorar temperatura da CPU (experimental)
        this.monitorPerformanceMetrics();

        // Ajustar baseado no tipo de dispositivo
        this.detectDeviceCapabilities();

        // Monitorar uso de memória
        this.monitorMemoryUsage();
    }

    monitorPerformanceMetrics() {
        if ('performance' in window && 'memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const used = memory.usedJSHeapSize / memory.totalJSHeapSize;

                if (used > 0.8) {
                    this.reduceAnimationComplexity();
                }
            }, 5000);
        }
    }

    detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            // Sem WebGL, reduzir animações
            document.body.classList.add('low-capability-device');
            this.animationQuality = 'low';
        }

        // Detectar se é mobile
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            document.body.classList.add('mobile-device');
            this.velocityThreshold = {
                low: 5,
                medium: 15,
                high: 30,
                extreme: 60
            };
        }
    }

    monitorMemoryUsage() {
        if ('performance' in window && 'memory' in performance) {
            const checkMemory = () => {
                const memory = performance.memory;
                const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

                if (usageRatio > 0.7) {
                    this.enableMemoryOptimizations();
                } else if (usageRatio < 0.5) {
                    this.disableMemoryOptimizations();
                }
            };

            setInterval(checkMemory, 10000);
        }
    }

    enableMemoryOptimizations() {
        document.body.classList.add('memory-optimized');
        this.reduceAnimationComplexity();
    }

    disableMemoryOptimizations() {
        document.body.classList.remove('memory-optimized');
    }

    reduceAnimationComplexity() {
        // Reduzir partículas
        if (window.ruantechApp?.particles) {
            window.ruantechApp.particles.stop();
        }

        // Simplificar efeitos visuais
        document.querySelectorAll('.connection-line').forEach(line => {
            line.style.display = 'none';
        });
    }

    /* ========================================
       MÉTODOS PÚBLICOS PARA CONTROLE EXTERNO
    ======================================== */
    forceHighPerformance() {
        this.animationQuality = 'high';
        document.body.classList.add('force-high-performance');
        this.enableAllAnimations();
    }

    forceLowPerformance() {
        this.animationQuality = 'low';
        document.body.classList.add('force-low-performance');
        this.setMinimalAnimations();
    }

    resetPerformanceMode() {
        document.body.classList.remove('force-high-performance', 'force-low-performance');
        this.adjustAnimationQuality();
    }

    getCurrentStats() {
        return {
            fps: this.fps,
            velocity: this.currentVelocity,
            quality: this.animationQuality,
            activeAnimations: document.querySelectorAll('[style*="animation-play-state: running"]').length
        };
    }
}

/* ========================================
   SISTEMA DE THROTTLING AVANÇADO
======================================== */
class AdvancedThrottleManager {
    constructor() {
        this.throttleQueues = new Map();
        this.maxConcurrentAnimations = 5;
        this.animationQueue = [];
        this.activeAnimations = 0;
    }

    throttleFunction(func, delay, key = 'default') {
        if (this.throttleQueues.has(key)) {
            clearTimeout(this.throttleQueues.get(key));
        }

        const timeoutId = setTimeout(() => {
            func();
            this.throttleQueues.delete(key);
        }, delay);

        this.throttleQueues.set(key, timeoutId);
    }

    queueAnimation(animationFunc, priority = 0) {
        if (this.activeAnimations < this.maxConcurrentAnimations) {
            this.executeAnimation(animationFunc);
        } else {
            this.animationQueue.push({ func: animationFunc, priority });
            this.animationQueue.sort((a, b) => b.priority - a.priority);
        }
    }

    executeAnimation(animationFunc) {
        this.activeAnimations++;

        const cleanup = () => {
            this.activeAnimations--;
            this.processQueue();
        };

        animationFunc(cleanup);
    }

    processQueue() {
        if (this.animationQueue.length > 0 && this.activeAnimations < this.maxConcurrentAnimations) {
            const next = this.animationQueue.shift();
            this.executeAnimation(next.func);
        }
    }
}

/* ========================================
   INICIALIZAÇÃO E INTEGRAÇÃO
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistemas de otimização
    window.optimizedAnimationController = new OptimizedAnimationController();
    window.throttleManager = new AdvancedThrottleManager();

    // Integrar com aplicação principal
    if (window.ruantechApp) {
        window.ruantechApp.animationController = window.optimizedAnimationController;
        window.ruantechApp.throttleManager = window.throttleManager;
    }

    console.log('✅ Sistema de animação otimizada integrado com sucesso');

    // Debug panel (remover em produção)
    if (window.location.hostname === 'localhost') {
        setInterval(() => {
            const stats = window.optimizedAnimationController.getCurrentStats();
            console.log('Performance Stats:', stats);
        }, 5000);
    }
});
