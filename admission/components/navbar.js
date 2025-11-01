class MentoraNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 70px;
                    background: rgba(17, 24, 39, 0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .navbar {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                }
                
                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                
                .page-title {
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.875rem;
                }
                
                .breadcrumb-separator {
                    color: rgba(255, 255, 255, 0.4);
                }
                
                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .search-container {
                    position: relative;
                }
                
                .search-input {
                    width: 300px;
                    padding: 0.5rem 1rem 0.5rem 2.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: #6366f1;
                    background: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
                
                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.5);
                }
                
                .notification-btn {
                    position: relative;
                    padding: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .notification-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                
                .notification-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
                
                .user-menu {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .user-menu:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .user-name {
                    color: white;
                    font-weight: 500;
                    font-size: 0.875rem;
                }
                
                .user-role {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.75rem;
                }
                
                .user-avatar-small {
                    position: relative;
                    width: 2rem;
                    height: 2rem;
                    background: rgba(99, 102, 241, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6366f1;
                }
            </style>
            
            <div class="navbar">
                <div class="navbar-left">
                    <div class="page-title">Admission Portal</div>
                    <nav class="breadcrumb">
                        <span>Dashboard</span>
                        <span class="breadcrumb-separator">/</span>
                        <span>Students</span>
                    </nav>
                </div>
                
                <div class="navbar-right">
                    <div class="search-container">
                        <i data-feather="search" class="search-icon"></i>
                        <input type="text" class="search-input" placeholder="Search anything...">
                    </div>
                    
                    <button class="notification-btn">
                        <i data-feather="bell" class="w-5 h-5"></i>
                        <span class="notification-badge"></span>
                    </button>
                    
                    <div class="user-menu">
                        <div class="user-avatar-small">
                            <i data-feather="user" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <div class="user-name">Admin User</div>
                            <div class="user-role">Admission Officer</div>
                        </div>
                        <i data-feather="chevron-down" class="w-4 h-4 text-gray-400"></i>
                    </div>
                </div>
            </div>
        `;
        
        feather.replace();
    }
}

customElements.define('mentora-navbar', MentoraNavbar);