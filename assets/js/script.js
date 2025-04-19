const DB_BASE_URL =
  "https://join-heuft-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the join webpage by including external HTML content, setting up menu interactions,
 * and initializing user-related elements.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
  await includeHTML();
  setTimeout(() => {
    setActiveMenuItem();
    addMenuClickListeners();
  }, 100);
  addSubmenuClickListeners();
  initUser();
}

/**
 * Includes external HTML files into the current document.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when all external HTML content has been included.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const { filePath, fragmentSelector } = parseIncludeAttribute(element);
    await processIncludeElement(element, filePath, fragmentSelector);
    element.removeAttribute("w3-include-html");
  }
}

/**
 * Parses the w3-include-html attribute to extract file path and fragment selector.
 *
 * @param {Element} element - The element with the w3-include-html attribute.
 * @returns {Object} An object containing filePath and fragmentSelector.
 */
function parseIncludeAttribute(element) {
  let fileAttr = element.getAttribute("w3-include-html");
  let filePath = fileAttr;
  let fragmentSelector = null;

  if (fileAttr.indexOf("#") !== -1) {
    let parts = fileAttr.split("#");
    filePath = parts[0];
    let fragment = parts[1];
    if (fragment) {
      fragmentSelector = "#" + fragment;
    }
  }
  return { filePath, fragmentSelector };
}

/**
 * Processes an include element by fetching and inserting HTML content.
 *
 * @async
 * @param {Element} element - The element to process.
 * @param {string} filePath - The path to the HTML file.
 * @param {string|null} fragmentSelector - Optional CSS selector for a fragment.
 */
async function processIncludeElement(element, filePath, fragmentSelector) {
  try {
    let resp = await fetch(filePath);
    if (resp.ok) {
      let htmlText = await resp.text();
      insertHtmlContent(element, htmlText, fragmentSelector);
    } else {
      element.innerHTML = "Page not found";
    }
  } catch (error) {
    element.innerHTML = "Error: " + error;
  }
}

/**
 * Inserts HTML content into an element, optionally selecting a fragment.
 *
 * @param {Element} element - The element to insert content into.
 * @param {string} htmlText - The HTML content.
 * @param {string|null} fragmentSelector - Optional CSS selector for a fragment.
 */
function insertHtmlContent(element, htmlText, fragmentSelector) {
  if (fragmentSelector) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlText, "text/html");
    let frag = doc.querySelector(fragmentSelector);
    element.innerHTML = frag ? frag.innerHTML : "Can't find fragment";
  } else {
    element.innerHTML = htmlText;
  }
}

/**
 * Initializes user-related elements on the page.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when user initialization is complete.
 */
async function initUser() {
  await checkUser();
  await renderUserDetails();
}

/**
 * Display the user informations on the header field.
 */
async function renderUserDetails() {
  const userName = await getActiveUserName();
  const textRef = document.getElementById("user-profile-name");
  const iconRef = document.getElementById("header-icons");
  const menuItemsRef = document.getElementById("menu-items");
  const backRef = document.getElementById("back_not_loggedin");
  const footerLinksRef = document.getElementById("footer_links");
  const hideElements = !userName;
  iconRef?.classList.toggle("dNone", hideElements);
  menuItemsRef?.classList.toggle("dNone", hideElements);
  backRef?.classList.toggle("dNone", Boolean(userName));
  footerLinksRef?.classList.toggle("logged_in", Boolean(userName));
  if (userName) {
    textRef.innerHTML = getInitials(userName);
  }
}

/**
 * Checks if a user is logged in. Otherwise we jump back to
 * the start page.
 * This is required for all pages except legal notice and privacy policy.
 */
async function checkUser() {
  const userName = await getActiveUserName();
  if (!userName) {
    if (
      window.location.pathname.endsWith("legal_notice.html") == false &&
      window.location.pathname.endsWith("privacy_policy.html") == false
    ) {
      goToStart();
    }
  }
}

/**
 * Logs out the current user and navigates to the start page.
 */
function goToStart() {
  logoutUser();
  window.location.href = "index.html";
}

/**
 * Logs out the current user by removing user-related information from local storage.
 */
function logoutUser() {
  localStorage.removeItem("activeUser");
  localStorage.removeItem("greetingShown");
}

/**
 * Retrieves the active user's name from local storage.
 *
 * @async
 * @returns {Promise<string|null>} A promise that resolves to the active
 * user's name or null if no active user exists.
 */
async function getActiveUserName() {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    return null;
  }
  if (activeUser === "Guest") {
    return "Guest";
  }
  const user = await getUser(activeUser);
  if (!user) {
    return null;
  }
  return user.name;
}

/**
 * Sets the active menu item based on the current page URL.
 */
function setActiveMenuItem() {
  const menuButtons = document.querySelectorAll(".menu-button");
  const currentPage = window.location.pathname.split("/").pop();

  resetActiveMenuItems(menuButtons);
  setActiveMenuItemByCurrentPage(menuButtons, currentPage);

  if (!currentPage) {
    setActiveMenuItemFromStorage(menuButtons);
  }
}

/**
 * Removes the "active" class from all menu buttons.
 *
 * @param {NodeList} menuButtons - The collection of menu buttons.
 */
function resetActiveMenuItems(menuButtons) {
  menuButtons.forEach((button) => button.classList.remove("active"));
}

/**
 * Sets the active menu item based on the current page.
 *
 * @param {NodeList} menuButtons - The collection of menu buttons.
 * @param {string} currentPage - The current page filename.
 */
function setActiveMenuItemByCurrentPage(menuButtons, currentPage) {
  menuButtons.forEach((button) => {
    const href = button.getAttribute("href");
    const hrefPage = href.split("/").pop();
    if (currentPage === hrefPage) {
      button.classList.add("active");
      localStorage.setItem("activeMenuItem", href);
    }
  });
}

/**
 * Sets the active menu item from localStorage if no current page matches.
 *
 * @param {NodeList} menuButtons - The collection of menu buttons.
 */
function setActiveMenuItemFromStorage(menuButtons) {
  const activeMenuItem = localStorage.getItem("activeMenuItem");
  if (activeMenuItem) {
    menuButtons.forEach((button) => {
      if (button.getAttribute("href") === activeMenuItem) {
        button.classList.add("active");
      }
    });
  }
}

/**
 * Adds click event listeners to menu buttons.
 */
function addMenuClickListeners() {
  const menuButtons = document.querySelectorAll(".menu-button");
  menuButtons.forEach((button) => {
    button.addEventListener("click", function () {
      resetActiveMenuItems(menuButtons);
      this.classList.add("active");
      localStorage.setItem("activeMenuItem", this.getAttribute("href"));
    });
  });
}

/**
 * Adds a click event listener to the header submenu element.
 */
function addSubmenuClickListeners() {
  document
    .getElementById("header-submenu")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        hideSubmenu();
      }
    });
}

/**
 * Validates a form field by checking if the input element has a non-empty value.
 *
 * @param {HTMLElement} inputElement - The input element to validate.
 * @returns {boolean} Returns true if the input has a non-empty value; otherwise, returns false.
 */
function validateFormField(inputElement) {
  const formGroup = inputElement.closest(".form-group");
  const isValid = !!inputElement.value.trim();
  formGroup.classList.toggle("error", !isValid);
  return isValid;
}

/**
 * Displays the header submenu by removing the "dNone" class.
 */
function showSubmenu() {
  const overlay = document.getElementById("header-submenu");
  overlay.classList.remove("dNone");
  openModal();
}

/**
 * Hides the header submenu by adding the "dNone" class.
 */
function hideSubmenu() {
  const overlay = document.getElementById("header-submenu");
  overlay.classList.add("dNone");
  closeModal();
}

/**
 * Generates a shortcut name from any string (surename [space] lastname).
 *
 * @function getInitials
 * @param {string} name - The name as string.
 * @returns {string} A string representing the initials of the contact's name.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
}

/**
 * Function to enable the background for a modal overlay.
 */
function openModal() {
  document.body.classList.add("modal-open");
}

/**
 * Function to disable the background for a modal overlay.
 */
function closeModal() {
  document.body.classList.remove("modal-open");
}
