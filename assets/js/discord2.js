// webhook-gold-notification.js

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
    return serverName || 'Servidor no especificado';
}

// Función para enviar notificación de Gold a Discord
async function sendGoldNotificationToDiscord() {
    try {
        const savedOrder = localStorage.getItem('currentOrder');
        
        if (!savedOrder) {
            console.log('No hay datos de orden para enviar notificación');
            return false;
        }
        
        const orderData = JSON.parse(savedOrder);
        
        // Solo enviar si es una orden de WoW Gold
        if (orderData.orderType !== 'wow_gold') {
            console.log('No es orden de WoW Gold, no se envía notificación');
            return false;
        }
        
        // Detectar servidor desde el título actual
        const currentServer = detectServerFromTitle();
        
        // Webhook específico para notificaciones de Gold
        const GOLD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1458653344670154956/jfFMu423SCJuBCnPen4pyJ5oxNRxCElRAOMsgzJlRiq9yrAZn13u4T0irft-1JNhYlgh';
        
        // Formatear el mensaje con etiqueta
        const goldAmount = orderData.goldAmount || 0;
        const serverName = orderData.server || currentServer;
        
        // ID del usuario de Discord a etiquetar - TU ID
        const USER_ID_TO_MENTION = '442921280954433536';
        
        // Crear el mensaje con etiqueta
        const message = {
            content: `Estoy comprando **${goldAmount.toLocaleString('es-VE')}G** ${serverName} - Escribeme <@${USER_ID_TO_MENTION}>`
        };
        
        console.log('Enviando notificación de Gold:', message.content);
        
        // Enviar al webhook
        const response = await fetch(GOLD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });
        
        if (response.ok) {
            console.log('✅ Notificación de Gold enviada exitosamente');
            return true;
        } else {
            console.error('❌ Error al enviar notificación de Gold');
            return false;
        }
        
    } catch (error) {
        console.error('Error en notificación de Gold:', error);
        return false;
    }
}

// Función para monitorear cuando se completa una orden
function setupOrderCompletionMonitor() {
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (!isCheckoutPage) {
        console.log('No está en checkout, no se monitorea');
        return;
    }
    
    // Monitorear el botón "COMPLETAR ORDEN"
    const completeOrderBtn = document.getElementById('complete-order-btn');
    
    if (completeOrderBtn) {
        console.log('Configurando monitor para botón COMPLETAR ORDEN');
        
        // Remover cualquier event listener existente para evitar duplicados
        completeOrderBtn.removeEventListener('click', handleCompleteOrderClick);
        
        // Agregar nuevo event listener
        completeOrderBtn.addEventListener('click', handleCompleteOrderClick);
        
        console.log('Monitor de orden de Gold configurado');
    } else {
        console.log('Botón COMPLETAR ORDEN no encontrado');
    }
}

// Handler específico para el clic en COMPLETAR ORDEN
async function handleCompleteOrderClick(e) {
    console.log('Botón COMPLETAR ORDEN clickeado - Handler específico');
    
    // Verificar si hay una orden de WoW Gold en localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    
    if (savedOrder) {
        try {
            const orderData = JSON.parse(savedOrder);
            
            // Solo enviar notificación si es WoW Gold
            if (orderData.orderType === 'wow_gold') {
                console.log('Orden de WoW Gold detectada, enviando notificación...');
                
                // Enviar notificación de Gold
                const notificationSent = await sendGoldNotificationToDiscord();
                
                if (notificationSent) {
                    console.log('Notificación de Gold enviada, continuando con proceso normal...');
                }
            } else {
                console.log('Orden no es de WoW Gold, no se envía notificación especial');
            }
        } catch (error) {
            console.error('Error al verificar datos de orden:', error);
        }
    }
    
    // NO llamamos al handler original aquí porque ya está en checkout.js
    // El checkout.js maneja su propio evento
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando notificador de Gold...');
    
    // Solo configurar el monitor de completado de orden
    setupOrderCompletionMonitor();
    
    console.log('✅ Notificador de Gold inicializado (solo se envía al hacer clic)');
});

// También puedes llamar a esta función manualmente si necesitas
function triggerGoldNotificationManual() {
    console.log('Notificación manual de Gold activada');
    return sendGoldNotificationToDiscord();
}