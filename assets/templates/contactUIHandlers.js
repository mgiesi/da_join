/**
 * Marks a contact as active when clicked
 */
function setupContactClickHandler() {
    document.body.onclick = function (event) {
        let contact = event.target.closest(".contact");
        if (!contact) return;
        document.querySelectorAll(".contact.active").forEach((c) => c.classList.remove("active"));
        contact.classList.add("active");
    };
}

/**
 * Sets up responsive behavior for contact info panel
 */
function setupContactInfoResponsive() {
    const contactInfo = document.querySelector(".contact-info");
    checkScreenSize(contactInfo);
    window.onresize = () => checkScreenSize(contactInfo);
}

/**
 * Adjusts contact info visibility based on screen size
 * @param {HTMLElement} contactInfo - The contact info container
 */
function checkScreenSize(contactInfo) {
    if (window.innerWidth <= 1530) {
        setupMobileContactView(contactInfo);
    } else {
        setupDesktopContactView(contactInfo);
    }
}

/**
 * Sets up mobile view for contacts
 * @param {HTMLElement} contactInfo - The contact info container
 */
function setupMobileContactView(contactInfo) {
    document.body.onclick = (event) => handleContactClick(event, contactInfo);
}

/**
 * Sets up desktop view for contacts
 * @param {HTMLElement} contactInfo - The contact info container
 */
function setupDesktopContactView(contactInfo) {
    document.body.onclick = null;
    contactInfo.style.visibility = "visible";
    contactInfo.style.opacity = "1";
}

/**
 * Handles click on contact elements
 * @param {Event} event - Click event
 * @param {HTMLElement} contactInfo - The contact info container
 */
function handleContactClick(event, contactInfo) {
    let contact = event.target.closest(".contact");
    if (contact) {
        showContactInfo(contact, contactInfo);
    } else {
        hideContactInfo(contactInfo);
    }
}

/**
 * Shows contact info and marks contact as active
 * @param {HTMLElement} contact - The contact element
 * @param {HTMLElement} contactInfo - The contact info container
 */
function showContactInfo(contact, contactInfo) {
    document.querySelectorAll(".contact.active").forEach((c) => c.classList.remove("active"));
    contact.classList.add("active");
    contactInfo.style.visibility = "visible";
    contactInfo.style.opacity = "1";
}

/**
 * Hides the contact info panel
 * @param {HTMLElement} contactInfo - The contact info container
 */
function hideContactInfo(contactInfo) {
    contactInfo.style.visibility = "hidden";
    contactInfo.style.opacity = "0";
}

/**
 * Scrolls the page to the top with a smooth animation
 */
function scrollToTop() {
    if (window.innerWidth < 1200) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}
