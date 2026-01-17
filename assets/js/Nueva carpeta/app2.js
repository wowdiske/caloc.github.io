// gold-calculator.js
document.addEventListener('DOMContentLoaded', function() {
    // Constantes del cálculo
    const PRICE_PER_100_GOLD = 2.00;
    const TAX_AMOUNT = 0.00;
    
    // Elementos del DOM
    const goldInput = document.querySelector('input[name="contact"]');
    const subtotalElement = document.querySelector('.bg-b-neutral-3.py-32p.px-40p.rounded-12 .flex-y.justify-between.gap-3.mb-3 .text-l-medium.text-w-neutral-1:nth-child(2)');
    const taxElement = document.querySelector('.bg-b-neutral-3.py-32p.px-40p.rounded-12 .flex-y.justify-between.gap-3.mb-20p .text-l-medium.text-w-neutral-1:nth-child(2)');
    const totalElement = document.querySelector('.bg-b-neutral-3.py-32p.px-40p.rounded-12 .flex-y.justify-between.gap-3.pt-20p.border-t.border-shap .text-l-medium.text-w-neutral-1:nth-child(2)');
    
    // Verificar que los elementos existen
    if (!goldInput || !subtotalElement || !taxElement || !totalElement) {
        console.error('No se encontraron los elementos necesarios para el cálculo');
        return;
    }
    
    // Función para calcular el precio
    function calculatePrice(goldAmount) {
        // Si no hay valor o es 0, mostrar 0
        if (!goldAmount || goldAmount <= 0) {
            return {
                subtotal: 0,
                tax: 0,
                total: 0
            };
        }
        
        // Calcular subtotal: por cada 100 gold = $2.00
        // Ejemplo: 100 gold = $2, 50 gold = $1, 150 gold = $3
        const subtotal = (goldAmount / 100) * PRICE_PER_100_GOLD;
        
        // Redondear a 2 decimales
        const roundedSubtotal = Math.round(subtotal * 100) / 100;
        
        return {
            subtotal: roundedSubtotal,
            tax: TAX_AMOUNT,
            total: roundedSubtotal + TAX_AMOUNT
        };
    }
    
    // Función para actualizar los precios en la interfaz
    function updatePrices(goldAmount) {
        const prices = calculatePrice(goldAmount);
        
        // Formatear a 2 decimales con formato de moneda
        subtotalElement.textContent = `$${prices.subtotal.toFixed(2)}`;
        taxElement.textContent = `$${prices.tax.toFixed(2)}`;
        totalElement.textContent = `$${prices.total.toFixed(2)}`;
    }
    
    // Event listener para cambios en el input
    goldInput.addEventListener('input', function() {
        const goldAmount = parseFloat(this.value) || 0;
        updatePrices(goldAmount);
    });
    
    // Event listener para eventos keyup (incluyendo borrar)
    goldInput.addEventListener('keyup', function() {
        const goldAmount = parseFloat(this.value) || 0;
        updatePrices(goldAmount);
    });
    
    // Event listener para cambios (para navegadores antiguos)
    goldInput.addEventListener('change', function() {
        const goldAmount = parseFloat(this.value) || 0;
        updatePrices(goldAmount);
    });
    
    // Inicializar con el valor actual si existe
    if (goldInput.value) {
        const initialGoldAmount = parseFloat(goldInput.value) || 0;
        updatePrices(initialGoldAmount);
    } else {
        // Mostrar valores iniciales
        updatePrices(0);
    }
    
    // También escuchar eventos de teclado para mejor UX
    goldInput.addEventListener('keydown', function(e) {
        // Permitir solo números, punto decimal, y teclas de control
        if (!/[\d\.]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
            e.preventDefault();
        }
    });
    
    // Validar entrada para evitar múltiples puntos decimales
    goldInput.addEventListener('input', function() {
        // Remover puntos decimales adicionales
        const value = this.value;
        const parts = value.split('.');
        if (parts.length > 2) {
            this.value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Asegurar que no empiece con punto
        if (value.startsWith('.')) {
            this.value = '0' + value;
        }
    });
});











// radio-selection.js
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los grupos de radio buttons
    const factionRadios = document.querySelectorAll('input[name="payment"][value="bank"], input[name="payment"][value="card"]');
    const deliveryRadios = document.querySelectorAll('input[name="payment"][value="shipping_address"], input[name="payment"][value="billing_address"]');
    
    // Función para manejar la selección de facciones (Alianza/Horda)
    function setupFactionSelection() {
        factionRadios.forEach(radio => {
            // Añadir evento de click a cada radio button
            radio.addEventListener('click', function() {
                // Remover la clase de selección visual si existe
                factionRadios.forEach(r => {
                    const parentDiv = r.closest('.border-input-1');
                    if (parentDiv) {
                        parentDiv.classList.remove('selected-faction');
                    }
                    
                    // Remover selección visual del círculo
                    const checkmark = r.nextElementSibling;
                    if (checkmark && checkmark.classList.contains('checkmark')) {
                        checkmark.classList.remove('checkmark-selected-faction');
                    }
                });
                
                // Añadir clase de selección visual al padre del radio seleccionado
                const selectedParent = this.closest('.border-input-1');
                if (selectedParent) {
                    selectedParent.classList.add('selected-faction');
                }
                
                // Añadir clase de selección visual al círculo (checkmark)
                const checkmark = this.nextElementSibling;
                if (checkmark && checkmark.classList.contains('checkmark')) {
                    checkmark.classList.add('checkmark-selected-faction');
                }
            });
            
            // Añadir evento de cambio para asegurar la selección
            radio.addEventListener('change', function() {
                // Si este radio está seleccionado, asegurar la clase visual
                if (this.checked) {
                    factionRadios.forEach(r => {
                        const parentDiv = r.closest('.border-input-1');
                        if (parentDiv) {
                            parentDiv.classList.remove('selected-faction');
                        }
                        
                        // Remover selección visual del círculo
                        const checkmark = r.nextElementSibling;
                        if (checkmark && checkmark.classList.contains('checkmark')) {
                            checkmark.classList.remove('checkmark-selected-faction');
                        }
                    });
                    
                    const selectedParent = this.closest('.border-input-1');
                    if (selectedParent) {
                        selectedParent.classList.add('selected-faction');
                    }
                    
                    // Añadir selección visual al círculo
                    const checkmark = this.nextElementSibling;
                    if (checkmark && checkmark.classList.contains('checkmark')) {
                        checkmark.classList.add('checkmark-selected-faction');
                    }
                }
            });
        });
    }
    
    // Función para manejar la selección de métodos de entrega
    function setupDeliverySelection() {
        deliveryRadios.forEach(radio => {
            // Añadir evento de click a cada radio button de entrega
            radio.addEventListener('click', function() {
                // Remover la clase de selección visual de todos los métodos de entrega
                deliveryRadios.forEach(r => {
                    const parentDiv = r.closest('.border-input-1');
                    if (parentDiv) {
                        parentDiv.classList.remove('selected-delivery');
                    }
                    
                    // Remover selección visual del círculo
                    const checkmark = r.nextElementSibling;
                    if (checkmark && checkmark.classList.contains('checkmark')) {
                        checkmark.classList.remove('checkmark-selected-delivery');
                    }
                });
                
                // Añadir clase de selección visual al padre del radio seleccionado
                const selectedParent = this.closest('.border-input-1');
                if (selectedParent) {
                    selectedParent.classList.add('selected-delivery');
                }
                
                // Añadir clase de selección visual al círculo (checkmark)
                const checkmark = this.nextElementSibling;
                if (checkmark && checkmark.classList.contains('checkmark')) {
                    checkmark.classList.add('checkmark-selected-delivery');
                }
            });
            
            // Añadir evento de cambio para asegurar la selección
            radio.addEventListener('change', function() {
                // Si este radio está seleccionado, asegurar la clase visual
                if (this.checked) {
                    deliveryRadios.forEach(r => {
                        const parentDiv = r.closest('.border-input-1');
                        if (parentDiv) {
                            parentDiv.classList.remove('selected-delivery');
                        }
                        
                        // Remover selección visual del círculo
                        const checkmark = r.nextElementSibling;
                        if (checkmark && checkmark.classList.contains('checkmark')) {
                            checkmark.classList.remove('checkmark-selected-delivery');
                        }
                    });
                    
                    const selectedParent = this.closest('.border-input-1');
                    if (selectedParent) {
                        selectedParent.classList.add('selected-delivery');
                    }
                    
                    // Añadir selección visual al círculo
                    const checkmark = this.nextElementSibling;
                    if (checkmark && checkmark.classList.contains('checkmark')) {
                        checkmark.classList.add('checkmark-selected-delivery');
                    }
                }
            });
        });
    }
    
    // Estilo CSS para las selecciones visuales
    function addVisualStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para las facciones (Alianza/Horda) */
            .selected-faction {
                border-color: #3b82f6 !important;
                background-color: rgba(59, 130, 246, 0.1) !important;
            }
            
            .checkmark-selected-faction {
                background-color: #3b82f6 !important;
                border-color: #3b82f6 !important;
            }
            
            .checkmark-selected-faction:after {
                display: block !important;
                background-color: white !important;
            }
            
            /* Estilos para los métodos de entrega */
            .selected-delivery {
                border-color: #10b981 !important;
                background-color: rgba(16, 185, 129, 0.1) !important;
            }
            
            .checkmark-selected-delivery {
                background-color: #10b981 !important;
                border-color: #10b981 !important;
            }
            
            .checkmark-selected-delivery:after {
                display: block !important;
                background-color: white !important;
            }
            
            /* Estilos base */
            .border-input-1 {
                transition: all 0.2s ease;
            }
            
            /* Estilos para el checkmark seleccionado */
            .checkmark {
                transition: all 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Inicializar
    function init() {
        setupFactionSelection();
        setupDeliverySelection();
        addVisualStyles();
        
        // Verificar si hay selecciones iniciales y aplicar estilos
        setTimeout(() => {
            // Para facciones
            factionRadios.forEach(radio => {
                if (radio.checked) {
                    const parentDiv = radio.closest('.border-input-1');
                    if (parentDiv) {
                        parentDiv.classList.add('selected-faction');
                    }
                    
                    // Aplicar estilo al círculo
                    const checkmark = radio.nextElementSibling;
                    if (checkmark && checkmark.classList.contains('checkmark')) {
                        checkmark.classList.add('checkmark-selected-faction');
                    }
                }
            });
            
            // Para métodos de entrega
            deliveryRadios.forEach(radio => {
                if (radio.checked) {
                    const parentDiv = radio.closest('.border-input-1');
                    if (parentDiv) {
                        parentDiv.classList.add('selected-delivery');
                    }
                    
                    // Aplicar estilo al círculo
                    const checkmark = radio.nextElementSibling;
                    if (checkmark && checkmark.classList.contains('checkmark')) {
                        checkmark.classList.add('checkmark-selected-delivery');
                    }
                }
            });
        }, 100);
    }
    
    // Inicializar el script
    init();
    
    // Manejar cambios dinámicos en el DOM si es necesario
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Volver a configurar si se añaden nuevos elementos
                setTimeout(() => {
                    setupFactionSelection();
                    setupDeliverySelection();
                }, 100);
            }
        });
    });
    
    // Observar cambios en el body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});