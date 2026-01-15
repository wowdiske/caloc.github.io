// CONFIGURACIÓN UNIVERSAL PARA TODAS LAS PLATAFORMAS
const platformConfigs = {
    steam: {
        title: "Steam Wallet Code (USD - United States)",
        cardTypeTitle: "Steam Wallet Code (USD - United States)",
        amounts: [5, 10, 20, 25, 30, 50, 100]
    },
    nintendo: {
        title: "Nintendo eShop Card (USA)",
        cardTypeTitle: "Nintendo eShop Card (USD - United States)",
        amounts: [5, 10, 20, 25, 30, 50, 100]
    },
    playstation: {
        title: "PlayStation Store Gift Card (USA)",
        cardTypeTitle: "PlayStation Store Gift Card (USD - United States)",
        amounts: [5, 10, 20, 25, 30, 50, 100]
    },
        valorant: {
        title: "Valorant USA",
        cardTypeTitle: "Valorant USA",
        amounts: [5, 10, 20, 25, 30, 50, 100]
    },
    xbox: {
        title: "Xbox Gift Card (USA)",
        cardTypeTitle: "Xbox Gift Card (USD - United States)",
        amounts: [5, 10, 20, 25, 30, 50, 100]
    }
};

// Variables globales
let couponApplied = false;
let currentPlatform = 'steam';
let currentPaymentMethod = null;
const DOLAR_TO_BS = 617; // 1 USD = 700 Bs

// Función para detectar la plataforma automáticamente
function detectPlatform() {
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('nintendo')) return 'nintendo';
    if (path.includes('valorant')) return 'valorant';
    if (path.includes('playstation') || path.includes('psn')) return 'playstation';
    if (path.includes('xbox')) return 'xbox';
    
    return 'steam';
}

// Función para inicializar la página según la plataforma
function initializePage() {
    currentPlatform = detectPlatform();
    const config = platformConfigs[currentPlatform];
    
    if (!config) {
        console.error('Configuración no encontrada para plataforma:', currentPlatform);
        return;
    }
    
    document.getElementById('giftCardTitle').textContent = config.title;
    document.getElementById('giftCardTypeTitle').textContent = config.cardTypeTitle;
    
    const amountOptionsContainer = document.getElementById('amountOptions');
    amountOptionsContainer.innerHTML = '';
    
    config.amounts.forEach(amount => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'border-input-1';
        optionDiv.innerHTML = `
            <label class="radio-button-container">
                <span class="text-l-medium text-w-neutral-4 cursor-pointer">
                    ${config.cardTypeTitle.split('(')[0].trim()} ${amount} USD
                </span>
                <input type="radio" name="giftCardAmount" value="${amount}" data-price="${amount}" />
                <span class="checkmark"></span>
            </label>
        `;
        amountOptionsContainer.appendChild(optionDiv);
    });
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

// Función para calcular comisiones (ahora incluida en el monto)
function calculateFees(amount) {
    let fee = 0;
    
    if (amount <= 4) {
        fee = 1;
    } else if (amount === 5) {
        fee = 2.5;
    } else if (amount >= 10) {
        fee = (amount / 10) * 2.5;
    }
    
    return parseFloat(fee.toFixed(2));
}

// Función para calcular total con cupón
function calculateTotal(amount) {
    const fee = calculateFees(amount);
    const subtotal = amount + fee; // Este es el MONTO que incluye comisión
    
    const discount = couponApplied ? subtotal * 0.07 : 0;
    const total = subtotal - discount;
    
    return {
        cardAmount: amount,
        fee: fee,
        monto: parseFloat(subtotal.toFixed(2)), // Nuevo campo: Monto con comisión incluida
        discount: parseFloat(discount.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
}

// Función para convertir USD a Bs
function convertToBs(amount) {
    return parseFloat((amount * DOLAR_TO_BS).toFixed(2));
}

// Función para actualizar precios
function updatePrices() {
    const selectedAmount = document.querySelector('input[name="giftCardAmount"]:checked');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (selectedAmount) {
        const amount = parseInt(selectedAmount.value);
        const calculation = calculateTotal(amount);
        
        if (paymentMethod && paymentMethod.value === 'ves') {
            // Mostrar en Bolívares
            const montoBs = convertToBs(calculation.monto);
            const discountBs = convertToBs(calculation.discount);
            const totalBs = convertToBs(calculation.total);
            
            document.getElementById('cardAmount').textContent = `Bs${montoBs.toLocaleString('es-VE')}`;
            document.getElementById('feeAmount').textContent = `-Bs${discountBs.toLocaleString('es-VE')}`;
            document.getElementById('totalAmount').textContent = `Bs${totalBs.toLocaleString('es-VE')}`;
        } else {
            // Mostrar en Dólares
            document.getElementById('cardAmount').textContent = `$${calculation.monto}`;
            document.getElementById('feeAmount').textContent = `-$${calculation.discount}`;
            document.getElementById('totalAmount').textContent = `$${calculation.total}`;
        }
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

// Función para guardar datos y redirigir
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
    
    const amount = parseInt(giftCardAmount.value);
    const calculation = calculateTotal(amount);
    
    // Calcular en Bolívares si es necesario
    const montoBs = convertToBs(calculation.monto);
    const discountBs = convertToBs(calculation.discount);
    const totalBs = convertToBs(calculation.total);
    
    const orderData = {
        platform: currentPlatform.toUpperCase(),
        platformTitle: config.title,
        email: email,
        paymentMethod: paymentMethod.value,
        paymentMethodText: paymentMethod.value === 'crypto' ? 'Crypto/Binance' : 'Bolívares (VES)',
        cardAmount: calculation.cardAmount,
        monto: calculation.monto, // Monto con comisión incluida
        montoBs: montoBs,
        cardAmountText: `${config.cardTypeTitle.split('(')[0].trim()} $${calculation.cardAmount} USD`,
        fee: calculation.fee,
        discount: calculation.discount,
        discountBs: discountBs,
        total: calculation.total,
        totalBs: totalBs,
        couponCode: couponApplied ? couponCode : "Sin cupón",
        couponApplied: couponApplied,
        timestamp: new Date().toISOString(),
        currency: paymentMethod.value === 'ves' ? 'Bs' : '$'
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    console.log('Datos guardados:', orderData);
    
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