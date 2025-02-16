async function init() {
  await includeHTML();
  setActiveMenuItem();
  addMenuClickListeners();
  addSubmenuClickListeners();
  initUser();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");

  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);

    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

async function initUser() {
  const userName = await getActiveUserName();
  const textRef = document.getElementById("user-profile-name");
  const iconRef = document.getElementById("header-icons");
  const menuItemsRef = document.getElementById("menu-items");
  const backRef = document.getElementById("back_not_loggedin");
  if (!userName) {
    iconRef.classList.add("dNone");
    menuItemsRef.classList.add("dNone");
    backRef.classList.remove("dNone");
  } else {
    iconRef.classList.remove("dNone");
    menuItemsRef.classList.remove("dNone");
    textRef.innerHTML = getInitials(userName);
    backRef.classList.add("dNone");
  }
}

function goToStart() {
  logoutUser();
  window.location.href = "index.html";
}

function logoutUser() {
  localStorage.removeItem("activeUser");
}

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

function setActiveMenuItem() {
  // Get all menu buttons
  const menuButtons = document.querySelectorAll(".menu-button");

  // Get the current page filename
  const currentPage = window.location.pathname.split("/").pop();

  // Remove active class from all buttons first
  menuButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Add active class to the button that matches current page
  menuButtons.forEach((button) => {
    const href = button.getAttribute("href");
    if (href.includes(currentPage)) {
      button.classList.add("active");
      // Store the active menu item
      localStorage.setItem("activeMenuItem", href);
    }
  });

  // If no page matches (like on first load), check localStorage
  const activeMenuItem = localStorage.getItem("activeMenuItem");
  if (!currentPage && activeMenuItem) {
    menuButtons.forEach((button) => {
      if (button.getAttribute("href") === activeMenuItem) {
        button.classList.add("active");
      }
    });
  }
}

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

function addSubmenuClickListeners() {
  document.getElementById('header-submenu').addEventListener('click', function(e) {
    if (e.target === this) {
      hideSubmenu();
    }
  });
}

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

function showSubmenu() {
  const overlay = document.getElementById("header-submenu");
  overlay.classList.remove("dNone");
}

function hideSubmenu() {
  const overlay = document.getElementById("header-submenu");
  overlay.classList.add("dNone");
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