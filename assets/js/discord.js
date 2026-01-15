const DISCORD_WEBHOOK_SHIPPING = 'https://discord.com/api/webhooks/1458624271893922007/KcHB-J6ALdjlBxt_EcDL3umkVFdMTx3QN43gfAMFflGcH2zOpPIjm8Xt2aVrSSQfsf07';
const CUPONES_VALIDOS = {
    'RAFAEL': 0.05,
    'PAUL': 0.05,
    'PLAYER': 0.05
};

let cuponAplicado = null;
let descuentoAplicado = 0;

// Función para obtener nombre del servidor del título
function obtenerNombreServidorDelTitulo() {
    const titulo = document.querySelector('title').textContent;
    const partes = titulo.split('-');
    if (partes.length > 1) {
        return partes[1].trim();
    }
    return '';
}

function guardarDatosOrden(gold, personaje, faccion, metodo, total) {
    const servidor = obtenerNombreServidorDelTitulo();
    
    const datosOrden = {
        gold: gold,
        personaje: personaje,
        faccion: faccion,
        metodo: metodo,
        total: total,
        servidor: servidor, // GUARDA el nombre del servidor
        timestamp: Date.now()
    };
    localStorage.setItem('wowOrdenData', JSON.stringify(datosOrden));
}

function obtenerFaccion() {
    const faccionRadio = document.querySelector('input[name="faction"]:checked');
    if (faccionRadio) {
        return faccionRadio.closest('label').querySelector('span.text-l-medium').textContent.trim();
    }
    return null;
}

function obtenerMetodoEntrega() {
    const metodoRadio = document.querySelector('input[name="delivery"]:checked');
    if (metodoRadio) {
        return metodoRadio.closest('label').querySelector('span.text-l-medium').textContent.trim();
    }
    return null;
}

function calcularPrecios(gold) {
    const cantidad = parseInt(gold) || 0;
    const precioBase = (cantidad / 100) * 2;
    
    let total = precioBase;
    if (cuponAplicado) {
        descuentoAplicado = precioBase * CUPONES_VALIDOS[cuponAplicado];
        total = precioBase - descuentoAplicado;
    }
    
    return {
        precioBase: precioBase.toFixed(2),
        descuento: descuentoAplicado.toFixed(2),
        total: total.toFixed(2)
    };
}

function aplicarCuponAutomatico(cupon) {
    const cuponUpper = cupon.trim().toUpperCase();
    
    if (CUPONES_VALIDOS[cuponUpper]) {
        cuponAplicado = cuponUpper;
        return true;
    } else {
        cuponAplicado = null;
        descuentoAplicado = 0;
        return false;
    }
}

async function enviarOrdenYDireccionar() {
    const gold = document.getElementById('contact').value.trim();
    const personaje = document.getElementById('shipping_address').value.trim();
    const faccion = obtenerFaccion();
    const metodo = obtenerMetodoEntrega();
    
    if (!gold || parseInt(gold) <= 0 || !personaje || !faccion || !metodo) {
        return;
    }
    
    const precios = calcularPrecios(gold);
    const goldSinDecimales = parseInt(gold).toString();
    const servidor = obtenerNombreServidorDelTitulo();
    
    // Guardar datos con el nombre del servidor
    guardarDatosOrden(gold, personaje, faccion, metodo, precios.total);
    
    let campoCupon = 'Ninguno';
    if (cuponAplicado) {
        campoCupon = `${cuponAplicado} - $${precios.descuento}`;
    }
    
    const mensaje = {
        embeds: [{
            title: "💰 NUEVA ORDEN DE GOLD - WoW",
            color: 0x00ff00,
            fields: [
                { name: "🧙‍♂️ PERSONAJE", value: personaje, inline: true },
                { name: "⚔️ FACCIÓN", value: faccion, inline: true },
                { name: "💰 GOLD", value: goldSinDecimales, inline: true },
                { name: "📦 MÉTODO", value: metodo, inline: true },
                { name: "💎 TOTAL", value: `$${precios.total}`, inline: true },
                { name: "🎫 CUPÓN", value: campoCupon, inline: true },
                { name: "🌍 SERVIDOR", value: servidor || "No especificado", inline: true }
            ],
            timestamp: new Date().toISOString()
        }],
        content: "@here **¡NUEVA ORDEN RECIBIDA!** 🎉"
    };
    
    try {
        await fetch(DISCORD_WEBHOOK_SHIPPING, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mensaje)
        });
        
        window.location.href = 'checkout.html';
    } catch (error) {
        window.location.href = 'checkout.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    const goldInput = document.getElementById('contact');
    const cuponInput = document.querySelector('input[name="coupon"]');
    
    if (goldInput) {
        function actualizarPrecios() {
            const precios = calcularPrecios(goldInput.value);
            const elementos = document.querySelectorAll('.bg-b-neutral-3 .text-l-medium.text-w-neutral-1');
            
            if (elementos.length >= 3) {
                elementos[0].textContent = `$${precios.total}`;
                elementos[1].textContent = '$0.00';
                elementos[2].textContent = `$${precios.total}`;
            }
        }
        
        goldInput.addEventListener('input', actualizarPrecios);
        
        if (cuponInput) {
            cuponInput.addEventListener('input', function() {
                aplicarCuponAutomatico(this.value);
                actualizarPrecios();
            });
        }
        
        actualizarPrecios();
    }
    
    const aplicarCuponBtn = document.querySelector('button[type="submit"]');
    
    if (aplicarCuponBtn && cuponInput && goldInput) {
        aplicarCuponBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const cupon = cuponInput.value.trim().toUpperCase();
            
            aplicarCuponAutomatico(cupon);
            const precios = calcularPrecios(goldInput.value);
            const elementos = document.querySelectorAll('.bg-b-neutral-3 .text-l-medium.text-w-neutral-1');
            
            if (elementos.length >= 3) {
                elementos[0].textContent = `$${precios.total}`;
                elementos[1].textContent = '$0.00';
                elementos[2].textContent = `$${precios.total}`;
            }
        });
    }
});

window.enviarOrdenYDireccionar = enviarOrdenYDireccionar;