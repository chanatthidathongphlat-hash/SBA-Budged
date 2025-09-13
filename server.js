const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ตรวจสอบและสร้างไฟล์ JSON ว่าง ๆ
if (!fs.existsSync('students.json')) fs.writeFileSync('students.json', '[]');
if (!fs.existsSync('paid.json')) fs.writeFileSync('paid.json', '[]');

// multer สำหรับ upload slip
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ===================== API =====================

// ดึงรหัสนักศึกษาทั้งหมด
app.get('/students', (req, res) => {
  const students = JSON.parse(fs.readFileSync('students.json'));
  res.json(students);
});

// เพิ่มรหัสนักศึกษา
app.post('/students', (req, res) => {
  const { id } = req.body;
  if (!id || id.length !== 8) return res.status(400).json({ message: 'รหัสไม่ถูกต้อง ต้องมี 8 หลัก' });
  let students = JSON.parse(fs.readFileSync('students.json'));
  if (students.includes(id)) return res.status(400).json({ message: 'รหัสนี้มีอยู่แล้ว' });
  students.push(id);
  fs.writeFileSync('students.json', JSON.stringify(students));
  res.json({ message: `เพิ่มรหัส ${id} สำเร็จ` });
});

// ลบรหัสนักศึกษา
app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  let students = JSON.parse(fs.readFileSync('students.json'));
  const index = students.indexOf(id);
  if (index === -1) return res.status(404).json({ message: 'ไม่พบรหัสนี้' });
  students.splice(index, 1);
  fs.writeFileSync('students.json', JSON.stringify(students));
  res.json({ message: `ลบรหัส ${id} สำเร็จ` });
});

// ดึงรายชื่อนักศึกษาที่จ่ายแล้ว
app.get('/paid', (req, res) => {
  const paidStudents = JSON.parse(fs.readFileSync('paid.json'));
  res.json(paidStudents);
});

// เพิ่มนักศึกษาที่จ่ายแล้ว (พร้อม upload slip)
app.post('/paid', upload.single('slip'), (req, res) => {
  const { id, name, date } = req.body;
  if (!id || !name || !date || !req.file) return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });

  const slipPath = `/uploads/${req.file.filename}`;

  let paidStudents = JSON.parse(fs.readFileSync('paid.json'));
  paidStudents.push({ id, name, date, slip: slipPath });
  fs.writeFileSync('paid.json', JSON.stringify(paidStudents));

  res.json({ message: 'บันทึกข้อมูลการชำระเงินสำเร็จ', slip: slipPath });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
