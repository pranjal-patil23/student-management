// ------------------------
// MARK ATTENDANCE PAGE
// ------------------------
const studentTableBody = document.getElementById('studentTableBody');
const attendanceDate = document.getElementById('attendanceDate');
const saveAttendance = document.getElementById('saveAttendance');
const successMsg = document.getElementById('successMsg');

// Set default date to today
if(attendanceDate) attendanceDate.valueAsDate = new Date();

// Load students from localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];

addStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = studentNameInput.value;
    const roll = studentRollInput.value;
    const className = studentClassInput.value;
    const section = studentSectionInput.value;

    students.push({ name, roll, class: className, section });
    localStorage.setItem('students', JSON.stringify(students)); // <-- Important
    alert('Student added successfully!');
});

// let students = JSON.parse(localStorage.getItem('students')) || [];

// function loadStudents() {
//     if(!studentTableBody) return;
//     studentTableBody.innerHTML = '';
//     students.forEach((student, index) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${index+1}</td>
//             <td>${student.name}</td>
//             <td>${student.roll}</td>
//             <td>${student.class || '-'}</td>
//             <td>${student.section || '-'}</td>
//             <td>
//                 <div class="form-check form-switch">
//                     <input class="form-check-input" type="checkbox" id="present-${index}" checked>
//                 </div>
//             </td>
//         `;
//         studentTableBody.appendChild(row);
//     });
// }
// loadStudents();

// Save attendance
if(saveAttendance){
    saveAttendance.addEventListener('click', () => {
        const date = attendanceDate.value;
        if(!date) return alert("Please select a date!");
        let attendanceRecords = JSON.parse(localStorage.getItem('attendance')) || [];
        students.forEach((student, index) => {
            const isPresent = document.getElementById(`present-${index}`).checked;
            attendanceRecords.push({
                date: date,
                roll: student.roll,
                name: student.name,
                class: student.class,
                section: student.section,
                status: isPresent ? 'Present' : 'Absent'
            });
        });
        localStorage.setItem('attendance', JSON.stringify(attendanceRecords));
        if(successMsg){
            successMsg.classList.remove('d-none');
            setTimeout(() => successMsg.classList.add('d-none'), 3000);
        }
    });
}

// ------------------------
// VIEW ATTENDANCE PAGE
// ------------------------
const attendanceTableBody = document.getElementById('attendanceTableBody');
const filterDate = document.getElementById('filterDate');
const filterStudent = document.getElementById('filterStudent');

function loadAttendance() {
    if(!attendanceTableBody) return;
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const dateFilter = filterDate ? filterDate.value : '';
    const nameFilter = filterStudent ? filterStudent.value.toLowerCase() : '';

    attendanceTableBody.innerHTML = '';
    const filtered = attendance.filter(record => {
        const matchesDate = dateFilter ? record.date === dateFilter : true;
        const matchesName = record.name.toLowerCase().includes(nameFilter);
        return matchesDate && matchesName;
    });

    filtered.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.date}</td>
            <td>${record.name}</td>
            <td>${record.roll}</td>
            <td>${record.class || '-'}</td>
            <td>${record.section || '-'}</td>
            <td>
                <span class="badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}">
                    ${record.status}
                </span>
            </td>
        `;
        attendanceTableBody.appendChild(row);
    });
}
loadAttendance();
if(filterDate) filterDate.addEventListener('change', loadAttendance);
if(filterStudent) filterStudent.addEventListener('input', loadAttendance);

// ------------------------
// REPORTS PAGE
// ------------------------
const attendanceChartCanvas = document.getElementById('attendanceChart');
const exportCSVBtn = document.getElementById('exportCSV');

function generateReports() {
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];

    const reportData = students.map(student => {
        const records = attendance.filter(a => a.roll === student.roll);
        const presentCount = records.filter(a => a.status === 'Present').length;
        const total = records.length;
        const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
        return {
            name: student.name,
            roll: student.roll,
            present: presentCount,
            total: total,
            percentage: percentage
        };
    });

    // Chart.js bar chart
    if(attendanceChartCanvas){
        new Chart(attendanceChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: reportData.map(r => r.name),
                datasets: [{
                    label: 'Attendance %',
                    data: reportData.map(r => r.percentage),
                    backgroundColor: '#0d6efd'
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }

    // CSV Export
    if(exportCSVBtn){
        exportCSVBtn.addEventListener('click', () => {
            let csv = 'Name,Roll No,Present Days,Total Days,Attendance %\n';
            reportData.forEach(r => {
                csv += `${r.name},${r.roll},${r.present},${r.total},${r.percentage}\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'attendance_report.csv';
            link.click();
        });
    }
}
generateReports();

// ------------------------
// DASHBOARD CHARTS
// ------------------------
function initDashboardCharts(){
    // PIE CHART
    const todayPieChartCanvas = document.getElementById('todayPieChart');
    if(todayPieChartCanvas){
        new Chart(todayPieChartCanvas.getContext('2d'), {
            type: 'pie',
            data: { labels: ['Present','Absent'], datasets:[{ data:[45,5], backgroundColor:['#28a745','#dc3545'] }]},
            options: { responsive:true }
        });
    }

    // TREND CHART
    const trendChartCanvas = document.getElementById('trendChart');
    if(trendChartCanvas){
        new Chart(trendChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                datasets: [{
                    label: 'Attendance %',
                    data: [90,85,88,92,95,80,87],
                    borderColor:'#0d6efd',
                    backgroundColor:'rgba(13,110,253,0.2)',
                    fill:true,
                    tension:0.3
                }]
            },
            options: { responsive:true, scales:{ y:{ beginAtZero:true, max:100 } } }
        });
    }
}
initDashboardCharts();

// ------------------------
// ANIMATED DASHBOARD NUMBERS
// ------------------------
function animateValue(id, start, end, duration){
    const obj = document.getElementById(id);
    if(!obj) return;
    let range = end - start;
    let current = start;
    let increment = end>start?1:-1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let timer = setInterval(()=>{
        current += increment;
        obj.textContent = current;
        if(current==end) clearInterval(timer);
    }, stepTime);
}

// Example dashboard numbers
animateValue("total-students",0,50,1000);
animateValue("present-today",0,45,1000);
animateValue("absent-today",0,5,1000);
animateValue("attendance-percent",0,90,1000);
