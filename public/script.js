const studentList = document.getElementById('studentList');
const paidList = document.getElementById('paidList');

// ดึงข้อมูลนักศึกษา
async function fetchStudents() {
  const res = await fetch('/students');
  const data = await res.json();
  studentList.innerHTML = '';
  data.forEach(id => {
    const li = document.createElement('li');
    li.textContent = id + ' ';
    const delBtn = document.createElement('button');
    delBtn.textContent = 'ลบ';
    delBtn.onclick = () => deleteStudent(id);
    li.appendChild(delBtn);
    studentList.appendChild(li);
  });
}

// เพิ่มนักศึกษา
async function addStudent() {
  const id = document.getElementById('studentId').value.trim();
  if (!id) return alert('กรุณากรอกรหัสนักศึกษา');
  const res = await fetch('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  alert(data.message || 'สำเร็จ');
  document.getElementById('studentId').value = '';
  fetchStudents();
}

// ลบรหัสนักศึกษา
async function deleteStudent(id) {
  const res = await fetch(`/students/${id}`, { method: 'DELETE' });
  const data = await res.json();
  alert(data.message || 'สำเร็จ');
  fetchStudents();
}

// ดึงข้อมูลนักศึกษาที่จ่ายแล้ว
async function fetchPaid() {
  const res = await fetch('/paid');
  const data = await res.json();
  paidList.innerHTML = '';
  data.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.date}</td>
      <td><a href="${p.slip}" target="_blank">ดู Slip</a></td>
    `;
    paidList.appendChild(tr);
  });
}

// ส่ง form การจ่ายเงิน
document.getElementById('paidForm').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch('/paid', { method: 'POST', body: formData });
  const data = await res.json();
  alert(data.message || 'สำเร็จ');
  e.target.reset();
  fetchPaid();
});

// เริ่มต้น
fetchStudents();
fetchPaid();
