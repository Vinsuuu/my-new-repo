// ---------------------------
// Counter Functionality
// ---------------------------
const display = document.getElementById('counter-display');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');

let count = 0;

function updateDisplay() {
  display.textContent = count;
}

incrementBtn.addEventListener('click', () => {
  count++;
  updateDisplay();
});

decrementBtn.addEventListener('click', () => {
  if (count > 0) {
    count--;
    updateDisplay();
  }
});

resetBtn.addEventListener('click', () => {
  count = 0;
  updateDisplay();
});

updateDisplay();


// ---------------------------
// Fetch Students from Render
// ---------------------------
const API_BASE = window.location.origin;
const API_URL = "https://simsmidterm.onrender.com";

async function loadStudents() {
  try {
    const res = await fetch(`${API_URL}/students`); // ← Correct URL
    if (!res.ok) throw new Error("Failed to fetch students");
    const students = await res.json();
    console.log("Students loaded:", students);

    // Optional: display students on the page
    const listContainer = document.getElementById('students-list');
    if (listContainer) {
      listContainer.innerHTML = ""; // Clear previous content
      students.forEach(student => {
        const li = document.createElement('li');
        li.textContent = `${student.fullName} (${student.studentId}) - ${student.program}`;
        listContainer.appendChild(li);
      });
    }

  } catch (err) {
    console.error("Error loading students:", err);
  }
}

// Load students when page loads
loadStudents();


// ---------------------------
// Optional: Seed a Student (run once to add a test student)
// ---------------------------
async function seedStudent() {
  try {
    const res = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: "S001",
        fullName: "John Doe",
        gender: "Male",
        gmail: "john@example.com",
        program: "IT",
        yearLevel: 3,
        university: "CSU"
      }),
    });

    const data = await res.json();
    console.log("Seed response:", data);
  } catch (err) {
    console.error("Error seeding student:", err);
  }
}

// ✅ Only uncomment the next line if you want to seed a student once
// seedStudent();
