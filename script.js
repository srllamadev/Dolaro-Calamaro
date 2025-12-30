// ===================================
// DÓLARO CALAMARO - WALLET CRIPTO
// ===================================

(function() {
    'use strict';

    // ===================================
    // ESTADO DE LA APLICACIÓN
    // ===================================
    const appState = {
        offlineMode: false,
        currentView: 'home',
        keypadValue: '0.00',
        selectedAsset: 'all'
    };

    // ===================================
    // DATOS DE LOS 5 ACTIVOS
    // ===================================
    const assetsData = [
        {
            id: 'usdc',
            name: 'USDC',
            fullName: 'USD Coin',
            cryptoAmount: 1240.50,
            usdValue: 1240.50,
            change: 2.1,
            icon: 'fa-dollar-sign',
            featured: true
        },
        {
            id: 'xlm',
            name: 'XLM',
            fullName: 'Stellar Lumens',
            cryptoAmount: 850.75,
            usdValue: 85.08,
            change: 1.5,
            icon: 'fa-star',
            featured: false
        },
        {
            id: 'aqua',
            name: 'AQUA',
            fullName: 'Aquarius',
            cryptoAmount: 2500.50,
            usdValue: 125.03,
            change: 3.2,
            icon: 'fa-water',
            featured: false
        },
        {
            id: 'ybtc',
            name: 'yBTC',
            fullName: 'Bitcoin anclado en Stellar',
            cryptoAmount: 0.0025,
            usdValue: 150.75,
            change: -0.8,
            icon: 'fa-bitcoin-sign',
            featured: false
        },
        {
            id: 'yeth',
            name: 'yETH',
            fullName: 'Ethereum anclado en Stellar',
            cryptoAmount: 0.12,
            usdValue: 240.60,
            change: 1.1,
            icon: 'fa-ethereum',
            featured: false
        }
    ];

    // ===================================
    // ELEMENTOS DOM
    // ===================================
    const elements = {
        offlineToggle: null,
        onlineMode: null,
        offlineMode: null,
        portfolioList: null,
        totalBalance: null,
        dailyChange: null,
        fab: null,
        statusDot: null,
        statusText: null,
        keypadDisplay: null,
        navItems: null,
        assetDropdown: null
    };

    // ===================================
    // INICIALIZACIÓN
    // ===================================
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🌸 Dólaro Calamaro - Inicializando...');
        
        initElements();
        renderPortfolio();
        updateTotalBalance();
        initOfflineToggle();
        initNavigation();
        initKeypad();
        initAssetSelector();
        startPriceUpdates();
        
        console.log('✅ Aplicación lista');
    });

    // ===================================
    // INICIALIZAR ELEMENTOS DOM
    // ===================================
    function initElements() {
        elements.offlineToggle = document.getElementById('offline-mode-toggle');
        elements.onlineMode = document.getElementById('online-mode');
        elements.offlineMode = document.getElementById('offline-mode');
        elements.portfolioList = document.getElementById('portfolio-list');
        elements.totalBalance = document.getElementById('total-balance');
        elements.dailyChange = document.getElementById('daily-change');
        elements.fab = document.getElementById('fab-offline');
        elements.statusDot = document.querySelector('.status-dot');
        elements.statusText = document.querySelector('.status-text');
        elements.keypadDisplay = document.getElementById('keypad-display');
        elements.navItems = document.querySelectorAll('.nav-item');
        elements.assetDropdown = document.getElementById('asset-dropdown');
    }

    // ===================================
    // RENDERIZAR PORTFOLIO
    // ===================================
    function renderPortfolio() {
        if (!elements.portfolioList) return;

        elements.portfolioList.innerHTML = '';

        // Filtrar activos según selección
        const assetsToShow = appState.selectedAsset === 'all' 
            ? assetsData 
            : assetsData.filter(asset => asset.id === appState.selectedAsset);

        assetsToShow.forEach(asset => {
            const assetCard = createAssetCard(asset);
            elements.portfolioList.appendChild(assetCard);
        });

        const assetText = appState.selectedAsset === 'all' 
            ? `${assetsData.length} activos` 
            : `1 activo (${appState.selectedAsset.toUpperCase()})`;
        console.log('📊 Portfolio renderizado con', assetText);
    }

    // ===================================
    // CREAR TARJETA DE ACTIVO
    // ===================================
    function createAssetCard(asset) {
        const card = document.createElement('div');
        card.className = `asset-item ${asset.featured ? 'featured' : ''}`;
        
        const changeClass = asset.change >= 0 ? 'positive' : 'negative';
        const changeIcon = asset.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        const changeSymbol = asset.change >= 0 ? '+' : '';

        card.innerHTML = `
            <div class="asset-icon-large ${asset.id}">
                <i class="fa-solid ${asset.icon}"></i>
            </div>
            <div class="asset-info">
                <div class="asset-name">${asset.name}</div>
                <div class="asset-fullname">${asset.fullName}</div>
            </div>
            <div class="asset-values">
                <div class="asset-crypto">${formatCrypto(asset.cryptoAmount, asset.name)}</div>
                <div class="asset-usd">$${asset.usdValue.toFixed(2)}</div>
                <div class="asset-change ${changeClass}">
                    <i class="fa-solid ${changeIcon}"></i>
                    <span>${changeSymbol}${asset.change.toFixed(1)}%</span>
                </div>
            </div>
        `;

        return card;
    }

    // ===================================
    // FORMATEAR CANTIDAD DE CRYPTO
    // ===================================
    function formatCrypto(amount, symbol) {
        if (amount < 1) {
            return `${amount.toFixed(4)} ${symbol}`;
        } else if (amount < 100) {
            return `${amount.toFixed(2)} ${symbol}`;
        } else {
            return `${amount.toFixed(2)} ${symbol}`;
        }
    }

    // ===================================
    // ACTUALIZAR BALANCE TOTAL
    // ===================================
    function updateTotalBalance() {
        if (!elements.totalBalance || !elements.dailyChange) return;

        const balanceCard = document.querySelector('.balance-card');
        const balanceLabel = document.querySelector('.balance-label');

        if (appState.selectedAsset === 'all') {
            // Mostrar balance total de todos los activos
            const total = assetsData.reduce((sum, asset) => sum + asset.usdValue, 0);
            const avgChange = assetsData.reduce((sum, asset) => sum + asset.change, 0) / assetsData.length;

            if (balanceLabel) {
                balanceLabel.innerHTML = 'Balance Total';
            }
            
            elements.totalBalance.innerHTML = `$${total.toFixed(2)}`;

            const changeClass = avgChange >= 0 ? 'positive' : 'negative';
            const changeIcon = avgChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            const changeSymbol = avgChange >= 0 ? '+' : '';

            elements.dailyChange.innerHTML = `
                <i class="fa-solid ${changeIcon}"></i>
                <span>${changeSymbol}${avgChange.toFixed(1)}% hoy</span>
            `;
            elements.dailyChange.className = `balance-change ${changeClass}`;

            console.log('💰 Balance total actualizado: $' + total.toFixed(2));
        } else {
            // Mostrar balance del activo individual seleccionado (estilo MetaMask)
            const selectedAsset = assetsData.find(asset => asset.id === appState.selectedAsset);
            
            if (selectedAsset) {
                // Agregar ícono del activo al label
                if (balanceLabel) {
                    balanceLabel.innerHTML = `
                        <div class="balance-asset-icon ${selectedAsset.id}">
                            <i class="fa-solid ${selectedAsset.icon}"></i>
                        </div>
                        <span>${selectedAsset.fullName}</span>
                    `;
                }
                
                // Mostrar cantidad en crypto y valor USD
                elements.totalBalance.innerHTML = `
                    <span class="balance-crypto-amount">${formatCrypto(selectedAsset.cryptoAmount, selectedAsset.name)}</span>
                    <span class="balance-usd-sub">$${selectedAsset.usdValue.toFixed(2)} USD</span>
                `;

                const changeClass = selectedAsset.change >= 0 ? 'positive' : 'negative';
                const changeIcon = selectedAsset.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                const changeSymbol = selectedAsset.change >= 0 ? '+' : '';

                elements.dailyChange.innerHTML = `
                    <i class="fa-solid ${changeIcon}"></i>
                    <span>${changeSymbol}${selectedAsset.change.toFixed(1)}% hoy</span>
                `;
                elements.dailyChange.className = `balance-change ${changeClass}`;

                console.log(`💎 Balance de ${selectedAsset.name} actualizado: ${selectedAsset.cryptoAmount} ($${selectedAsset.usdValue.toFixed(2)} USD)`);
            }
        }
        
        // Animación de actualización
        if (balanceCard) {
            balanceCard.style.animation = 'none';
            setTimeout(() => {
                balanceCard.style.animation = 'balanceUpdate 0.5s ease';
            }, 10);
        }
    }

    // ===================================
    // TOGGLE MODO OFFLINE
    // ===================================
    function initOfflineToggle() {
        if (!elements.offlineToggle) return;

        elements.offlineToggle.addEventListener('change', (e) => {
            appState.offlineMode = e.target.checked;
            toggleOfflineMode(appState.offlineMode);
        });
    }

    function toggleOfflineMode(isOffline) {
        console.log('🔄 Cambiando a modo:', isOffline ? 'OFFLINE' : 'ONLINE');

        // Cambiar vistas
        if (isOffline) {
            elements.onlineMode.classList.remove('active');
            elements.offlineMode.classList.add('active');
            elements.fab.classList.add('visible');
            document.body.classList.add('offline-active');
            
            // Cambiar status
            if (elements.statusDot) {
                elements.statusDot.classList.remove('online');
                elements.statusDot.classList.add('offline');
            }
            if (elements.statusText) {
                elements.statusText.textContent = 'OFFLINE';
            }
        } else {
            elements.onlineMode.classList.add('active');
            elements.offlineMode.classList.remove('active');
            elements.fab.classList.remove('visible');
            document.body.classList.remove('offline-active');
            
            // Cambiar status
            if (elements.statusDot) {
                elements.statusDot.classList.remove('offline');
                elements.statusDot.classList.add('online');
            }
            if (elements.statusText) {
                elements.statusText.textContent = 'USSD Ready';
            }
        }

        // Actualizar navegación
        updateNavigation(isOffline ? 'offline' : 'home');
    }

    // ===================================
    // SELECTOR DE ACTIVOS
    // ===================================
    function initAssetSelector() {
        if (!elements.assetDropdown) return;

        elements.assetDropdown.addEventListener('change', (e) => {
            appState.selectedAsset = e.target.value;
            renderPortfolio();
            updateTotalBalance();
            console.log('💎 Activo seleccionado:', appState.selectedAsset);
        });
    }

    // ===================================
    // NAVEGACIÓN
    // ===================================
    function initNavigation() {
        elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                // Si es el botón offline, activar modo offline
                if (view === 'offline') {
                    if (!appState.offlineMode) {
                        elements.offlineToggle.checked = true;
                        toggleOfflineMode(true);
                    }
                } else {
                    // Para otros botones, si estamos en modo offline, desactivarlo
                    if (appState.offlineMode && view !== 'offline') {
                        elements.offlineToggle.checked = false;
                        toggleOfflineMode(false);
                    }
                    updateNavigation(view);
                }
            });
        });

        // FAB click
        if (elements.fab) {
            elements.fab.addEventListener('click', () => {
                console.log('⚡ FAB: Iniciar pago sin internet');
                alert('Funcionalidad de pago offline - Demo');
            });
        }
    }

    function updateNavigation(activeView) {
        elements.navItems.forEach(item => {
            if (item.dataset.view === activeView) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        appState.currentView = activeView;
        console.log('📍 Vista actual:', activeView);
    }

    // ===================================
    // TECLADO NUMÉRICO
    // ===================================
    function initKeypad() {
        const keyNumbers = document.querySelectorAll('.key-number, .key-special');
        const keyDelete = document.querySelector('.key-delete');

        keyNumbers.forEach(key => {
            key.addEventListener('click', () => {
                const value = key.dataset.value;
                handleKeypadInput(value);
            });
        });

        if (keyDelete) {
            keyDelete.addEventListener('click', () => {
                handleKeypadDelete();
            });
        }
    }

    function handleKeypadInput(value) {
        // Si el display es 0.00, reemplazar
        if (appState.keypadValue === '0.00') {
            if (value === '.') {
                appState.keypadValue = '0.';
            } else {
                appState.keypadValue = value;
            }
        } else {
            // Validar que solo haya un punto decimal
            if (value === '.' && appState.keypadValue.includes('.')) {
                return;
            }
            
            // Limitar a 10 caracteres
            if (appState.keypadValue.length >= 10) {
                return;
            }
            
            appState.keypadValue += value;
        }

        updateKeypadDisplay();
        console.log('🔢 Keypad:', appState.keypadValue);
    }

    function handleKeypadDelete() {
        if (appState.keypadValue.length <= 1) {
            appState.keypadValue = '0.00';
        } else {
            appState.keypadValue = appState.keypadValue.slice(0, -1);
        }

        updateKeypadDisplay();
        console.log('⌫ Keypad borrado:', appState.keypadValue);
    }

    function updateKeypadDisplay() {
        if (elements.keypadDisplay) {
            elements.keypadDisplay.textContent = appState.keypadValue;
        }
    }

    // ===================================
    // SIMULACIÓN DE ACTUALIZACIÓN DE PRECIOS
    // ===================================
    function startPriceUpdates() {
        setInterval(() => {
            if (!appState.offlineMode) {
                updatePrices();
            }
        }, 10000); // Cada 10 segundos
    }

    function updatePrices() {
        assetsData.forEach(asset => {
            // Cambio aleatorio pequeño (-1% a +1%)
            const randomChange = (Math.random() - 0.5) * 0.02;
            asset.usdValue *= (1 + randomChange);
            
            // Actualizar cambio porcentual con simulación
            const randomPercent = (Math.random() - 0.5) * 0.5;
            asset.change += randomPercent;
            
            // Limitar el cambio entre -10% y +10%
            if (asset.change > 10) asset.change = 10;
            if (asset.change < -10) asset.change = -10;
        });

        renderPortfolio();
        updateTotalBalance();
        console.log('📈 Precios actualizados');
    }

    // ===================================
    // EASTER EGG: Sakura Animation
    // ===================================
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    let clickTimer = null;

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
                console.log('🌸 Easter egg activado!');
            }
        });
    }

    function createSakuraParticles() {
        const colors = ['#F7C5D0', '#E0A8B5', '#FFF9FB'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const size = Math.random() * 12 + 6;
                const left = Math.random() * window.innerWidth;
                const duration = Math.random() * 4 + 3;
                const delay = Math.random() * 0.3;
                
                Object.assign(particle.style, {
                    position: 'fixed',
                    left: left + 'px',
                    top: '-30px',
                    width: size + 'px',
                    height: size + 'px',
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    borderRadius: '50%',
                    opacity: '0.8',
                    pointerEvents: 'none',
                    zIndex: '9999',
                    animation: `sakuraFall ${duration}s linear ${delay}s forwards`
                });
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), (duration + delay) * 1000);
            }, i * 100);
        }
    }

    // Agregar animación CSS para partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sakuraFall {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0.8;
            }
            100% {
                transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // TELEMETRÍA Y DEBUG
    // ===================================
    console.log('%c🌸 Dólaro Calamaro Wallet', 'font-size: 20px; font-weight: bold; color: #F7C5D0;');
    console.log('%cVersión: 2.0 - Modo Offline/USSD', 'font-size: 12px; color: #9E8C91;');
    console.log('%c5 Activos: USDC, XLM, AQUA, yBTC, yETH', 'font-size: 12px; color: #5D4E52;');

})();
