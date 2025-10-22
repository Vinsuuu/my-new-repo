// -------------------------
// SIMS Project - Server.js
// -------------------------
app.use(express.static('public'));
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// -------------------------
// API ROUTES
// -------------------------
const DATA_FILE = path.join(__dirname, 'students.json');

// Read student data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading data file:', err);
    return [];
  }
}

// Write student data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all students
app.get('/students', (req, res) => {
  const data = readData();
  const { q, gender, program } = req.query;

  let filtered = data;
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.studentId.toLowerCase().includes(query) ||
        s.fullName.toLowerCase().includes(query) ||
        s.program.toLowerCase().includes(query)
    );
  }

  if (gender) filtered = filtered.filter((s) => s.gender === gender);
  if (program)
    filtered = filtered.filter((s) =>
      s.program.toLowerCase().includes(program.toLowerCase())
    );

  res.json(filtered);
});

// Add new student
app.post('/students', (req, res) => {
  const { studentId, fullName, gender, gmail, program, yearLevel, university } =
    req.body;

  if (!studentId || !fullName || !gmail)
    return res.status(400).json({ error: 'Missing required fields' });

  const data = readData();
  const newStudent = {
    id: Date.now(),
    studentId,
    fullName,
    gender,
    gmail,
    program,
    yearLevel,
    university,
  };
  data.push(newStudent);
  writeData(data);

  res.status(201).json(newStudent);
});

// Delete student
app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  let data = readData();
  const initialLength = data.length;
  data = data.filter((s) => s.id !== id);

  if (data.length === initialLength)
    return res.status(404).json({ error: 'Student not found' });

  writeData(data);
  res.json({ message: 'Deleted successfully' });
});

// -------------------------
// SERVE FRONTEND
// -------------------------
app.use(express.static(path.join(__dirname, 'public')));

// Handle all other routes → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// -------------------------
// START SERVER
// -------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
