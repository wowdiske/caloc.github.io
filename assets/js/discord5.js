// Variables globales
let orderData = {};
let uploadedFile = null;
let fileBase64 = null;

// Función para validar si hay datos de orden - SOLO para checkout.html
function validateOrderData() {
    // Solo validar si estamos en checkout.html
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (!isCheckoutPage) {
        return true; // No validar en otras páginas
    }
    
    const savedOrder = localStorage.getItem('currentOrder');
    
    if (!savedOrder) {
        // Mostrar mensaje de error y redirigir
        alert('⚠️ No hay datos de compra. Por favor, completa el formulario de compra primero.');
        
        // Redirigir al formulario principal después de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        return false;
    }
    
    return true;
}

// Función para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const button = event.target;
        const originalText = button.textContent;
        
        button.textContent = '¡Copiado!';
        button.classList.add('bg-green-600');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
        }, 2000);
    });
}

// Función para formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función para cargar datos de la orden
function loadOrderData() {
    // Solo validar en checkout.html
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (isCheckoutPage) {
        // Primero validar si hay datos
        if (!validateOrderData()) {
            return false;
        }
    }
    
    const savedOrder = localStorage.getItem('currentOrder');
    
    if (!savedOrder) {
        // Si no hay datos guardados y NO estamos en checkout, continuar normalmente
        if (!isCheckoutPage) {
            return true;
        }
        
        // Si estamos en checkout y no hay datos, ya se manejó en validateOrderData()
        return false;
    }
    
    try {
        orderData = JSON.parse(savedOrder);
        console.log('✅ Datos de la orden cargados:', orderData);
        
        // Verificar que los datos mínimos necesarios estén presentes
        if (!orderData.total) {
            console.error('Datos incompletos en la orden');
            
            // Solo mostrar alerta si estamos en checkout
            if (isCheckoutPage) {
                alert('⚠️ Los datos de la orden están incompletos. Por favor, completa el formulario nuevamente.');
                
                // Limpiar datos inválidos y redirigir
                localStorage.removeItem('currentOrder');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        
        // Solo mostrar alerta si estamos en checkout
        if (isCheckoutPage) {
            alert('❌ Error al cargar datos. Por favor, completa el formulario nuevamente.');
            
            // Limpiar datos corruptos y redirigir
            localStorage.removeItem('currentOrder');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
        return false;
    }
    
    // Solo mostrar el total si estamos en checkout
    if (isCheckoutPage) {
        if (orderData.currency === 'Bs') {
            document.getElementById('currency-symbol').textContent = 'Bs';
            document.getElementById('summary-total').textContent = orderData.totalBs.toLocaleString('es-VE');
        } else {
            document.getElementById('currency-symbol').textContent = '$';
            document.getElementById('summary-total').textContent = orderData.total;
        }
    }
    
    return true;
}

// Función SIMPLE para manejar subida de archivos
function setupFileUpload() {
    // Verificar si estamos en checkout antes de configurar
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (!isCheckoutPage) {
        return; // No configurar upload en otras páginas
    }
    
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFileBtn = document.getElementById('remove-file');
    const uploadStatus = document.getElementById('upload-status');
    
    if (!fileInput) return; // Si no existe el elemento, salir
    
    // Configurar file input change
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            handleFile(this.files[0]);
        }
    });
    
    // Configurar drag & drop en toda el área
    const dropArea = document.querySelector('.file-upload-container');
    if (dropArea) {
        dropArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = '#3B82F6';
            this.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        });
        
        dropArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        });
        
        dropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = '';
            this.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                handleFile(e.dataTransfer.files[0]);
            }
        });
    }
    
    // Configurar botones de copiar
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            copyToClipboard(input.value);
        });
    });
    
    // Configurar remoción de archivo
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', removeFile);
    }
    
    async function handleFile(file) {
        // Validar tamaño (5MB máximo)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('❌ El archivo es demasiado grande. Tamaño máximo: 5MB');
            return;
        }
        
        // Validar tipo
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert('❌ Formato de archivo no válido. Solo se aceptan: JPG, PNG, GIF');
            return;
        }
        
        // Guardar archivo
        uploadedFile = file;
        
        // Convertir a base64 inmediatamente
        try {
            fileBase64 = await fileToBase64(file);
            console.log('✅ Archivo convertido a base64');
        } catch (error) {
            console.error('Error al convertir archivo:', error);
            alert('Error al procesar la imagen');
            return;
        }
        
        // Mostrar información del archivo
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
        if (fileInfo) fileInfo.classList.remove('hidden');
        if (uploadStatus) uploadStatus.classList.remove('hidden');
        
        // Habilitar checkbox de confirmación
        const paymentConfirmedCheckbox = document.getElementById('payment-confirmed');
        if (paymentConfirmedCheckbox) {
            paymentConfirmedCheckbox.disabled = false;
        }
        
        // Actualizar estado del botón
        updateCompleteButton();
        
        console.log('✅ Archivo listo para enviar:', file.name);
    }
    
    function removeFile() {
        if (fileInput) fileInput.value = '';
        if (fileInfo) fileInfo.classList.add('hidden');
        if (uploadStatus) uploadStatus.classList.add('hidden');
        uploadedFile = null;
        fileBase64 = null;
        
        const paymentConfirmedCheckbox = document.getElementById('payment-confirmed');
        if (paymentConfirmedCheckbox) {
            paymentConfirmedCheckbox.disabled = true;
            paymentConfirmedCheckbox.checked = false;
        }
        
        updateCompleteButton();
        console.log('🗑️ Archivo removido');
    }
}

// Función para convertir archivo a base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Función para actualizar estado del botón
function updateCompleteButton() {
    // Solo en checkout
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (!isCheckoutPage) return;
    
    const completeOrderBtn = document.getElementById('complete-order-btn');
    const paymentConfirmedCheckbox = document.getElementById('payment-confirmed');
    
    if (!completeOrderBtn || !paymentConfirmedCheckbox) return;
    
    if (uploadedFile && paymentConfirmedCheckbox.checked) {
        completeOrderBtn.disabled = false;
        completeOrderBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        completeOrderBtn.disabled = true;
        completeOrderBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// Función para enviar datos a Discord CON IMAGEN VISIBLE
async function sendToDiscord() {
    try {
        const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1458624271893922007/KcHB-J6ALdjlBxt_EcDL3umkVFdMTx3QN43gfAMFflGcH2zOpPIjm8Xt2aVrSSQfsf07';
        
        let embed;
        
        // Determinar tipo de orden y crear embed correspondiente
        if (orderData.orderType === 'wow_gold') {
            // Para WoW Gold
            let fields = [
                {
                    name: "Servidor",
                    value: orderData.server || "Servidor no especificado",
                    inline: false
                },
                {
                    name: "Cantidad de GOLD",
                    value: orderData.goldAmountFormatted || "0 GOLD",
                    inline: true
                },
                {
                    name: "Personaje",
                    value: orderData.characterName || "No especificado",
                    inline: true
                },
                {
                    name: "Faccion",
                    value: orderData.factionText || "No especificada",
                    inline: true
                },
                {
                    name: "Metodo de entrega",
                    value: orderData.deliveryMethodText || "No especificado",
                    inline: true
                },
                {
                    name: "Metodo de Pago",
                    value: orderData.paymentMethodText || "No especificado",
                    inline: true
                }
            ];
            
            // Agregar campo de cupón/descuento SOLO si es PAUL
            if (orderData.couponApplied && orderData.couponCode === 'PAUL' && orderData.discount > 0) {
                fields.push({
                    name: "CUPON - PAUL",
                    value: `$${orderData.discount || "0.00"}`,
                    inline: true
                });
            } else if (orderData.couponApplied && orderData.couponCode !== 'PAUL' && orderData.discount > 0) {
                fields.push({
                    name: "Cupon",
                    value: `${orderData.couponCode}\nDescuento - $${orderData.discount || "0.00"}`,
                    inline: true
                });
            } else if (orderData.couponApplied) {
                fields.push({
                    name: "Cupon",
                    value: orderData.couponCode || "Sin cupon",
                    inline: true
                });
            }
            
            // Agregar total y captura
            fields.push(
                {
                    name: "Total",
                    value: orderData.currency === 'Bs' ? 
                           `Bs ${orderData.totalBs?.toLocaleString('es-VE') || "0.00"}` : 
                           `$${orderData.total || "0.00"}`,
                    inline: true
                },
                {
                    name: "Captura",
                    value: uploadedFile ? "IMAGEN ADJUNTA" : "No se subio captura",
                    inline: false
                }
            );
            
            embed = {
                title: "NUEVA ORDEN WoW GOLD",
                color: 0x8B4513,
                fields: fields,
                timestamp: new Date().toISOString()
            };
        } else {
            // Para gift cards
            let fields = [
                {
                    name: "Correo Electronico",
                    value: orderData.email || "No proporcionado",
                    inline: false
                },
                {
                    name: "Metodo de Pago",
                    value: orderData.paymentMethodText || "No especificado",
                    inline: true
                },
                {
                    name: "Producto",
                    value: orderData.cardAmountText || "$0 USD",
                    inline: true
                }
            ];
            
            // Agregar campo de cupón/descuento SOLO si es PAUL
            if (orderData.couponApplied && orderData.couponCode === 'PAUL' && orderData.discount > 0) {
                fields.push({
                    name: "CUPON - PAUL",
                    value: `$${orderData.discount || "0.00"}`,
                    inline: true
                });
            } else if (orderData.couponApplied && orderData.couponCode !== 'PAUL' && orderData.discount > 0) {
                fields.push({
                    name: "Cupon",
                    value: `${orderData.couponCode}\nDescuento - $${orderData.discount || "0.00"}`,
                    inline: true
                });
            } else if (orderData.couponApplied) {
                fields.push({
                    name: "Cupon",
                    value: orderData.couponCode || "Sin cupon",
                    inline: true
                });
            }
            
            // Agregar total y captura
            fields.push(
                {
                    name: "Total",
                    value: orderData.currency === 'Bs' ? 
                           `Bs ${orderData.totalBs?.toLocaleString('es-VE') || "0.00"}` : 
                           `$${orderData.total || "0.00"}`,
                    inline: true
                },
                {
                    name: "Captura",
                    value: uploadedFile ? "IMAGEN ADJUNTA" : "No se subio captura",
                    inline: false
                }
            );
            
            embed = {
                title: "NUEVA ORDEN GIFT CARD",
                color: 0x00ff00,
                fields: fields,
                timestamp: new Date().toISOString()
            };
        }
        
        // Si hay imagen, enviarla como archivo adjunto usando FormData
        let payload;
        
        if (fileBase64) {
            // Crear FormData para enviar la imagen
            const formData = new FormData();
            
            // Primero, crear un Blob desde base64
            const byteCharacters = atob(fileBase64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: uploadedFile.type});
            
            // Agregar archivo al FormData
            formData.append('file', blob, uploadedFile.name);
            
            // Agregar payload JSON como string
            const payloadJson = JSON.stringify({
                embeds: [embed],
                username: "Sistema de Ordenes",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
            });
            
            formData.append('payload_json', payloadJson);
            
            // Enviar usando FormData (Discord acepta esto para imágenes)
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                body: formData
            });
            
            return response.ok;
            
        } else {
            // Si no hay imagen, enviar solo el JSON
            payload = {
                embeds: [embed],
                username: "Sistema de Ordenes",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
            };
            
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            return response.ok;
        }
        
    } catch (error) {
        console.error('❌ Error en el envio:', error);
        
        // Intentar método alternativo sin imagen
        try {
            return await sendToDiscordWithoutImage();
        } catch (secondError) {
            console.error('❌ Error en envio alternativo:', secondError);
            return false;
        }
    }
}

// Función alternativa para enviar sin imagen si falla
async function sendToDiscordWithoutImage() {
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1458624271893922007/KcHB-J6ALdjlBxt_EcDL3umkVFdMTx3QN43gfAMFflGcH2zOpPIjm8Xt2aVrSSQfsf07';
    
    let embed;
    
    if (orderData.orderType === 'wow_gold') {
        // Para WoW Gold sin imagen
        let fields = [
            {
                name: "Servidor",
                value: orderData.server || "Servidor no especificado",
                inline: false
            },
            {
                name: "Cantidad de GOLD",
                value: orderData.goldAmountFormatted || "0 GOLD",
                inline: true
            },
            {
                name: "Personaje",
                value: orderData.characterName || "No especificado",
                inline: true
            },
            {
                name: "Faccion",
                value: orderData.factionText || "No especificada",
                inline: true
            },
            {
                name: "Metodo de entrega",
                value: orderData.deliveryMethodText || "No especificado",
                inline: true
            },
            {
                name: "Metodo de Pago",
                value: orderData.paymentMethodText || "No especificado",
                inline: true
            }
        ];
        
        // Agregar campo de cupón/descuento SOLO si es PAUL
        if (orderData.couponApplied && orderData.couponCode === 'PAUL' && orderData.discount > 0) {
            fields.push({
                name: "CUPON - PAUL",
                value: `$${orderData.discount || "0.00"}`,
                inline: true
            });
        } else if (orderData.couponApplied && orderData.couponCode !== 'PAUL' && orderData.discount > 0) {
            fields.push({
                name: "Cupon",
                value: `${orderData.couponCode}\nDescuento - $${orderData.discount || "0.00"}`,
                inline: true
            });
        } else if (orderData.couponApplied) {
            fields.push({
                name: "Cupon",
                value: orderData.couponCode || "Sin cupon",
                inline: true
            });
        }
        
        // Agregar total y captura
        fields.push(
            {
                name: "Total",
                value: orderData.currency === 'Bs' ? 
                       `Bs ${orderData.totalBs?.toLocaleString('es-VE') || "0.00"}` : 
                       `$${orderData.total || "0.00"}`,
                inline: true
            },
            {
                name: "Captura",
                value: uploadedFile ? `Subida pero no se pudo adjuntar: ${uploadedFile.name}` : "No se subio captura",
                inline: false
            }
        );
        
        embed = {
            title: "NUEVA ORDEN WoW GOLD (Sin imagen)",
            color: 0xff9900,
            fields: fields,
            timestamp: new Date().toISOString()
        };
    } else {
        // Para gift cards sin imagen
        let fields = [
            {
                name: "Correo Electronico",
                value: orderData.email || "No proporcionado",
                inline: false
            },
            {
                name: "Metodo de Pago",
                value: orderData.paymentMethodText || "No especificado",
                inline: true
            },
            {
                name: "Producto",
                value: orderData.cardAmountText || "$0 USD",
                inline: true
            }
        ];
        
        // Agregar campo de cupón/descuento SOLO si es PAUL
        if (orderData.couponApplied && orderData.couponCode === 'PAUL' && orderData.discount > 0) {
            fields.push({
                name: "CUPON - PAUL",
                value: `$${orderData.discount || "0.00"}`,
                inline: true
            });
        } else if (orderData.couponApplied && orderData.couponCode !== 'PAUL' && orderData.discount > 0) {
            fields.push({
                name: "Cupon",
                value: `${orderData.couponCode}\nDescuento - $${orderData.discount || "0.00"}`,
                inline: true
            });
        } else if (orderData.couponApplied) {
            fields.push({
                name: "Cupon",
                value: orderData.couponCode || "Sin cupon",
                inline: true
            });
        }
        
        // Agregar total y captura
        fields.push(
            {
                name: "Total",
                value: orderData.currency === 'Bs' ? 
                       `Bs ${orderData.totalBs?.toLocaleString('es-VE') || "0.00"}` : 
                       `$${orderData.total || "0.00"}`,
                inline: true
            },
            {
                name: "Captura",
                value: uploadedFile ? `Subida pero no se pudo adjuntar: ${uploadedFile.name}` : "No se subio captura",
                inline: false
            }
        );
        
        embed = {
            title: "NUEVA ORDEN GIFT CARD (Sin imagen)",
            color: 0xff9900,
            fields: fields,
            timestamp: new Date().toISOString()
        };
    }
    
    const payload = {
        embeds: [embed],
        username: "Sistema de Ordenes",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
    };
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    return response.ok;
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (!isCheckoutPage) return;
    
    const modal = document.getElementById('success-modal');
    const countdownElement = document.getElementById('countdown');
    const countdownBar = document.getElementById('countdown-bar');
    
    if (!modal) return;
    
    modal.classList.remove('hidden');
    
    let seconds = 5;
    if (countdownElement) countdownElement.textContent = seconds;
    if (countdownBar) countdownBar.style.width = '0%';
    
    const countdownInterval = setInterval(() => {
        seconds--;
        if (countdownElement) countdownElement.textContent = seconds;
        if (countdownBar) countdownBar.style.width = `${(5 - seconds) * 20}%`;
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            const savedOrder = localStorage.getItem('currentOrder');
            if (savedOrder) {
                localStorage.removeItem('currentOrder');
            }
            window.location.href = 'index.html';
        }
    }, 1000);
}

// Función para completar la orden
async function completeCheckoutOrder() {
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (!isCheckoutPage) return;
    
    const completeOrderBtn = document.getElementById('complete-order-btn');
    if (!completeOrderBtn) return;
    
    completeOrderBtn.disabled = true;
    completeOrderBtn.textContent = 'ENVIANDO IMAGEN...';
    
    try {
        console.log('🔄 Enviando orden a Discord...');
        
        const success = await sendToDiscord();
        
        if (success) {
            console.log('✅ Orden enviada exitosamente');
            showSuccessMessage();
        } else {
            completeOrderBtn.disabled = false;
            completeOrderBtn.textContent = 'COMPLETAR ORDEN';
            alert('Hubo un error al procesar la orden. Por favor intenta nuevamente.');
        }
    } catch (error) {
        console.error('Error al completar la orden:', error);
        completeOrderBtn.disabled = false;
        completeOrderBtn.textContent = 'COMPLETAR ORDEN';
        alert('Error al procesar la orden. Por favor intenta nuevamente.');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando checkout...');
    
    // Primero validar y cargar los datos
    const dataLoaded = loadOrderData();
    
    // Verificar en qué página estamos
    const currentPath = window.location.pathname.toLowerCase();
    const isCheckoutPage = currentPath.includes('checkout') || currentPath.endsWith('checkout.html');
    
    if (isCheckoutPage) {
        // Solo inicializar checkout si los datos se cargaron correctamente
        if (dataLoaded) {
            setupFileUpload();
            
            const paymentConfirmedCheckbox = document.getElementById('payment-confirmed');
            if (paymentConfirmedCheckbox) {
                paymentConfirmedCheckbox.addEventListener('change', updateCompleteButton);
            }
            
            const completeOrderBtn = document.getElementById('complete-order-btn');
            if (completeOrderBtn) {
                completeOrderBtn.addEventListener('click', completeCheckoutOrder);
            }
            
            updateCompleteButton();
            
            console.log('✅ Checkout inicializado correctamente');
        } else {
            // Si no hay datos, deshabilitar todo en la página
            const completeOrderBtn = document.getElementById('complete-order-btn');
            if (completeOrderBtn) {
                completeOrderBtn.disabled = true;
            }
            
            const paymentConfirmedCheckbox = document.getElementById('payment-confirmed');
            if (paymentConfirmedCheckbox) {
                paymentConfirmedCheckbox.disabled = true;
            }
            
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.disabled = true;
            }
            
            // Mostrar mensaje adicional en la interfaz
            const uploadContainer = document.querySelector('.file-upload-container');
            if (uploadContainer) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'text-center p-4 text-red-500 bg-red-500/10 rounded-12 mt-4';
                errorMessage.innerHTML = `
                    <i class="ti ti-alert-triangle text-xl mb-2 block"></i>
                    <p class="font-medium">Por favor completa el formulario de compra primero</p>
                    <p class="text-sm mt-1">Redirigiendo...</p>
                `;
                uploadContainer.appendChild(errorMessage);
            }
        }
    } else {
        // Si no estamos en checkout, solo cargar datos normalmente
        console.log('✅ Formulario inicializado correctamente');
    }
});