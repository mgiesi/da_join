document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-task-form');
    const requiredFields = form.querySelectorAll('[required]');

    // Initialize validation state for all required fields
    requiredFields.forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Proceed with form submission
            console.log('Form is valid, submitting...');
            // Add your form submission logic here
        }
    });

    // Add click handlers for all input fields
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('click', handleInputClick);
    });

    function handleInputClick(event) {
        // Remove active class from all inputs
        allInputs.forEach(input => input.classList.remove('active'));
        // Add active class to clicked input
        event.target.classList.add('active');
    }

    // Subtask specific handling
    const subtaskInput = document.getElementById('subtaskInput');
    const plusIcon = document.querySelector('.plus-icon');
    const editActions = document.querySelector('.edit-actions');

    subtaskInput.addEventListener('click', handleSubtaskInputClick);

    function handleSubtaskInputClick(event) {
        event.stopPropagation(); // Prevent event bubbling

        // Add active class to input
        subtaskInput.classList.add('active');

        // Show edit actions and hide plus icon
        plusIcon.classList.add('hidden');
        editActions.classList.add('active');

        const cancelBtn = document.querySelector('.cancel-btn');
        const confirmBtn = document.querySelector('.confirm-btn');

        cancelBtn.onclick = handleCancel;
        confirmBtn.onclick = handleConfirm;

        // Add click outside listener
        document.addEventListener('click', handleClickOutside);
    }

    function handleCancel() {
        resetSubtaskInput();
    }

    function handleConfirm() {
        const text = subtaskInput.value.trim();
        if (text) {
            addSubtask(text);
            resetSubtaskInput();
        }
    }

    function addSubtask(text) {
        const subtasksList = document.querySelector('.subtasks-list');
        const subtaskItem = document.createElement('div');
        subtaskItem.classList.add('subtask-item');
        subtaskItem.textContent = text;
        subtasksList.appendChild(subtaskItem);
    }

    function resetSubtaskInput() {
        subtaskInput.value = '';
        subtaskInput.classList.remove('active');
        plusIcon.classList.remove('hidden');
        editActions.classList.remove('active');
    }

    function handleClickOutside(event) {
        const inputWrapper = document.querySelector('.input-wrapper');
        if (!inputWrapper.contains(event.target)) {
            resetSubtaskInput();
            document.removeEventListener('click', handleClickOutside);
        }
    }

    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');

        if (!field.value.trim()) {
            formGroup.classList.add('error');
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
            return false;
        } else {
            formGroup.classList.remove('error');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
            return true;
        }
    }

    function validateDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // Initialize calendar
    const dateInput = document.getElementById('dueDate');
    const calendar = new Calendar(dateInput);

    // Add click handler for calendar icon
    const calendarIcon = document.querySelector('.calendar-icon');
    calendarIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        calendar.toggle();
    });

    // Make calendar icon clickable and add proper styling
    calendarIcon.style.cursor = 'pointer';
    calendarIcon.style.pointerEvents = 'auto';

    // Date input handling
    dateInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        // Format with slashes
        if (value.length >= 4) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
        } else if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }

        e.target.value = value;
    });

    dateInput.addEventListener('keydown', function (e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        // Ensure that it is a number and stop the keypress if not
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    dateInput.addEventListener('blur', function (e) {
        const value = e.target.value;
        if (value) {
            const parts = value.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);

                const date = new Date(year, month - 1, day);
                const isValid = date.getDate() === day &&
                    date.getMonth() === month - 1 &&
                    date.getFullYear() === year &&
                    year >= new Date().getFullYear();

                if (!isValid) {
                    e.target.value = '';
                    alert('Please enter a valid future date in dd/mm/yyyy format');
                }
            } else {
                e.target.value = '';
                alert('Please enter the date in dd/mm/yyyy format');
            }
        }
    });
});
