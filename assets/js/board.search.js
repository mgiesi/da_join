let filterText;


/**
 * Initializes the search filter by adding input event listeners to the filter text elements.
 */
function initSearchFilter() {
    const filterInputRef = document.getElementById("board-filter-text");
    filterInputRef.addEventListener("input", updateFilterIcon);
    const filterInput2Ref = document.getElementById("board-filter-text2");
    filterInput2Ref.addEventListener("input", updateFilterIcon);
  }
  
  /**
   * Updates the filter icons for both filter input fields based on whether they contain a value.
   */
  function updateFilterIcon() {
    const filterInputRef = document.getElementById("board-filter-text");
    const filterInputIconRef = document.getElementById("board-filter-text-icon");
    const filterInput2Ref = document.getElementById("board-filter-text2");
    const filterInputIcon2Ref = document.getElementById(
      "board-filter-text-icon2"
    );
    filterInputIconRef.src = filterInputRef.value
      ? "./assets/icons/cancel.svg"
      : "./assets/icons/search.svg";
    filterInputIcon2Ref.src = filterInput2Ref.value
      ? "./assets/icons/cancel.svg"
      : "./assets/icons/search.svg";
  }
  
  /**
   * Updates the board filter based on user input.
   * Synchronizes the filter text between two input fields, updates the filter icon, and re-renders tasks.
   *
   * @param {Event} event - The input event triggered by the filter text change.
   */
  function updateFilter(event) {
    const filterInputRef = document.getElementById("board-filter-text");
    const filterInput2Ref = document.getElementById("board-filter-text2");
    filterText = event.target.value;
    filterInputRef.value = filterText;
    filterInput2Ref.value = filterText;
    updateFilterIcon();
    renderTasks();
  }
  
  /**
   * Resets the board filter by clearing both filter input fields, updating the filter icon, and re-rendering tasks.
   */
  function resetFilter() {
    const filterInputRef = document.getElementById("board-filter-text");
    const filterInput2Ref = document.getElementById("board-filter-text2");
    filterInputRef.value = "";
    filterInput2Ref.value = "";
    filterText = "";
    updateFilterIcon();
    renderTasks();
  }
  