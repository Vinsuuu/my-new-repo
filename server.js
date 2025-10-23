const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (index.html, script.js, etc.)
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'students.json');
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

const readStudents = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
};

const writeStudents = (students) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
};

app.get('/students', (req, res) => {
  res.json(readStudents());
});

app.post('/students', (req, res) => {
  const body = req.body || {};
  const { studentId, fullName, gmail } = body;
  if (!studentId || !fullName || !gmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const students = readStudents();
  const newStudent = { id: Date.now().toString(), ...body };
  students.push(newStudent);
  writeStudents(students);
  res.status(201).json(newStudent);
});

app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  const students = readStudents();
  const updated = students.filter(s => s.id !== id);
  if (updated.length === students.length) {
    return res.status(404).json({ error: 'Student not found' });
  }
  writeStudents(updated);
  res.json({ message: 'Student deleted' });
});

// Serve your index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
