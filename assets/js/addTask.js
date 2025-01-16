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
});

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Check if field is empty
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

// Add validation for specific field types
function validateDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}
