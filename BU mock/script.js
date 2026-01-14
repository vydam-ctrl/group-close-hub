const Status = Object.freeze({
    IN_PROGRESS: 'In Progress',
    SENT: 'Sent',
    OPEN: 'Open',
    REJECT: 'Reject',
    APPROVE: 'Approve'
});

// TASKS_DATA is loaded from tasks.js
let tasks = TASKS_DATA || [];
let currentTaskIndex = null;

const taskList = document.getElementById('task-list');
const notesList = document.getElementById('notes-list');
const notify = document.getElementById('notification');
const taskModal = document.getElementById('taskModal');
const confirmBtn = document.getElementById('modalConfirmBtn');
const spinner = document.getElementById('modalSpinner');

function renderTable(data) {
    const tbody = document.getElementById('task-list');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.forEach(task => {
        // --- CRITICAL FIX ---
        // We must find the index of this task in the MAIN list (TASKS_DATA),
        // not the filtered list. This ensures openModal gets the correct index.
        const originalIndex = TASKS_DATA.indexOf(task);

        // Define color based on status
        let statusColor = 'bg-gray-100 text-gray-800';
        if (task.status === 'Open') statusColor = 'bg-blue-100 text-blue-800';
        if (task.status === 'Sent') statusColor = 'bg-yellow-100 text-yellow-800';
        if (task.status === 'Reject') statusColor = 'bg-red-100 text-red-800';
        if (task.status === 'Approve') statusColor = 'bg-green-100 text-green-800';

        // Action Buttons
        let actionButtons = (task.status === 'Sent' || task.status === 'Approve') ? '' : `
        <button class="text-gray-500 hover:text-blue-600 transistion-colors" title="View Detail" onclick="openModal(${originalIndex})">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>`;

        const row = `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 text-sm text-gray-700 font-medium">${task.name}</td>
                <td class="p-3 text-sm text-gray-600">${task.owner}</td>
                <td class="p-3">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusColor}">
                        ${task.status}
                    </span>
                </td>
                <td class="p-3 text-sm text-gray-600">${task.dueDate}</td>
                <td class="p-3 text-sm text-gray-600 text-center">${task.sla}</td>
                <td class="p-3 text-center">
                    ${actionButtons}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Variable to track what action triggered the modal (approve, reject, confirm)
let currentActionType = '';
function handleAction(type, index) {
    currentActionType = type; // Save the action type if you need it later
    openModal(index);         // Call your existing openModal function
}

// Function to Filter the Data
function applyFilters() {
    const ownerTerm = document.getElementById('searchOwner').value.toLowerCase();
    const statusTerm = document.getElementById('searchStatus').value;
    const dateTerm = document.getElementById('searchDate').value;
    const slaTerm = document.getElementById('searchSLA').value;

    const filteredData = TASKS_DATA.filter(task => {
        // 1. Filter by Owner (Partial Match)
        const matchOwner = !ownerTerm || (task.owner && task.owner.toLowerCase().includes(ownerTerm));

        // 2. Filter by Status (Exact Match)
        const matchStatus = !statusTerm || task.status === statusTerm;

        // 3. Filter by Due Date (Exact Match)
        const matchDate = !dateTerm || task.dueDate === dateTerm;

        // 4. Filter by SLA (Less than or equal to input)
        const matchSLA = !slaTerm || task.sla <= parseInt(slaTerm);

        return matchOwner && matchStatus && matchDate && matchSLA;
    });

    // Re-render table with filtered data
    renderTable(filteredData);

    // Optional: Update dashboard counts if you have a function for that
    // updateDashboard(filteredData); 
}

// Initial Render
window.onload = () => {
    renderTable(TASKS_DATA);
    // updateDashboard(TASKS_DATA);
};

// Date Helpers
function parseTaskDate(dateStr) {
    return new Date(dateStr);
}

function calculateSLA(dueDateStr) {
    const due = parseTaskDate(dueDateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare date only

    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function show(msg, type = 'info') {
    const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    // Clear previous types
    notify.classList.remove('notification-success', 'notification-error', 'notification-info');

    // Add current type
    notify.classList.add(`notification-${type}`);
    notify.innerHTML = `${icons[type] || icons.info} <span>${msg}</span>`;
    notify.classList.add('show');
    setTimeout(() => notify.classList.remove('show'), 3000);
}

function getBadgeClass(status) {
    switch (status) {
        case Status.IN_PROGRESS: return 'badge badge-progress';
        case Status.SENT: return 'badge badge-sent';
        case Status.REJECT: return 'badge badge-reject';
        case Status.APPROVE: return 'badge badge-approve';
        default: return 'badge badge-open';
    }
}

function openModal(index) {
    currentTaskIndex = index;
    const task = tasks[index];

    document.getElementById('modalTaskName').textContent = task.name;
    document.getElementById('modalOwner').textContent = task.owner;
    document.getElementById('modalStatusContainer').innerHTML = `<span class="${getBadgeClass(task.status)}">${task.status}</span>`;
    document.getElementById('modalDueDate').textContent = task.dueDate;

    // Handle Reason visibility
    const reasonContainer = document.getElementById('modalReasonContainer');
    if (task.status === Status.REJECT) {
        reasonContainer.classList.remove('hidden');
        document.getElementById('modalReason').textContent = task.reason || 'No reason provided';
    } else {
        reasonContainer.classList.add('hidden');
    }

    // Reset state
    confirmBtn.disabled = false;
    spinner.classList.add('hidden');
    confirmBtn.querySelector('span').textContent = 'Confirm Action';

    taskModal.classList.remove('hidden');
    taskModal.classList.add('flex');
}

function closeModal() {
    if (confirmBtn.disabled) return; // Prevent closing while processing
    taskModal.classList.add('hidden');
    taskModal.classList.remove('flex');
}

async function confirmTask() {
    confirmBtn.disabled = true;
    spinner.classList.remove('hidden');
    confirmBtn.querySelector('span').textContent = 'Processing...';

    // Simulate process
    setTimeout(() => {
        const task = tasks[currentTaskIndex];
        const mock = task.confirmMock || { status: 'success' };

        spinner.classList.add('hidden');
        confirmBtn.disabled = false;
        confirmBtn.querySelector('span').textContent = 'Confirm Action';

        if (mock.status === 'success') {
            if (task.status === Status.OPEN || task.status === Status.REJECT) {
                task.status = Status.SENT;
            }
            show(`Process completed successfully for ${task.name}!`, 'success');
            render(); // Update UI
            closeModal();
        } else {
            show(`Error: ${mock.message || 'Process failed'}. Please try again.`, 'error');
        }
    }, 1000);
}

function render() {
    // Render Tasks
    taskList.innerHTML = tasks.map((task, index) => {
        const sla = calculateSLA(task.dueDate);
        const isOverdue = sla <= 0;
        const slaClass = isOverdue ? 'text-red-600 font-bold' : 'text-gray-600';
        const rowClass = isOverdue ? 'row-overdue' : '';

        return `
    <tr class="border-b transition-colors ${rowClass}">
      <td class="px-6 py-4 font-medium">${task.name}</td>
      <td class="px-6 py-4 text-gray-600">${task.owner}</td>
      <td class="px-6 py-4">
        <span class="${getBadgeClass(task.status)}">${task.status}</span>
      </td>
      <td class="px-6 py-4 text-gray-600">${task.dueDate}</td>
      <td class="px-6 py-4 ${slaClass}">${sla}</td>
      <td class="px-6 py-4 text-right">
        ${(task.status === Status.SENT || task.status === Status.APPROVE) ? '' : `
        <button class="view-btn" title="View Detail" onclick="openModal(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        `}
      </td>
    </tr>
  `}).join('');

    // Render Summary
    const total = tasks.length;
    const sent = tasks.filter(t => t.status === Status.SENT).length;
    const ip = tasks.filter(t => t.status === Status.IN_PROGRESS).length;
    const open = tasks.filter(t => t.status === Status.OPEN).length;

    document.getElementById('totalTasks').textContent = total;

    // Render breakdown as badges
    document.getElementById('breakdown').innerHTML = `
      <div class="flex flex-wrap gap-2 justify-center mt-1">
        <span class="${getBadgeClass(Status.OPEN)} text-[12px] px-2 py-0.5">${Status.OPEN}: ${open}</span>
        <span class="${getBadgeClass(Status.IN_PROGRESS)} text-[12px] px-2 py-0.5">${Status.IN_PROGRESS}: ${ip}</span>
        <span class="${getBadgeClass(Status.SENT)} text-[12px] px-2 py-0.5">${Status.SENT}: ${sent}</span>
      </div>
    `;

    // Calculate urgent tasks (SLA < 1)
    const urgentTasks = tasks.filter(t => calculateSLA(t.dueDate) <= 1);
    const urgentCount = urgentTasks.length;

    if (urgentCount > 0) {
        const listItems = urgentTasks.map(t => `<li class="truncate" title="${t.name}">${t.name}</li>`).join('');
        document.getElementById('urgentCount').innerHTML = `
            <div class="text-left w-full">
                <div class="mb-1">${urgentCount} urgent:</div>
                <ul class="list-disc pl-4 space-y-0.5 text-xs text-orange-700">
                    ${listItems}
                </ul>
            </div>
        `;
    } else {
        document.getElementById('urgentCount').textContent = 'All tasks on track';
    }
}

// Actions
document.getElementById('refreshBtn').onclick = () => {
    show('Refreshing dashboard...', 'info');
    setTimeout(render, 500);
};
document.getElementById('exportBtn').onclick = () => show('Exporting Task List...', 'info');

// Sidebar Selection Logic
const navLinks = document.querySelectorAll('nav a');
const activeClass = ['bg-blue-50', 'text-bizzi', 'font-medium'];
const inactiveClass = ['hover:bg-gray-100'];

function setActive(el) {
    navLinks.forEach(link => {
        link.classList.remove(...activeClass);
        link.classList.add(...inactiveClass);
    });
    el.classList.remove(...inactiveClass);
    el.classList.add(...activeClass);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setActive(link);
        show(`Navigating to ${link.textContent}...`, 'info');
    });
});

// Set default
if (navLinks.length > 0) setActive(navLinks[0]);

render();
