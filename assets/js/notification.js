/**
 * Updates the text content of the notification
 * @param {HTMLElement} notification - The notification element
 * @param {string} message - The message to display
 */
function updateNotificationText(notification, message) {
    const textElement = notification.querySelector('span');
    if (textElement) {
        textElement.textContent = message;
    }
}

/**
 * Shows the notification element
 * @param {HTMLElement} notification - The notification element
 */
function displayNotification(notification) {
    notification.classList.add('show');
}

/**
 * Hides notification and redirects to board
 * @param {HTMLElement} notification - The notification element
 * @param {number} delay - Delay in milliseconds before redirect
 */
function hideAndRedirect(notification, delay) {
    setTimeout(() => {
        if (notification) notification.classList.remove('show');
        window.location.href = 'board.html';
    }, delay);
}

/**
 * Shows a notification that a task has been added to the board
 * @param {string} message - Optional custom message to display (defaults to "Task added to board")
 */
function showTaskAddedNotification(message = "Task added to board") {
    const notification = document.getElementById('taskAddedNotification');
    if (notification) {
        updateNotificationText(notification, message);
        displayNotification(notification);
        hideAndRedirect(notification, 3000);
    } else {
        console.warn('Notification element not found in the DOM');
        hideAndRedirect(null, 1000);
    }
}

/**
 * Shows a custom notification with the provided message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    showTaskAddedNotification(message);
}
