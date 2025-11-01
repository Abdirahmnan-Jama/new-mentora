// Department data
const departments = [
    {
        name: "Health Science",
        image: "http://static.photos/medical/640x360/1",
        students: 2847,
        faculties: 156,
        popularity: 5,
        performance: 94,
        color: "from-green-400 to-emerald-600"
    },
    {
        name: "Computer Science",
        image: "http://static.photos/technology/640x360/2",
        students: 3256,
        faculties: 142,
        popularity: 5,
        performance: 96,
        color: "from-blue-400 to-indigo-600"
    },
    {
        name: "Sharia Science",
        image: "http://static.photos/education/640x360/3",
        students: 1892,
        faculties: 98,
        popularity: 4,
        performance: 91,
        color: "from-amber-400 to-orange-600"
    },
    {
        name: "Engineering",
        image: "http://static.photos/industry/640x360/4",
        students: 4123,
        faculties: 203,
        popularity: 5,
        performance: 93,
        color: "from-red-400 to-pink-600"
    },
    {
        name: "Business",
        image: "http://static.photos/finance/640x360/5",
        students: 3567,
        faculties: 178,
        popularity: 4,
        performance: 89,
        color: "from-purple-400 to-violet-600"
    },
    {
        name: "Social Science",
        image: "http://static.photos/people/640x360/6",
        students: 2345,
        faculties: 134,
        popularity: 4,
        performance: 87,
        color: "from-teal-400 to-cyan-600"
    }
];

// Create bubbles
function createBubbles() {
    const container = document.querySelector('.bubble-container');
    const bubbleCount = 15;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 100 + 50;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 10;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.top = `${top}%`;
        bubble.style.animationDelay = `${delay}s`;
        
        container.appendChild(bubble);
    }
}

// Create department cards
function createDepartmentCards() {
    const grid = document.getElementById('departments-grid');
    
    departments.forEach((dept, index) => {
        const card = document.createElement('div');
        card.className = 'dept-card glass-card rounded-3xl p-6';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Generate stars for popularity
        const stars = Array.from({ length: 5 }, (_, i) => 
            `<i data-feather="star" class="star w-4 h-4 ${i < dept.popularity ? 'fill-current' : ''}"></i>`
        ).join('');
        
        card.innerHTML = `
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Left side - Info -->
                <div class="flex-1 space-y-4">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-1">${dept.name}</h2>
                        <div class="h-1 w-20 bg-gradient-to-r ${dept.color} rounded-full"></div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="stat-item">
                            <div class="flex items-center gap-2 text-gray-300">
                                <i data-feather="users" class="w-4 h-4"></i>
                                <span class="text-sm">Students</span>
                            </div>
                            <p class="text-xl font-bold text-white mt-1">${dept.students.toLocaleString()}</p>
                        </div>
                        
                        <div class="stat-item">
                            <div class="flex items-center gap-2 text-gray-300">
                                <i data-feather="user-check" class="w-4 h-4"></i>
                                <span class="text-sm">Faculties</span>
                            </div>
                            <p class="text-xl font-bold text-white mt-1">${dept.faculties}</p>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-300">Popularity</span>
                            <div class="star-rating">${stars}</div>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-300">Performance</span>
                            <span class="text-sm font-bold text-white">${dept.performance}%</span>
                        </div>
                        <div class="performance-bar">
                            <div class="performance-fill" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Right side - Image -->
                <div class="flex-1">
                    <div class="dept-image h-64 lg:h-full">
                        <img src="${dept.image}" alt="${dept.name}" class="w-full h-full" />
                    </div>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Animate performance bars
    setTimeout(() => {
        document.querySelectorAll('.performance-fill').forEach((bar, index) => {
            bar.style.width = `${departments[index].performance}%`;
        });
    }, 500);
    
    feather.replace();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    createDepartmentCards();
    
    // Add hover effects to cards
    document.querySelectorAll('.dept-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const stars = card.querySelectorAll('.star');
            stars.forEach((star, index) => {
                setTimeout(() => {
                    star.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        star.style.transform = 'scale(1)';
                    }, 150);
                }, index * 50);
            });
        });
    });
});