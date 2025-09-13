// --- Students Management ---
async function getStudents() {
    const res = await fetch('/students');
    return await res.json();
}

async function addStudent(id) {
    const res = await fetch('/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    return await res.json();
}

async function removeStudent(id) {
    const res = await fetch(`/students/${id}`, { method: 'DELETE' });
    return await res.json();
}

// --- Paid Students ---
async function getPaid() {
    const res = await fetch('/paid');
    return await res.json();
}

async function addPaid(formData) {
    const res = await fetch('/paid', { method: 'POST', body: formData });
    return await res.json();
}

// --- Helpers ---
function renderStudentList(containerId, students) {
    const container = document.getElementById(containerId);
    if (!students.length) container.innerHTML = "<p>ยังไม่มีข้อมูล</p>";
    else container.innerHTML = "<ol>" + students.map(s => `<li>${s.id || ''} ${s.name || ''}</li>`).join('') + "</ol>";
}

function renderPaidList(containerId, paidStudents, filter = "") {
    const container = document.getElementById(containerId);
    const list = filter
        ? paidStudents.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.id.includes(filter))
        : paidStudents;
    if (!list.length) container.innerHTML = "<p>ยังไม่มีข้อมูล</p>";
    else container.innerHTML = list.map(s => `<div>
        <b>${s.name} (${s.id})</b><br>
        <img src="${s.slip}" style="max-width:200px;"><br>
    </div>`).join("");
}
