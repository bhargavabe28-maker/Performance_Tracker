// MyPerformance - Student Performance Tracker Main Script
console.log('MyPerformance Script Loaded');

// --- APP STATE ---
let currentDate = new Date();
let chartInstances = {};
let currentStreak = 0;
let currentTimetableDay = 'Monday';
let isTimetableEditMode = false;

// --- CONSTANTS ---
const STATUS = {
    COMPLETED: 'completed',
    HALF_DONE: 'half-done',
    NOT_DONE: 'not-done',
};

// --- DEFAULT TIMETABLE (INTENSE STUDY FOCUS - BATCH 1) ---
// --- DEFAULT TIMETABLE (PERSONALIZED BATCH 1) ---
const defaultTimetable = {
    "Monday": [
        { time: "06:30 - 07:30", activity: "Wake Up + Fresh Up" },
        { time: "07:30 - 08:15", activity: "Breakfast + Get Ready" },
        { time: "08:15 - 08:45", activity: "Travel to College" },
        { time: "09:00 - 10:00", activity: "EM-IV" },
        { time: "10:00 - 11:00", activity: "DAA" },
        { time: "11:00 - 12:00", activity: "MEA" },
        { time: "12:00 - 13:00", activity: "S & S" },
        { time: "13:00 - 14:00", activity: "Lunch Break" },
        { time: "14:00 - 15:00", activity: "DAR" },
        { time: "15:00 - 17:00", activity: "DAA Lab (Batch–1)" },
        { time: "17:30 - 19:00", activity: "Rest + Snacks" },
        { time: "19:00 - 21:00", activity: "Evening Walk" },
        { time: "21:00 - 23:00", activity: "Study + Assignments" }
    ],
    "Tuesday": [
        { time: "06:30 - 07:30", activity: "Wake Up + Fresh Up" },
        { time: "07:30 - 08:15", activity: "Breakfast" },
        { time: "08:15 - 08:45", activity: "Travel" },
        { time: "09:00 - 10:00", activity: "ALC" },
        { time: "10:00 - 11:00", activity: "EM-IV" },
        { time: "11:00 - 12:00", activity: "OS" },
        { time: "12:00 - 13:00", activity: "MEA" },
        { time: "13:00 - 14:00", activity: "Lunch" },
        { time: "14:00 - 16:00", activity: "DAA Lab" },
        { time: "16:00 - 17:00", activity: "Library / Revision" },
        { time: "17:30 - 19:00", activity: "Rest" },
        { time: "19:00 - 21:00", activity: "Evening Walk" },
        { time: "21:00 - 23:00", activity: "Deep Study Session" }
    ],
    "Wednesday": [
        { time: "06:30 - 07:30", activity: "Wake Up + Fresh Up" },
        { time: "07:30 - 08:15", activity: "Breakfast" },
        { time: "08:15 - 08:45", activity: "Travel" },
        { time: "09:00 - 11:00", activity: "DAA Lab / OS Lab" },
        { time: "11:00 - 12:00", activity: "OS" },
        { time: "12:00 - 13:00", activity: "EM-IV" },
        { time: "13:00 - 14:00", activity: "Lunch" },
        { time: "14:00 - 15:00", activity: "S & S" },
        { time: "15:00 - 17:00", activity: "OS Lab (Batch–1)" },
        { time: "17:30 - 19:00", activity: "Relax" },
        { time: "19:00 - 21:00", activity: "Evening Walk" },
        { time: "21:00 - 23:00", activity: "Revision + Preparation" }
    ],
    "Thursday": [
        { time: "06:30 - 07:30", activity: "Wake Up" },
        { time: "07:30 - 08:15", activity: "Breakfast" },
        { time: "08:15 - 08:45", activity: "Travel" },
        { time: "09:00 - 10:00", activity: "ALC" },
        { time: "10:00 - 11:00", activity: "DAA" },
        { time: "11:00 - 12:00", activity: "OS" },
        { time: "12:00 - 13:00", activity: "DAR" },
        { time: "13:00 - 14:00", activity: "Lunch" },
        { time: "14:00 - 17:00", activity: "Free Study / Practical Work" },
        { time: "17:30 - 19:00", activity: "Snacks + Rest" },
        { time: "19:00 - 21:00", activity: "Evening Walk" },
        { time: "21:00 - 23:00", activity: "Assignments + Study" }
    ],
    "Friday": [
        { time: "06:30 - 07:30", activity: "Wake Up + Fresh Up" },
        { time: "07:30 - 08:15", activity: "Breakfast" },
        { time: "08:15 - 08:45", activity: "Travel" },
        { time: "09:00 - 10:00", activity: "ALC" },
        { time: "10:00 - 11:00", activity: "DAA" },
        { time: "11:00 - 12:00", activity: "DAR" },
        { time: "12:00 - 13:00", activity: "MEA" },
        { time: "13:00 - 14:00", activity: "Lunch" },
        { time: "14:00 - 15:00", activity: "S & S" },
        { time: "15:00 - 17:00", activity: "OS Lab / DAA Lab" },
        { time: "17:30 - 19:00", activity: "Relax" },
        { time: "19:00 - 21:00", activity: "Evening Walk" },
        { time: "21:00 - 23:00", activity: "Weekly Revision + Notes Update" }
    ],
    "Saturday": [
        { time: "06:30 - 07:30", activity: "Wake Up + Fresh Up" },
        { time: "07:30 - 08:30", activity: "Breakfast + Planning the Day" },
        { time: "09:00 - 12:00", activity: "Deep Study Session (DAA / OS / EM-IV)" },
        { time: "12:00 - 13:00", activity: "Short Break + Lunch" },
        { time: "13:00 - 15:00", activity: "Assignment Completion + Notes Writing" },
        { time: "15:00 - 17:00", activity: "Coding Practice / Project Work" },
        { time: "17:00 - 18:30", activity: "Revision of Weak Topics" },
        { time: "18:30 - 19:00", activity: "Snacks + Refresh" },
        { time: "19:00 - 21:00", activity: "Evening Walk" },
        { time: "21:00 - 22:30", activity: "Light Study + Next Day Planning" },
        { time: "23:00", activity: "Sleep" }
    ],
    "Sunday": [
        { time: "07:00 - 08:00", activity: "Wake Up + Relaxed Morning" },
        { time: "08:00 - 09:00", activity: "Breakfast + Weekly Goal Setting" },
        { time: "09:00 - 12:00", activity: "Full Revision Session" },
        { time: "12:00 - 13:00", activity: "Lunch" },
        { time: "13:00 - 15:00", activity: "Previous Questions Practice" },
        { time: "15:00 - 17:00", activity: "Project Work / Skill Development" },
        { time: "17:00 - 18:30", activity: "Notes Update + Weekly Planning" },
        { time: "18:30 - 19:00", activity: "Refresh" },
        { time: "19:00 - 21:00", activity: "Evening Walk" },
        { time: "21:00 - 22:30", activity: "Light Reading + Monday Preparation" },
        { time: "23:00", activity: "Sleep" }
    ]
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();
    setupTabListeners();
    setupThemeListener();
    setupTaskListeners();
    setupDateNavigation();
    setupTimetableListeners();
    
    // Auto-initialize timetable if empty or effectively empty
    const currentTT = await getTimetable();
    const hasAnyData = Object.values(currentTT).some(day => Array.isArray(day) && day.length > 0);
    
    if (!hasAnyData) {
        localStorage.setItem('timetable', JSON.stringify(defaultTimetable));
    }

    // Load initial data
    renderToday();
    renderHistory();
    updateDashboard();
    renderTimetable();
});

// --- APP CORE LOGIC ---
function setupDateNavigation() {
    const prevBtn = document.getElementById('prev-day');
    const nextBtn = document.getElementById('next-day');
    if (prevBtn) prevBtn.onclick = () => { currentDate.setDate(currentDate.getDate() - 1); renderToday(); };
    if (nextBtn) nextBtn.onclick = () => { currentDate.setDate(currentDate.getDate() + 1); renderToday(); };
}

function setupTabListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.currentTarget.getAttribute('data-tab');
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');

    if (tab === 'dashboard') updateDashboard();
    if (tab === 'history') renderHistory();
    if (tab === 'timetable') renderTimetable();
}
function setupTaskListeners() {
    document.getElementById('add-task-btn').onclick = addNewTask;
    document.getElementById('task-input').onkeypress = (e) => { if (e.key === 'Enter') addNewTask(); };
    document.getElementById('reset-btn').onclick = resetTasks;
}

async function addNewTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;

    const dateStr = getDateString(currentDate);
    let tasks = await getTasksForDate(dateStr);
    
    const newTask = {
        id: Date.now(),
        text: text,
        status: STATUS.NOT_DONE,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await saveTasksForDate(dateStr, tasks);
    input.value = '';
    renderToday();
}

async function renderToday() {
    const dateStr = getDateString(currentDate);
    const isToday = dateStr === getDateString(new Date());
    const isPast = dateStr < getDateString(new Date());

    document.getElementById('current-date').textContent = isToday ? 'Today' : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    document.getElementById('date-message').textContent = isPast ? 'Viewing past performance (Read-only)' : '';

    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const resetBtn = document.getElementById('reset-btn');

    taskInput.disabled = isPast;
    addBtn.disabled = isPast;
    resetBtn.disabled = isPast;

    let tasks = await getTasksForDate(dateStr);

    // Auto-populate from timetable if today/future and empty
    if (!tasks.length && !isPast) {
        tasks = await populateFromTimetable(dateStr);
    }

    const list = document.getElementById('task-list');
    list.innerHTML = '';

    if (!tasks.length) {
        list.innerHTML = '<p class="empty-message">No tasks for this day.</p>';
    } else {
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item fadeIn';
            li.innerHTML = `
                <span class="task-label ${task.status}">${task.text}</span>
                <div class="task-status-btns">
                    <button class="status-btn ${task.status === STATUS.COMPLETED ? 'completed' : ''}" onclick="updateTaskStatus('${dateStr}', ${task.id}, '${STATUS.COMPLETED}')">✅</button>
                    <button class="status-btn ${task.status === STATUS.HALF_DONE ? 'half-done' : ''}" onclick="updateTaskStatus('${dateStr}', ${task.id}, '${STATUS.HALF_DONE}')">⚠️</button>
                    <button class="status-btn ${task.status === STATUS.NOT_DONE ? 'not-done' : ''}" onclick="updateTaskStatus('${dateStr}', ${task.id}, '${STATUS.NOT_DONE}')">❌</button>
                    <button class="delete-btn" onclick="deleteTask('${dateStr}', ${task.id})">🗑️</button>
                </div>
            `;
            if (isPast) li.querySelectorAll('button').forEach(b => b.disabled = true);
            list.appendChild(li);
        });
    }

    updateProgress(tasks);
    calculateStreak();
}

async function updateTaskStatus(dateStr, taskId, status) {
    let tasks = await getTasksForDate(dateStr);
    tasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    await saveTasksForDate(dateStr, tasks);
    renderToday();
}

async function deleteTask(dateStr, taskId) {
    let tasks = await getTasksForDate(dateStr);
    tasks = tasks.filter(t => t.id !== taskId);
    await saveTasksForDate(dateStr, tasks);
    renderToday();
}

async function resetTasks() {
    if (confirm('Reset all tasks for today?')) {
        await saveTasksForDate(getDateString(currentDate), []);
        renderToday();
    }
}

async function importTodayFromTimetable() {
    const dateStr = getDateString(currentDate);
    if (confirm(`Import all activities from the timetable for this day?`)) {
        const tasks = await populateFromTimetable(dateStr);
        if (tasks.length === 0) {
            alert('No activities scheduled in the timetable for this day.');
        } else {
            renderToday();
        }
    }
}

function updateProgress(tasks) {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === STATUS.COMPLETED).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-text').textContent = percent + '% completed';
    document.getElementById('count-text').textContent = `${done} / ${total}`;
}

// --- DATA ACCESS LAYER (LOCAL STORAGE) ---
async function getTasksForDate(dateStr) {
    const data = localStorage.getItem(`tasks_${dateStr}`);
    return data ? JSON.parse(data) : [];
}

async function saveTasksForDate(dateStr, tasks) {
    localStorage.setItem(`tasks_${dateStr}`, JSON.stringify(tasks));
}

async function populateFromTimetable(dateStr) {
    const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
    const timetable = await getTimetable();
    const daySchedule = timetable[dayName] || [];

    if (daySchedule.length > 0) {
        const tasks = daySchedule.map((item, idx) => ({
            id: Date.now() + idx,
            text: `${item.time}: ${item.activity}`,
            status: STATUS.NOT_DONE
        }));
        await saveTasksForDate(dateStr, tasks);
        return tasks;
    }
    return [];
}

// --- ANALYTICS & DASHBOARD ---
async function updateDashboard() {
    const stats = await getOverallStats();
    document.getElementById('total-completed').textContent = stats.completed;
    document.getElementById('total-half-done').textContent = stats.halfDone;
    document.getElementById('total-not-done').textContent = stats.notDone;

    updateCharts(stats);
}

async function getOverallStats() {
    let stats = { completed: 0, halfDone: 0, notDone: 0, dailyProgress: [] };
    
    // Iterate through all localStorage keys to find task entries
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('tasks_')) {
            const dateStr = key.replace('tasks_', '');
            const tasks = JSON.parse(localStorage.getItem(key)) || [];
            
            tasks.forEach(t => {
                if (t.status === STATUS.COMPLETED) stats.completed++;
                else if (t.status === STATUS.HALF_DONE) stats.halfDone++;
                else stats.notDone++;
            });

            const done = tasks.filter(t => t.status === STATUS.COMPLETED).length;
            stats.dailyProgress.push({ date: dateStr, done });
        }
    }

    return stats;
}

function updateCharts(stats) {
    const pieCanvas = document.getElementById('pie-chart');
    const barCanvas = document.getElementById('bar-chart');
    if (!pieCanvas || !barCanvas) return;

    const ctxPie = pieCanvas.getContext('2d');
    const ctxBar = barCanvas.getContext('2d');

    if (chartInstances.pie) chartInstances.pie.destroy();
    if (chartInstances.bar) chartInstances.bar.destroy();

    chartInstances.pie = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Done', 'Half', 'Todo'],
            datasets: [{
                data: [stats.completed, stats.halfDone, stats.notDone],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });

    const last7 = stats.dailyProgress.sort((a, b) => a.date.localeCompare(b.date)).slice(-7);

    chartInstances.bar = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: last7.map(d => d.date.split('-').slice(1).join('/')),
            datasets: [{
                label: 'Tasks Completed',
                data: last7.map(d => d.done),
                backgroundColor: '#6366f1',
                borderRadius: 8
            }]
        },
        options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
}

// --- HISTORY ---
async function renderHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = '';

    const historyData = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('tasks_')) {
            historyData.push({
                date: key.replace('tasks_', ''),
                tasks: JSON.parse(localStorage.getItem(key))
            });
        }
    }

    // Sort by date descending
    historyData.sort((a, b) => b.date.localeCompare(a.date));
    const recent = historyData.slice(0, 10);

    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-message">No history found.</p>';
        return;
    }

    recent.forEach(doc => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'history-day fadeIn';
        dayDiv.innerHTML = `
            <div class="history-date">${doc.date}</div>
            <div class="history-tasks">
                ${doc.tasks.map(t => `<span class="history-task ${t.status}">${t.text}</span>`).join('')}
            </div>
        `;
        container.appendChild(dayDiv);
    });
}

// --- TIMETABLE ---
async function getTimetable() {
    try {
        const data = localStorage.getItem('timetable');
        if (!data || data === '{}') return JSON.parse(JSON.stringify(defaultTimetable));
        const parsed = JSON.parse(data);
        // If it's an object but all days are empty, also fallback
        const hasData = Object.values(parsed).some(day => Array.isArray(day) && day.length > 0);
        return hasData ? parsed : JSON.parse(JSON.stringify(defaultTimetable));
    } catch (e) {
        console.error("Error loading timetable", e);
        return JSON.parse(JSON.stringify(defaultTimetable));
    }
}

async function renderTimetable() {
    const container = document.getElementById('dynamic-timetable-container');
    const timetable = await getTimetable();
    const daySchedule = timetable[currentTimetableDay] || [];

    document.getElementById('edit-timetable-btn').style.display = isTimetableEditMode ? 'none' : 'block';
    document.getElementById('save-timetable-btn').style.display = isTimetableEditMode ? 'block' : 'none';

    if (isTimetableEditMode) {
        let html = `<table class="timetable-table">
            <thead><tr><th>Time</th><th>Activity</th><th>Action</th></tr></thead>
            <tbody>`;
        daySchedule.forEach((item, idx) => {
            html += `<tr>
                <td><input type="text" class="time-input" value="${item.time}"></td>
                <td><input type="text" class="activity-input" value="${item.activity}"></td>
                <td><button class="delete-btn" onclick="removeTimetableRow(${idx})">🗑️</button></td>
            </tr>`;
        });
        html += `</tbody></table>`;
        html += `<button class="add-task-btn" onclick="addTimetableRow()" style="margin-top:15px">+ Add Slot</button>`;
        container.innerHTML = html;
    } else {
        let html = `<div class="timetable-grid">`;
        if (daySchedule.length === 0) {
            html += `<p class="empty-message">No activities scheduled for ${currentTimetableDay}. Click Edit to add some!</p>`;
        } else {
            daySchedule.forEach((item) => {
                html += `
                    <div class="timetable-card fadeIn">
                        <div class="tt-time">
                            <span class="tt-icon">⏰</span>
                            ${item.time}
                        </div>
                        <div class="tt-activity">
                            <span class="tt-label">Activity:</span>
                            ${item.activity}
                        </div>
                    </div>
                `;
            });
        }
        html += `</div>`;
        container.innerHTML = html;
    }
}

function setupTimetableListeners() {
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentTimetableDay = e.currentTarget.getAttribute('data-day');
            renderTimetable();
        };
    });

    document.getElementById('edit-timetable-btn').onclick = () => { isTimetableEditMode = true; renderTimetable(); };
    document.getElementById('save-timetable-btn').onclick = saveTimetable;
    document.getElementById('reset-timetable-btn').onclick = resetTimetable;
}

async function resetTimetable() {
    if (confirm('Are you sure you want to reset to the intense default schedule? This will overwrite your current timetable changes.')) {
        localStorage.removeItem('timetable');
        renderTimetable();
    }
}

async function saveTimetable() {
    const rows = document.querySelectorAll('.timetable-table tbody tr');
    let newDaySchedule = [];
    rows.forEach(row => {
        const timeInput = row.querySelector('.time-input');
        const activityInput = row.querySelector('.activity-input');
        if (timeInput && activityInput) {
            const time = timeInput.value;
            const activity = activityInput.value;
            if (time || activity) newDaySchedule.push({ time, activity });
        }
    });

    const timetable = await getTimetable();
    timetable[currentTimetableDay] = newDaySchedule;

    localStorage.setItem('timetable', JSON.stringify(timetable));
    isTimetableEditMode = false;
    renderTimetable();
}

window.addTimetableRow = async function () {
    const timetable = await getTimetable();
    if (!timetable[currentTimetableDay]) timetable[currentTimetableDay] = [];
    timetable[currentTimetableDay].push({ time: '', activity: '' });
    localStorage.setItem('timetable', JSON.stringify(timetable));
    renderTimetable();
};

window.removeTimetableRow = async function (idx) {
    const timetable = await getTimetable();
    timetable[currentTimetableDay].splice(idx, 1);
    localStorage.setItem('timetable', JSON.stringify(timetable));
    renderTimetable();
};

// --- STREAK LOGIC ---
async function calculateStreak() {
    let streak = 0;
    const today = getDateString(new Date());
    let checkDate = new Date();

    while (true) {
        const dateStr = getDateString(checkDate);
        const data = localStorage.getItem(`tasks_${dateStr}`);
        
        if (data) {
            const tasks = JSON.parse(data) || [];
            const completed = tasks.some(t => t.status === STATUS.COMPLETED);
            if (completed) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        } else {
            if (dateStr === today) {
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            }
            break;
        }
    }

    currentStreak = streak;
    const streakEl = document.getElementById('streak-number');
    if (streakEl) streakEl.textContent = currentStreak;
}

// --- UTILS ---
function getDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'soft-gradient';
    document.body.setAttribute('data-theme', theme);
    document.getElementById('theme-select').value = theme;
}

function setupThemeListener() {
    document.getElementById('theme-select').onchange = (e) => {
        const theme = e.target.value;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
}
