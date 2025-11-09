// Students List | Mentora - JavaScript
// This file handles all interactive functionality for the Students Database page.

document.addEventListener('DOMContentLoaded', function() {
    // Configuration and state
    const state = {
        currentView: 'table', // 'table' or 'cards'
        searchTerm: '',
        departmentFilter: '',
        students: [],
        filteredStudents: [],
        activeModalStudent: null,
        animationTimeline: null
    };

    // Sample students data (in real app, this would come from an API)
    const studentsData = [
        {
            id: 'STU001',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@university.edu',
            phone: '+1 (555) 123-4567',
            department: 'Medicine & Health Sciences',
            year: 'Year 3',
            gpa: 3.8,
            attendance: 92,
            feeStatus: 'Paid',
            feePercentage: 100,
            assignmentCompletion: 88,
            examPerformance: 85,
            dob: '1999-03-15',
            enrollmentDate: '2021-09-01',
            status: 'Active'
        },
        {
            id: 'STU002',
            name: 'Michael Chen',
            email: 'michael.chen@university.edu',
            phone: '+1 (555) 234-5678',
            department: 'Technology & Engineering',
            year: 'Year 2',
            gpa: 3.6,
            attendance: 78,
            feeStatus: 'Partial',
            feePercentage: 75,
            assignmentCompletion: 82,
            examPerformance: 79,
            dob: '2000-07-22',
            enrollmentDate: '2022-09-01',
            status: 'Active'
        },
        {
            id: 'STU003',
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@university.edu',
            phone: '+1 (555) 345-6789',
            department: 'Business & Management',
            year: 'Year 4',
            gpa: 3.9,
            attendance: 95,
            feeStatus: 'Paid',
            feePercentage: 100,
            assignmentCompletion: 95,
            examPerformance: 91,
            dob: '1998-11-10',
            enrollmentDate: '2020-09-01',
            status: 'Active'
        },
        
    ];

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'active': return 'status-active';
            case 'warning': return 'status-warning';
            case 'inactive': return 'status-danger';
            default: return 'status-active';
        }
    }

    function getFeeStatusClass(feeStatus) {
        switch (feeStatus.toLowerCase()) {
            case 'paid': return 'text-green-400';
            case 'partial': return 'text-yellow-400';
            case 'pending': return 'text-red-400';
            default: return 'text-gray-400';
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Data filtering
    function filterStudents() {
        state.filteredStudents = state.students.filter(student => {
            const matchesSearch = !state.searchTerm || 
                student.name.toLowerCase().includes(state.searchTerm) ||
                student.email.toLowerCase().includes(state.searchTerm) ||
                student.id.toLowerCase().includes(state.searchTerm) ||
                student.department.toLowerCase().includes(state.searchTerm);

            const matchesDepartment = !state.departmentFilter || 
                student.department === state.departmentFilter;

            return matchesSearch && matchesDepartment;
        });
    }

    // Table rendering
    function renderTable() {
        const tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (state.filteredStudents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12 text-gray-400">
                        <i data-feather="users" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                        <p class="text-lg">No students found</p>
                        <p class="text-sm">Try adjusting your search or filter criteria</p>
                    </td>
                </tr>
            `;
        } else {
            state.filteredStudents.forEach((student, index) => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-primary-500/10 transition-colors duration-200';
                row.setAttribute('data-aos', 'fade-up');
                row.setAttribute('data-aos-delay', (index * 50).toString());

                row.innerHTML = `
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <i data-feather="user" class="w-5 h-5 text-white"></i>
                            </div>
                            <div>
                                <div class="font-medium text-white">${student.name}</div>
                                <div class="text-sm text-gray-400">${student.id}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-300">${student.department}</td>
                    <td class="px-6 py-4 text-gray-300">${student.year}</td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <div class="progress-bar w-20">
                                <div class="progress-fill bg-primary-500" style="width: 0%"></div>
                            </div>
                            <span class="text-sm text-gray-300">${student.attendance}%</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="${getFeeStatusClass(student.feeStatus)} font-medium">${student.feeStatus}</span>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <button class="p-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 transition-colors" 
                                    onclick="openStudentModal('${student.id}')" title="View Details">
                                <i data-feather="eye" class="w-4 h-4"></i>
                            </button>
                            <button class="p-2 rounded-lg bg-secondary-500/20 hover:bg-secondary-500/30 text-secondary-400 transition-colors" 
                                    onclick="editStudent('${student.id}')" title="Edit">
                                <i data-feather="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button class="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors" 
                                    onclick="deleteStudent('${student.id}')" title="Delete">
                                <i data-feather="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                `;

                tbody.appendChild(row);
            });
        }

        // Replace feather icons in the table
        setTimeout(() => {
            feather.replace();
            animateTableProgressBars();
        }, 0);
    }

    // Card rendering
    function renderCards() {
        const container = document.getElementById('studentsCardsGrid');
        if (!container) return;

        container.innerHTML = '';

        if (state.filteredStudents.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-400">
                    <i data-feather="users" class="w-16 h-16 mx-auto mb-4 opacity-50"></i>
                    <p class="text-xl mb-2">No students found</p>
                    <p class="text-sm">Try adjusting your search or filter criteria</p>
                </div>
            `;
        } else {
            state.filteredStudents.forEach((student, index) => {
                const card = document.createElement('div');
                card.className = 'student-card p-6 hover-lift';
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-delay', (index * 100).toString());
                card.onclick = () => openStudentModal(student.id);

                card.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <i data-feather="user" class="w-7 h-7 text-white"></i>
                        </div>
                        <span class="status-indicator ${getStatusClass(student.status)}">
                            <i data-feather="circle" class="w-3 h-3"></i>
                            ${student.status}
                        </span>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-white mb-1">${student.name}</h3>
                    <p class="text-sm text-gray-400 mb-3">${student.id}</p>
                    <p class="text-sm text-gray-300 mb-4">${student.department}</p>
                    
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs text-gray-400">Attendance</span>
                                <span class="text-xs text-primary-400 font-medium">${student.attendance}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-primary-500" style="width: 0%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs text-gray-400">GPA</span>
                                <span class="text-xs text-accent-400 font-medium">${student.gpa}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-accent-500" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
                        <span class="text-sm text-gray-400">${student.year}</span>
                        <span class="${getFeeStatusClass(student.feeStatus)} font-medium text-sm">${student.feeStatus}</span>
                    </div>
                `;

                container.appendChild(card);
            });
        }

        // Replace feather icons and animate progress bars
        setTimeout(() => {
            feather.replace();
            animateCardProgressBars();
        }, 0);
    }

    // Progress bar animations
    function animateTableProgressBars() {
        const bars = document.querySelectorAll('#studentsTableBody .progress-fill');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                const student = state.filteredStudents[Math.floor(index / 2)]; // Each student has 2 bars
                if (student) {
                    gsap.to(bar, {
                        width: `${student.attendance}%`,
                        duration: 1.5,
                        ease: "power2.out",
                        delay: 0.1
                    });
                }
            }, index * 100);
        });
    }

    function animateCardProgressBars() {
        const cards = document.querySelectorAll('#studentsCardsGrid .student-card');
        cards.forEach((card, index) => {
            const bars = card.querySelectorAll('.progress-fill');
            const student = state.filteredStudents[index];
            
            if (student && bars.length >= 2) {
                setTimeout(() => {
                    gsap.to(bars[0], {
                        width: `${student.attendance}%`,
                        duration: 1.5,
                        ease: "power2.out",
                        delay: 0.2
                    });
                    gsap.to(bars[1], {
                        width: `${(student.gpa / 4.0) * 100}%`,
                        duration: 1.5,
                        ease: "power2.out",
                        delay: 0.3
                    });
                }, index * 150);
            }
        });
    }

    function animateModalProgressBars(student) {
        const attendanceBar = document.getElementById('attendanceBar');
        const examBar = document.getElementById('examBar');
        const feeBar = document.getElementById('feeBar');
        const assignmentBar = document.getElementById('assignmentBar');

        if (attendanceBar) {
            gsap.to(attendanceBar, {
                width: `${student.attendance}%`,
                duration: 1.5,
                ease: "power2.out"
            });
        }

        if (examBar) {
            gsap.to(examBar, {
                width: `${student.examPerformance}%`,
                duration: 1.5,
                ease: "power2.out",
                delay: 0.2
            });
        }

        if (feeBar) {
            gsap.to(feeBar, {
                width: `${student.feePercentage}%`,
                duration: 1.5,
                ease: "power2.out",
                delay: 0.4
            });
        }

        if (assignmentBar) {
            gsap.to(assignmentBar, {
                width: `${student.assignmentCompletion}%`,
                duration: 1.5,
                ease: "power2.out",
                delay: 0.6
            });
        }
    }

    // View management
    function switchView(view) {
        state.currentView = view;
        
        const tableViewBtn = document.getElementById('tableView');
        const cardViewBtn = document.getElementById('cardView');
        const tableContent = document.getElementById('tableViewContent');
        const cardContent = document.getElementById('cardViewContent');

        if (tableViewBtn && cardViewBtn && tableContent && cardContent) {
            if (view === 'table') {
                tableViewBtn.classList.add('active');
                cardViewBtn.classList.remove('active');
                tableContent.classList.remove('hidden');
                cardContent.classList.add('hidden');
                setTimeout(() => {
                    renderTable();
                    animateTableProgressBars();
                }, 100);
            } else {
                cardViewBtn.classList.add('active');
                tableViewBtn.classList.remove('active');
                cardContent.classList.remove('hidden');
                tableContent.classList.add('hidden');
                setTimeout(() => {
                    renderCards();
                    animateCardProgressBars();
                }, 100);
            }
        }
    }

    // Modal functionality
    function openStudentModal(studentId) {
        const student = state.students.find(s => s.id === studentId);
        if (!student) return;

        state.activeModalStudent = student;
        const modal = document.getElementById('studentModal');
        
        if (!modal) return;

        // Populate modal content
        document.getElementById('modalName').textContent = student.name;
        document.getElementById('modalDepartment').textContent = student.department;
        document.getElementById('modalStudentId').textContent = student.id;
        document.getElementById('modalFullName').textContent = student.name;
        document.getElementById('modalEmail').textContent = student.email;
        document.getElementById('modalPhone').textContent = student.phone;
        document.getElementById('modalDOB').textContent = formatDate(student.dob);
        document.getElementById('modalDept').textContent = student.department;
        document.getElementById('modalYear').textContent = student.year;
        document.getElementById('modalGPA').textContent = student.gpa.toFixed(1);
        document.getElementById('modalEnrollment').textContent = formatDate(student.enrollmentDate);
        document.getElementById('modalStatus').textContent = student.status;
        
        // Populate academic summary
        document.getElementById('summaryGPA').textContent = student.gpa.toFixed(2);
        document.getElementById('summaryCredits').textContent = '120';
        document.getElementById('summaryCourses').textContent = '15';
        document.getElementById('summarySemester').textContent = student.year;

        // Set progress percentages
        const attendancePercentage = document.getElementById('attendancePercentage');
        const examPercentage = document.getElementById('examPercentage');
        const feePercentage = document.getElementById('feePercentage');
        const assignmentPercentage = document.getElementById('assignmentPercentage');

        if (attendancePercentage) attendancePercentage.textContent = `${student.attendance}%`;
        if (examPercentage) examPercentage.textContent = `${student.examPerformance}%`;
        if (feePercentage) feePercentage.textContent = `${student.feePercentage}%`;
        if (assignmentPercentage) assignmentPercentage.textContent = `${student.assignmentCompletion}%`;

        // Reset tab to personal info
        switchTab('personal');

        // Show modal
        modal.classList.remove('hidden');
        
        // Animate modal appearance
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            gsap.fromTo(modalContent, 
                { opacity: 0, scale: 0.9, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }

        // Animate progress bars after modal is shown
        setTimeout(() => {
            animateModalProgressBars(student);
        }, 600);

        // Replace feather icons
        feather.replace();
    }

    function closeStudentModal() {
        const modal = document.getElementById('studentModal');
        if (!modal) return;

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            gsap.to(modalContent, {
                opacity: 0,
                scale: 0.9,
                y: 50,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    modal.classList.add('hidden');
                }
            });
        } else {
            modal.classList.add('hidden');
        }

        state.activeModalStudent = null;
    }

    function switchTab(tab) {
        const personalTab = document.getElementById('personalInfoTab');
        const academicTab = document.getElementById('academicInfoTab');
        const personalBtn = document.getElementById('tabPersonal');
        const academicBtn = document.getElementById('tabAcademic');

        if (tab === 'personal') {
            if (personalTab) personalTab.classList.remove('hidden');
            if (academicTab) academicTab.classList.add('hidden');
            if (personalBtn) {
                personalBtn.classList.add('active', 'border-primary-500', 'text-primary-400');
                personalBtn.classList.remove('border-transparent', 'text-gray-400');
            }
            if (academicBtn) {
                academicBtn.classList.remove('active', 'border-primary-500', 'text-primary-400');
                academicBtn.classList.add('border-transparent', 'text-gray-400');
            }
        } else {
            if (personalTab) personalTab.classList.add('hidden');
            if (academicTab) academicTab.classList.remove('hidden');
            if (personalBtn) {
                personalBtn.classList.remove('active', 'border-primary-500', 'text-primary-400');
                personalBtn.classList.add('border-transparent', 'text-gray-400');
            }
            if (academicBtn) {
                academicBtn.classList.add('active', 'border-primary-500', 'text-primary-400');
                academicBtn.classList.remove('border-transparent', 'text-gray-400');
            }
        }

        // Animate tab content
        if (academicTab && !academicTab.classList.contains('hidden') && state.activeModalStudent) {
            setTimeout(() => {
                animateModalProgressBars(state.activeModalStudent);
            }, 200);
        }

        feather.replace();
    }

    // Student actions (placeholders for future implementation)
    function editStudent(studentId) {
        const student = state.students.find(s => s.id === studentId);
        if (student) {
            // In a real application, this would open an edit form
            alert(`Edit functionality for ${student.name} would be implemented here.`);
        }
    }

    function deleteStudent(studentId) {
        const student = state.students.find(s => s.id === studentId);
        if (student) {
            if (confirm(`Are you sure you want to delete ${student.name}?`)) {
                // In a real application, this would make an API call to delete the student
                state.students = state.students.filter(s => s.id !== studentId);
                filterStudents();
                renderCurrentView();
            }
        }
    }

    // Render management
    function renderCurrentView() {
        if (state.currentView === 'table') {
            renderTable();
        } else {
            renderCards();
        }
    }

    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const debouncedSearch = debounce((value) => {
            state.searchTerm = value.toLowerCase();
            filterStudents();
            renderCurrentView();
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    // Filter functionality
    function setupFilters() {
        const departmentFilter = document.getElementById('departmentFilter');
        if (!departmentFilter) return;

        departmentFilter.addEventListener('change', (e) => {
            state.departmentFilter = e.target.value;
            filterStudents();
            renderCurrentView();
        });
    }

    // View toggle setup
    function setupViewToggle() {
        const tableViewBtn = document.getElementById('tableView');
        const cardViewBtn = document.getElementById('cardView');

        if (tableViewBtn) {
            tableViewBtn.addEventListener('click', () => switchView('table'));
        }

        if (cardViewBtn) {
            cardViewBtn.addEventListener('click', () => switchView('cards'));
        }
    }

    // Modal event listeners
    function setupModalEvents() {
        const modal = document.getElementById('studentModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModalBtn = document.getElementById('closeModal');
        const tabPersonal = document.getElementById('tabPersonal');
        const tabAcademic = document.getElementById('tabAcademic');

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeStudentModal);
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeStudentModal);
        }

        if (tabPersonal) {
            tabPersonal.addEventListener('click', () => switchTab('personal'));
        }

        if (tabAcademic) {
            tabAcademic.addEventListener('click', () => switchTab('academic'));
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                closeStudentModal();
            }
        });
    }

    // Enhanced animations
    function setupEnhancedAnimations() {
        // Add hover effects to cards
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.student-card')) {
                const card = e.target.closest('.student-card');
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.student-card')) {
                const card = e.target.closest('.student-card');
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // Floating animation for the main icon
        const mainIcon = document.querySelector('.relative.z-10');
        if (mainIcon) {
            gsap.to(mainIcon, {
                y: -10,
                duration: 2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }

    // Initialize application
    function init() {
        // Initialize data
        state.students = studentsData;
        state.filteredStudents = [...state.students];

        // Setup event listeners
        setupSearch();
        setupFilters();
        setupViewToggle();
        setupModalEvents();

        // Initial render
        renderTable();

        // Setup enhanced animations after a short delay to ensure DOM is ready
        setTimeout(() => {
            setupEnhancedAnimations();
            animateTableProgressBars();
        }, 500);

        // Re-initialize feather icons and AOS
        setTimeout(() => {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 100);
    }

    // Global functions (called from HTML)
    window.openStudentModal = openStudentModal;
    window.editStudent = editStudent;
    window.deleteStudent = deleteStudent;

    // Initialize the application
    init();

    // Periodic data refresh simulation (every 30 seconds)
    setInterval(() => {
        // In a real application, this would fetch new data from an API
        // For demo purposes, we'll just update attendance slightly
        state.students.forEach(student => {
            const change = (Math.random() - 0.5) * 2; // -1 to +1
            student.attendance = Math.max(60, Math.min(100, student.attendance + change));
        });
        
        filterStudents();
        renderCurrentView();
    }, 30000);
});