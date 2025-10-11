/**
 * Blog Windows - Script Principal
 * Funcionalidades: Menu Mobile, Scroll Suave, Botão Voltar ao Topo, Lazy Loading
 */

// ===================================
// Variáveis Globais
// ===================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTopButton = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-menu a');

// ===================================
// Menu Mobile
// ===================================

/**
 * Toggle do menu mobile
 */
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuToggle.setAttribute(
        'aria-expanded',
        navMenu.classList.contains('active')
    );
    
    // Animação do ícone hambúrguer
    mobileMenuToggle.classList.toggle('active');
}

/**
 * Fecha o menu mobile ao clicar em um link
 */
function closeMobileMenu() {
    if (window.innerWidth <= 768) {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
    }
}

// Event Listeners para o menu mobile
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Fecha o menu ao clicar fora dele
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.main-nav')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.classList.remove('active');
        }
    }
});

// ===================================
// Botão Voltar ao Topo
// ===================================

/**
 * Mostra/esconde o botão de voltar ao topo baseado no scroll
 */
function handleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

/**
 * Scroll suave para o topo da página
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event Listeners para o botão voltar ao topo
if (backToTopButton) {
    window.addEventListener('scroll', handleBackToTop);
    backToTopButton.addEventListener('click', scrollToTop);
}

// ===================================
// Scroll Suave para Âncoras
// ===================================

/**
 * Implementa scroll suave para todos os links de âncora
 */
function smoothScrollToAnchor(e) {
    const href = this.getAttribute('href');
    
    // Verifica se é um link de âncora interno
    if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Atualiza a URL sem recarregar a página
            history.pushState(null, null, href);
        }
    }
}

// Aplica scroll suave a todos os links de âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', smoothScrollToAnchor);
});

// ===================================
// Lazy Loading de Imagens
// ===================================

/**
 * Implementa lazy loading para imagens
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Verifica se o navegador suporta Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Adiciona classe para animação de fade-in
                    img.classList.add('loaded');
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores que não suportam Intersection Observer
        images.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// Inicializa lazy loading quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ===================================
// Highlight do Menu de Navegação
// ===================================

/**
 * Destaca o item do menu correspondente à seção visível
 */
function highlightActiveSection() {
    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-menu a, .quick-links a');
    
    let currentSection = '';
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        
        if (href && href.substring(1) === currentSection) {
            item.classList.add('active');
        }
    });
}

// Event listener para scroll
window.addEventListener('scroll', highlightActiveSection);

// ===================================
// Animação de Entrada dos Elementos
// ===================================

/**
 * Adiciona animação de fade-in aos elementos quando entram na viewport
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.content-section, .alert, .info-box, .step-by-step');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => observer.observe(element));
    }
}

// Inicializa animações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', animateOnScroll);

// ===================================
// Copiar Código para Área de Transferência
// ===================================

/**
 * Adiciona funcionalidade de copiar para blocos de código (se houver)
 */
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const copyButton = document.createElement('button');
        
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copiar';
        copyButton.setAttribute('aria-label', 'Copiar código');
        
        copyButton.addEventListener('click', () => {
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = 'Copiado!';
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.textContent = 'Copiar';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
            });
        });
        
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });
}

// Inicializa botões de copiar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', addCopyButtons);

// ===================================
// Modo de Leitura (Opcional)
// ===================================

/**
 * Ajusta o tamanho da fonte baseado na preferência do usuário
 */
function initializeFontSizeControl() {
    const savedFontSize = localStorage.getItem('fontSize');
    
    if (savedFontSize) {
        document.documentElement.style.fontSize = savedFontSize;
    }
}

// Inicializa controle de tamanho de fonte
document.addEventListener('DOMContentLoaded', initializeFontSizeControl);

// ===================================
// Tempo de Leitura Estimado
// ===================================

/**
 * Calcula e exibe o tempo estimado de leitura
 */
function calculateReadingTime() {
    const article = document.querySelector('.main-content');
    
    if (article) {
        const text = article.textContent;
        const wordsPerMinute = 200; // Média de palavras por minuto
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);
        
        // Cria elemento para exibir o tempo de leitura
        const readingTimeElement = document.createElement('div');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `<span>⏱️ Tempo de leitura: ${readingTime} min</span>`;
        
        // Insere no início do artigo
        const firstSection = document.querySelector('.content-section');
        if (firstSection) {
            firstSection.insertBefore(readingTimeElement, firstSection.firstChild);
        }
    }
}

// Calcula tempo de leitura quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', calculateReadingTime);

// ===================================
// Barra de Progresso de Leitura
// ===================================

/**
 * Cria e atualiza uma barra de progresso de leitura
 */
function createReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    
    document.body.insertBefore(progressBar, document.body.firstChild);
    
    const progressFill = document.querySelector('.reading-progress-fill');
    
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();
}

// Cria barra de progresso quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', createReadingProgressBar);

// ===================================
// Adicionar Estilos Dinâmicos
// ===================================

/**
 * Adiciona estilos CSS dinâmicos para funcionalidades JavaScript
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Barra de Progresso de Leitura */
        .reading-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }
        
        .reading-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #0078d4, #50a0e0);
            width: 0%;
            transition: width 0.2s ease;
        }
        
        /* Tempo de Leitura */
        .reading-time {
            display: inline-block;
            background-color: #f0f8ff;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            color: #0078d4;
            font-weight: 500;
        }
        
        /* Botão de Copiar Código */
        .copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 0.5rem 1rem;
            background-color: #0078d4;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .copy-button:hover {
            background-color: #005a9e;
        }
        
        .copy-button.copied {
            background-color: #27ae60;
        }
        
        /* Animação de Fade-in para Imagens */
        img[loading="lazy"] {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        img[loading="lazy"].loaded {
            opacity: 1;
        }
        
        /* Link Ativo no Menu */
        .nav-menu a.active,
        .quick-links a.active {
            color: #0078d4;
            font-weight: 600;
        }
        
        /* Animação do Menu Mobile */
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    `;
    
    document.head.appendChild(style);
}

// Adiciona estilos dinâmicos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', addDynamicStyles);

// ===================================
// Performance: Debounce para Scroll
// ===================================

/**
 * Função debounce para otimizar eventos de scroll
 */
function debounce(func, wait = 10) {
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

// Aplica debounce aos eventos de scroll
const debouncedBackToTop = debounce(handleBackToTop, 10);
const debouncedHighlight = debounce(highlightActiveSection, 10);

window.removeEventListener('scroll', handleBackToTop);
window.removeEventListener('scroll', highlightActiveSection);

window.addEventListener('scroll', debouncedBackToTop);
window.addEventListener('scroll', debouncedHighlight);

// ===================================
// Acessibilidade: Navegação por Teclado
// ===================================

/**
 * Melhora a navegação por teclado
 */
function enhanceKeyboardNavigation() {
    // Permite fechar o menu mobile com a tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Trap focus no menu mobile quando aberto
    const focusableElements = navMenu.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    navMenu.addEventListener('keydown', (e) => {
        if (!navMenu.classList.contains('active')) return;
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Inicializa melhorias de acessibilidade
document.addEventListener('DOMContentLoaded', enhanceKeyboardNavigation);

// ===================================
// Analytics (Opcional)
// ===================================

/**
 * Rastreia cliques em links externos
 */
function trackExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            console.log('Link externo clicado:', href);
            
            // Aqui você pode adicionar código para enviar eventos para Google Analytics
            // Exemplo: gtag('event', 'click', { 'event_category': 'external_link', 'event_label': href });
        });
    });
}

// Inicializa rastreamento de links externos
document.addEventListener('DOMContentLoaded', trackExternalLinks);

// ===================================
// Inicialização Final
// ===================================

console.log('Blog Windows - Script carregado com sucesso!');

