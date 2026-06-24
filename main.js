const students = JSON.parse(localStorage.getItem('students') || '[]');
const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');

document.getElementById('totalStudents').textContent = students.length;

const today = new Date().toISOString().split('T')[0];
let present = 0, absent = 0;

if(attendance[today]){
  present = attendance[today].filter(s => s.status === 'Present').length;
  absent = attendance[today].filter(s => s.status === 'Absent').length;
}

document.getElementById('presentToday').textContent = present;
document.getElementById('absentToday').textContent = absent;
