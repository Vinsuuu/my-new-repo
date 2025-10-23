// ---------------------------
// Counter Functionality
// ---------------------------
const display = document.getElementById('counter-display');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');

let count = 0;

function updateDisplay() {
  if (display) display.textContent = count;
}

incrementBtn?.addEventListener('click', () => {
  count++;
  updateDisplay();
});

decrementBtn?.addEventListener('click', () => {
  if (count > 0) {
    count--;
    updateDisplay();
  }
});

resetBtn?.addEventListener('click', () => {
  count = 0;
  updateDisplay();
});

updateDisplay();

// ---------------------------
// Fetch Students from API
// ---------------------------

// Use Render URL in production, localhost for local testing
const API_URL = window.location.hostname.includes("onrender.com")
  ? "https://simsmidterm.onrender.com"
  : "http://localhost:3000";

async function loadStudents() {
  try {
    const res = await fetch(`${API_URL}/students`);
    if (!res.ok) throw new Error("Failed to fetch students");
    const students = await res.json();
    console.log("Students loaded:", students);

    const listContainer = document.getElementById('students-list');
    if (listContainer) {
      listContainer.innerHTML = "";
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

loadStudents();
