function toggleOverlay() {
  let overlay = document.getElementById("overlayAddContact");
  overlay.classList.toggle("dNone");
  overlay.innerHTML = getOverlay();
}

function getOverlay() {
  return `
        <div class="overlay">
          <div class="overlay-left">
            <div class="logo1">
              <img
                class="logoInnerOverlay"
                src="./assets/icons/Logo-side-bar.png"
                alt=""
              />
            </div>
            <h1 class="f1">Add contact</h1>
            <p class="f4 font-weight: none;">Tasks are better with a team!</p>
            <hr />
          </div>
          <div class="overlay-right">
            <div onclick="toggleOverlay()" class="close-btn">×</div>
            <div class="form-container">
              <img class="avatar" src="./assets/icons/Group 13.svg" alt="" />
              <form>
                <div class="form-group">
                  <input
                    id="inputName"
                    type="text"
                    placeholder="Name"
                    required
                  />
                  <i class="icon-user"></i>
                </div>
                <div class="form-group">
                  <input
                    id="inputMail"
                    type="text"
                    placeholder="Email"
                    required
                  />
                  <i class="icon-email"></i>
                </div>
                <div class="form-group">
                  <input
                    id="inputCall"
                    type="text"
                    placeholder="Phone"
                    required
                  />
                  <i class="icon-phone"></i>
                </div>
                <div class="button-group">
                  <button
                    onclick="toggleOverlay()"
                    type="button"
                    class="cancel-btn"
                  >
                    Cancel<img src="./assets/icons/cancel.svg" />
                  </button>
                  <button id="addContactButton" onclick="addContact()" type="button" class="create-btn">
                    Create contact <img src="./assets/icons/check.svg" alt="" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
const firebaseConfig = {
  databaseURL:
    "https://joinusercontacts-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

import {
  getDatabase,
  ref,
  get,
  child,
  set,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

window.addContact = async function () {
  console.log("Funktion wurde aufgerufen");
  const database = getDatabase();
  const dbRef = ref(database);
  const name = document.getElementById("inputName").value;
  const mail = document.getElementById("inputMail").value;
  const call = document.getElementById("inputCall").value;

  try {
    const snapshot = await get(child(dbRef, "contacts"));
    const contacts = snapshot.val();
    const contactCount = contacts ? Object.keys(contacts).length : 0;
    const newContactKey = `contact${contactCount + 1}`;
    await set(ref(database, `contacts/${newContactKey}`), {
      name: name,
      email: mail,
      phone: call,
    });

    console.log(`Kontakt ${newContactKey} erfolgreich hinzugefügt.`);
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
  }
};

async function addContact() {
  console.log("Funktion wurde aufgerufen");
  const database = getDatabase();
  const dbRef = ref(database);
  const name = document.getElementById("inputName").value;
  const mail = document.getElementById("inputMail").value;
  const call = document.getElementById("inputCall").value;

  try {
    const snapshot = await get(child(dbRef, "contacts"));
    const contacts = snapshot.val();
    const contactCount = contacts ? Object.keys(contacts).length : 0;
    const newContactKey = `contact${contactCount + 1}`;
    await set(ref(database, `contacts/${newContactKey}`), {
      name: name,
      email: mail,
      phone: call,
    });

    console.log(`Kontakt ${newContactKey} erfolgreich hinzugefügt.`);
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
  }
}

function fetchContacts() {
  const contactsRef = ref(database, "contacts");
  onValue(
    contactsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Kontakte:", data);
      } else {
        console.log("Keine Kontakte gefunden.");
      }
    },
    (error) => {
      console.error("Fehler beim Abrufen der Kontakte: ", error);
    }
  );
}

// Kontakte abrufen
fetchContacts();

function updateContact(contactId, updatedData) {
  const contactRef = ref(database, `contacts/${contactId}`); // Referenz auf den spezifischen Kontakt
  set(contactRef, updatedData)
    .then(() => {
      console.log("Kontakt erfolgreich aktualisiert!");
    })
    .catch((error) => {
      console.error("Fehler beim Aktualisieren des Kontakts: ", error);
    });
}

function deleteContact(contactId) {
  const contactRef = ref(database, `contacts/${contactId}`);
  set(contactRef, null)
    .then(() => {
      console.log("Kontakt erfolgreich gelöscht!");
    })
    .catch((error) => {
      console.error("Fehler beim Löschen des Kontakts: ", error);
    });
}
