// Add this JavaScript to handle the notification
function showTaskAddedNotification(message = 'Task added to board') {
    const notification = document.querySelector('.task-added-notification');
    const textElement = notification.querySelector('.notification-text');
    
    // Update the message if provided
    textElement.textContent = message;
    
    // Show the notification
    notification.classList.add('show');
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Example usage:
// Call this function when a task is added
// showTaskAddedNotification();
// Or with a custom message:
// showTaskAddedNotification('Added to backlog');
