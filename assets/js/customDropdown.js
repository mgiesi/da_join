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
    const optionItems = dropdown.querySelectorAll('.custom-dropdown-option:not(.custom-dropdown-header)');

    handleSelectedClick(dropdown, selected);
    setupOptionItems(dropdown, selected, optionItems);
    setupOutsideClickHandler(dropdown);
}

/**
 * Handles click on the selected dropdown element
 */
function handleSelectedClick(dropdown, selected) {
    selected.onclick = () => {
        dropdown.classList.toggle('open');
    };
}

/**
 * Sets up click handlers for dropdown options
 */
function setupOptionItems(dropdown, selected, optionItems) {
    optionItems.forEach(option => {
        option.onclick = () => {
            updateDropdownValue(dropdown, selected, option);
        };
    });
}

/**
 * Updates dropdown value when option is selected
 */
function updateDropdownValue(dropdown, selected, option) {
    const value = option.getAttribute('data-value');
    const text = option.textContent.trim();

    selected.textContent = text;
    selected.setAttribute('data-value', value);

    updateHiddenInput(dropdown, value);
    dropdown.classList.remove('open');
}

/**
 * Updates hidden input field if it exists
 */
function updateHiddenInput(dropdown, value) {
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    if (hiddenInput) {
        hiddenInput.value = value;
        const event = new Event('input', { bubbles: true });
        hiddenInput.dispatchEvent(event);
    }
}

/**
 * Sets up handler to close dropdown when clicking outside
 */
function setupOutsideClickHandler(dropdown) {
    document.onclick = (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    };
}