// chat-system.js
class DiscordChatSystem {
    constructor() {
        this.DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1461460831765008486/wxzCCvW1HzRWcqS5eSJeqwyMFmxVdLcZi0I75CqgmPMGUXhmMa4QDVHmqS_D0PLzLJpu';
        this.BACKEND_URL = 'http://localhost:3000'; // NECESITAS ESTE SERVIDOR
        this.ws = null;
        this.sessionId = null;
        this.userName = 'Usuario Web';
        this.userAvatar = 'assets/images/users/avatar3.png';
        
        this.init();
    }
    
    async init() {
        await this.loadConfig();
        this.initWebSocket();
        this.setupEventListeners();
        this.loadInitialMessages();
    }
    
    async loadConfig() {
        // Cargar configuración desde localStorage
        const savedName = localStorage.getItem('chat_username');
        if (savedName) this.userName = savedName;
        
        // Permitir al usuario cambiar su nombre
        const name = prompt('¿Cuál es tu nombre?', this.userName);
        if (name && name.trim()) {
            this.userName = name.trim();
            localStorage.setItem('chat_username', this.userName);
        }
    }
    
    initWebSocket() {
        try {
            this.ws = new WebSocket(`ws://localhost:8080/chat`);
            
            this.ws.onopen = () => {
                console.log('✅ Conectado al chat');
                this.showNotification('Chat conectado', 'success');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('❌ Desconectado del chat');
                this.showNotification('Desconectado - Reconectando...', 'warning');
                setTimeout(() => this.initWebSocket(), 3000);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
        } catch (error) {
            console.error('Error inicializando WebSocket:', error);
        }
    }
    
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'session':
                this.sessionId = data.sessionId;
                console.log('Sesión ID:', this.sessionId);
                break;
                
            case 'new_message':
                this.addMessageToUI(data.message);
                break;
                
            case 'history':
                if (data.messages && Array.isArray(data.messages)) {
                    data.messages.forEach(msg => this.addMessageToUI(msg));
                }
                break;
        }
    }
    
    setupEventListeners() {
        // Botón de enviar
        const sendBtn = document.querySelector('button[type="button"] .ti-send')?.closest('button');
        const messageInput = document.querySelector('input[placeholder*="Type Your message"]');
        
        if (sendBtn && messageInput) {
            sendBtn.onclick = () => this.sendMessage();
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Botones de adjuntar archivos y emojis
        const attachBtn = document.querySelector('.ti-link')?.closest('button');
        const emojiBtn = document.querySelector('.ti-mood-smile')?.closest('button');
        
        if (attachBtn) {
            attachBtn.onclick = () => this.attachFile();
        }
        
        if (emojiBtn) {
            emojiBtn.onclick = () => this.showEmojiPicker();
        }
        
        // Botones de video y llamada
        const videoBtn = document.querySelector('.ti-video')?.closest('button');
        const phoneBtn = document.querySelector('.ti-phone')?.closest('button');
        
        if (videoBtn) videoBtn.onclick = () => alert('Funcionalidad de video por implementar');
        if (phoneBtn) phoneBtn.onclick = () => alert('Funcionalidad de llamada por implementar');
    }
    
    async sendMessage() {
        const input = document.querySelector('input[placeholder*="Type Your message"]');
        const message = input?.value.trim();
        
        if (!message) return;
        
        // Verificar conexión
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.showNotification('No hay conexión con el servidor', 'error');
            return;
        }
        
        // Crear objeto mensaje
        const messageData = {
            type: 'user_message',
            text: message,
            username: this.userName,
            avatar: this.userAvatar,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        try {
            // Enviar a través de WebSocket
            this.ws.send(JSON.stringify(messageData));
            
            // Enviar también a Discord directamente (si no hay servidor backend)
            await this.sendToDiscordDirect(message);
            
            // Agregar mensaje propio a la UI inmediatamente
            this.addMessageToUI({
                user: this.userName,
                text: message,
                timestamp: messageData.timestamp,
                avatar: this.userAvatar,
                isWebUser: true
            });
            
            // Limpiar input
            if (input) input.value = '';
            
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.showNotification('Error enviando mensaje', 'error');
        }
    }
    
    async sendToDiscordDirect(message) {
        try {
            // Enviar directamente a Discord usando Fetch API
            const response = await fetch(this.DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: `**${this.userName}:** ${message}`,
                    username: this.userName.substring(0, 80),
                    avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
                })
            });
            
            if (!response.ok) {
                console.warn('Discord responded with:', response.status);
            }
            
        } catch (error) {
            console.warn('No se pudo enviar a Discord directamente (problema de CORS):', error);
        }
    }
    
    addMessageToUI(messageData) {
        const chatContainer = document.querySelector('.grid.gap-y-60p, .grid.gap-y-40p');
        if (!chatContainer) return;
        
        const isFromWebUser = messageData.isWebUser || messageData.user === this.userName;
        
        // Crear elemento HTML del mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex justify-${isFromWebUser ? 'end' : 'start'}`;
        
        const avatarSrc = messageData.avatar || (isFromWebUser ? 
            'assets/images/users/avatar3.png' : 
            'assets/images/users/avatar1.png');
        
        messageDiv.innerHTML = `
            <div class="flex ${isFromWebUser ? 'max-sm:flex-col-reverse items-end' : 'sm:items-end max-sm:flex-col'} gap-x-30p gap-y-20p">
                ${!isFromWebUser ? `
                    <img class="shrink-0 avatar size-60p" src="${avatarSrc}" alt="${messageData.user}" />
                ` : ''}
                
                <div class="flex ${isFromWebUser ? 'items-end max-sm:flex-col-reverse' : 'sm:items-end max-sm:flex-col'} gap-x-30p gap-y-20p">
                    ${isFromWebUser ? `
                        <span class="shrink-0 text-base text-w-neutral-4">
                            ${messageData.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    ` : ''}
                    
                    <div class="p-24p ${isFromWebUser ? 'bg-glass-8 rounded-t-3xl rounded-bl-3xl' : 'bg-glass-1 rounded-t-3xl rounded-br-3xl'} text-base text-w-neutral-3 max-w-[566px]">
                        <p>${this.escapeHtml(messageData.text)}</p>
                    </div>
                    
                    ${!isFromWebUser ? `
                        <span class="shrink-0 text-base text-w-neutral-4">
                            ${messageData.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    ` : ''}
                </div>
                
                ${isFromWebUser ? `
                    <img class="shrink-0 avatar size-60p" src="${avatarSrc}" alt="${messageData.user}" />
                ` : ''}
            </div>
        `;
        
        // Agregar al chat
        chatContainer.appendChild(messageDiv);
        
        // Auto-scroll al último mensaje
        this.scrollToBottom();
        
        // Sonido de notificación (opcional)
        if (!isFromWebUser) {
            this.playNotificationSound();
        }
    }
    
    scrollToBottom() {
        const chatScroll = document.querySelector('.h-screen.overflow-y-auto.scrollbar-sm');
        if (chatScroll) {
            setTimeout(() => {
                chatScroll.scrollTop = chatScroll.scrollHeight;
            }, 100);
        }
    }
    
    playNotificationSound() {
        // Puedes agregar un sonido de notificación aquí
        console.log('Nuevo mensaje recibido');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación toast
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
        } z-50`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    attachFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*,.pdf,.doc,.docx';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.sendFile(file);
            }
        };
        
        input.click();
    }
    
    async sendFile(file) {
        // Implementar envío de archivos
        this.showNotification('Envío de archivos por implementar', 'info');
    }
    
    showEmojiPicker() {
        // Implementar selector de emojis
        const emojis = ['😀', '😂', '😊', '😍', '🤔', '🎉', '👍', '❤️'];
        const picker = document.createElement('div');
        picker.className = 'fixed bottom-20 right-4 bg-glass-7 p-4 rounded-lg grid grid-cols-4 gap-2';
        
        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'text-2xl p-2 hover:bg-glass-6 rounded';
            btn.textContent = emoji;
            btn.onclick = () => {
                const input = document.querySelector('input[placeholder*="Type Your message"]');
                if (input) input.value += emoji;
                picker.remove();
            };
            picker.appendChild(btn);
        });
        
        document.body.appendChild(picker);
        
        // Cerrar al hacer clic fuera
        setTimeout(() => {
            const closePicker = (e) => {
                if (!picker.contains(e.target)) {
                    picker.remove();
                    document.removeEventListener('click', closePicker);
                }
            };
            document.addEventListener('click', closePicker);
        }, 100);
    }
    
    loadInitialMessages() {
        // Cargar mensajes iniciales del localStorage
        const savedMessages = localStorage.getItem('chat_messages');
        if (savedMessages) {
            try {
                const messages = JSON.parse(savedMessages);
                messages.forEach(msg => this.addMessageToUI(msg));
            } catch (error) {
                console.error('Error loading saved messages:', error);
            }
        }
    }
    
    saveMessageToLocal(message) {
        const saved = localStorage.getItem('chat_messages') || '[]';
        const messages = JSON.parse(saved);
        messages.push(message);
        
        // Mantener solo los últimos 50 mensajes
        if (messages.length > 50) {
            messages.splice(0, messages.length - 50);
        }
        
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.chatSystem = new DiscordChatSystem();
});