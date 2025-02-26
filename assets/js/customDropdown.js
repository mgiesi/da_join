/**
 * Initializes custom dropdowns throughout the application
 */
function initCustomDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    dropdowns.forEach(dropdown => {
        setupCustomDropdown(dropdown);
    });
}

/**
 * Sets up a single custom dropdown
 * @param {HTMLElement} dropdown - The dropdown container element
 */
function setupCustomDropdown(dropdown) {
    const selected = dropdown.querySelector('.custom-dropdown-selected');
    const options = dropdown.querySelector('.custom-dropdown-options');
    const optionItems = dropdown.querySelectorAll('.custom-dropdown-option:not(.custom-dropdown-header)');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');

    // Toggle dropdown on click
    selected.addEventListener('click', () => {
        dropdown.classList.toggle('open');
    });

    // Handle option selection
    optionItems.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            const text = option.textContent.trim();

            // Update the selected text and hidden input value
            selected.textContent = text;
            selected.setAttribute('data-value', value);

            if (hiddenInput) {
                hiddenInput.value = value;
                // Trigger validation if needed
                const event = new Event('input', { bubbles: true });
                hiddenInput.dispatchEvent(event);
            }

            dropdown.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}
