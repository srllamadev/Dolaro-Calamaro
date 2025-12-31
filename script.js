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
        selectedAsset: 'all',
        sendAsset: 'usdc'
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
        assetDropdown: null,
        sendView: null,
        receiveView: null,
        marketView: null,
        settingsView: null,
        sendAssetDropdown: null,
        sendAddress: null,
        sendAmount: null,
        sendAvailableAmount: null,
        sendAmountUsd: null,
        openSendBtn: null,
        openReceiveBtn: null,
        confirmSendBtn: null,
        scanQrBtn: null,
        maxButton: null,
        backButtons: null,
        copyAddressBtn: null,
        receiveAddress: null,
        priceChart: null
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
        initSendForm();
        initReceiveForm();
        initMarketView();
        initSettingsView();
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
        elements.sendView = document.getElementById('view-send');
        elements.receiveView = document.getElementById('view-receive');
        elements.marketView = document.getElementById('view-market');
        elements.settingsView = document.getElementById('view-settings');
        elements.sendAssetDropdown = document.getElementById('send-asset-dropdown');
        elements.sendAddress = document.getElementById('send-address');
        elements.sendAmount = document.getElementById('send-amount');
        elements.sendAvailableAmount = document.getElementById('send-available-amount');
        elements.sendAmountUsd = document.getElementById('send-amount-usd');
        elements.openSendBtn = document.getElementById('open-send-btn');
        elements.openReceiveBtn = document.getElementById('open-receive-btn');
        elements.confirmSendBtn = document.getElementById('confirm-send-btn');
        elements.scanQrBtn = document.getElementById('scan-qr-btn');
        elements.maxButton = document.getElementById('max-button');
        elements.backButtons = document.querySelectorAll('[data-action="back-home"]');
        elements.copyAddressBtn = document.getElementById('copy-address-btn');
        elements.receiveAddress = document.getElementById('receive-address');
        elements.priceChart = document.getElementById('price-chart');
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
    // FORMULARIO DE ENVÍO
    // ===================================
    function initSendForm() {
        if (!elements.openSendBtn) return;

        // Abrir vista de enviar
        elements.openSendBtn.addEventListener('click', () => {
            openSendView();
        });

        // Botones de volver
        elements.backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                closeSendView();
                closeReceiveView();
            });
        });

        // Cambio de activo a enviar
        if (elements.sendAssetDropdown) {
            elements.sendAssetDropdown.addEventListener('change', (e) => {
                appState.sendAsset = e.target.value;
                updateSendAvailableBalance();
                updateSendAmountUsd();
                console.log('📤 Activo a enviar:', appState.sendAsset);
            });
        }

        // Botón MAX
        if (elements.maxButton) {
            elements.maxButton.addEventListener('click', () => {
                const asset = assetsData.find(a => a.id === appState.sendAsset);
                if (asset && elements.sendAmount) {
                    elements.sendAmount.value = asset.cryptoAmount.toString();
                    updateSendAmountUsd();
                }
            });
        }

        // Actualizar USD al cambiar monto
        if (elements.sendAmount) {
            elements.sendAmount.addEventListener('input', () => {
                updateSendAmountUsd();
            });
        }

        // Escanear QR (simulado)
        if (elements.scanQrBtn) {
            elements.scanQrBtn.addEventListener('click', () => {
                simulateQrScan();
            });
        }

        // Confirmar envío
        if (elements.confirmSendBtn) {
            elements.confirmSendBtn.addEventListener('click', () => {
                processSend();
            });
        }
    }

    function openSendView() {
        // Cerrar otras vistas
        if (elements.receiveView) elements.receiveView.classList.remove('active');
        if (elements.offlineMode) elements.offlineMode.classList.remove('active');
        
        elements.onlineMode.classList.remove('active');
        elements.sendView.classList.add('active');
        updateSendAvailableBalance();
        
        // Actualizar navegación para que no quede ningún botón activo
        elements.navItems.forEach(item => item.classList.remove('active'));
        
        console.log('📤 Abriendo vista de enviar');
    }

    function closeSendView() {
        if (!elements.sendView) return;
        if (elements.sendView.classList.contains('active')) {
            elements.sendView.classList.remove('active');
            if (elements.onlineMode && !appState.offlineMode) {
                elements.onlineMode.classList.add('active');
            }
            // Limpiar formulario
            if (elements.sendAddress) elements.sendAddress.value = '';
            if (elements.sendAmount) elements.sendAmount.value = '';
            
            // Activar botón de inicio
            updateNavigation('home');
            
            console.log('📤 Vista de enviar cerrada');
        }
    }

    function updateSendAvailableBalance() {
        const asset = assetsData.find(a => a.id === appState.sendAsset);
        if (asset && elements.sendAvailableAmount) {
            elements.sendAvailableAmount.textContent = formatCrypto(asset.cryptoAmount, asset.name);
        }
    }

    function updateSendAmountUsd() {
        const asset = assetsData.find(a => a.id === appState.sendAsset);
        if (!asset || !elements.sendAmount || !elements.sendAmountUsd) return;

        const amount = parseFloat(elements.sendAmount.value) || 0;
        const pricePerUnit = asset.usdValue / asset.cryptoAmount;
        const usdValue = amount * pricePerUnit;

        elements.sendAmountUsd.textContent = `≈ $${usdValue.toFixed(2)} USD`;
    }

    function simulateQrScan() {
        const sampleAddresses = [
            'GxB45Kq7mN9pL2Rt8Zy4Wv6Ch3Js1Xz9L',
            'GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMEK',
            'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'
        ];
        const randomAddress = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];
        
        if (elements.sendAddress) {
            elements.sendAddress.value = randomAddress;
            showNotification('✅ Dirección escaneada desde QR', 'success');
            console.log('📷 QR escaneado:', randomAddress);
        }
    }

    function processSend() {
        const asset = assetsData.find(a => a.id === appState.sendAsset);
        const address = elements.sendAddress?.value.trim();
        const amount = parseFloat(elements.sendAmount?.value) || 0;

        // Validaciones
        if (!address) {
            showNotification('❌ Por favor ingresa una dirección válida', 'error');
            return;
        }

        if (address.length < 20) {
            showNotification('❌ La dirección parece incorrecta', 'error');
            return;
        }

        if (!amount || amount <= 0) {
            showNotification('❌ Por favor ingresa un monto válido', 'error');
            return;
        }

        if (!asset) {
            showNotification('❌ Error al seleccionar activo', 'error');
            return;
        }

        if (amount > asset.cryptoAmount) {
            showNotification('❌ Saldo insuficiente', 'error');
            return;
        }

        // Simular envío
        showNotification(`⏳ Enviando ${amount} ${asset.name}...`, 'info');
        
        setTimeout(() => {
            // Restar del balance
            asset.cryptoAmount -= amount;
            asset.usdValue = asset.cryptoAmount * (asset.usdValue / (asset.cryptoAmount + amount));

            showNotification(`✅ ¡Envío exitoso! ${amount} ${asset.name} enviados`, 'success');
            console.log(`💸 Enviado: ${amount} ${asset.name} a ${address.substring(0, 10)}...`);

            // Actualizar UI
            renderPortfolio();
            updateTotalBalance();
            closeSendView();
        }, 1500);
    }

    // ===================================
    // VISTA DE RECIBIR
    // ===================================
    function initReceiveForm() {
        if (!elements.openReceiveBtn) return;

        // Abrir vista de recibir
        elements.openReceiveBtn.addEventListener('click', () => {
            openReceiveView();
        });

        // Copiar dirección
        if (elements.copyAddressBtn && elements.receiveAddress) {
            elements.copyAddressBtn.addEventListener('click', () => {
                copyAddressToClipboard();
            });
        }
    }

    function openReceiveView() {
        // Cerrar otras vistas
        if (elements.sendView) elements.sendView.classList.remove('active');
        if (elements.offlineMode) elements.offlineMode.classList.remove('active');
        
        elements.onlineMode.classList.remove('active');
        elements.receiveView.classList.add('active');
        
        // Actualizar navegación para que no quede ningún botón activo
        elements.navItems.forEach(item => item.classList.remove('active'));
        
        console.log('📥 Abriendo vista de recibir');
    }

    function closeReceiveView() {
        if (!elements.receiveView) return;
        if (elements.receiveView.classList.contains('active')) {
            elements.receiveView.classList.remove('active');
            if (elements.onlineMode && !appState.offlineMode) {
                elements.onlineMode.classList.add('active');
            }
            
            // Activar botón de inicio
            updateNavigation('home');
            
            console.log('📥 Vista de recibir cerrada');
        }
    }

    function copyAddressToClipboard() {
        if (!elements.receiveAddress) return;

        const address = elements.receiveAddress.value;

        // Usar la API del portapapeles moderna
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(address)
                .then(() => {
                    showNotification('✅ Dirección copiada al portapapeles', 'success');
                    
                    // Cambiar el texto del botón temporalmente
                    const copyText = elements.copyAddressBtn.querySelector('.copy-text');
                    if (copyText) {
                        const originalText = copyText.textContent;
                        copyText.textContent = '¡Copiado!';
                        setTimeout(() => {
                            copyText.textContent = originalText;
                        }, 2000);
                    }
                    
                    console.log('📋 Dirección copiada:', address);
                })
                .catch(err => {
                    console.error('Error al copiar:', err);
                    fallbackCopy(address);
                });
        } else {
            fallbackCopy(address);
        }
    }

    function fallbackCopy(text) {
        // Método alternativo para navegadores más antiguos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showNotification('✅ Dirección copiada al portapapeles', 'success');
            console.log('📋 Dirección copiada (fallback):', text);
        } catch (err) {
            showNotification('❌ No se pudo copiar la dirección', 'error');
            console.error('Error al copiar (fallback):', err);
        }
        
        document.body.removeChild(textarea);
    }

    // ===================================
    // SISTEMA DE NOTIFICACIONES
    // ===================================
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#A8D5BA',
            error: '#F5A5A8',
            info: '#A5C9F5'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: colors[type] || colors.info,
            color: '#5D4E52',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            fontWeight: '600',
            fontSize: '0.95rem',
            maxWidth: '90%',
            textAlign: 'center',
            animation: 'slideDown 0.4s ease',
            fontFamily: 'var(--font-secondary)'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
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
                    updateNavigation('offline');
                } else if (view === 'home') {
                    // Volver al inicio
                    if (appState.offlineMode) {
                        elements.offlineToggle.checked = false;
                        toggleOfflineMode(false);
                    }
                    // Cerrar todas las vistas abiertas
                    closeAllViews();
                    elements.onlineMode.classList.add('active');
                    updateNavigation(view);
                } else if (view === 'market') {
                    // Abrir vista de mercado
                    if (appState.offlineMode) {
                        elements.offlineToggle.checked = false;
                        toggleOfflineMode(false);
                    }
                    closeAllViews();
                    elements.marketView.classList.add('active');
                    updateNavigation(view);
                } else if (view === 'settings') {
                    // Abrir vista de ajustes
                    if (appState.offlineMode) {
                        elements.offlineToggle.checked = false;
                        toggleOfflineMode(false);
                    }
                    closeAllViews();
                    elements.settingsView.classList.add('active');
                    updateNavigation(view);
                } else {
                    // Para otros botones
                    if (appState.offlineMode) {
                        elements.offlineToggle.checked = false;
                        toggleOfflineMode(false);
                    }
                    closeAllViews();
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

    function closeAllViews() {
        // Cerrar todas las vistas
        if (elements.onlineMode) elements.onlineMode.classList.remove('active');
        if (elements.offlineMode) elements.offlineMode.classList.remove('active');
        if (elements.sendView) elements.sendView.classList.remove('active');
        if (elements.receiveView) elements.receiveView.classList.remove('active');
        if (elements.marketView) elements.marketView.classList.remove('active');
        if (elements.settingsView) elements.settingsView.classList.remove('active');
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
    // VISTA DE MERCADO
    // ===================================
    let priceChartInstance = null;

    function initMarketView() {
        renderMarketAssets();
        initPriceChart();
        initTimeframeButtons();
        initRefreshButton();
    }

    function renderMarketAssets() {
        const marketAssetsList = document.getElementById('market-assets-list');
        if (!marketAssetsList) return;

        const marketAssets = [
            { name: 'Bitcoin', symbol: 'BTC', price: 98250.43, change: 2.5, icon: 'fa-bitcoin-sign' },
            { name: 'Ethereum', symbol: 'ETH', price: 3621.87, change: 1.8, icon: 'fa-ethereum' },
            { name: 'Stellar', symbol: 'XLM', price: 0.42, change: 3.2, icon: 'fa-star' },
            { name: 'USD Coin', symbol: 'USDC', price: 1.00, change: 0.1, icon: 'fa-dollar-sign' },
            { name: 'Cardano', symbol: 'ADA', price: 1.05, change: -1.3, icon: 'fa-coins' },
            { name: 'Solana', symbol: 'SOL', price: 189.34, change: 4.7, icon: 'fa-sun' }
        ];

        marketAssetsList.innerHTML = marketAssets.map(asset => {
            const changeClass = asset.change >= 0 ? 'positive' : 'negative';
            const changeIcon = asset.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            const changeSymbol = asset.change >= 0 ? '+' : '';

            return `
                <div class="market-asset-item">
                    <div class="market-asset-icon">
                        <i class="fa-solid ${asset.icon}"></i>
                    </div>
                    <div class="market-asset-info">
                        <span class="market-asset-name">${asset.name}</span>
                        <span class="market-asset-symbol">${asset.symbol}</span>
                    </div>
                    <div class="market-asset-values">
                        <span class="market-asset-price">$${asset.price.toLocaleString()}</span>
                        <span class="market-asset-change ${changeClass}">
                            <i class="fa-solid ${changeIcon}"></i>
                            ${changeSymbol}${asset.change.toFixed(1)}%
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function initPriceChart() {
        if (!elements.priceChart) return;

        const ctx = elements.priceChart.getContext('2d');
        
        // Generar datos simulados
        const labels = [];
        const data = [];
        const basePrice = 98000;
        
        for (let i = 24; i >= 0; i--) {
            labels.push(`${i}h`);
            const variation = (Math.random() - 0.5) * 2000;
            data.push(basePrice + variation);
        }

        priceChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'BTC/USD',
                    data: data,
                    borderColor: '#F7C5D0',
                    backgroundColor: 'rgba(247, 197, 208, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#F7C5D0',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#FFFFFF',
                        titleColor: '#5D4E52',
                        bodyColor: '#5D4E52',
                        borderColor: '#F7C5D0',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#9E8C91',
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'k';
                            }
                        },
                        grid: {
                            color: 'rgba(247, 197, 208, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#9E8C91',
                            maxTicksLimit: 8
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    function initTimeframeButtons() {
        const timeframeButtons = document.querySelectorAll('.timeframe-btn');
        timeframeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                timeframeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const timeframe = btn.dataset.timeframe;
                console.log('📊 Timeframe cambiado a:', timeframe);
                showNotification(`📊 Vista de ${timeframe} activada`, 'info');
            });
        });
    }

    function initRefreshButton() {
        const refreshBtn = document.getElementById('refresh-market-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.animation = 'spin 0.5s ease';
                setTimeout(() => {
                    refreshBtn.style.animation = '';
                }, 500);
                
                renderMarketAssets();
                showNotification('🔄 Datos actualizados', 'success');
            });
        }
    }

    // ===================================
    // VISTA DE AJUSTES
    // ===================================
    function initSettingsView() {
        initSettingsToggles();
        initLogoutButton();
    }

    function initSettingsToggles() {
        const toggles = document.querySelectorAll('.settings-toggle input[type="checkbox"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const label = e.target.closest('.settings-item').querySelector('.settings-item-label');
                const labelText = label ? label.textContent : 'Configuración';
                const status = e.target.checked ? 'activada' : 'desactivada';
                
                showNotification(`${labelText} ${status}`, 'success');
                console.log(`⚙️ ${labelText}: ${status}`);
            });
        });
    }

    function initLogoutButton() {
        const logoutBtn = document.querySelector('.logout-button');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                    showNotification('👋 Cerrando sesión...', 'info');
                    setTimeout(() => {
                        console.log('🚪 Sesión cerrada');
                        alert('Demo: Sesión cerrada exitosamente');
                    }, 1000);
                }
            });
        }
    }

    // Agregar animación de rotación para el botón de refresh
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);

    // ===================================
    // TELEMETRÍA Y DEBUG
    // ===================================
    console.log('%c🌸 Dólaro Calamaro Wallet', 'font-size: 20px; font-weight: bold; color: #F7C5D0;');
    console.log('%cVersión: 2.0 - Modo Offline/USSD', 'font-size: 12px; color: #9E8C91;');
    console.log('%c5 Activos: USDC, XLM, AQUA, yBTC, yETH', 'font-size: 12px; color: #5D4E52;');

})();
