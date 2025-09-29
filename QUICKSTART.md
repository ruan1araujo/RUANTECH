# 🚀 GUIA RÁPIDO - RUANTECH V2.0

## 🔥 **SETUP EM 5 MINUTOS**

### **1. Pré-requisitos**

- ✅ XAMPP/WAMP ou Apache+PHP 8+
- ✅ MySQL 8.0+ rodando
- ✅ Navegador moderno (Chrome, Firefox, Edge)

### **2. Instalação Express**

```bash
# 1. Baixar/clonar projeto
cd c:\xampp\htdocs\
git clone https://github.com/ruantech/v2.git RUANTECH
# ou extrair ZIP baixado

# 2. Configurar banco (opcional para frontend)
# Abrir phpMyAdmin: http://localhost/phpmyadmin
# Criar database: ruantech_v2

# 3. Configurar ambiente
cd RUANTECH
copy .env.example .env
# Editar .env se necessário

# 4. Testar
# Abrir: http://localhost/RUANTECH
```

### **3. Verificar Funcionalidades**

✅ **Teia Interativa** - Clique nos nós de serviços  
✅ **Temas** - Botão tema no canto superior direito  
✅ **Busca** - Ctrl+K ou clique na lupa  
✅ **Configurações** - Ícone engrenagem  
✅ **PWA** - Menu → "Instalar App"  
✅ **Offline** - Desconecte internet, funciona!

### **4. Estrutura Simplificada**

```
RUANTECH/
├── index.html          ← Aplicação principal
├── assets/
│   ├── css/           ← Estilos
│   └── js/            ← Scripts
├── sw.js              ← Service Worker (PWA)
├── manifest.json      ← PWA Manifest
├── offline.html       ← Página offline
└── README.md          ← Documentação completa
```

## 🎯 **COMO USAR**

### **Interface Principal**

- **Teia Central**: Navegue pelos 28+ serviços
- **Menu Superior**: Busca, configurações, tema
- **FAB Menu**: Ações rápidas (canto inferior direito)
- **Barra Inferior**: Status, notificações, conquistas

### **Demos Interativos**

1. Clique em qualquer serviço da teia
2. Modal abre com demo funcional
3. Teste as funcionalidades
4. Feche com X ou clique fora

### **Sistema de Conquistas**

- Explore serviços para desbloquear
- Toast aparece ao conseguir conquista
- Som de feedback (se áudio ativado)
- Progresso salvo automaticamente

### **Temas Disponíveis**

- 🌙 **Dark Mode** (padrão)
- ☀️ **Light Mode**
- 🔮 **Cyberpunk Mode**

## 🔧 **PERSONALIZAÇÃO RÁPIDA**

### **Modificar Cores**

Edite `assets/css/advanced.css`:

```css
:root {
  --primary: #7c3aed; /* Cor principal */
  --accent: #f59e0b; /* Cor de destaque */
  --bg-primary: #0a0a0a; /* Fundo principal */
}
```

### **Adicionar Serviço**

Edite `index.html`, encontre a seção services e adicione:

```html
<div class="service-node" data-service="novo-servico">
  <div class="service-icon">🆕</div>
  <div class="service-name">Novo Serviço</div>
</div>
```

### **Configurar Analytics**

No arquivo `.env`:

```
ANALYTICS_ENABLED=true
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## ⚡ **COMANDOS ÚTEIS**

### **Desenvolvimento**

```bash
# Limpar cache
del cache\*.* /q

# Verificar logs
type logs\error.log

# Build CSS (se usando Tailwind CLI)
npx tailwindcss -i input.css -o assets/css/tailwind.css --watch

# Servir local com PHP
php -S localhost:8000
```

### **Teste de Performance**

```bash
# Chrome DevTools
# 1. F12 → Lighthouse
# 2. Generate Report
# 3. Verificar scores 90+

# Ou online
# https://pagespeed.web.dev/
```

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **Erro: Service Worker não registra**

```javascript
// Verificar HTTPS ou localhost
if (
  "serviceWorker" in navigator &&
  (location.protocol === "https:" || location.hostname === "localhost")
) {
  // OK para registrar
}
```

### **Erro: Cache não funciona**

```bash
# Limpar cache do navegador
# Chrome: Ctrl+Shift+Del
# Ou F12 → Application → Clear Storage
```

### **Performance baixa**

```javascript
// Reduzir efeitos visuais
localStorage.setItem("ruantech_performance_mode", "true");
location.reload();
```

### **PWA não instala**

- ✅ Verificar HTTPS/localhost
- ✅ Manifest.json válido
- ✅ Service Worker registrado
- ✅ Ícones 192px e 512px existem

## 📱 **TESTE MOBILE**

### **Emular no Desktop**

```bash
# Chrome DevTools
# 1. F12
# 2. Ctrl+Shift+M (toggle device toolbar)
# 3. Selecionar dispositivo
# 4. Testar gestos touch
```

### **Teste Real**

1. Conectar dispositivo via USB
2. Chrome → chrome://inspect
3. Ou usar ngrok para túnel público

## 🚀 **DEPLOY PRODUÇÃO**

### **Checklist Pre-Deploy**

- ✅ `.env` configurado corretamente
- ✅ Database schema aplicado
- ✅ HTTPS configurado
- ✅ Compressão gzip habilitada
- ✅ Headers de cache configurados
- ✅ Analytics configurado

### **Apache Virtual Host**

```apache
<VirtualHost *:443>
    ServerName ruantech.com
    DocumentRoot /var/www/ruantech

    # PWA Headers
    Header set Service-Worker-Allowed /

    # Cache Headers
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
    </IfModule>

    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
</VirtualHost>
```

## 📊 **MONITORAMENTO**

### **Métricas Importantes**

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **PWA Score**: 90+/100
- **Performance**: 90+/100
- **Accessibility**: 95+/100

### **Ferramentas Recomendadas**

- Google PageSpeed Insights
- Chrome DevTools Lighthouse
- WebPageTest.org
- GTmetrix

## 💡 **PRÓXIMOS PASSOS**

1. **Personalizar** cores e temas
2. **Adicionar** seus próprios serviços/demos
3. **Configurar** analytics e métricas
4. **Implementar** backend PHP/MySQL
5. **Deploy** em produção com HTTPS
6. **Monitorar** performance e uso

---

🎯 **Objetivo**: Ter uma plataforma web moderna, rápida e interativa funcionando em minutos!

📝 **Dúvidas?** Consulte o README.md completo ou abra uma issue no GitHub.

🚀 **Vamos construir algo incrível juntos!**
