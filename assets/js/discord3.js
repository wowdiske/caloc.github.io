
// Variables globales
let paymentScreenshot = null;
let paymentConfirmed = false;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el drag and drop para la captura de pantalla
    setupFileUpload();
    
    // Configurar el checkbox de confirmación de pago
    setupPaymentConfirmation();
    
    // Configurar el botón de completar orden
    setupCompleteOrderButton();
});

// Configurar la subida de archivos
function setupFileUpload() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFileBtn = document.getElementById('remove-file');
    
    // Prevenir comportamientos por defecto para drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Efectos visuales para drag and drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('border-primary');
        dropArea.classList.add('bg-primary/5');
    }
    
    function unhighlight() {
        dropArea.classList.remove('border-primary');
        dropArea.classList.remove('bg-primary/5');
    }
    
    // Manejar archivos soltados
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // Manejar clic en botón de buscar
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Manejar selección de archivo
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // Manejar eliminación de archivo
    removeFileBtn.addEventListener('click', function() {
        paymentScreenshot = null;
        fileInput.value = '';
        fileInfo.classList.add('hidden');
        checkOrderReady();
    });
    
    // Función para manejar archivos
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                alert('Tipo de archivo no válido. Por favor, sube una imagen (JPG, PNG, GIF) o PDF.');
                return;
            }
            
            // Validar tamaño (5MB máximo)
            const maxSize = 5 * 1024 * 1024; // 5MB en bytes
            if (file.size > maxSize) {
                alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
                return;
            }
            
            // Convertir archivo a base64
            const reader = new FileReader();
            reader.onload = function(e) {
                paymentScreenshot = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    base64: e.target.result.split(',')[1] // Remover el prefijo data:image/...
                };
                
                // Mostrar información del archivo
                fileName.textContent = file.name;
                fileSize.textContent = formatFileSize(file.size);
                fileInfo.classList.remove('hidden');
                
                checkOrderReady();
            };
            reader.readAsDataURL(file);
        }
    }
}

// Configurar confirmación de pago
function setupPaymentConfirmation() {
    const saveInfoCheckbox = document.getElementById('saveInfo');
    
    saveInfoCheckbox.addEventListener('change', function() {
        paymentConfirmed = this.checked;
        checkOrderReady();
    });
}

// Configurar botón de completar orden
function setupCompleteOrderButton() {
    const completeOrderBtn = document.getElementById('complete-order-btn');
    
    // Inicialmente deshabilitado
    completeOrderBtn.classList.add('opacity-50', 'cursor-not-allowed');
    completeOrderBtn.style.pointerEvents = 'none';
}

// Verificar si la orden está lista para enviar
function checkOrderReady() {
    const completeOrderBtn = document.getElementById('complete-order-btn');
    
    if (paymentScreenshot && paymentConfirmed) {
        // Habilitar botón
        completeOrderBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        completeOrderBtn.style.pointerEvents = 'auto';
    } else {
        // Deshabilitar botón
        completeOrderBtn.classList.add('opacity-50', 'cursor-not-allowed');
        completeOrderBtn.style.pointerEvents = 'none';
    }
}

// Función para formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función principal que se ejecuta al completar la orden
function PagadoConExito() {
    // Verificar que todo esté listo
    if (!paymentScreenshot || !paymentConfirmed) {
        alert('Por favor, sube la captura de pantalla y marca la confirmación de pago.');
        return;
    }
    
    // Recuperar datos del localStorage (de la página anterior)
    const orderData = getOrderDataFromLocalStorage();
    
    // Crear objeto con todos los datos
    const completeOrderData = {
        ...orderData,
        payment: {
            screenshot: paymentScreenshot,
            confirmed: paymentConfirmed,
            timestamp: new Date().toISOString()
        }
    };
    
    // Enviar al webhook
    sendToWebhook(completeOrderData);
    
    // Redirigir a página de confirmación
    redirectToConfirmation();
}

// Obtener datos del localStorage
function getOrderDataFromLocalStorage() {
    const orderData = {
        gold: localStorage.getItem('order_gold') || '0',
        personaje: localStorage.getItem('order_personaje') || '',
        faction: localStorage.getItem('order_faction') || '',
        delivery: localStorage.getItem('order_delivery') || '',
        total: localStorage.getItem('order_total') || '0',
        subtotal: localStorage.getItem('order_subtotal') || '0',
        timestamp: localStorage.getItem('order_timestamp') || new Date().toISOString()
    };
    
    return orderData;
}

// Enviar datos al webhook
function sendToWebhook(orderData) {
    const webhookUrl = 'https://discord.com/api/webhooks/1458624271893922007/KcHB-J6ALdjlBxt_EcDL3umkVFdMTx3QN43gfAMFflGcH2zOpPIjm8Xt2aVrSSQfsf07'; // Reemplazar con tu URL de webhook
    
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    
    // Agregar datos de texto
    formData.append('gold', orderData.gold);
    formData.append('personaje', orderData.personaje);
    formData.append('faction', orderData.faction);
    formData.append('delivery', orderData.delivery);
    formData.append('total', orderData.total);
    formData.append('subtotal', orderData.subtotal);
    formData.append('timestamp', orderData.timestamp);
    formData.append('payment_confirmed', orderData.payment.confirmed);
    formData.append('payment_timestamp', orderData.payment.timestamp);
    
    // Agregar la captura de pantalla como archivo
    if (orderData.payment.screenshot) {
        // Convertir base64 a Blob
        const byteCharacters = atob(orderData.payment.screenshot.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: orderData.payment.screenshot.type });
        
        // Crear archivo desde el Blob
        const file = new File([blob], orderData.payment.screenshot.name, { 
            type: orderData.payment.screenshot.type 
        });
        
        formData.append('payment_screenshot', file);
    }
    
    // Enviar al webhook usando fetch
    fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        headers: {
            // No establecer Content-Type para FormData, fetch lo hace automáticamente con boundary
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos al servidor');
        }
        return response.text();
    })
    .then(data => {
        console.log('Datos enviados exitosamente:', data);
        
        // Limpiar localStorage después de enviar
        clearOrderDataFromLocalStorage();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar tu orden. Por favor, intenta de nuevo o contacta al soporte.');
        
        // Guardar datos localmente en caso de error
        saveOrderDataLocally(orderData);
    });
}

// Redirigir a página de confirmación
function redirectToConfirmation() {
    window.location.href = 'confirmation.html';
}

// Limpiar datos del localStorage
function clearOrderDataFromLocalStorage() {
    const keys = [
        'order_gold',
        'order_personaje',
        'order_faction',
        'order_delivery',
        'order_total',
        'order_subtotal',
        'order_timestamp'
    ];
    
    keys.forEach(key => {
        localStorage.removeItem(key);
    });
}

// Guardar datos localmente en caso de error de conexión
function saveOrderDataLocally(orderData) {
    const backupKey = 'order_backup_' + new Date().getTime();
    localStorage.setItem(backupKey, JSON.stringify(orderData));
}

// Función para copiar al portapapeles (ya existente)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Mostrar mensaje de éxito
        const originalText = event.target.textContent;
        event.target.textContent = 'Copiado!';
        event.target.classList.add('bg-green-500');
        
        setTimeout(() => {
            event.target.textContent = originalText;
            event.target.classList.remove('bg-green-500');
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
        alert('No se pudo copiar al portapapeles. Por favor, cópialo manualmente.');
    });
}
