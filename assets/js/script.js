/**
 * Initializes the join webpage by including external HTML content, setting up menu interactions,
 * and initializing user-related elements.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
  await includeHTML();
  // Add a small delay to ensure DOM is updated
  setTimeout(() => {
    setActiveMenuItem();
    addMenuClickListeners();
  }, 100);
  addSubmenuClickListeners();
  initUser();
}

/**
 * Includes external HTML files into the current document.
 * Searches for elements with the attribute "w3-include-html", fetches the corresponding file
 * and replaces the element's inner HTML with the fetched content.
 * If the fetch fails, displays "Page not found".
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when all external HTML content has been included.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");

  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let fileAttr = element.getAttribute("w3-include-html");
    let filePath = fileAttr;
    let fragmentSelector = null;

    // Prüfen, ob ein Fragment angegeben wurde (z.B. side-menu.html#myelement)
    if (fileAttr.indexOf("#") !== -1) {
      let parts = fileAttr.split("#");
      filePath = parts[0];
      let fragment = parts[1];
      if (fragment) {
        fragmentSelector = "#" + fragment; // Sicherstellen, dass es ein gültiger CSS-Selektor ist
      }
    }

    try {
      let resp = await fetch(filePath);

      if (resp.ok) {
        let htmlText = await resp.text();

        if (fragmentSelector) {
          // HTML in ein Dokument parsen, um gezielt das Fragment auszuwählen
          let parser = new DOMParser();
          let doc = parser.parseFromString(htmlText, "text/html");
          let frag = doc.querySelector(fragmentSelector);

          if (frag) {
            element.innerHTML = frag.innerHTML;
          } else {
            element.innerHTML = "Can't find fragment";
          }
        } else {
          // Gesamten HTML-Content einfügen
          element.innerHTML = htmlText;
        }
      } else {
        element.innerHTML = "Page not found";
      }
    } catch (error) {
      element.innerHTML = "Error: " + error;
    }

    // Entferne das Attribut, nachdem der Inhalt ersetzt wurde
    element.removeAttribute("w3-include-html");
  }
}

/**
 * Initializes user-related elements on the page.
 * Retrieves the active user's name and updates the UI elements
 * accordingly by showing or hiding certain elements.
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
  const hideElements = !userName;
  iconRef?.classList.toggle("dNone", hideElements);
  menuItemsRef?.classList.toggle("dNone", hideElements);
  backRef?.classList.toggle("dNone", Boolean(userName));
  if (userName) {
    textRef.innerHTML = getInitials(userName);
  }
}

/**
 * Checks if a user is logged in. Otherwise we jump back to
 * the start page.
 */
async function checkUser() {
  const userName = await getActiveUserName();
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
 * If the active user is "Guest", returns "Guest".
 * Otherwise, fetches the user object and returns its name.
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
 * Removes the "active" class from all menu buttons and adds it to the
 * button whose href matches the current page.
 * Also stores the active menu item's href in local storage.
 */
function setActiveMenuItem() {
  const menuButtons = document.querySelectorAll(".menu-button");
  const currentPage = window.location.pathname.split("/").pop();
  menuButtons.forEach((button) => {
    button.classList.remove("active");
  });
  // Add active class to the button that matches current page
  menuButtons.forEach((button) => {
    const href = button.getAttribute("href");
    // Extract just the filename from the href
    const hrefPage = href.split("/").pop();
    if (currentPage === hrefPage) {
      button.classList.add("active");
      localStorage.setItem("activeMenuItem", href);
    }
  });

  // If no page matches (like on first load), check localStorage
  if (!currentPage) {
    const activeMenuItem = localStorage.getItem("activeMenuItem");
    if (activeMenuItem) {
      menuButtons.forEach((button) => {
        if (button.getAttribute("href") === activeMenuItem) {
          button.classList.add("active");
        }
      });
    }
  }
}

/**
 * Adds click event listeners to menu buttons.
 * When a menu button is clicked, updates the active class and
 * stores the active menu item's href in local storage.
 */
function addMenuClickListeners() {
  const menuButtons = document.querySelectorAll(".menu-button");

  menuButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Remove active class from all buttons
      menuButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Store the active menu item's href in localStorage
      localStorage.setItem("activeMenuItem", this.getAttribute("href"));
    });
  });
}

/**
 * Adds a click event listener to the header submenu element.
 * Hides the submenu when the user clicks directly on the submenu overlay.
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
 * Adds or removes an "error" class on the parent form group accordingly.
 *
 * @param {HTMLElement} inputElement - The input element to validate.
 * @returns {boolean} Returns true if the input has a non-empty value; otherwise, returns false.
 */
function validateFormField(inputElement) {
  const formGroup = inputElement.closest(".form-group");

  if (!inputElement.value.trim()) {
    formGroup.classList.add("error");
    return false;
  } else {
    formGroup.classList.remove("error");
    return true;
  }
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
 * This function takes a name as a string and returns a string composed of the uppercase initials
 * of each word in the contact's name.
 *
 * @function getInitials
 * @param {string} name - The name as string.
 * @returns {string} A string representing the initials of the contact's name, or an empty string if the contact is null.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
}

function openModal() {
  document.body.classList.add("modal-open");
}

function closeModal() {
  document.body.classList.remove("modal-open");
}
