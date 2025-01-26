class Calendar {
    constructor(inputElement) {
        this.input = inputElement;
        this.date = new Date();
        this.selectedDate = null;
        this.calendarContainer = null;
        this.isVisible = false;

        this.createCalendar();
        this.addEventListeners();
    }

    createCalendar() {
        this.calendarContainer = document.createElement('div');
        this.calendarContainer.className = 'calendar-container';
        this.calendarContainer.setAttribute('role', 'dialog');
        this.calendarContainer.setAttribute('aria-label', 'Choose date');
        this.renderCalendar();

        // Insert after the date input wrapper
        this.input.closest('.date-input-wrapper').appendChild(this.calendarContainer);
        this.hide(); // Initially hidden
    }

    renderCalendar() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        this.calendarContainer.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav" onclick="this.previousMonth()">
                    <img src="./assets/icons/arrow_drop_down.svg" alt="Previous month" style="transform: rotate(90deg)">
                </button>
                <span>${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}</span>
                <button class="calendar-nav" onclick="this.nextMonth()">
                    <img src="./assets/icons/arrow_drop_down.svg" alt="Next month" style="transform: rotate(270deg)">
                </button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-days">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                .map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
                </div>
                <div class="calendar-dates">
                    ${this.generateDates(firstDay, lastDay)}
                </div>
            </div>
        `;
    }

    generateDates(firstDay, lastDay) {
        const dates = [];
        const today = new Date();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            dates.push('<div class="calendar-date empty"></div>');
        }

        // Add the days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const currentDate = new Date(this.date.getFullYear(), this.date.getMonth(), i);
            const isSelected = this.selectedDate && this.isSameDay(currentDate, this.selectedDate);
            const isToday = this.isSameDay(currentDate, today);

            dates.push(`
                <div class="calendar-date ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}"
                     role="button"
                     tabindex="0"
                     data-date="${currentDate.toISOString()}"
                     onclick="this.selectDate('${currentDate.toISOString()}')">
                    ${i}
                </div>
            `);
        }

        return dates.join('');
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }

    selectDate(dateString) {
        const date = new Date(dateString);
        this.selectedDate = date;
        this.input.value = this.formatDate(date);
        this.hide();

        // Trigger input event to validate the field
        const event = new Event('input', { bubbles: true });
        this.input.dispatchEvent(event);
    }

    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    previousMonth() {
        this.date.setMonth(this.date.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.date.setMonth(this.date.getMonth() + 1);
        this.renderCalendar();
    }

    show() {
        this.calendarContainer.style.display = 'block';
        this.isVisible = true;
    }

    hide() {
        this.calendarContainer.style.display = 'none';
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    addEventListeners() {
        // Close calendar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isVisible &&
                !this.calendarContainer.contains(e.target) &&
                !this.input.contains(e.target) &&
                !e.target.closest('.calendar-icon')) {
                this.hide();
            }
        });

        // Keyboard navigation
        this.calendarContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }
}
