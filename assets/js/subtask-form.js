class SubtaskForm {
    constructor() {
        this.subtasks = [];
        this.editingIndex = null;

        // DOM Elements
        this.form = document.querySelector('.subtask-form');
        this.input = document.getElementById('subtaskInput');
        this.inputContainer = document.querySelector('.input-container');
        this.defaultActions = document.querySelector('.default-actions');
        this.editActions = document.querySelector('.edit-actions');
        this.subtasksList = document.getElementById('subtasksList');

        // Ensure initial state is correct
        this.editActions.classList.add('hidden');
        this.defaultActions.classList.remove('hidden');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Input focus event
        this.input.addEventListener('focus', () => {
            this.showEditActions();
        });

        // Input blur event
        this.input.addEventListener('blur', (e) => {
            // Don't hide actions if clicking on the action buttons
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || !this.inputContainer.contains(relatedTarget)) {
                if (!this.input.value.trim()) {
                    this.showDefaultActions();
                }
            }
        });

        // Button click events
        this.defaultActions.querySelector('button').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.editActions.querySelector('button:first-child').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCancel();
        });

        this.editActions.querySelector('button:last-child').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Enter key submission
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
            }
        });
    }

    showEditActions() {
        this.defaultActions.classList.add('hidden');
        this.editActions.classList.remove('hidden');
        this.inputContainer.classList.add('active');
    }

    showDefaultActions() {
        this.defaultActions.classList.remove('hidden');
        this.editActions.classList.add('hidden');
        this.inputContainer.classList.remove('active');
    }

    handleSubmit() {
        const value = this.input.value.trim();
        if (value) {
            if (this.editingIndex !== null) {
                this.subtasks[this.editingIndex] = value;
                this.editingIndex = null;
            } else {
                this.subtasks.push(value);
            }
            this.input.value = '';
            this.showDefaultActions();
            this.renderSubtasks();
        }
    }

    handleCancel() {
        this.input.value = '';
        this.showDefaultActions();
        if (this.editingIndex !== null) {
            this.editingIndex = null;
            this.renderSubtasks();
        }
    }

    startEditing(index) {
        this.editingIndex = index;
        this.input.value = this.subtasks[index];
        this.showEditActions();
        this.input.focus();
    }

    createSubtaskElement(subtask, index) {
        const li = document.createElement('li');
        li.className = 'subtask-item';

        const content = document.createElement('div');
        content.className = 'subtask-content';

        content.innerHTML = `
            <span class="subtask-text">${subtask}</span>
            <div class="subtask-actions">
                <button class="icon-button" aria-label="Edit subtask">
                    <img src="./assets/icons/subTsk_check.svg" alt="">
                </button>
                <div class="divider"></div>
                <button class="icon-button" aria-label="Delete subtask">
                    <img src="./assets/icons/subTsk_cancel.svg" alt="">
                </button>
            </div>
        `;

        // Add event listeners
        content.addEventListener('dblclick', () => this.startEditing(index));
        content.querySelector('button:first-child').addEventListener('click', () => this.startEditing(index));
        content.querySelector('button:last-child').addEventListener('click', () => this.handleDelete(index));

        li.appendChild(content);
        return li;
    }

    renderSubtasks() {
        this.subtasksList.innerHTML = '';
        this.subtasks.forEach((subtask, index) => {
            const subtaskElement = this.createSubtaskElement(subtask, index);
            this.subtasksList.appendChild(subtaskElement);
        });
    }
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SubtaskForm();
});
