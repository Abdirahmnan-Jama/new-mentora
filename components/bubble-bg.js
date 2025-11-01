class BubbleBackground extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    overflow: hidden;
                }
                
                .bubble {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.1);
                    filter: blur(60px);
                    animation: float 15s infinite ease-in-out;
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    50% {
                        transform: translateY(-100px) translateX(50px);
                    }
                }
            </style>
            <div id="bubbles"></div>
        `;
        
        this.createBubbles();
    }
    
    createBubbles() {
        const bubblesContainer = this.shadowRoot.getElementById('bubbles');
        const colors = [
            'rgba(99, 102, 241, 0.1)',  // indigo
            'rgba(217, 70, 239, 0.1)',  // pink
            'rgba(6, 182, 212, 0.1)',   // cyan
            'rgba(139, 92, 246, 0.1)'    // violet
        ];
        
        for (let i = 0; i < 10; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            const size = Math.random() * 300 + 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.background = color;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.top = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 15 + 10}s`;
            bubble.style.animationDelay = `${Math.random() * 5}s`;
            
            bubblesContainer.appendChild(bubble);
        }
    }
}

customElements.define('bubble-background', BubbleBackground);