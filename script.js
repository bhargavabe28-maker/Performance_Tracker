// MyPerformance - Student Performance Tracker Main Script
console.log('MyPerformance Script Loaded');

// --- APP STATE ---
let currentDate = new Date();
let chartInstances = {};
let currentStreak = 0;
let currentTimetableDay = 'Monday';
let isTimetableEditMode = false;
let allowOfficialEdit = false;

// --- CONSTANTS ---
const STATUS = {
  COMPLETED: 'completed',
  HALF_DONE: 'half-done',
  NOT_DONE: 'not-done',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CATEGORY_COLORS = {
  College: '🎓',
  DSA: '🧠',
  GATE: '📘',
  Semester: '📚',
  Development: '💻',
  AI: '🤖',
  Exercise: '🏃',
  Meal: '🍽️',
  Sleep: '😴',
  Break: '☕',
  Routine: '🕒',
  Review: '✅',
  Planning: '🗓️',
  Personal: '🌱',
};

const GROUP_TO_METRIC = {
  DSA: 'dsa',
  GATE: 'gate',
  Semester: 'semester',
  Development: 'development',
  AI: 'development',
};

const TRACKED_METRICS = ['dsa', 'gate', 'semester', 'development'];

const defaultTimetable = {
  Monday: [
    createSlot('06:00', '06:15', 'Wake-up routine', 'Routine', 'Hydrate, freshen up, and set top 3 outcomes for the day.', 'Start day on time with clear focus.', 'high', true, true),
    createSlot('06:15', '06:45', 'Exercise', 'Exercise', 'Bodyweight + mobility routine (30 mins).', 'Complete planned workout and energize body.', 'high', true, true),
    createSlot('06:45', '07:15', 'Bath and get ready', 'Routine', 'Morning hygiene and preparation for college.', 'Leave home ready without delay.', 'medium', true, true),
    createSlot('07:15', '07:45', 'Breakfast', 'Meal', 'High-protein breakfast and hydration.', 'Maintain energy till lunch.', 'high', true, true),
    createSlot('07:45', '08:45', 'Travel & prep buffer', 'Routine', 'Commute/preparation buffer (editable once commute is confirmed).', 'Reach college before first block.', 'high', false, true),
    createSlot('09:00', '13:00', 'College', 'College', 'Attend all official classes and capture key notes.', 'Complete morning college attendance and notes.', 'high', true, true, true),
    createSlot('13:00', '14:00', 'Lunch Break', 'Meal', 'Lunch + short reset.', 'Return refreshed for afternoon block.', 'high', true, true, true),
    createSlot('14:00', '17:00', 'College', 'College', 'Attend all official classes/labs and note assignment updates.', 'Complete afternoon college responsibilities.', 'high', true, true, true),
    createSlot('17:00', '17:45', 'Return & refresh', 'Break', 'Travel back/transition + snack.', 'Recover from college and reset for study.', 'high', false, true),
    createSlot('17:45', '19:45', 'DSA (Java) - 2h target', 'DSA', '30m concept revision, 60m solve 2 LeetCode problems, 20m error analysis, 10m pattern notes.', 'Solve 2 problems with complexity analysis and notes.', 'high', false, false),
    createSlot('19:45', '20:15', 'Dinner', 'Meal', 'Dinner and hydration.', 'Refuel for evening focus.', 'high', true, true),
    createSlot('20:15', '22:15', 'GATE CSE - 2h target', 'GATE', '60m syllabus topic, 45m PYQ/problem practice, 15m formula/error revision.', 'Advance one topic and log mistakes.', 'high', false, false),
    createSlot('22:15', '22:45', 'Semester revision', 'Semester', 'Revise today’s college notes and list pending assignments.', 'Keep semester subjects current.', 'medium', false, false),
    createSlot('22:45', '23:00', 'Daily review & next-day plan', 'Review', 'Update tracker: wins, misses, carry-forwards.', 'Clear plan for tomorrow.', 'high', false, false),
    createSlot('23:00', '06:00', 'Sleep', 'Sleep', 'Sleep window (7h, crosses midnight).', 'Recovery and cognitive readiness.', 'high', true, true),
  ],
  Tuesday: [
    createSlot('06:00', '06:15', 'Wake-up routine', 'Routine', 'Hydrate, freshen up, and set priorities.', 'Start day on time.', 'high', true, true),
    createSlot('06:15', '06:45', 'Exercise', 'Exercise', 'Light cardio and stretching.', 'Maintain consistency and fitness.', 'high', true, true),
    createSlot('06:45', '07:15', 'Bath and get ready', 'Routine', 'Get ready for college.', 'Be prepared before commute.', 'medium', true, true),
    createSlot('07:15', '07:45', 'Breakfast', 'Meal', 'Balanced breakfast.', 'Sustain energy across lab-heavy day.', 'high', true, true),
    createSlot('07:45', '08:45', 'Travel & prep buffer', 'Routine', 'Commute/prep buffer (editable).', 'Arrive before college block.', 'high', false, true),
    createSlot('09:00', '13:00', 'College', 'College', 'Attend official classes/lab sessions.', 'Complete morning college sessions.', 'high', true, true, true),
    createSlot('13:00', '14:00', 'Lunch Break', 'Meal', 'Lunch break and short walk.', 'Return refreshed.', 'high', true, true, true),
    createSlot('14:00', '17:00', 'College', 'College', 'Continue official lab/college sessions.', 'Complete day’s official schedule.', 'high', true, true, true),
    createSlot('17:00', '17:45', 'Return & refresh', 'Break', 'Commute/transition and snack.', 'Regain focus after long lab day.', 'high', false, true),
    createSlot('17:45', '19:15', 'DSA (Java) - core block', 'DSA', 'Solve 2 medium problems focused on arrays/strings.', 'Keep interview prep momentum.', 'high', false, false),
    createSlot('19:15', '19:45', 'Dinner', 'Meal', 'Dinner.', 'Refuel.', 'high', true, true),
    createSlot('19:45', '21:30', 'GATE CSE - focused block', 'GATE', 'Study one topic + solve PYQs.', 'Complete one concept cycle.', 'high', false, false),
    createSlot('21:30', '22:15', 'Semester/lab record update', 'Semester', 'Update Web Programming lab record and pending tasks.', 'Avoid assignment backlog.', 'high', false, false),
    createSlot('22:15', '22:45', 'DSA/GATE top-up (trade-off slot)', 'DSA', 'Use for finishing DSA/GATE target if pending from today.', 'Close critical target gaps without sacrificing sleep.', 'medium', false, false),
    createSlot('22:45', '23:00', 'Daily review & next-day plan', 'Review', 'Record completed tasks and blockers.', 'Clear carry-forward list.', 'high', false, false),
    createSlot('23:00', '06:00', 'Sleep', 'Sleep', 'Sleep window (7h, crosses midnight).', 'Recovery.', 'high', true, true),
  ],
  Wednesday: [
    createSlot('06:00', '06:15', 'Wake-up routine', 'Routine', 'Hydrate and morning prep.', 'On-time start.', 'high', true, true),
    createSlot('06:15', '06:45', 'Exercise', 'Exercise', 'Strength + mobility.', 'Complete workout.', 'high', true, true),
    createSlot('06:45', '07:15', 'Bath and get ready', 'Routine', 'Get ready.', 'Prepared for college.', 'medium', true, true),
    createSlot('07:15', '07:45', 'Breakfast', 'Meal', 'Breakfast and hydration.', 'Sustained concentration.', 'high', true, true),
    createSlot('07:45', '08:45', 'Travel & prep buffer', 'Routine', 'Commute/prep buffer (editable).', 'Reach college on time.', 'high', false, true),
    createSlot('09:00', '13:00', 'College', 'College', 'Attend official classes.', 'Morning attendance complete.', 'high', true, true, true),
    createSlot('13:00', '14:00', 'Lunch Break', 'Meal', 'Lunch and short reset.', 'Afternoon readiness.', 'high', true, true, true),
    createSlot('14:00', '17:00', 'College', 'College', 'Attend official DBMS lab block.', 'Complete all lab sessions.', 'high', true, true, true),
    createSlot('17:00', '17:45', 'Return & refresh', 'Break', 'Travel/transition + snack.', 'Restore attention.', 'high', false, true),
    createSlot('17:45', '19:45', 'GATE CSE - 2h target', 'GATE', 'Topic learning + PYQ drill + formula recap.', 'Progress one GATE topic unit.', 'high', false, false),
    createSlot('19:45', '20:15', 'Dinner', 'Meal', 'Dinner.', 'Energy recovery.', 'high', true, true),
    createSlot('20:15', '22:15', 'DSA (Java) - 2h target', 'DSA', 'Concept + 2 LeetCode problems + postmortem notes.', '2 solved problems and notes.', 'high', false, false),
    createSlot('22:15', '22:45', 'Semester revision', 'Semester', 'Review DBMS lab and difficult topics.', 'Improve retention and exam readiness.', 'medium', false, false),
    createSlot('22:45', '23:00', 'Daily review & planning', 'Review', 'Update task tracker and blockers.', 'Tomorrow plan ready.', 'high', false, false),
    createSlot('23:00', '06:00', 'Sleep', 'Sleep', 'Sleep window (7h, crosses midnight).', 'Recovery.', 'high', true, true),
  ],
  Thursday: [
    createSlot('06:00', '06:15', 'Wake-up routine', 'Routine', 'Hydrate and freshen up.', 'On-time start.', 'high', true, true),
    createSlot('06:15', '06:45', 'Exercise', 'Exercise', 'Light run + stretching.', 'Maintain health consistency.', 'high', true, true),
    createSlot('06:45', '07:15', 'Bath and get ready', 'Routine', 'Morning preparation.', 'Prepared for college.', 'medium', true, true),
    createSlot('07:15', '07:45', 'Breakfast', 'Meal', 'Breakfast.', 'Sustain energy.', 'high', true, true),
    createSlot('07:45', '08:45', 'Travel & prep buffer', 'Routine', 'Commute/prep buffer (editable).', 'Reach before class.', 'high', false, true),
    createSlot('09:00', '13:00', 'College', 'College', 'Attend official classes/lab sessions.', 'Complete morning block.', 'high', true, true, true),
    createSlot('13:00', '14:00', 'Lunch Break', 'Meal', 'Lunch and short reset.', 'Ready for afternoon classes.', 'high', true, true, true),
    createSlot('14:00', '17:00', 'College', 'College', 'Attend official sessions.', 'Complete official college schedule.', 'high', true, true, true),
    createSlot('17:00', '17:45', 'Return & refresh', 'Break', 'Travel/transition and snack.', 'Shift into study mode.', 'high', false, true),
    createSlot('17:45', '19:45', 'DSA (Java) - 2h target', 'DSA', 'Trees/graphs practice with complexity analysis.', '2 quality solutions with notes.', 'high', false, false),
    createSlot('19:45', '20:15', 'Dinner', 'Meal', 'Dinner.', 'Recovery.', 'high', true, true),
    createSlot('20:15', '22:15', 'GATE CSE - 2h target', 'GATE', 'Study + question practice + formula revision.', 'Topic progress logged.', 'high', false, false),
    createSlot('22:15', '22:45', 'Semester revision', 'Semester', 'Revise difficult class topics and assignment list.', 'No hidden pending work.', 'medium', false, false),
    createSlot('22:45', '23:00', 'Daily review & planning', 'Review', 'Record progress and next-day tasks.', 'Clear priorities.', 'high', false, false),
    createSlot('23:00', '06:00', 'Sleep', 'Sleep', 'Sleep window (7h, crosses midnight).', 'Recovery.', 'high', true, true),
  ],
  Friday: [
    createSlot('06:00', '06:15', 'Wake-up routine', 'Routine', 'Hydrate and freshen up.', 'Start day with clarity.', 'high', true, true),
    createSlot('06:15', '06:45', 'Exercise', 'Exercise', 'Mobility + core.', 'Maintain weekly fitness target.', 'high', true, true),
    createSlot('06:45', '07:15', 'Bath and get ready', 'Routine', 'Morning preparation.', 'Ready before commute.', 'medium', true, true),
    createSlot('07:15', '07:45', 'Breakfast', 'Meal', 'Balanced breakfast.', 'Steady energy.', 'high', true, true),
    createSlot('07:45', '08:45', 'Travel & prep buffer', 'Routine', 'Commute/prep buffer (editable).', 'Arrive on time.', 'high', false, true),
    createSlot('09:00', '13:00', 'College', 'College', 'Attend official classes and collect assignment deadlines.', 'Morning block complete.', 'high', true, true, true),
    createSlot('13:00', '14:00', 'Lunch Break', 'Meal', 'Lunch break.', 'Refresh.', 'high', true, true, true),
    createSlot('14:00', '17:00', 'College', 'College', 'Attend official sessions and complete pending lab checks.', 'Close weekly college loop.', 'high', true, true, true),
    createSlot('17:00', '17:45', 'Return & refresh', 'Break', 'Commute/transition and snack.', 'Mental reset.', 'high', false, true),
    createSlot('17:45', '19:30', 'GATE CSE - focused block', 'GATE', 'One topic + PYQ set.', 'Solidify key concepts before weekend.', 'high', false, false),
    createSlot('19:30', '20:00', 'Dinner', 'Meal', 'Dinner.', 'Recovery.', 'high', true, true),
    createSlot('20:00', '21:45', 'DSA (Java) - focused block', 'DSA', 'Solve 2 interview-style problems and document patterns.', 'Weekly DSA continuity maintained.', 'high', false, false),
    createSlot('21:45', '22:45', 'CareerPilot AI feature sprint', 'Development', 'Implement one small feature or bug fix and commit progress.', 'Visible project increment for the week.', 'medium', false, false),
    createSlot('22:45', '23:00', 'Weekly academic review', 'Review', 'Review completed vs pending academic tasks.', 'Weekend priorities identified.', 'high', false, false),
    createSlot('23:00', '06:30', 'Sleep', 'Sleep', 'Sleep window (7.5h, crosses midnight).', 'Recovery before weekend deep work.', 'high', true, true),
  ],
  Saturday: [
    createSlot('06:30', '06:45', 'Wake-up routine', 'Routine', 'Hydrate and freshen up.', 'Start focused weekend day.', 'high', true, true),
    createSlot('06:45', '07:20', 'Exercise', 'Exercise', 'Cardio + stretching.', 'Physical activation.', 'high', true, true),
    createSlot('07:20', '08:00', 'Breakfast and setup', 'Meal', 'Breakfast and plan deep-work blocks.', 'Ready for long focus sessions.', 'high', true, true),
    createSlot('08:00', '10:00', 'DSA (Java) - deep practice', 'DSA', 'Solve 3-4 problems with detailed dry runs.', 'Strengthen speed + accuracy.', 'high', false, false),
    createSlot('10:00', '10:20', 'Break', 'Break', 'Walk and hydration break.', 'Avoid fatigue.', 'medium', true, true),
    createSlot('10:20', '12:20', 'GATE CSE - deep study', 'GATE', 'Structured topic coverage + PYQ practice.', 'Advance syllabus with notes.', 'high', false, false),
    createSlot('12:20', '13:20', 'Lunch', 'Meal', 'Lunch and rest.', 'Recover before afternoon sessions.', 'high', true, true),
    createSlot('13:20', '15:20', 'CareerPilot AI project block', 'Development', 'Implement one meaningful module with tests/manual verification.', 'Project milestone movement.', 'high', false, false),
    createSlot('15:20', '15:50', 'Break', 'Break', 'Tea/snack and short reset.', 'Maintain focus quality.', 'medium', true, true),
    createSlot('15:50', '17:20', 'Semester assignments', 'Semester', 'Finish pending records/assignments from week.', 'Reduce weekday overload.', 'high', false, false),
    createSlot('17:20', '18:20', 'Personal time', 'Personal', 'Leisure, family, or social recharge.', 'Mental recovery.', 'medium', false, true),
    createSlot('18:20', '19:00', 'Dinner', 'Meal', 'Dinner.', 'Refuel.', 'high', true, true),
    createSlot('19:00', '20:30', 'Full-stack + AI learning sprint', 'AI', 'Build one mini integration (API/auth/LLM feature).', 'Practical AI full-stack experience.', 'medium', false, false),
    createSlot('20:30', '21:00', 'Daily review', 'Review', 'Log completed tasks, misses, and improvements.', 'Accurate progress record.', 'high', false, false),
    createSlot('23:15', '07:00', 'Sleep', 'Sleep', 'Sleep window (7h45m, crosses midnight).', 'Weekend recovery.', 'high', true, true),
  ],
  Sunday: [
    createSlot('07:00', '07:20', 'Wake-up routine', 'Routine', 'Hydrate and freshen up.', 'Gentle start.', 'medium', true, true),
    createSlot('07:20', '07:50', 'Exercise', 'Exercise', 'Light walk/stretch/yoga.', 'Active recovery.', 'medium', true, true),
    createSlot('07:50', '08:30', 'Breakfast', 'Meal', 'Breakfast and hydration.', 'Steady energy.', 'high', true, true),
    createSlot('08:30', '10:00', 'GATE revision/mock', 'GATE', 'Revise one completed topic or take a short mock test.', 'Measure and improve retention.', 'high', false, false),
    createSlot('10:00', '10:20', 'Break', 'Break', 'Short break.', 'Recharge.', 'medium', true, true),
    createSlot('10:20', '11:50', 'DSA focused practice', 'DSA', 'Solve 2 quality problems + review wrong attempts.', 'Maintain consistency.', 'high', false, false),
    createSlot('11:50', '12:50', 'Weekly semester revision', 'Semester', 'Revise weak college topics from week.', 'Keep academics stable.', 'high', false, false),
    createSlot('12:50', '13:40', 'Lunch', 'Meal', 'Lunch and rest.', 'Recovery.', 'high', true, true),
    createSlot('13:40', '15:10', 'Project progress review', 'Development', 'Review CareerPilot AI backlog, bugs, and next milestones.', 'Clear next build plan.', 'medium', false, false),
    createSlot('15:10', '16:10', 'Personal development', 'Personal', 'Resume/GitHub/interview notes or reading.', 'Long-term career growth.', 'medium', false, false),
    createSlot('16:10', '17:10', 'Leisure / family time', 'Personal', 'Low-stress recovery block.', 'Mental reset before week.', 'low', false, true),
    createSlot('17:10', '18:00', 'Dinner', 'Meal', 'Early dinner.', 'Prepare for night planning.', 'high', true, true),
    createSlot('18:00', '19:00', 'Next week planning', 'Planning', 'Plan top goals, DSA/GATE topics, and college deadlines.', 'Actionable week plan.', 'high', false, false),
    createSlot('19:00', '19:30', 'Weekly review summary', 'Review', 'Record planned vs actual and missed-task reasons.', 'Data-ready weekly dashboard.', 'high', false, false),
    createSlot('22:45', '06:00', 'Sleep', 'Sleep', 'Sleep window (7h15m, crosses midnight).', 'Recovery for Monday start.', 'high', true, true),
  ],
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  loadTheme();
  setupTabListeners();
  setupThemeListener();
  setupTaskListeners();
  setupDateNavigation();
  setupTimetableListeners();

  const currentTT = await getTimetable();
  const hasAnyData = Object.values(currentTT).some((day) => Array.isArray(day) && day.length > 0);
  if (!hasAnyData) localStorage.setItem('timetable', JSON.stringify(defaultTimetable));

  renderToday();
  renderHistory();
  updateDashboard();
  renderTimetable();
});

// --- APP CORE LOGIC ---
function setupDateNavigation() {
  const prevBtn = document.getElementById('prev-day');
  const nextBtn = document.getElementById('next-day');
  if (prevBtn) prevBtn.onclick = () => {
    currentDate.setDate(currentDate.getDate() - 1);
    renderToday();
  };
  if (nextBtn) nextBtn.onclick = () => {
    currentDate.setDate(currentDate.getDate() + 1);
    renderToday();
  };
}

function setupTabListeners() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(tab).classList.add('active');

  if (tab === 'dashboard') updateDashboard();
  if (tab === 'history') renderHistory();
  if (tab === 'timetable') renderTimetable();
}

function setupTaskListeners() {
  document.getElementById('add-task-btn').onclick = addNewTask;
  document.getElementById('task-input').onkeypress = (e) => {
    if (e.key === 'Enter') addNewTask();
  };
  document.getElementById('reset-btn').onclick = resetTasks;
}

async function addNewTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) return;

  const dateStr = getDateString(currentDate);
  let tasks = await getTasksForDate(dateStr);

  let task;
  try {
    task = taskFromFreeText(text);
  } catch (e) {
    return;
  }
  tasks.push(task);

  const validation = validateTaskSet(tasks);
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  await saveTasksForDate(dateStr, tasks);
  input.value = '';
  renderToday();
}

async function renderToday() {
  const dateStr = getDateString(currentDate);
  const todayStr = getDateString(new Date());
  const isToday = dateStr === todayStr;
  const isPast = dateStr < todayStr;

  document.getElementById('current-date').textContent = isToday
    ? 'Today'
    : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  document.getElementById('date-message').textContent = isPast ? 'Viewing past performance (Read-only)' : '';

  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-task-btn');
  const resetBtn = document.getElementById('reset-btn');

  taskInput.disabled = isPast;
  addBtn.disabled = isPast;
  resetBtn.disabled = isPast;

  let tasks = await getTasksForDate(dateStr);

  if (!tasks.length && !isPast) tasks = await populateFromTimetable(dateStr);
  tasks = tasks.map(normalizeTask);

  const list = document.getElementById('task-list');
  list.innerHTML = '';

  if (!tasks.length) {
    list.innerHTML = '<p class="empty-message">No tasks for this day.</p>';
  } else {
    const sorted = [...tasks].sort((a, b) => sortSlot(a, b));
    sorted.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item fadeIn';

      const lockText = task.isOfficial ? 'Official college block' : task.fixed ? 'Fixed task' : 'Flexible task';
      const duration = formatMinutes(getDuration(task.start, task.end));
      const icon = CATEGORY_COLORS[task.category] || '📝';

      li.innerHTML = `
        <div class="task-main">
          <div class="task-line1">
            <span class="task-time">${to12h(task.start)} – ${to12h(task.end)} (${duration})</span>
            <span class="task-chip ${task.category.toLowerCase()}">${icon} ${task.category}</span>
            <span class="task-chip priority-${task.priority}">${task.priority.toUpperCase()}</span>
            <span class="task-chip ${task.fixed ? 'chip-fixed' : 'chip-flex'}">${task.fixed ? 'FIXED' : 'FLEX'}</span>
          </div>
          <div class="task-label ${task.status}">${escapeHtml(task.taskName)}</div>
          <div class="task-sub">${escapeHtml(task.activity)}</div>
          <div class="task-sub"><strong>Expected:</strong> ${escapeHtml(task.expectedOutcome)}</div>
          <div class="task-sub"><strong>Actual:</strong> ${task.actualMinutes ? `${task.actualMinutes} mins` : 'Not logged'}${task.notes ? ` • Notes: ${escapeHtml(task.notes)}` : ''}</div>
          <div class="task-sub"><strong>Type:</strong> ${lockText}</div>
        </div>
        <div class="task-status-btns">
          <button class="status-btn ${task.status === STATUS.COMPLETED ? 'completed' : ''}" onclick="updateTaskStatus('${dateStr}', '${task.id}', '${STATUS.COMPLETED}')">✅</button>
          <button class="status-btn ${task.status === STATUS.HALF_DONE ? 'half-done' : ''}" onclick="updateTaskStatus('${dateStr}', '${task.id}', '${STATUS.HALF_DONE}')">⚠️</button>
          <button class="status-btn ${task.status === STATUS.NOT_DONE ? 'not-done' : ''}" onclick="updateTaskStatus('${dateStr}', '${task.id}', '${STATUS.NOT_DONE}')">❌</button>
          <button class="status-btn" onclick="editTask('${dateStr}', '${task.id}')">✏️</button>
          <button class="status-btn" onclick="suggestReschedule('${dateStr}', '${task.id}')">🔁</button>
          <button class="delete-btn" onclick="deleteTask('${dateStr}', '${task.id}')">🗑️</button>
        </div>
      `;

      if (isPast) li.querySelectorAll('button').forEach((b) => (b.disabled = true));
      list.appendChild(li);
    });
  }

  updateProgress(tasks);
  calculateStreak();
}

async function updateTaskStatus(dateStr, taskId, status) {
  let tasks = await getTasksForDate(dateStr);
  tasks = tasks.map((t) => {
    const task = normalizeTask(t);
    if (task.id !== taskId) return task;

    const updated = { ...task, status };
    if (status === STATUS.COMPLETED && (!updated.actualMinutes || updated.actualMinutes <= 0)) {
      updated.actualMinutes = getDuration(updated.start, updated.end);
    }
    return updated;
  });

  await saveTasksForDate(dateStr, tasks);
  renderToday();
  updateDashboard();
}

async function deleteTask(dateStr, taskId) {
  let tasks = await getTasksForDate(dateStr);
  const target = tasks.map(normalizeTask).find((t) => t.id === taskId);
  if (!target) return;

  if (target.isOfficial) {
    const confirmed = confirm('This is an official college/lunch block. Delete only if you explicitly want to override it. Continue?');
    if (!confirmed) return;
  }

  tasks = tasks.map(normalizeTask).filter((t) => t.id !== taskId);
  await saveTasksForDate(dateStr, tasks);
  renderToday();
  updateDashboard();
}

async function editTask(dateStr, taskId) {
  let tasks = (await getTasksForDate(dateStr)).map(normalizeTask);
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return;

  const task = tasks[index];

  if (task.isOfficial && !allowOfficialEdit) {
    const unlock = confirm('Official college blocks are protected. Click OK for explicit unlock and edit this task now.');
    if (!unlock) return;
  }

  const start = prompt('Start time (HH:MM, 24-hour)', task.start);
  if (start === null) return;
  const end = prompt('End time (HH:MM, 24-hour)', task.end);
  if (end === null) return;
  if (!isValidTime(start) || !isValidTime(end)) {
    alert('Invalid time format. Use HH:MM.');
    return;
  }

  const taskName = prompt('Task name', task.taskName);
  if (taskName === null || !taskName.trim()) return;
  const category = prompt('Category (College/DSA/GATE/Semester/Development/AI/Exercise/Meal/Sleep/Break/Review/Planning/Personal)', task.category);
  if (category === null || !category.trim()) return;
  const activity = prompt('Specific activity', task.activity);
  if (activity === null) return;
  const expectedOutcome = prompt('Expected outcome', task.expectedOutcome);
  if (expectedOutcome === null) return;
  const priority = prompt('Priority (high/medium/low)', task.priority);
  if (priority === null) return;
  const fixedInput = prompt('Is this task fixed? (yes/no)', task.fixed ? 'yes' : 'no');
  if (fixedInput === null) return;
  const actualInput = prompt('Actual time spent in minutes (blank keeps current)', task.actualMinutes ? String(task.actualMinutes) : '');
  if (actualInput === null) return;
  const notes = prompt('Notes / difficulties (optional)', task.notes || '');
  if (notes === null) return;

  const updated = {
    ...task,
    start,
    end,
    taskName: taskName.trim(),
    category: category.trim(),
    activity: activity.trim(),
    expectedOutcome: expectedOutcome.trim(),
    priority: normalizePriority(priority),
    fixed: /^y(es)?$/i.test(fixedInput.trim()),
    actualMinutes: actualInput.trim() === '' ? task.actualMinutes : Math.max(0, Number(actualInput) || 0),
    notes: notes.trim(),
  };

  tasks[index] = updated;

  const validation = validateTaskSet(tasks);
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  await saveTasksForDate(dateStr, tasks);
  renderToday();
  updateDashboard();
}

async function resetTasks() {
  if (confirm('Reset all tasks for this date?')) {
    await saveTasksForDate(getDateString(currentDate), []);
    renderToday();
    updateDashboard();
  }
}

async function importTodayFromTimetable() {
  const dateStr = getDateString(currentDate);
  if (confirm('Import activities from timetable for this day and overwrite existing day tasks?')) {
    const tasks = await populateFromTimetable(dateStr, true);
    if (tasks.length === 0) {
      alert('No activities scheduled in the timetable for this day.');
    } else {
      renderToday();
      updateDashboard();
    }
  }
}

function updateProgress(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === STATUS.COMPLETED).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('progress-fill').style.width = `${percent}%`;
  document.getElementById('progress-text').textContent = `${percent}% completed`;
  document.getElementById('count-text').textContent = `${done} / ${total}`;
}

// --- DATA ACCESS LAYER ---
async function getTasksForDate(dateStr) {
  const data = localStorage.getItem(`tasks_${dateStr}`);
  const parsed = data ? JSON.parse(data) : [];
  return Array.isArray(parsed) ? parsed.map(normalizeTask) : [];
}

async function saveTasksForDate(dateStr, tasks) {
  localStorage.setItem(`tasks_${dateStr}`, JSON.stringify(tasks.map(normalizeTask)));
}

async function populateFromTimetable(dateStr, overwrite = false) {
  const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  const timetable = await getTimetable();
  const daySchedule = (timetable[dayName] || []).map(normalizeSlot);

  if (!daySchedule.length) return [];

  if (!overwrite) {
    const existing = await getTasksForDate(dateStr);
    if (existing.length) return existing;
  }

  const tasks = daySchedule.map((item, idx) => ({
    id: `${dateStr}-${item.id || idx}`,
    start: item.start,
    end: item.end,
    taskName: item.taskName,
    category: item.category,
    activity: item.activity,
    expectedOutcome: item.expectedOutcome,
    priority: item.priority,
    fixed: !!item.fixed,
    protected: !!item.protected,
    isOfficial: !!item.isOfficial,
    status: STATUS.NOT_DONE,
    actualMinutes: 0,
    notes: '',
    createdAt: new Date().toISOString(),
  }));

  const validation = validateTaskSet(tasks);
  if (!validation.valid) {
    alert(`Unable to import timetable: ${validation.message}`);
    return [];
  }

  await saveTasksForDate(dateStr, tasks);
  return tasks;
}

// --- ANALYTICS & DASHBOARD ---
async function updateDashboard() {
  const stats = await getOverallStats();
  document.getElementById('total-completed').textContent = stats.completed;
  document.getElementById('total-half-done').textContent = stats.halfDone;
  document.getElementById('total-not-done').textContent = stats.notDone;

  updateCharts(stats);
  renderDashboardInsights(stats);
}

async function getOverallStats() {
  const stats = {
    completed: 0,
    halfDone: 0,
    notDone: 0,
    dailyProgress: [],
    weekly: buildEmptyWeeklyStats(),
  };

  const today = new Date();
  const weekKeys = new Set();
  for (let i = 0; i < 7; i++) weekKeys.add(getDateString(addDays(today, -i)));

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('tasks_')) continue;

    const dateStr = key.replace('tasks_', '');
    const tasks = (JSON.parse(localStorage.getItem(key)) || []).map(normalizeTask);

    tasks.forEach((t) => {
      if (t.status === STATUS.COMPLETED) stats.completed++;
      else if (t.status === STATUS.HALF_DONE) stats.halfDone++;
      else stats.notDone++;
    });

    const done = tasks.filter((t) => t.status === STATUS.COMPLETED).length;
    stats.dailyProgress.push({ date: dateStr, done });

    if (weekKeys.has(dateStr)) mergeWeeklyStats(stats.weekly, tasks);
    if (dateStr < getDateString(today)) {
      stats.weekly.carryForward += tasks.filter((t) => t.status !== STATUS.COMPLETED && !t.protected).length;
    }
  }

  if (!stats.weekly.totalTasks) stats.weekly.completionPercent = 0;
  else stats.weekly.completionPercent = Math.round((stats.weekly.completedTasks / stats.weekly.totalTasks) * 100);

  stats.weekly.nextPriorities = deriveNextWeekPriorities(stats.weekly);
  return stats;
}

function updateCharts(stats) {
  const pieCanvas = document.getElementById('pie-chart');
  const barCanvas = document.getElementById('bar-chart');
  if (!pieCanvas || !barCanvas) return;
  if (typeof Chart === 'undefined') return;

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
        borderWidth: 0,
      }],
    },
    options: { plugins: { legend: { position: 'bottom' } } },
  });

  const last7 = stats.dailyProgress.sort((a, b) => a.date.localeCompare(b.date)).slice(-7);

  chartInstances.bar = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: last7.map((d) => d.date.split('-').slice(1).join('/')),
      datasets: [{
        label: 'Tasks Completed',
        data: last7.map((d) => d.done),
        backgroundColor: '#6366f1',
        borderRadius: 8,
      }],
    },
    options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
  });
}

function renderDashboardInsights(stats) {
  const dashboardCard = document.querySelector('#dashboard .card');
  if (!dashboardCard) return;

  let section = document.getElementById('weekly-insights');
  if (!section) {
    section = document.createElement('div');
    section.id = 'weekly-insights';
    section.className = 'weekly-insights';
    dashboardCard.appendChild(section);
  }

  const w = stats.weekly;
  section.innerHTML = `
    <h3 style="margin-bottom: 12px;">Weekly Planner Dashboard (Actual Data)</h3>
    <div class="insight-grid">
      ${TRACKED_METRICS.map((metric) => {
        const planned = minutesToHours(w.planned[metric]);
        const actual = minutesToHours(w.actual[metric]);
        return `<div class="insight-card"><strong>${metric.toUpperCase()}</strong><br/>Planned: ${planned}h<br/>Actual: ${actual}h</div>`;
      }).join('')}
      <div class="insight-card"><strong>Completion</strong><br/>${w.completedTasks}/${w.totalTasks} tasks<br/>${w.completionPercent}%</div>
      <div class="insight-card"><strong>Carry Forward</strong><br/>${w.carryForward} tasks</div>
    </div>
    <div class="review-box">
      <h4>Weekly Review Snapshot</h4>
      <p><strong>Total Planned Study:</strong> ${minutesToHours(w.totalPlannedStudy)}h</p>
      <p><strong>Total Actual Study:</strong> ${minutesToHours(w.totalActualStudy)}h</p>
      <p><strong>Missed Tasks:</strong> ${w.missedTasks}</p>
      <p><strong>Top Difficulties (from notes):</strong> ${w.difficulties.length ? w.difficulties.slice(0, 3).join(' | ') : 'No difficulty notes logged yet.'}</p>
      <p><strong>3 Priorities for Next Week:</strong></p>
      <ol>${w.nextPriorities.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ol>
    </div>
  `;
}

function buildEmptyWeeklyStats() {
  return {
    planned: { dsa: 0, gate: 0, semester: 0, development: 0 },
    actual: { dsa: 0, gate: 0, semester: 0, development: 0 },
    completedTasks: 0,
    totalTasks: 0,
    completionPercent: 0,
    carryForward: 0,
    missedTasks: 0,
    totalPlannedStudy: 0,
    totalActualStudy: 0,
    difficulties: [],
    nextPriorities: [],
  };
}

function mergeWeeklyStats(weekly, tasks) {
  tasks.forEach((taskRaw) => {
    const task = normalizeTask(taskRaw);
    const duration = getDuration(task.start, task.end);
    const metric = GROUP_TO_METRIC[task.category];

    weekly.totalTasks += 1;
    if (task.status === STATUS.COMPLETED) weekly.completedTasks += 1;
    if (task.status === STATUS.NOT_DONE && !task.protected) weekly.missedTasks += 1;

    if (task.notes && task.status !== STATUS.COMPLETED) weekly.difficulties.push(task.notes);

    if (metric) {
      weekly.planned[metric] += duration;
      let actual = Number(task.actualMinutes) || 0;
      if (!actual) {
        if (task.status === STATUS.COMPLETED) actual = duration;
        else if (task.status === STATUS.HALF_DONE) actual = Math.round(duration * 0.5);
      }
      weekly.actual[metric] += actual;
      weekly.totalPlannedStudy += duration;
      weekly.totalActualStudy += actual;
    }
  });
}

function deriveNextWeekPriorities(weekly) {
  const gaps = TRACKED_METRICS.map((m) => ({ metric: m, gap: weekly.planned[m] - weekly.actual[m] }))
    .sort((a, b) => b.gap - a.gap);

  const priorities = [];
  if (gaps[0]?.gap > 0) priorities.push(`Recover ${gaps[0].metric.toUpperCase()} gap with dedicated catch-up blocks.`);
  if (gaps[1]?.gap > 0) priorities.push(`Strengthen ${gaps[1].metric.toUpperCase()} consistency and reduce missed tasks.`);
  priorities.push('Review pending tasks daily and reschedule only into realistic flexible slots.');
  return priorities.slice(0, 3);
}

// --- HISTORY ---
async function renderHistory() {
  const container = document.getElementById('history-list');
  container.innerHTML = '';

  const historyData = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('tasks_')) continue;
    historyData.push({
      date: key.replace('tasks_', ''),
      tasks: (JSON.parse(localStorage.getItem(key)) || []).map(normalizeTask),
    });
  }

  historyData.sort((a, b) => b.date.localeCompare(a.date));
  const recent = historyData.slice(0, 10);

  if (!recent.length) {
    container.innerHTML = '<p class="empty-message">No history found.</p>';
    return;
  }

  recent.forEach((doc) => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'history-day fadeIn';
    dayDiv.innerHTML = `
      <div class="history-date">${doc.date}</div>
      <div class="history-tasks">
        ${doc.tasks
          .map((t) => `<span class="history-task ${t.status}">${to12h(t.start)}-${to12h(t.end)} • ${escapeHtml(t.taskName)} (${t.status})</span>`)
          .join('')}
      </div>
    `;
    container.appendChild(dayDiv);
  });
}

// --- TIMETABLE ---
async function getTimetable() {
  try {
    const data = localStorage.getItem('timetable');
    if (!data || data === '{}') return deepClone(defaultTimetable);

    const parsed = JSON.parse(data);
    const hasData = Object.values(parsed).some((day) => Array.isArray(day) && day.length > 0);
    if (!hasData) return deepClone(defaultTimetable);

    const normalized = {};
    DAYS.forEach((day) => {
      normalized[day] = (parsed[day] || []).map(normalizeSlot);
    });
    return normalized;
  } catch (e) {
    console.error('Error loading timetable', e);
    return deepClone(defaultTimetable);
  }
}

async function renderTimetable() {
  const container = document.getElementById('dynamic-timetable-container');
  const timetable = await getTimetable();
  const daySchedule = (timetable[currentTimetableDay] || []).map(normalizeSlot).sort(sortSlot);

  const editBtn = document.getElementById('edit-timetable-btn');
  const saveBtn = document.getElementById('save-timetable-btn');
  const resetBtn = document.getElementById('reset-timetable-btn');
  if (editBtn) editBtn.style.display = isTimetableEditMode ? 'none' : 'block';
  if (saveBtn) saveBtn.style.display = isTimetableEditMode ? 'block' : 'none';
  if (resetBtn) resetBtn.textContent = '🔄 Reset Weekly Planner';

  if (isTimetableEditMode) {
    let html = `<div style="margin-bottom: 10px;"><button class="status-btn" onclick="toggleOfficialEdit()">${allowOfficialEdit ? '🔓 Official blocks editable' : '🔒 Unlock official blocks'}</button></div>`;
    html += `<table class="timetable-table">
      <thead>
        <tr>
          <th>Start</th><th>End</th><th>Task</th><th>Category</th><th>Specific Activity</th><th>Expected Outcome</th><th>Priority</th><th>Fixed</th><th>Action</th>
        </tr>
      </thead><tbody>`;

    daySchedule.forEach((item, idx) => {
      const disabled = item.isOfficial && !allowOfficialEdit ? 'disabled' : '';
      html += `
        <tr>
          <td><input ${disabled} type="text" class="time-input start-input" value="${item.start}" /></td>
          <td><input ${disabled} type="text" class="time-input end-input" value="${item.end}" /></td>
          <td><input ${disabled} type="text" class="activity-input taskname-input" value="${escapeHtml(item.taskName)}" /></td>
          <td><input ${disabled} type="text" class="activity-input category-input" value="${escapeHtml(item.category)}" /></td>
          <td><input ${disabled} type="text" class="activity-input activity-input-field" value="${escapeHtml(item.activity)}" /></td>
          <td><input ${disabled} type="text" class="activity-input outcome-input" value="${escapeHtml(item.expectedOutcome)}" /></td>
          <td><input ${disabled} type="text" class="activity-input priority-input" value="${item.priority}" /></td>
          <td><input ${disabled} type="checkbox" class="fixed-input" ${item.fixed ? 'checked' : ''} /></td>
          <td><button class="delete-btn" onclick="removeTimetableRow(${idx})">🗑️</button></td>
        </tr>`;
    });

    html += `</tbody></table>`;
    html += `<button class="add-task-btn" onclick="addTimetableRow()" style="margin-top:15px">+ Add Slot</button>`;
    container.innerHTML = html;
    return;
  }

  let html = '<div class="timetable-grid">';
  if (!daySchedule.length) {
    html += `<p class="empty-message">No activities scheduled for ${currentTimetableDay}. Click Edit to add some!</p>`;
  } else {
    daySchedule.forEach((item) => {
      const duration = formatMinutes(getDuration(item.start, item.end));
      const icon = CATEGORY_COLORS[item.category] || '📝';
      html += `
        <div class="timetable-card fadeIn">
          <div class="tt-time"><span class="tt-icon">⏰</span> ${to12h(item.start)} – ${to12h(item.end)}</div>
          <div class="tt-activity"><span class="tt-label">Task:</span> ${escapeHtml(item.taskName)}</div>
          <div class="tt-activity"><span class="tt-label">Category:</span> ${icon} ${escapeHtml(item.category)}</div>
          <div class="tt-activity"><span class="tt-label">Duration:</span> ${duration}</div>
          <div class="tt-activity"><span class="tt-label">Specific Activity:</span> ${escapeHtml(item.activity)}</div>
          <div class="tt-activity"><span class="tt-label">Expected Outcome:</span> ${escapeHtml(item.expectedOutcome)}</div>
          <div class="tt-activity"><span class="tt-label">Priority:</span> ${item.priority.toUpperCase()} • ${item.fixed ? 'FIXED' : 'FLEXIBLE'}</div>
        </div>
      `;
    });
  }
  html += '</div>';
  container.innerHTML = html;
}

function setupTimetableListeners() {
  document.querySelectorAll('.day-btn').forEach((btn) => {
    btn.onclick = (e) => {
      document.querySelectorAll('.day-btn').forEach((b) => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentTimetableDay = e.currentTarget.getAttribute('data-day');
      renderTimetable();
    };
  });

  document.getElementById('edit-timetable-btn').onclick = () => {
    isTimetableEditMode = true;
    renderTimetable();
  };
  document.getElementById('save-timetable-btn').onclick = saveTimetable;
  document.getElementById('reset-timetable-btn').onclick = resetTimetable;
}

function toggleOfficialEdit() {
  allowOfficialEdit = !allowOfficialEdit;
  renderTimetable();
}
window.toggleOfficialEdit = toggleOfficialEdit;

async function resetTimetable() {
  if (confirm('Reset weekly planner to the structured default schedule?')) {
    localStorage.removeItem('timetable');
    renderTimetable();
  }
}

async function saveTimetable() {
  const rows = document.querySelectorAll('.timetable-table tbody tr');
  const newDaySchedule = [];

  rows.forEach((row, idx) => {
    const start = row.querySelector('.start-input')?.value?.trim();
    const end = row.querySelector('.end-input')?.value?.trim();
    const taskName = row.querySelector('.taskname-input')?.value?.trim();
    const category = row.querySelector('.category-input')?.value?.trim();
    const activity = row.querySelector('.activity-input-field')?.value?.trim();
    const expectedOutcome = row.querySelector('.outcome-input')?.value?.trim();
    const priority = row.querySelector('.priority-input')?.value?.trim();
    const fixed = row.querySelector('.fixed-input')?.checked;

    if (!start && !end && !taskName) return;

    newDaySchedule.push(
      normalizeSlot({
        id: `${currentTimetableDay}-${Date.now()}-${idx}`,
        start,
        end,
        taskName,
        category: category || 'Personal',
        activity: activity || 'Planned activity',
        expectedOutcome: expectedOutcome || 'Complete as planned',
        priority: normalizePriority(priority || 'medium'),
        fixed: !!fixed,
        protected: isProtectedCategory(category || ''),
        isOfficial: false,
      }),
    );
  });

  const validation = validateTaskSet(newDaySchedule);
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  const timetable = await getTimetable();
  timetable[currentTimetableDay] = newDaySchedule;

  localStorage.setItem('timetable', JSON.stringify(timetable));
  isTimetableEditMode = false;
  allowOfficialEdit = false;
  renderTimetable();
}

window.addTimetableRow = async function addTimetableRow() {
  const timetable = await getTimetable();
  if (!timetable[currentTimetableDay]) timetable[currentTimetableDay] = [];
  timetable[currentTimetableDay].push(
    createSlot('18:00', '18:30', 'New task', 'Personal', 'Define activity', 'Complete task', 'medium', false, false, false),
  );
  localStorage.setItem('timetable', JSON.stringify(timetable));
  renderTimetable();
};

window.removeTimetableRow = async function removeTimetableRow(idx) {
  const timetable = await getTimetable();
  const target = normalizeSlot(timetable[currentTimetableDay][idx]);
  if (target?.isOfficial && !allowOfficialEdit) {
    alert('Official college blocks are protected. Unlock first to remove.');
    return;
  }
  timetable[currentTimetableDay].splice(idx, 1);
  localStorage.setItem('timetable', JSON.stringify(timetable));
  renderTimetable();
};

// --- RESCHEDULING ---
async function suggestReschedule(dateStr, taskId) {
  const tasks = (await getTasksForDate(dateStr)).map(normalizeTask).sort(sortSlot);
  const target = tasks.find((t) => t.id === taskId);
  if (!target) return;

  if (target.fixed || target.protected || target.isOfficial) {
    alert('This is a fixed/protected task. Reschedule suggestions are only for flexible tasks.');
    return;
  }

  const duration = getDuration(target.start, target.end);
  const boundaries = { dayStart: '05:30', dayEnd: '23:30' };
  const suggestion = findAvailableWindow(tasks, target, duration, boundaries);

  if (!suggestion) {
    alert('No realistic flexible slot found today without overlapping protected periods. Keep this task as carry-forward.');
    return;
  }

  const msg = `Suggested slot: ${to12h(suggestion.start)} – ${to12h(suggestion.end)} (${formatMinutes(duration)}). Apply this change?`;
  if (!confirm(msg)) return;

  const updated = tasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          start: suggestion.start,
          end: suggestion.end,
          notes: [t.notes, `Rescheduled from ${to12h(target.start)}-${to12h(target.end)}.`].filter(Boolean).join(' '),
        }
      : t,
  );

  await saveTasksForDate(dateStr, updated);
  renderToday();
  updateDashboard();
}
window.suggestReschedule = suggestReschedule;

function findAvailableWindow(tasks, target, duration, boundaries) {
  const dayStart = toMinutes(boundaries.dayStart);
  const dayEnd = toMinutes(boundaries.dayEnd);

  const blocking = tasks
    .filter((t) => t.id !== target.id)
    .map((t) => ({ start: toMinutes(t.start), end: toMinutesAdjusted(t.start, t.end) }))
    .sort((a, b) => a.start - b.start);

  let cursor = Math.max(toMinutesAdjusted(target.start, target.end), dayStart);
  if (cursor + duration > dayEnd) cursor = dayStart;

  for (let round = 0; round < 2; round++) {
    let ptr = cursor;
    for (const block of blocking) {
      if (ptr + duration <= block.start && ptr + duration <= dayEnd) {
        return { start: fromMinutes(ptr), end: fromMinutes(ptr + duration) };
      }
      if (ptr < block.end) ptr = block.end;
      if (ptr + duration > dayEnd) break;
    }
    if (ptr + duration <= dayEnd) {
      return { start: fromMinutes(ptr), end: fromMinutes(ptr + duration) };
    }
    cursor = dayStart;
  }

  return null;
}

// --- STREAK LOGIC ---
async function calculateStreak() {
  let streak = 0;
  const today = getDateString(new Date());
  let checkDate = new Date();

  while (true) {
    const dateStr = getDateString(checkDate);
    const data = localStorage.getItem(`tasks_${dateStr}`);

    if (data) {
      const tasks = JSON.parse(data).map(normalizeTask) || [];
      const completed = tasks.some((t) => t.status === STATUS.COMPLETED);
      if (completed) {
        streak += 1;
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

// --- HELPERS ---
function createSlot(start, end, taskName, category, activity, expectedOutcome, priority, fixed, protectedSlot, isOfficial = false) {
  return {
    id: `${taskName}-${start}-${end}`.replace(/\s+/g, '-').toLowerCase(),
    start,
    end,
    taskName,
    category,
    activity,
    expectedOutcome,
    priority: normalizePriority(priority),
    fixed,
    protected: !!protectedSlot,
    isOfficial,
  };
}

function normalizeSlot(slot = {}) {
  if (slot.time && !slot.start && !slot.end) {
    const parts = slot.time.split('–').map((s) => s.trim());
    if (parts.length === 2) {
      return normalizeSlot({
        start: from12h(parts[0]),
        end: from12h(parts[1]),
        taskName: slot.activity || 'Planned task',
        category: inferCategory(slot.activity || ''),
        activity: slot.activity || 'Planned task',
        expectedOutcome: 'Complete as planned.',
        priority: 'medium',
        fixed: false,
        protected: false,
        isOfficial: false,
      });
    }
  }

  return {
    id: slot.id || `${slot.taskName || slot.activity || 'task'}-${slot.start || '00:00'}-${slot.end || '00:30'}`.replace(/\s+/g, '-').toLowerCase(),
    start: isValidTime(slot.start) ? slot.start : '00:00',
    end: isValidTime(slot.end) ? slot.end : addMinutesStr(isValidTime(slot.start) ? slot.start : '00:00', 30),
    taskName: slot.taskName || slot.activity || 'Task',
    category: slot.category || inferCategory(slot.taskName || slot.activity || ''),
    activity: slot.activity || slot.taskName || 'Planned activity',
    expectedOutcome: slot.expectedOutcome || 'Complete as planned.',
    priority: normalizePriority(slot.priority || 'medium'),
    fixed: !!slot.fixed,
    protected: typeof slot.protected === 'boolean' ? slot.protected : isProtectedCategory(slot.category || ''),
    isOfficial: !!slot.isOfficial,
  };
}

function normalizeTask(task = {}) {
  if (task.text && !task.start) {
    const [left, ...rest] = task.text.split(':');
    if (left.includes('–')) {
      const [start12, end12] = left.split('–').map((v) => v.trim());
      return normalizeTask({
        id: task.id || `${Date.now()}-${Math.random()}`,
        start: from12h(start12),
        end: from12h(end12),
        taskName: rest.join(':').trim() || 'Task',
        category: inferCategory(rest.join(':').trim()),
        activity: rest.join(':').trim() || 'Task',
        expectedOutcome: 'Complete as planned.',
        priority: 'medium',
        fixed: false,
        protected: false,
        isOfficial: false,
        status: task.status || STATUS.NOT_DONE,
        actualMinutes: task.actualMinutes || 0,
        notes: task.notes || '',
        createdAt: task.createdAt || new Date().toISOString(),
      });
    }
  }

  const start = isValidTime(task.start) ? task.start : '00:00';
  const end = isValidTime(task.end) ? task.end : addMinutesStr(start, 30);

  return {
    id: String(task.id || `${Date.now()}-${Math.random()}`),
    start,
    end,
    taskName: task.taskName || task.activity || task.text || 'Task',
    category: task.category || inferCategory(task.taskName || task.activity || task.text || ''),
    activity: task.activity || task.taskName || task.text || 'Planned activity',
    expectedOutcome: task.expectedOutcome || 'Complete as planned.',
    priority: normalizePriority(task.priority || 'medium'),
    fixed: !!task.fixed,
    protected: typeof task.protected === 'boolean' ? task.protected : isProtectedCategory(task.category || ''),
    isOfficial: !!task.isOfficial,
    status: task.status || STATUS.NOT_DONE,
    actualMinutes: Number(task.actualMinutes) || 0,
    notes: task.notes || '',
    createdAt: task.createdAt || new Date().toISOString(),
  };
}

function taskFromFreeText(text) {
  const start = prompt('Start time (HH:MM, 24-hour)', '18:00');
  const end = prompt('End time (HH:MM, 24-hour)', '18:30');
  if (!start || !end || !isValidTime(start) || !isValidTime(end)) {
    alert('Task not added: invalid time format. Use HH:MM.');
    throw new Error('Invalid manual task time');
  }

  const category = prompt('Category (DSA/GATE/Semester/Development/AI/Exercise/Meal/Break/Personal/Review/Planning)', inferCategory(text)) || inferCategory(text);
  const activity = prompt('Specific activity', text) || text;
  const expectedOutcome = prompt('Expected outcome', 'Complete the task and log progress.') || 'Complete the task and log progress.';
  const priority = prompt('Priority (high/medium/low)', 'medium') || 'medium';
  const fixedInput = prompt('Is this fixed? (yes/no)', 'no') || 'no';

  return normalizeTask({
    id: `${Date.now()}-${Math.random()}`,
    start,
    end,
    taskName: text,
    category,
    activity,
    expectedOutcome,
    priority,
    fixed: /^y(es)?$/i.test(fixedInput),
    protected: isProtectedCategory(category),
    isOfficial: false,
    status: STATUS.NOT_DONE,
    actualMinutes: 0,
    notes: '',
  });
}

function validateTaskSet(tasksRaw) {
  const tasks = tasksRaw.map((t) => normalizeTask(t));

  for (const task of tasks) {
    if (!isValidTime(task.start) || !isValidTime(task.end)) {
      return { valid: false, message: `Invalid time for task: ${task.taskName}` };
    }
    if (getDuration(task.start, task.end) <= 0) {
      return { valid: false, message: `Invalid duration for task: ${task.taskName}` };
    }
  }

  const expanded = tasks
    .map((task) => ({ task, ranges: expandRange(task.start, task.end) }))
    .sort((a, b) => a.ranges[0].start - b.ranges[0].start);

  for (let i = 0; i < expanded.length; i++) {
    for (let j = i + 1; j < expanded.length; j++) {
      const a = expanded[i];
      const b = expanded[j];
      if (a.task.id === b.task.id) continue;
      if (rangesOverlap(a.ranges, b.ranges)) {
        return {
          valid: false,
          message: `Overlapping tasks detected: "${a.task.taskName}" and "${b.task.taskName}".`,
        };
      }
    }
  }

  return { valid: true };
}

function rangesOverlap(rangesA, rangesB) {
  for (const a of rangesA) {
    for (const b of rangesB) {
      if (a.start < b.end && b.start < a.end) return true;
    }
  }
  return false;
}

function expandRange(start, end) {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (e > s) return [{ start: s, end: e }];
  return [
    { start: s, end: 1440 },
    { start: 0, end: e },
  ];
}

function getDuration(start, end) {
  const s = toMinutes(start);
  const e = toMinutes(end);
  return e > s ? e - s : 1440 - s + e;
}

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toMinutesAdjusted(start, end) {
  const s = toMinutes(start);
  const e = toMinutes(end);
  return e > s ? e : e + 1440;
}

function fromMinutes(totalMins) {
  let mins = totalMins % 1440;
  if (mins < 0) mins += 1440;
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function addMinutesStr(time, mins) {
  return fromMinutes(toMinutes(time) + mins);
}

function isValidTime(value) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value || '');
}

function to12h(time24) {
  if (!isValidTime(time24)) return time24 || '';
  let [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h %= 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

function from12h(time12) {
  const trimmed = (time12 || '').trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '00:00';
  let h = Number(match[1]);
  const m = Number(match[2]);
  const part = match[3].toUpperCase();
  if (part === 'PM' && h !== 12) h += 12;
  if (part === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function minutesToHours(mins) {
  return (mins / 60).toFixed(1);
}

function inferCategory(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('dsa') || t.includes('leetcode')) return 'DSA';
  if (t.includes('gate')) return 'GATE';
  if (t.includes('college')) return 'College';
  if (t.includes('semester') || t.includes('assignment') || t.includes('lab') || t.includes('revision')) return 'Semester';
  if (t.includes('careerpilot') || t.includes('project') || t.includes('full-stack') || t.includes('full stack') || t.includes('react') || t.includes('backend')) return 'Development';
  if (t.includes('ai') || t.includes('llm')) return 'AI';
  if (t.includes('exercise') || t.includes('workout') || t.includes('walk')) return 'Exercise';
  if (t.includes('break') || t.includes('rest')) return 'Break';
  if (t.includes('breakfast') || t.includes('lunch') || t.includes('dinner')) return 'Meal';
  if (t.includes('sleep')) return 'Sleep';
  if (t.includes('plan')) return 'Planning';
  if (t.includes('review')) return 'Review';
  return 'Personal';
}

function isProtectedCategory(category) {
  return ['College', 'Meal', 'Sleep', 'Exercise', 'Routine', 'Break'].includes((category || '').trim());
}

function normalizePriority(priority) {
  const p = (priority || '').toLowerCase().trim();
  if (p === 'high' || p === 'medium' || p === 'low') return p;
  return 'medium';
}

function sortSlot(a, b) {
  const sa = toMinutes(a.start);
  const sb = toMinutes(b.start);
  if (sa !== sb) return sa - sb;
  return toMinutesAdjusted(a.start, a.end) - toMinutesAdjusted(b.start, b.end);
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

// expose for inline handlers
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;
window.editTask = editTask;
window.importTodayFromTimetable = importTodayFromTimetable;
window.resetTasks = resetTasks;
