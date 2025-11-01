 // Initialize AOS animations
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
        
        // Initialize Feather Icons
        feather.replace();
        
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCPV_mXojZBR-Dew8RuZSi9jv9X6rc_D90",
            authDomain: "mentora-71f5c.firebaseapp.com",
            projectId: "mentora-71f5c",
            storageBucket: "mentora-71f5c.appspot.com",
            messagingSenderId: "16685388211",
            appId: "1:16685388211:web:7eed812660439dec7b3bc6",
            measurementId: "G-BL98PXGK2G"
        };

        // Initialize Firebase
        let db;
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }

        // Global variables
        let students = [];
        let activities = [];

        // Utility functions
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 opacity-0 translate-y-2 ${
                type === 'success' ? 'bg-green-600' : 
                type === 'error' ? 'bg-red-600' : 
                type === 'warning' ? 'bg-yellow-600' : 'bg-indigo-600'
            }`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.remove('opacity-0', 'translate-y-2');
                notification.classList.add('opacity-100', 'translate-y-0');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('opacity-100', 'translate-y-0');
                notification.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        function generateStudentId() {
            return 'STU' + Date.now().toString().slice(-6);
        }

        function formatDate(timestamp) {
            if (!timestamp) return 'N/A';
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Student management functions
        async function loadStudents() {
            try {
                const snapshot = await db.collection('students').orderBy('createdAt', 'desc').get();
                students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateDashboard();
                renderStudentsTable();
            } catch (error) {
                console.error('Error loading students:', error);
                showNotification('Failed to load students', 'error');
            }
        }

        function updateDashboard() {
            const total = students.length;
            const approved = students.filter(s => s.status === 'approved').length;
            const pending = students.filter(s => s.status === 'pending').length;
            const newAdmissions = students.filter(s => {
                const created = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return created > weekAgo;
            }).length;

            document.getElementById('totalStudents').textContent = total;
            document.getElementById('newAdmissions').textContent = newAdmissions;
            document.getElementById('approvedCount').textContent = approved;
            document.getElementById('pendingCount').textContent = pending;
        }

        function renderStudentsTable() {
            const tbody = document.getElementById('studentsTableBody');
            if (!tbody) return;

            const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
            const statusFilter = document.getElementById('filterStatus')?.value || '';

            let filteredStudents = students.filter(student => {
                const matchesSearch = student.firstName.toLowerCase().includes(searchTerm) ||
                                    student.lastName.toLowerCase().includes(searchTerm) ||
                                    student.email.toLowerCase().includes(searchTerm) ||
                                    student.studentId.toLowerCase().includes(searchTerm);
                
                const matchesStatus = !statusFilter || student.status === statusFilter;
                
                return matchesSearch && matchesStatus;
            });

            tbody.innerHTML = filteredStudents.map(student => `
                <tr>
                    <td class="text-white font-medium">${student.studentId}</td>
                    <td>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <i data-feather="user" class="w-4 h-4 text-indigo-300"></i>
                            </div>
                            <span>${student.firstName} ${student.lastName}</span>
                        </div>
                    </td>
                    <td class="text-slate-300">${student.email}</td>
                    <td class="text-slate-300">${student.department}</td>
                    <td>
                        <span class="status-badge status-${student.status}">
                            <i data-feather="${student.status === 'approved' ? 'check-circle' : student.status === 'pending' ? 'clock' : 'x-circle'}" class="w-3 h-3 mr-1"></i>
                            ${student.status}
                        </span>
                    </td>
                    <td>
                        <div class="flex items-center gap-2">
                            <button onclick="editStudent('${student.id}')" class="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition">
                                <i data-feather="edit" class="w-4 h-4"></i>
                            </button>
                            <button onclick="deleteStudent('${student.id}')" class="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition">
                                <i data-feather="trash" class="w-4 h-4"></i>
                            </button>
                            <button onclick="viewStudent('${student.id}')" class="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition">
                                <i data-feather="eye" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            feather.replace();
        }

        // Modal functions
        function showAddStudentModal() {
            const modal = document.getElementById('addStudentModal');
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        function hideAddStudentModal() {
            const modal = document.getElementById('addStudentModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
                document.getElementById('addStudentForm').reset();
            }
        }

        // Student CRUD operations
        async function addStudent(data) {
            try {
                const studentData = {
                    ...data,
                    studentId: generateStudentId(),
                    status: 'pending',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await db.collection('students').add(studentData);
                
                // Add activity
                await addActivity('New student admission', `${data.firstName} ${data.lastName} has been admitted`);
                
                showNotification('Student added successfully!', 'success');
                hideAddStudentModal();
                loadStudents();
            } catch (error) {
                console.error('Error adding student:', error);
                showNotification('Failed to add student', 'error');
            }
        }

        async function editStudent(id) {
            const student = students.find(s => s.id === id);
            if (!student) return;
            
            // Populate form with student data
            const form = document.getElementById('addStudentForm');
            if (form) {
                form.firstName.value = student.firstName || '';
                form.lastName.value = student.lastName || '';
                form.email.value = student.email || '';
                form.department.value = student.department || '';
                form.phone.value = student.phone || '';
                form.dob.value = student.dob || '';
                form.gender.value = student.gender || '';
                form.address.value = student.address || '';
                form.city.value = student.city || '';
                form.country.value = student.country || '';
                form.educationLevel.value = student.educationLevel || '';
                form.previousInstitution.value = student.previousInstitution || '';
                
                // Change form to edit mode
                form.dataset.mode = 'edit';
                form.dataset.studentId = id;
                
                showAddStudentModal();
            }
        }

        async function deleteStudent(id) {
            if (!confirm('Are you sure you want to delete this student?')) return;
            
            try {
                await db.collection('students').doc(id).delete();
                
                const student = students.find(s => s.id === id);
                if (student) {
                    await addActivity('Student deleted', `${student.firstName} ${student.lastName} has been removed`);
                }
                
                showNotification('Student deleted successfully!', 'success');
                loadStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
                showNotification('Failed to delete student', 'error');
            }
        }

        function viewStudent(id) {
            const student = students.find(s => s.id === id);
            if (!student) return;
            
            // Show student details in a modal
            alert(`Student Details:\n\nName: ${student.firstName} ${student.lastName}\nEmail: ${student.email}\nDepartment: ${student.department}\nStatus: ${student.status}`);
        }

        // Activity management
        async function addActivity(type, description) {
            try {
                await db.collection('activities').add({
                    type,
                    description,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (error) {
                console.error('Error adding activity:', error);
            }
        }

        async function loadActivities() {
            try {
                const snapshot = await db.collection('activities')
                    .orderBy('timestamp', 'desc')
                    .limit(10)
                    .get();
                
                activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Update activity timeline component
                const timeline = document.querySelector('activity-timeline');
                if (timeline) {
                    timeline.activities = activities;
                }
            } catch (error) {
                console.error('Error loading activities:', error);
            }
        }

        // Export and report functions
        function exportData() {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Student ID,First Name,Last Name,Email,Department,Status,Phone,DOB,Gender,Address,City,Country,Education Level,Previous Institution\n"
                + students.map(s => `${s.studentId},${s.firstName},${s.lastName},${s.email},${s.department},${s.status},${s.phone || ''},${s.dob || ''},${s.gender || ''},${s.address || ''},${s.city || ''},${s.country || ''},${s.educationLevel || ''},${s.previousInstitution || ''}`).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "students_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Data exported successfully!', 'success');
        }

        function generateReport() {
            const approved = students.filter(s => s.status === 'approved').length;
            const pending = students.filter(s => s.status === 'pending').length;
            const rejected = students.filter(s => s.status === 'rejected').length;
            
            const report = `
                Student Admission Report
                ======================
                Total Students: ${students.length}
                Approved: ${approved}
                Pending: ${pending}
                Rejected: ${rejected}
                Success Rate: ${students.length > 0 ? ((approved / students.length) * 100).toFixed(1) : 0}%
                
                Department Distribution:
                ${[...new Set(students.map(s => s.department))].map(dept => {
                    const count = students.filter(s => s.department === dept).length;
                    return `${dept || 'Unknown'}: ${count} (${(count / students.length * 100).toFixed(1)}%)`;
                }).join('\n')}
            `;
            
            const blob = new Blob([report], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'admission_report.txt';
            a.click();
            window.URL.revokeObjectURL(url);
            
            showNotification('Report generated successfully!', 'success');
        }

        function showBulkImportModal() {
            showNotification('Bulk import feature coming soon!', 'info');
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize Firebase and load data
            if (db) {
                loadStudents();
                loadActivities();
            }
            
            // Search functionality
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', renderStudentsTable);
            }
            
            // Filter functionality
            const filterStatus = document.getElementById('filterStatus');
            if (filterStatus) {
                filterStatus.addEventListener('change', renderStudentsTable);
            }
            
            // Add student form
            const addStudentForm = document.getElementById('addStudentForm');
            if (addStudentForm) {
                addStudentForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const formData = new FormData(addStudentForm);
                    const data = Object.fromEntries(formData);
                    
                    if (addStudentForm.dataset.mode === 'edit') {
                        // Update existing student
                        try {
                            await db.collection('students').doc(addStudentForm.dataset.studentId).update({
                                ...data,
                                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            showNotification('Student updated successfully!', 'success');
                            hideAddStudentModal();
                            loadStudents();
                        } catch (error) {
                            showNotification('Failed to update student', 'error');
                        }
                    } else {
                        // Add new student
                        await addStudent(data);
                    }
                });
            }
            
            // Modal close on outside click
            const modal = document.getElementById('addStudentModal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        hideAddStudentModal();
                    }
                });
            }
            
            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', () => {
                    const sidebar = document.querySelector('#app > div:nth-child(1)');
                    if (sidebar) {
                        sidebar.classList.toggle('hidden');
                    }
                });
            }
        });