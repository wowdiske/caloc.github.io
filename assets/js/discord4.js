// CONFIGURACIÓN UNIVERSAL PARA TODAS LAS PLATAFORMAS
const platformConfigs = {
    // Steam
    steamusa: {
        title: "Steam Wallet Code (USD - United States)",
        cardTypeTitle: "Steam Wallet Code - USD - United States",
        amounts: [5, 10, 20, 25, 30, 50, 75],
        currency: 'USD',
        format: 'card',
        region: 'usa'
    },
    steameu: {
        title: "Steam Wallet Code (EUR - Europe)",
        cardTypeTitle: "Steam Wallet Code - EUR - Europe",
        amounts: [5, 10, 20, 25, 30, 35],
        currency: 'EUR',
        format: 'card',
        region: 'eu'
    },
    
    // Blizzard
    blizzardusa: {
        title: "Blizzard (Battle.net) USA",
        cardTypeTitle: "Blizzard - Battle.net - USA",
        amounts: [20, 50],
        currency: 'USD',
        format: 'card',
        region: 'usa'
    },
    blizzardeu: {
        title: "Blizzard (Battle.net) EU",
        cardTypeTitle: "Blizzard - Battle.net - EU",
        amounts: [20, 50],
        currency: 'EUR',
        format: 'card',
        region: 'eu'
    },
    
    // Valorant
    valorantusa: {
        title: "Valorant USA",
        cardTypeTitle: "Valorant USA",
        amounts: [5, 10, 15, 25, 50],
        currency: 'USD',
        format: 'card',
        region: 'usa'
    },
    valoranteu: {
        title: "Valorant EU",
        cardTypeTitle: "Valorant EU",
        amounts: [5, 10, 15, 20, 25, 35, 50],
        currency: 'EUR',
        format: 'card',
        region: 'eu'
    },
    
    // Riot Points
    riotpointsusa: {
        title: "Riot Points (LoL / Valorant) (USD - Global)",
        cardTypeTitle: "Riot Points - LoL / Valorant - USD - Global",
        amounts: [5, 10, 15, 25, 50],
        currency: 'USD',
        format: 'card',
        region: 'usa'
    },
    riotpointseu: {
        title: "Riot Points (LoL / Valorant) (EUR - Europe)",
        cardTypeTitle: "Riot Points - LoL / Valorant - EUR - Europe",
        amounts: [2.5, 5, 10, 20, 25, 35, 50],
        currency: 'EUR',
        format: 'card',
        region: 'eu'
    },
    
    // PlayStation
    playstationusa: {
        title: "PlayStation USA",
        cardTypeTitle: "PlayStation USA",
        amounts: [1, 2, 3, 4, 5, 10, 25, 50],
        currency: 'USD',
        format: 'card',
        region: 'usa'
    },
    playstationspain: {
        title: "PlayStation Spain",
        cardTypeTitle: "PlayStation ES",
        amounts: [10, 20, 25, 50],
        currency: 'EUR',
        format: 'card',
        region: 'eu'
    },

    nintendousa: {
        title: "Nintendo USA",
        cardTypeTitle: "Nintendo USA",
        amounts: [10, 20, 35, 50],
        currency: 'USD',
        format: 'card',
        region: 'usa'
    },

    nintendoeu: {
        title: "Nintendo eShop Currency (EUR - Europe)",
        cardTypeTitle: "Nintendo eShop Currency (EUR - Europe)",
        amounts: [15, 25, 50],
        currency: 'EUR',
        format: 'card',
        region: 'eu'
    },
    
    // Fortnite
    fortniteusa: {
        title: "V-Bucks Fortnite (USD - USA)",
        cardTypeTitle: "V-Bucks Fortnite - USA",
        amounts: [33, 48, 112],
        specificAmounts: {
            33: "2800 V-Bucks",
            48: "5000 V-Bucks", 
            112: "13500 V-Bucks"
        },
        currency: 'USD',
        format: 'game',
        region: 'usa'
    },
    fortniteeu: {
        title: "V-Bucks Fortnite (EUR - Europe)",
        cardTypeTitle: "V-Bucks Fortnite - Europe",
        amounts: [30, 44, 102],
        specificAmounts: {
            30: "2800 V-Bucks",
            44: "5000 V-Bucks",
            102: "13500 V-Bucks"
        },
        currency: 'EUR',
        format: 'game',
        region: 'eu'
    },
    
    // Minecraft
    minecraftusa: {
        title: "Minecraft Minecoins (Global)",
        cardTypeTitle: "Minecoins Minecraft - USA",
        amounts: [8, 16, 47],
        specificAmounts: {
            8: "1720 Minecoins",
            16: "3500 Minecoins",
            47: "Minecoins Pack: 8800 Coins"
        },
        currency: 'USD',
        format: 'game',
        region: 'usa'
    },

    // ROBLOX
    robloxusa: {
        title: "Roblox (USD - USA)",
        cardTypeTitle: "Roblox (USD - USA)",
        amounts: [10, 20],
        specificAmounts: {
            10: "Roblox",
            20: "Roblox"
        },
        currency: 'USD',
        format: 'game',
        region: 'usa'
    },

    // ROBLOX
    robloxeu: {
        title: "ROBLOX EUROPE",
        cardTypeTitle: "ROBLOX EUROPE",
        amounts: [10, 20],
        specificAmounts: {
            10: "Roblox",
            20: "Roblox"
        },
        currency: 'EUR',
        format: 'game',
        region: 'eu'
    },

    // ROBLOX
    robloxglobal: {
        title: "Roblox Premium Global",
        cardTypeTitle: "Roblox Premium Global",
        amounts: [25],
        specificAmounts: {
            25: "Roblox Robux 2200"
        },
        currency: 'USD',
        format: 'game',
        region: 'usa'
    },

    // FreeFire
    freefireusa: {
        title: "Free Fire Diamantes",
        cardTypeTitle: "Free Fire Diamantes",
        amounts: [2, 4, 7, 13, 25],
        specificAmounts: {
            2: "100 + Bonus Diamantes for FF",
            4: "210 + Bonus Diamantes for FF",
            7: "530 + Bonus Diamantes for FF",
            13: "1080 + Bonus Diamantes for FF",
            25: "2200 + Bonus Diamantes for FF"
        },
        currency: 'USD',
        format: 'game',
        region: 'usa'
    },

    freefireregion: {
        title: "Garena Free Fire Mena Region",
        cardTypeTitle: "Garena Free Fire Mena Region",
        amounts: [2, 5, 20],
        specificAmounts: {
            2: "Free Fire 210 + 21 Diamantes",
            5: "Free Fire 530 + 53 Diamantes",
            20: "Free Fire 2200 + 220 Diamantes"
        },
        currency: 'USD',
        format: 'game',
        region: 'usa'
    },
    
    // Xbox
    xboxusa: {
        title: "Xbox Gift Card (USD - USA)",
        cardTypeTitle: "Xbox Gift Card - USA",
        amounts: [5, 10, 15, 25, 50, 100],
        currency: 'USD',
        format: 'card',
        region: 'usa'
    },
    xboxeu: {
        title: "Xbox Gift Card (EUR - Europe)",
        cardTypeTitle: "Xbox Gift Card - Europe",
        amounts: [5, 10, 15, 25, 50, 100],
        currency: 'EUR',
        format: 'card',
        region: 'eu'
    }
};

// Variables globales
let couponApplied = false;
let currentPlatform = 'steamusa';
let currentPaymentMethod = null;
const DOLAR_TO_BS = 617; // 1 USD = 617 Bs
const EURO_TO_USD = 1.16; // 1 EUR = 1.16 USD (aproximado)
const DOLAR_TO_EUR = 0.86; // 1 USD = 0.86 EUR (inverso)

// Función para calcular porcentaje de ganancia según monto
function calculateProfitPercentage(nominalAmount) {
    if (nominalAmount >= 1 && nominalAmount <= 4) return 0.70; // 70%
    if (nominalAmount >= 5 && nominalAmount <= 9) return 0.50; // 50%
    if (nominalAmount >= 10 && nominalAmount <= 19) return 0.40; // 40%
    if (nominalAmount >= 20 && nominalAmount <= 29) return 0.35; // 35%
    if (nominalAmount >= 30 && nominalAmount <= 39) return 0.30; // 30%
    if (nominalAmount >= 40 && nominalAmount <= 49) return 0.30; // 30%
    if (nominalAmount >= 50) return 0.30; // 30% para $50+
    return 0.30; // Por defecto
}

// Función para convertir moneda si es necesario
function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === 'EUR' && toCurrency === 'USD') {
        return amount * EURO_TO_USD;
    } else if (fromCurrency === 'USD' && toCurrency === 'EUR') {
        return amount * DOLAR_TO_EUR;
    }
    
    return amount; // Por defecto, no convertir
}

// Función para calcular precio de venta en USD
function calculateSalePriceUSD(nominalAmount, config) {
    const profitPercentage = calculateProfitPercentage(nominalAmount);
    
    // Si el producto está en EUR, primero convertir a USD
    let nominalUSD = nominalAmount;
    if (config.currency === 'EUR') {
        nominalUSD = convertCurrency(nominalAmount, 'EUR', 'USD');
    }
    
    // Calcular precio con ganancia en USD
    const salePriceUSD = nominalUSD * (1 + profitPercentage);
    return parseFloat(salePriceUSD.toFixed(2));
}

// Función para calcular descuento del cupón (5%)
function calculateCouponDiscount(salePrice) {
    return parseFloat((salePrice * 0.05).toFixed(2));
}

// Función para calcular ganancia real
function calculateRealProfit(nominalAmount, salePriceUSD, couponApplied) {
    const profitPercentage = calculateProfitPercentage(nominalAmount);
    let nominalUSD = nominalAmount;
    
    // Si es EUR, convertir para calcular ganancia
    const config = platformConfigs[currentPlatform];
    if (config.currency === 'EUR') {
        nominalUSD = convertCurrency(nominalAmount, 'EUR', 'USD');
    }
    
    const baseProfit = nominalUSD * profitPercentage;
    
    if (!couponApplied) {
        return {
            baseProfit: parseFloat(baseProfit.toFixed(2)),
            totalProfit: parseFloat(baseProfit.toFixed(2)),
            couponDiscount: 0
        };
    }
    
    const couponDiscount = calculateCouponDiscount(salePriceUSD);
    const totalProfit = baseProfit - couponDiscount;
    
    return {
        baseProfit: parseFloat(baseProfit.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        couponDiscount: couponDiscount
    };
}

// Función para detectar la plataforma automáticamente
function detectPlatform() {
    const path = window.location.pathname.toLowerCase();
    const pageName = path.split('/').pop().replace('.html', '').replace('.php', '');
    
    // Buscar coincidencia exacta o parcial en las configuraciones
    for (const platform in platformConfigs) {
        if (pageName.includes(platform) || pageName === platform) {
            return platform;
        }
    }
    
    // Detección por palabras clave
    if (pageName.includes('steam')) {
        if (pageName.includes('eu')) return 'steameu';
        return 'steamusa';
    }
    if (pageName.includes('blizzard') || pageName.includes('battlenet')) {
        if (pageName.includes('eu')) return 'blizzardeu';
        return 'blizzardusa';
    }
    if (pageName.includes('valorant')) {
        if (pageName.includes('eu')) return 'valoranteu';
        return 'valorantusa';
    }
    if (pageName.includes('riot') || pageName.includes('lol')) {
        if (pageName.includes('eu')) return 'riotpointseu';
        return 'riotpointsusa';
    }
    if (pageName.includes('playstation') || pageName.includes('psn')) {
        if (pageName.includes('spain')) return 'playstationspain';
        if (pageName.includes('eu')) return 'playstationeu';
        return 'playstationusa';
    }
    if (pageName.includes('fortnite') || pageName.includes('vbucks')) {
        if (pageName.includes('eu')) return 'fortniteeu';
        return 'fortniteusa';
    }
    if (pageName.includes('minecraft') || pageName.includes('minecoins')) {
        if (pageName.includes('eu')) return 'minecrafteu';
        return 'minecraftusa';
    }
    if (pageName.includes('roblox')) {
        if (pageName.includes('eu')) return 'robloxeu';
        return 'robloxusa';
    }
    if (pageName.includes('freefire')) {
        return 'freefireusa';
    }
    if (pageName.includes('xbox')) {
        if (pageName.includes('eu')) return 'xboxeu';
        return 'xboxusa';
    }
    if (pageName.includes('nintendo')) {
        if (pageName.includes('eu')) return 'nintendoeu';
        return 'nintendousa';
    }
    
    return 'steamusa'; // Por defecto
}

// Función para obtener símbolo de moneda
function getCurrencySymbol(currency) {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'Bs': 'Bs'
    };
    return symbols[currency] || '$';
}

// Función para formatear el texto de la opción (CON MONTO Y MONEDA)
function getOptionText(config, nominalAmount) {
    if (config.format === 'game' && config.specificAmounts && config.specificAmounts[nominalAmount]) {
        // Para juegos: "Roblox 10 EUR" o "2800 V-Bucks 30 EUR"
        const specificText = config.specificAmounts[nominalAmount];
        // Si el texto específico ya incluye el monto, mostrarlo completo
        if (specificText.includes(nominalAmount.toString())) {
            return specificText;
        } else {
            return `${specificText} ${nominalAmount} ${config.currency}`;
        }
    } else {
        // Para tarjetas: usar el cardTypeTitle completo con el monto
        return `${config.cardTypeTitle} - ${nominalAmount} ${config.currency}`;
    }
}

// Función para obtener la descripción completa del producto
function getProductFullDescription(config, nominalAmount) {
    if (config.format === 'game' && config.specificAmounts && config.specificAmounts[nominalAmount]) {
        return `${config.specificAmounts[nominalAmount]} - ${config.title}`;
    } else {
        return `${config.cardTypeTitle} - ${nominalAmount} ${config.currency}`;
    }
}

// Función para inicializar la página según la plataforma
function initializePage() {
    currentPlatform = detectPlatform();
    const config = platformConfigs[currentPlatform];
    
    if (!config) {
        console.error('Configuración no encontrada para plataforma:', currentPlatform);
        return;
    }
    
    // Actualizar título principal (SOLO EL TÍTULO, SIN CONVERSIÓN)
    document.getElementById('giftCardTitle').textContent = config.title;
    document.getElementById('giftCardTypeTitle').textContent = config.cardTypeTitle;
    
    // Actualizar opciones de monto (SIN SELECCIONAR NINGUNA POR DEFECTO)
    const amountOptionsContainer = document.getElementById('amountOptions');
    amountOptionsContainer.innerHTML = '';
    
    config.amounts.forEach(nominalAmount => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'border-input-1';
        
        const optionText = getOptionText(config, nominalAmount);
        const salePriceUSD = calculateSalePriceUSD(nominalAmount, config);
        
        optionDiv.innerHTML = `
            <label class="radio-button-container">
                <span class="text-l-medium text-w-neutral-4 cursor-pointer">
                    ${optionText}
                </span>
                <input type="radio" name="giftCardAmount" value="${nominalAmount}" 
                       data-sale-price="${salePriceUSD}" data-nominal="${nominalAmount}" />
                <span class="checkmark"></span>
            </label>
        `;
        amountOptionsContainer.appendChild(optionDiv);
    });
    
    // NO seleccionar ninguna opción por defecto
    // Las opciones aparecerán sin ninguna seleccionada inicialmente
    
    // Resetear precios cuando no hay selección
    resetPrices();
}

// Función para resetear precios cuando no hay selección
function resetPrices() {
    const usdSymbol = getCurrencySymbol('USD');
    
    document.getElementById('cardAmount').textContent = `${usdSymbol}0.00`;
    document.getElementById('feeAmount').textContent = `-${usdSymbol}0.00`;
    document.getElementById('totalAmount').textContent = `${usdSymbol}0.00`;
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Función para validar y habilitar botón
function validateAndEnableButton() {
    const email = document.getElementById('userEmail').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const giftCardAmount = document.querySelector('input[name="giftCardAmount"]:checked');
    const proceedBtn = document.getElementById('proceedBtn');
    const emailError = document.getElementById('emailError');
    
    if (email && !isValidEmail(email)) {
        emailError.classList.remove('hidden');
        proceedBtn.disabled = true;
        return;
    } else {
        emailError.classList.add('hidden');
    }
    
    if (email && isValidEmail(email) && paymentMethod && giftCardAmount) {
        proceedBtn.disabled = false;
    } else {
        proceedBtn.disabled = true;
    }
}

// Función para calcular total con cupón
function calculateTotal(nominalAmount) {
    const config = platformConfigs[currentPlatform];
    const salePriceUSD = calculateSalePriceUSD(nominalAmount, config);
    const profitCalculation = calculateRealProfit(nominalAmount, salePriceUSD, couponApplied);
    
    let totalUSD = salePriceUSD;
    let discountUSD = 0;
    
    if (couponApplied) {
        discountUSD = profitCalculation.couponDiscount;
        totalUSD = salePriceUSD - discountUSD;
    }
    
    return {
        nominalAmount: nominalAmount,
        originalCurrency: config.currency,
        salePriceUSD: salePriceUSD,
        discountUSD: discountUSD,
        totalUSD: parseFloat(totalUSD.toFixed(2)),
        profit: profitCalculation.baseProfit,
        totalProfit: profitCalculation.totalProfit,
        profitPercentage: (calculateProfitPercentage(nominalAmount) * 100).toFixed(0)
    };
}

// Función para convertir a Bolívares
function convertToBs(amount) {
    return parseFloat((amount * DOLAR_TO_BS).toFixed(2));
}

// Función para actualizar precios
function updatePrices() {
    const selectedAmount = document.querySelector('input[name="giftCardAmount"]:checked');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (selectedAmount) {
        const nominalAmount = parseInt(selectedAmount.value);
        const calculation = calculateTotal(nominalAmount);
        const config = platformConfigs[currentPlatform];
        
        if (paymentMethod && paymentMethod.value === 'ves') {
            // Mostrar en Bolívares
            const totalBs = convertToBs(calculation.totalUSD);
            
            document.getElementById('cardAmount').textContent = `Bs${totalBs.toLocaleString('es-VE')}`;
            
            if (couponApplied) {
                const discountBs = convertToBs(calculation.discountUSD);
                document.getElementById('feeAmount').textContent = `-Bs${discountBs.toLocaleString('es-VE')}`;
                document.getElementById('totalAmount').textContent = `Bs${convertToBs(calculation.totalUSD).toLocaleString('es-VE')}`;
            } else {
                document.getElementById('feeAmount').textContent = `-Bs0`;
                document.getElementById('totalAmount').textContent = `Bs${totalBs.toLocaleString('es-VE')}`;
            }
        } else {
            // Mostrar en USD (SIEMPRE)
            const usdSymbol = getCurrencySymbol('USD');
            
            // SOLO mostrar precios, NO modificar el título
            if (config.currency === 'EUR') {
                // Para EUR, mostrar los precios en USD pero NO modificar el título
                document.getElementById('cardAmount').textContent = `${usdSymbol}${calculation.salePriceUSD}`;
                
                if (couponApplied) {
                    document.getElementById('feeAmount').textContent = `-${usdSymbol}${calculation.discountUSD}`;
                    document.getElementById('totalAmount').textContent = `${usdSymbol}${calculation.totalUSD}`;
                } else {
                    document.getElementById('feeAmount').textContent = `-${usdSymbol}0`;
                    document.getElementById('totalAmount').textContent = `${usdSymbol}${calculation.salePriceUSD}`;
                }
            } else {
                // Para USD, mostrar normalmente
                document.getElementById('cardAmount').textContent = `${usdSymbol}${calculation.salePriceUSD}`;
                
                if (couponApplied) {
                    document.getElementById('feeAmount').textContent = `-${usdSymbol}${calculation.discountUSD}`;
                    document.getElementById('totalAmount').textContent = `${usdSymbol}${calculation.totalUSD}`;
                } else {
                    document.getElementById('feeAmount').textContent = `-${usdSymbol}0`;
                    document.getElementById('totalAmount').textContent = `${usdSymbol}${calculation.salePriceUSD}`;
                }
            }
        }
    } else {
        // Si no hay opción seleccionada, mostrar $0.00
        resetPrices();
    }
}

// Lista de cupones válidos
const validCoupons = ['PAUL', 'DESCUENTO10', 'GAMER2024', 'STEAM5'];

// Función para aplicar cupón
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    const applyBtn = document.getElementById('applyCouponBtn');
    
    if (!couponCode) {
        resetCouponButton();
        return;
    }
    
    if (validCoupons.includes(couponCode)) {
        couponApplied = true;
        applyBtn.textContent = 'CUPÓN APLICADO';
        applyBtn.classList.remove('bg-red-600', 'btn-primary');
        applyBtn.classList.add('bg-green-600');
        
        updatePrices();
    } else {
        applyBtn.textContent = 'CUPÓN NO VÁLIDO';
        applyBtn.classList.remove('bg-green-600', 'btn-primary');
        applyBtn.classList.add('bg-red-600');
        
        setTimeout(() => {
            resetCouponButton();
            document.getElementById('couponCode').value = '';
        }, 2000);
    }
}

function resetCouponButton() {
    const applyBtn = document.getElementById('applyCouponBtn');
    applyBtn.textContent = 'APLICAR CUPÓN';
    applyBtn.classList.remove('bg-green-600', 'bg-red-600');
    applyBtn.classList.add('btn-primary');
    couponApplied = false;
    updatePrices();
}

// Función para guardar datos y redirigir - VERSIÓN CORREGIDA
function proceedToCheckout() {
    const email = document.getElementById('userEmail').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const giftCardAmount = document.querySelector('input[name="giftCardAmount"]:checked');
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    const config = platformConfigs[currentPlatform];
    
    if (!email || !isValidEmail(email)) {
        alert('Por favor ingresa un correo electrónico válido');
        return;
    }
    
    if (!paymentMethod) {
        alert('Por favor selecciona un método de pago');
        return;
    }
    
    if (!giftCardAmount) {
        alert('Por favor selecciona un monto');
        return;
    }
    
    const nominalAmount = parseInt(giftCardAmount.value);
    const calculation = calculateTotal(nominalAmount);
    
    // Calcular en Bolívares
    const totalBs = convertToBs(calculation.totalUSD);
    const salePriceBs = convertToBs(calculation.salePriceUSD);
    const discountBs = convertToBs(calculation.discountUSD);
    
    // Obtener descripción completa del producto
    const productFullDescription = getProductFullDescription(config, nominalAmount);
    
    // PREPARAR DATOS EN EL FORMATO QUE EL CHECKOUT ESPERA
    const orderData = {
        // Información básica (VERSION COMPATIBLE CON EL CHECKOUT ACTUAL)
        platform: currentPlatform.toUpperCase(),
        platformTitle: config.title,
        
        // PRODUCTO - ESTA ES LA CLAVE IMPORTANTE
        productDescription: productFullDescription, // "Steam Wallet Code - USD - United States - 25 USD"
        cardAmountText: productFullDescription, // Backup por si checkout usa este campo
        cardAmount: nominalAmount,
        
        // Información del cliente
        email: email,
        
        // Información de pago
        paymentMethod: paymentMethod.value,
        paymentMethodText: paymentMethod.value === 'crypto' ? 'Crypto/Binance' : 'Bolívares (VES)',
        
        // Montos y precios
        baseCurrency: calculation.originalCurrency,
        salePrice: calculation.salePriceUSD,
        salePriceUSD: calculation.salePriceUSD,
        salePriceBs: salePriceBs,
        discount: calculation.discountUSD,
        discountUSD: calculation.discountUSD,
        discountBs: discountBs,
        total: calculation.totalUSD,
        totalUSD: calculation.totalUSD,
        totalBs: totalBs,
        
        // Información del cupón
        couponCode: couponApplied ? couponCode : "Sin cupón",
        couponApplied: couponApplied,
        
        // Información adicional
        profitPercentage: calculation.profitPercentage,
        profit: calculation.profit,
        totalProfit: calculation.totalProfit,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('es-ES'),
        
        // Moneda
        currency: paymentMethod.value === 'ves' ? 'Bs' : 'USD'
    };
    
    // Mostrar en consola lo que se va a guardar
    console.log('=== DATOS A GUARDAR EN LOCALSTORAGE ===');
    console.log('PRODUCTO:', orderData.productDescription);
    console.log('EMAIL:', orderData.email);
    console.log('TOTAL:', orderData.total);
    console.log('Datos completos:', orderData);
    
    // Guardar en localStorage con la clave EXACTA que el checkout busca
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // Verificar que se guardó
    const savedData = JSON.parse(localStorage.getItem('currentOrder'));
    console.log('✅ Datos guardados. Producto:', savedData?.productDescription);
    
    // Redirigir a checkout
    window.location.href = 'checkout.html';
}

// Inicializar página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    document.addEventListener('change', function(e) {
        if (e.target.name === 'giftCardAmount') {
            updatePrices();
            validateAndEnableButton();
        }
        if (e.target.name === 'paymentMethod') {
            currentPaymentMethod = e.target.value;
            updatePrices();
            validateAndEnableButton();
        }
    });
    
    document.getElementById('userEmail').addEventListener('input', validateAndEnableButton);
    document.getElementById('applyCouponBtn').addEventListener('click', applyCoupon);
    document.getElementById('couponCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyCoupon();
        }
    });
    document.getElementById('proceedBtn').addEventListener('click', proceedToCheckout);
    
    validateAndEnableButton();
});

// Función para agregar nueva configuración dinámicamente
function addNewProductConfig(productKey, config) {
    if (!platformConfigs[productKey]) {
        platformConfigs[productKey] = config;
        console.log(`Producto ${productKey} agregado exitosamente`);
        return true;
    }
    console.warn(`El producto ${productKey} ya existe`);
    return false;
}
