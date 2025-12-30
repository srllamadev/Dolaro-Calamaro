// ===================================
// DÓLARO CALAMARO - INTERACTIVIDAD
// ===================================

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCopyAddress();
    initSendButton();
});

// ===================================
// SISTEMA DE NAVEGACIÓN
// ===================================
function initNavigation() {
    const views = document.querySelectorAll('.view');
    const navItems = document.querySelectorAll('.nav-item');
    const actionButtons = document.querySelectorAll('[data-view]');

    // Función para cambiar de vista
    function switchView(targetViewId) {
        // Remover active de todas las vistas
        views.forEach(view => view.classList.remove('active'));
        
        // Activar la vista objetivo
        const targetView = document.getElementById(`view-${targetViewId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Actualizar navegación inferior
        navItems.forEach(item => {
            if (item.dataset.view === targetViewId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Scroll al inicio de la vista
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Event listeners para navegación inferior
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetView = item.dataset.view;
            switchView(targetView);
        });
    });

    // Event listeners para botones de acción y botones "atrás"
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.dataset.view;
            switchView(targetView);
        });
    });
}

// ===================================
// FUNCIONALIDAD DE COPIAR DIRECCIÓN
// ===================================
function initCopyAddress() {
    const copyButton = document.getElementById('copy-address-btn');
    const addressText = document.getElementById('public-address');
    const feedback = document.getElementById('copy-feedback');

    if (copyButton && addressText) {
        copyButton.addEventListener('click', async () => {
            try {
                // Copiar al portapapeles
                await navigator.clipboard.writeText(addressText.textContent);
                
                // Mostrar feedback
                feedback.classList.add('show');
                
                // Cambiar ícono temporalmente
                const icon = copyButton.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'ph-fill ph-check';
                
                // Resetear después de 2 segundos
                setTimeout(() => {
                    feedback.classList.remove('show');
                    icon.className = originalClass;
                }, 2000);

            } catch (err) {
                console.error('Error al copiar:', err);
                // Fallback para navegadores sin soporte de clipboard API
                fallbackCopyText(addressText.textContent);
                feedback.classList.add('show');
                setTimeout(() => feedback.classList.remove('show'), 2000);
            }
        });
    }
}

// Función de fallback para copiar texto
function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// ===================================
// FUNCIONALIDAD BOTÓN DE ENVÍO
// ===================================
function initSendButton() {
    const sendButton = document.getElementById('send-button');
    const addressInput = document.getElementById('recipient-address');
    const amountInput = document.getElementById('amount');

    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const address = addressInput.value.trim();
            const amount = parseFloat(amountInput.value);

            // Validaciones simples
            if (!address) {
                showNotification('Por favor ingresa una dirección válida', 'error');
                return;
            }

            if (!amount || amount <= 0) {
                showNotification('Por favor ingresa un monto válido', 'error');
                return;
            }

            if (amount > 150) {
                showNotification('Saldo insuficiente', 'error');
                return;
            }

            // Simular envío exitoso
            showNotification(`Enviando ${amount} USDC...`, 'success');
            
            // Limpiar formulario después de 1 segundo
            setTimeout(() => {
                addressInput.value = '';
                amountInput.value = '';
                showNotification('¡Transacción completada!', 'success');
            }, 1000);
        });

        // Actualizar valor en USD en tiempo real
        if (amountInput) {
            const usdHint = amountInput.parentElement.nextElementSibling;
            amountInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value) || 0;
                usdHint.textContent = `≈ $${value.toFixed(2)} USD`;
            });
        }
    }
}

// ===================================
// SISTEMA DE NOTIFICACIONES
// ===================================
function showNotification(message, type = 'info') {
    // Remover notificación existente si hay
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: type === 'error' ? '#F5A5A8' : '#A8D5BA',
        color: '#5D4E52',
        padding: '12px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: '1000',
        fontWeight: '500',
        fontSize: '0.9rem',
        maxWidth: '90%',
        textAlign: 'center',
        animation: 'slideDown 0.3s ease'
    });

    // Agregar al DOM
    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar animaciones de notificación al head
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// EASTER EGG: Sakura Particles
// ===================================
// Efecto visual opcional al hacer triple click en el logo
let clickCount = 0;
let clickTimer = null;

const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        }
        
        if (clickCount === 3) {
            clearTimeout(clickTimer);
            clickCount = 0;
            createSakuraParticles();
        }
    });
}

function createSakuraParticles() {
    const colors = ['#F7C5D0', '#E0A8B5', '#FFF9FB'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const left = Math.random() * window.innerWidth;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        Object.assign(particle.style, {
            position: 'fixed',
            left: left + 'px',
            top: '-20px',
            width: size + 'px',
            height: size + 'px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: '50%',
            opacity: '0.7',
            pointerEvents: 'none',
            zIndex: '9999',
            animation: `fall ${duration}s linear ${delay}s forwards`
        });
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), (duration + delay) * 1000);
    }
}

// Animación de caída para las partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes fall {
        to {
            top: 100vh;
            transform: translateX(${Math.random() * 100 - 50}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);
