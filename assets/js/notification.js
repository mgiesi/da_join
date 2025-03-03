/**
 * Shows a notification that a task has been added to the board
 * @param {string} message - Optional custom message to display (defaults to "Task added to board")
 */
function showTaskAddedNotification(message = "Task added to board") {
    const notification = document.getElementById('taskAddedNotification');

    if (notification) {
        // Find the span element within the notification
        const textElement = notification.querySelector('span');

        // Only set textContent if the element exists
        if (textElement) {
            textElement.textContent = message;
        }

        // Show the notification
        notification.classList.add('show');

        // Hide the notification and redirect after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            // Redirect to board.html after notification is hidden
            window.location.href = 'board.html';
        }, 3000);
    } else {
        console.warn('Notification element not found in the DOM');
        // Redirect anyway if notification element doesn't exist
        setTimeout(() => {
            window.location.href = 'board.html';
        }, 1000);
    }
}

/**
 * Shows a custom notification with the provided message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    showTaskAddedNotification(message);
}
