class ActivityTimeline extends HTMLElement {
    constructor() {
        super();
        this.activities = [];
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
        this.loadActivities();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .timeline-container {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                }
                
                .timeline-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }
                
                .timeline-title {
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .refresh-btn {
                    padding: 0.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 0.375rem;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .refresh-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }
                
                .timeline {
                    position: relative;
                }
                
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 0.75rem;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: rgba(99, 102, 241, 0.3);
                }
                
                .timeline-item {
                    position: relative;
                    padding-left: 2.5rem;
                    margin-bottom: 1.5rem;
                    animation: fadeIn 0.5s ease-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .timeline-dot {
                    position: absolute;
                    left: 0;
                    top: 0.375rem;
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }
                
                .timeline-dot::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    filter: blur(4px);
                    opacity: 0.6;
                }
                
                .timeline-dot.success::before {
                    background: #10b981;
                }
                
                .timeline-dot.info::before {
                    background: #3b82f6;
                }
                
                .timeline-dot.warning::before {
                    background: #f59e0b;
                }
                
                .timeline-dot.error::before {
                    background: #ef4444;
                }
                
                .timeline-icon {
                    position: relative;
                    z-index: 1;
                    width: 0.75rem;
                    height: 0.75rem;
                    color: white;
                }
                
                .timeline-content {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    padding: 1rem;
                }
                
                .timeline-type {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.25rem;
                }
                
                .timeline-description {
                    color: white;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    margin-bottom: 0.5rem;
                }
                
                .timeline-time {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.75rem;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 2rem;
                    color: rgba(255, 255, 255, 0.5);
                }
                
                .empty-state i {
                    width: 3rem;
                    height: 3rem;
                    margin: 0 auto 1rem;
                    opacity: 0.5;
                }
            </style>
            
            <div class="timeline-container">
                <div class="timeline-header">
                    <h3 class="timeline-title">Recent Activities</h3>
                    <button class="refresh-btn" onclick="this.getRootNode().host.loadActivities()">
                        <i data-feather="refresh-cw" class="w-4 h-4"></i>
                    </button>
                </div>
                
                <div class="timeline">
                    ${this.activities.length === 0 ? `
                        <div class="empty-state">
                            <i data-feather="activity" class="w-12 h-12"></i>
                            <p>No recent activities</p>
                        </div>
                    ` : this.activities.map(activity => this.renderActivity(activity)).join('')}
                </div>
            </div>
        `;
        
        feather.replace();
    }

    renderActivity(activity) {
        const type = this.getActivityType(activity.type);
        const timeAgo = this.getTimeAgo(activity.timestamp);
        
        return `
            <div class="timeline-item">
                <div class="timeline-dot ${type.class}">
                    <i data-feather="${type.icon}" class="timeline-icon"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-type">${activity.type}</div>
                    <div class="timeline-description">${activity.description}</div>
                    <div class="timeline-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }

    getActivityType(type) {
        const types = {
            'New student admission': { icon: 'user-plus', class: 'success' },
            'Student updated': { icon: 'edit', class: 'info' },
            'Student deleted': { icon: 'trash', class: 'error' },
            'Status changed': { icon: 'refresh-cw', class: 'warning' },
            'Report generated': { icon: 'file-text', class: 'info' },
            'Data exported': { icon: 'download', class: 'success' }
        };
        
        return types[type] || { icon: 'activity', class: 'info' };
    }

    getTimeAgo(timestamp) {
        if (!timestamp) return 'Just now';
        
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }

    async loadActivities() {
        if (window.db) {
            try {
                const snapshot = await window.db.collection('activities')
                    .orderBy('timestamp', 'desc')
                    .limit(8)
                    .get();
                
                this.activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.render();
            } catch (error) {
                console.error('Error loading activities:', error);
            }
        }
    }
}

customElements.define('activity-timeline', ActivityTimeline);