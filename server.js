const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Essential Middleware
app.use(cors());
app.use(express.json());

// Serve static files from root directory
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize data file if it doesn't exist
const DATA_FILE = path.join(__dirname, 'students.json');
if (!fs.existsSync(DATA_FILE)) {
    try {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('Created students.json file');
    } catch (error) {
        console.error('Error creating students.json:', error);
    }
}

// Read students data
const readStudents = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error reading students:', error);
        return [];
    }
};

// Write students data
const writeStudents = (students) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
    } catch (error) {
        console.error('Error writing students:', error);
    }
};

// GET /students - Get all students
app.get('/students', (req, res) => {
    try {
        const students = readStudents();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// POST /students - Add a new student
app.post('/students', (req, res) => {
    const body = req.body || {};
    const { studentId, fullName, gmail } = body;
    if (!studentId || !fullName || !gmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const students = readStudents();
    const newStudent = { id: Date.now(), ...body };
    students.push(newStudent);
    writeStudents(students);
    res.status(201).json(newStudent);
});

// DELETE /students/:id - Delete a student
app.delete('/students/:id', (req, res) => {
    const id = Number(req.params.id);
    const students = readStudents();
    const updatedStudents = students.filter(student => student.id !== id);
    if (updatedStudents.length === students.length) {
        return res.status(404).json({ error: 'Student not found' });
    }
    writeStudents(updatedStudents);
    res.json({ message: 'Student deleted' });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
