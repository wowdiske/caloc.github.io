// CONFIGURACIÓN PARA TURTLE WOW
const GOLD_PRICE_PER_100 = 2.50; // $2.10 por cada 100 GOLD
const DOLAR_TO_BS = 460; // 1 USD = 567 Bs
const VALID_COUPONS = ['PAUL', 'DESCUENTO10', 'GAMER2024', 'WOW5'];
const DISCOUNT_PERCENTAGE = 0.03; // 5% de descuento

// Variables globales
let couponApplied = false;
let currentPaymentMethod = null;
let currentServer = '';

// Función para detectar el servidor desde el título
function detectServerFromTitle() {
    const pageTitle = document.title;
    console.log('Título de la página:', pageTitle);
    
    // Buscar el nombre del servidor después del guión
    if (pageTitle.includes('-')) {
        const parts = pageTitle.split('-');
        if (parts.length > 1) {
            const serverName = parts[1].trim();
            console.log('Servidor detectado:', serverName);
            return serverName;
        }
    }
    
    // Si no encuentra formato específico, devolver título completo sin "CarryLoot"
    const serverName = pageTitle.replace('CarryLoot', '').replace('-', '').trim();
    console.log('Servidor detectado (alternativo):', serverName);
    return serverName || 'Servidor no especificado';
}

// Función para calcular precio del gold
function calculatePrice(goldAmount) {
    const gold = parseInt(goldAmount) || 0;
    const price = (gold / 100) * GOLD_PRICE_PER_100;
    return parseFloat(price.toFixed(2));
}

// Función para calcular total con cupón
function calculateTotal(goldAmount) {
    const price = calculatePrice(goldAmount);
    const discount = couponApplied ? price * DISCOUNT_PERCENTAGE : 0;
    const total = price - discount;
    
    return {
        goldAmount: goldAmount,
        price: price,
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
    const goldAmount = document.getElementById('goldAmount').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (goldAmount && parseInt(goldAmount) >= 100) {
        const calculation = calculateTotal(goldAmount);
        
        // Actualizar display de gold
        document.getElementById('goldAmountDisplay').textContent = 
            `${parseInt(goldAmount).toLocaleString('es-VE')} GOLD`;
        
        if (paymentMethod && paymentMethod.value === 'ves') {
            // Mostrar en Bolívares
            const priceBs = convertToBs(calculation.price);
            const discountBs = convertToBs(calculation.discount);
            const totalBs = convertToBs(calculation.total);
            
            document.getElementById('priceAmount').textContent = `Bs${priceBs.toLocaleString('es-VE')}`;
            document.getElementById('discountAmount').textContent = `-Bs${discountBs.toLocaleString('es-VE')}`;
            document.getElementById('totalAmount').textContent = `Bs${totalBs.toLocaleString('es-VE')}`;
        } else {
            // Mostrar en Dólares
            document.getElementById('priceAmount').textContent = `$${calculation.price}`;
            document.getElementById('discountAmount').textContent = `-$${calculation.discount}`;
            document.getElementById('totalAmount').textContent = `$${calculation.total}`;
        }
    } else {
        // Resetear valores
        document.getElementById('goldAmountDisplay').textContent = '0 GOLD';
        document.getElementById('priceAmount').textContent = '$0.00';
        document.getElementById('discountAmount').textContent = '-$0.00';
        document.getElementById('totalAmount').textContent = '$0.00';
    }
    
    validateFields();
}

// Función para validar campos
function validateFields() {
    const goldAmount = document.getElementById('goldAmount').value.trim();
    const characterName = document.getElementById('characterName').value.trim();
    const faction = document.querySelector('input[name="faction"]:checked');
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const proceedBtn = document.getElementById('proceedBtn');
    
    let isValid = true;
    
    // Validar gold
    if (!goldAmount || parseInt(goldAmount) < 100) {
        isValid = false;
    }
    
    // Validar nombre del personaje
    if (!characterName || characterName.length < 2) {
        isValid = false;
    }
    
    // Validar selecciones
    if (!faction || !deliveryMethod || !paymentMethod) {
        isValid = false;
    }
    
    // Habilitar o deshabilitar botón
    proceedBtn.disabled = !isValid;
    
    return isValid;
}

// Función para aplicar cupón
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    const applyBtn = document.getElementById('applyCouponBtn');
    
    if (!couponCode) {
        resetCouponButton();
        return;
    }
    
    if (VALID_COUPONS.includes(couponCode)) {
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
    const goldAmount = document.getElementById('goldAmount').value.trim();
    const characterName = document.getElementById('characterName').value.trim();
    const faction = document.querySelector('input[name="faction"]:checked');
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    
    // Detectar servidor actual
    currentServer = detectServerFromTitle();
    
    // Validaciones finales
    if (!goldAmount || parseInt(goldAmount) < 100) {
        alert('Por favor ingresa una cantidad válida de GOLD (mínimo 100)');
        return;
    }
    
    if (!characterName || characterName.length < 2) {
        alert('Por favor ingresa un nombre de personaje válido');
        return;
    }
    
    if (!faction) {
        alert('Por favor selecciona una facción');
        return;
    }
    
    if (!deliveryMethod) {
        alert('Por favor selecciona un método de entrega');
        return;
    }
    
    if (!paymentMethod) {
        alert('Por favor selecciona un método de pago');
        return;
    }
    
    // Calcular total
    const calculation = calculateTotal(goldAmount);
    
    // Calcular en Bolívares si es necesario
    const priceBs = convertToBs(calculation.price);
    const discountBs = convertToBs(calculation.discount);
    const totalBs = convertToBs(calculation.total);
    
    // Mapear textos descriptivos
    const factionText = faction.value === 'alliance' ? 'Alianza' : 'Horda';
    const deliveryText = getDeliveryMethodText(deliveryMethod.value);
    const paymentText = paymentMethod.value === 'crypto' ? 'Crypto/Binance' : 'Bolívares (VES)';
    
    // Crear objeto de datos
    const orderData = {
        orderType: 'wow_gold',
        server: currentServer,
        serverTitle: `Turtle WoW - ${currentServer}`,
        goldAmount: parseInt(goldAmount),
        goldAmountFormatted: `${parseInt(goldAmount).toLocaleString('es-VE')} GOLD`,
        characterName: characterName,
        faction: faction.value,
        factionText: factionText,
        deliveryMethod: deliveryMethod.value,
        deliveryMethodText: deliveryText,
        paymentMethod: paymentMethod.value,
        paymentMethodText: paymentText,
        price: calculation.price,
        priceBs: priceBs,
        discount: calculation.discount,
        discountBs: discountBs,
        total: calculation.total,
        totalBs: totalBs,
        couponCode: couponApplied ? couponCode : "Sin cupón",
        couponApplied: couponApplied,
        timestamp: new Date().toISOString(),
        currency: paymentMethod.value === 'ves' ? 'Bs' : '$'
    };
    
    // Guardar en localStorage
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    console.log('Datos guardados:', orderData);
    
    // Redirigir al checkout
    window.location.href = 'checkout.html';
}

// Función auxiliar para texto de método de entrega
function getDeliveryMethodText(method) {
    const methods = {
        'mail': 'Correo interno del juego',
        'trade': 'Intercambio cara a cara',
        'auction': 'Casa de subastas',
        'item_trade': 'Comercio de artículos'
    };
    return methods[method] || method;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando formulario WoW Gold...');
    
    // Detectar servidor automáticamente
    currentServer = detectServerFromTitle();
    console.log('Servidor detectado:', currentServer);
    
    // Event listeners para inputs
    document.getElementById('goldAmount').addEventListener('input', updatePrices);
    document.getElementById('characterName').addEventListener('input', validateFields);
    
    // Event listeners para radios
    document.addEventListener('change', function(e) {
        if (e.target.name === 'faction' || 
            e.target.name === 'deliveryMethod' || 
            e.target.name === 'paymentMethod') {
            updatePrices();
            validateFields();
        }
    });
    
    // Event listeners para cupón
    document.getElementById('applyCouponBtn').addEventListener('click', applyCoupon);
    document.getElementById('couponCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyCoupon();
        }
    });
    
    // Event listener para botón principal
    document.getElementById('proceedBtn').addEventListener('click', proceedToCheckout);
    
    // Validar campos iniciales
    validateFields();
    console.log('Formulario WoW Gold inicializado correctamente');
});