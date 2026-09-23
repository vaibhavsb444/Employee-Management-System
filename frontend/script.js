// ==========================================================================
// Project 2: Employee Management System — Frontend JavaScript
// Communicates with Express REST API (Node.js + Mongoose + MongoDB Atlas)
// ==========================================================================

// Base API URL
const API_URL = window.location.origin.includes(':5000')
  ? '/api/employees'
  : 'http://localhost:5000/api/employees';

// Global state
let employees = [];
let editingId = null;
let deletingId = null;
let currentSortColumn = 'name';
let currentSortDirection = 'asc';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadEmployees();
});

// --------------------------------------------------------------------------
// 1. Event Listeners Initialization
// --------------------------------------------------------------------------
function initEventListeners() {
  // Add Employee button
  const openAddBtn = document.querySelector('#openAddModalBtn');
  if (openAddBtn) {
    openAddBtn.addEventListener('click', openAddModal);
  }

  // Modal close and cancel buttons
  const closeBtn = document.querySelector('#closeModalBtn');
  const cancelBtn = document.querySelector('#cancelModalBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Form submission
  const form = document.querySelector('#employeeForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Clear validation error on input
  const inputs = document.querySelectorAll('#employeeForm .form-control');
  inputs.forEach((input) => {
    input.addEventListener('input', function () {
      this.classList.remove('is-invalid');
    });
    input.addEventListener('change', function () {
      this.classList.remove('is-invalid');
    });
  });

  // Search input filter
  const searchInput = document.querySelector('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderTable();
    });
  }

  // Department select filter
  const departmentFilter = document.querySelector('#departmentFilter');
  if (departmentFilter) {
    departmentFilter.addEventListener('change', () => {
      renderTable();
    });
  }

  // Sortable column headers
  const sortHeaders = document.querySelectorAll('th.sortable');
  sortHeaders.forEach((header) => {
    header.addEventListener('click', function () {
      const column = this.getAttribute('data-sort');
      handleSort(column);
    });
  });

  // Delete modal buttons
  const cancelDeleteBtn = document.querySelector('#cancelDeleteBtn');
  const confirmDeleteBtn = document.querySelector('#confirmDeleteBtn');
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

  // Alert banner close buttons
  document.querySelectorAll('.alert-close').forEach((btn) => {
    btn.addEventListener('click', function () {
      this.parentElement.classList.remove('show');
    });
  });
}

// --------------------------------------------------------------------------
// 2. Fetch All Employees from Backend REST API
// --------------------------------------------------------------------------
async function loadEmployees() {
  setLoadingState(true);

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to load employee records from backend');
    }

    employees = result.data || [];
    renderTable();
  } catch (error) {
    showErrorAlert(
      error.message ||
        'Unable to connect to backend server. Make sure the Node.js Express server is running on port 5000.'
    );
    renderTable();
  } finally {
    setLoadingState(false);
  }
}

// --------------------------------------------------------------------------
// 3. Render Employee Table & Apply Search / Filter / Sorting
// --------------------------------------------------------------------------
function getFilteredAndSortedEmployees() {
  const searchInput = document.querySelector('#searchInput');
  const departmentFilter = document.querySelector('#departmentFilter');

  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedDept = departmentFilter ? departmentFilter.value : 'All';

  // 1. Filter
  let filtered = employees.filter((emp) => {
    const matchesSearch =
      (emp.name && emp.name.toLowerCase().includes(searchTerm)) ||
      (emp.department && emp.department.toLowerCase().includes(searchTerm)) ||
      (emp.role && emp.role.toLowerCase().includes(searchTerm));

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  // 2. Sort
  filtered.sort((a, b) => {
    let valA = a[currentSortColumn];
    let valB = b[currentSortColumn];

    if (currentSortColumn === 'salary') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    } else {
      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
    }

    if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
}

function renderTable() {
  const tableBody = document.querySelector('#employeeTableBody');
  const emptyState = document.querySelector('#emptyState');
  const countText = document.querySelector('#tableCountText');

  if (!tableBody) return;

  const displayList = getFilteredAndSortedEmployees();
  tableBody.innerHTML = '';

  if (countText) {
    countText.textContent = `Showing ${displayList.length} of ${employees.length} employee${
      employees.length === 1 ? '' : 's'
    }`;
  }

  // Handle empty state
  if (displayList.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  displayList.forEach((emp) => {
    const tr = document.createElement('tr');

    // Format salary cleanly (e.g. ₹35,000 or $35,000)
    const formattedSalary = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(emp.salary || 0);

    tr.innerHTML = `
      <td><span class="emp-name">${escapeHtml(emp.name)}</span></td>
      <td><span class="dept-badge">${escapeHtml(emp.department)}</span></td>
      <td>${escapeHtml(emp.role)}</td>
      <td><span class="salary-text">${formattedSalary}</span></td>
      <td>${escapeHtml(emp.joinDate || '')}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-outline edit-btn" data-id="${emp._id}" type="button" title="Edit employee">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>Edit</span>
          </button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${emp._id}" type="button" title="Delete employee">
            <i class="fa-solid fa-trash"></i>
            <span>Delete</span>
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // Attach row actions
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      openEditModal(id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      openDeleteModal(id);
    });
  });
}

// --------------------------------------------------------------------------
// 4. Column Sorting Handler
// --------------------------------------------------------------------------
function handleSort(column) {
  if (currentSortColumn === column) {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortColumn = column;
    currentSortDirection = 'asc';
  }

  // Update table header sort icons
  document.querySelectorAll('th.sortable').forEach((th) => {
    const icon = th.querySelector('i');
    if (th.getAttribute('data-sort') === currentSortColumn) {
      icon.className =
        currentSortDirection === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
    } else {
      icon.className = 'fa-solid fa-sort';
    }
  });

  renderTable();
}

// --------------------------------------------------------------------------
// 5. Add / Edit Modal Management
// --------------------------------------------------------------------------
function openAddModal() {
  editingId = null;
  const modal = document.querySelector('#employeeModal');
  const title = document.querySelector('#modalTitle');
  const form = document.querySelector('#employeeForm');

  if (title) title.textContent = 'Add Employee';
  const saveBtn = document.querySelector('#saveEmployeeBtn');
  if (saveBtn) saveBtn.textContent = 'Save Employee';
  if (form) form.reset();

  clearValidationErrors();

  // Pre-fill today's date for convenience
  const joinDateInput = document.querySelector('#empJoinDate');
  if (joinDateInput) {
    joinDateInput.value = new Date().toISOString().split('T')[0];
  }

  if (modal) modal.classList.add('active');
}

function openEditModal(id) {
  const emp = employees.find((e) => e._id === id);
  if (!emp) return;

  editingId = id;
  const modal = document.querySelector('#employeeModal');
  const title = document.querySelector('#modalTitle');

  if (title) title.textContent = 'Edit Employee';
  const saveBtn = document.querySelector('#saveEmployeeBtn');
  if (saveBtn) saveBtn.textContent = 'Update Employee';

  clearValidationErrors();

  // Pre-fill modal form fields
  document.querySelector('#empName').value = emp.name || '';
  document.querySelector('#empDepartment').value = emp.department || '';
  document.querySelector('#empRole').value = emp.role || '';
  document.querySelector('#empSalary').value = emp.salary || '';
  document.querySelector('#empJoinDate').value = emp.joinDate || '';

  if (modal) modal.classList.add('active');
}

function closeModal() {
  const modal = document.querySelector('#employeeModal');
  if (modal) modal.classList.remove('active');
  clearValidationErrors();
  editingId = null;
}

// --------------------------------------------------------------------------
// 6. Form Validation & Save (POST or PUT API Call)
// --------------------------------------------------------------------------
function validateField(input, isValid) {
  if (isValid) {
    input.classList.remove('is-invalid');
    return true;
  } else {
    input.classList.add('is-invalid');
    return false;
  }
}

function clearValidationErrors() {
  document.querySelectorAll('#employeeForm .form-control').forEach((input) => {
    input.classList.remove('is-invalid');
  });
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.querySelector('#empName');
  const deptInput = document.querySelector('#empDepartment');
  const roleInput = document.querySelector('#empRole');
  const salaryInput = document.querySelector('#empSalary');
  const joinInput = document.querySelector('#empJoinDate');
  const saveBtn = document.querySelector('#saveEmployeeBtn');

  // Validations
  const isNameValid = validateField(nameInput, nameInput.value.trim().length > 0);
  const isDeptValid = validateField(deptInput, deptInput.value.trim().length > 0);
  const isRoleValid = validateField(roleInput, roleInput.value.trim().length > 0);
  const isSalaryValid = validateField(
    salaryInput,
    salaryInput.value.trim().length > 0 && !isNaN(salaryInput.value) && Number(salaryInput.value) > 0
  );
  const isJoinValid = validateField(
    joinInput,
    joinInput.value.trim().length > 0 && !isNaN(Date.parse(joinInput.value))
  );

  if (!isNameValid || !isDeptValid || !isRoleValid || !isSalaryValid || !isJoinValid) {
    const firstInvalid = document.querySelector('#employeeForm .is-invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    department: deptInput.value,
    role: roleInput.value.trim(),
    salary: Number(salaryInput.value),
    joinDate: joinInput.value.trim(),
  };

  // Disable button and show saving/updating feedback
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = editingId ? 'Updating...' : 'Saving...';
  }

  try {
    let url = API_URL;
    let method = 'POST';

    if (editingId) {
      url = `${API_URL}/${editingId}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to save employee record');
    }

    closeModal();
    showSuccessAlert(
      editingId ? 'Employee updated successfully!' : 'New employee added successfully!'
    );
    await loadEmployees();
  } catch (error) {
    showErrorAlert(error.message || 'Error occurred while saving employee record.');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = editingId ? 'Update Employee' : 'Save Employee';
    }
  }
}

// --------------------------------------------------------------------------
// 7. Delete Employee Operation (DELETE API Call)
// --------------------------------------------------------------------------
function openDeleteModal(id) {
  const emp = employees.find((e) => e._id === id);
  if (!emp) return;

  deletingId = id;
  const deleteModal = document.querySelector('#deleteModal');
  const deleteMessage = document.querySelector('#deleteMessage');

  if (deleteMessage) {
    deleteMessage.textContent = `Are you sure you want to delete ${emp.name} (${emp.role})?`;
  }

  if (deleteModal) deleteModal.classList.add('active');
}

function closeDeleteModal() {
  const deleteModal = document.querySelector('#deleteModal');
  if (deleteModal) deleteModal.classList.remove('active');
  deletingId = null;
}

async function handleConfirmDelete() {
  if (!deletingId) return;

  const confirmBtn = document.querySelector('#confirmDeleteBtn');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';
  }

  try {
    const response = await fetch(`${API_URL}/${deletingId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete employee record');
    }

    closeDeleteModal();
    showSuccessAlert('Employee record deleted successfully.');
    await loadEmployees();
  } catch (error) {
    showErrorAlert(error.message || 'Error deleting employee record.');
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Delete Employee';
    }
  }
}

// --------------------------------------------------------------------------
// 8. User Notification Alerts & Loading States
// --------------------------------------------------------------------------
function showSuccessAlert(msg) {
  const alert = document.querySelector('#successAlert');
  const text = document.querySelector('#successMessage');
  if (text) text.textContent = msg;
  if (alert) {
    alert.classList.add('show');
    setTimeout(() => {
      alert.classList.remove('show');
    }, 4500);
  }
}

function showErrorAlert(msg) {
  const alert = document.querySelector('#errorAlert');
  const text = document.querySelector('#errorMessage');
  if (text) text.textContent = msg;
  if (alert) {
    alert.classList.add('show');
  }
}

function setLoadingState(isLoading) {
  const loading = document.querySelector('#loadingState');
  if (loading) {
    loading.style.display = isLoading ? 'block' : 'none';
  }
}

// --------------------------------------------------------------------------
// 9. Utility: Escape HTML
// --------------------------------------------------------------------------
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
