import { pubsub } from "./pubsub.js";
import Tasks from "./todos.js";

export default (function Category() {
  // ! should not call document here ......
  const catContainer = document.querySelector("#category-container");
  console.log(catContainer);

  const render = () => {
    // listen to each category event and fire associated func
    pubsub.subscribe("priorityClicked", _displayPriorityHandler);
    pubsub.subscribe("allClicked", _displayAllTasks);
    pubsub.subscribe("dueTodayClicked", _displayDueToday);
    pubsub.subscribe("addCatBtnClicked", _showFormHideBtn);
    pubsub.subscribe("catSaveCancelClicked", _showBtnHideForm);
    pubsub.subscribe("newCatCreated", _saveCategory);
    pubsub.subscribe("categoryClicked", _displayCategoryHandler);
    pubsub.subscribe("dueThisWeekClicked", _displayDueThisWeek);

    _renderCategories(catContainer);
  };

  const _renderTasks = (tasks, contentDiv) => {
    contentDiv.lastElementChild.innerHTML = "";
    tasks.forEach((task) => {
      const elements = Tasks.createTaskElements(task);
      contentDiv.lastElementChild.appendChild(elements);
    });
  };

  const _displayAllTasks = ([allButton, contentDiv]) => {
    _resetClassName(contentDiv);
    Tasks.createTaskCards(contentDiv);
  };

  const _displayDueToday = ([dueToday, contentDiv]) => {
    const today = new Date().toLocaleDateString("en-GB");
    const tasks = Tasks.getDataFromStorage();
    const dueT = tasks.filter((obj) => _convertDate(obj["dueDate"]) === today);
    _renderTasks(dueT, contentDiv);
  };

  const _displayDueThisWeek = ([dueToday, contentDiv]) => {
    const today = new Date().toLocaleDateString("en-GB");
    const tasks = Tasks.getDataFromStorage();
    const currentWeek = Tasks.getWeek(_convertDate(today));
    const dueThisWeek = tasks.filter((obj) => obj["week"] === currentWeek);
    _renderTasks(dueThisWeek, contentDiv);
  };

  const _displayPriorityHandler = ([priority, contentDiv]) => {
    console.log(priority);
    switch (priority.id) {
      case "priority-low":
        _displayPriority("low", contentDiv);
        break;
      case "priority-medium":
        _displayPriority("medium", contentDiv);
        break;
      case "priority-high":
        _displayPriority("high", contentDiv);
        break;
    }
  };

  const _displayPriority = (priority, contentDiv) => {
    console.log(`prority: ${priority} clicked`);
    const allTasks = Tasks.getDataFromStorage();
    const priorityTasks = allTasks.filter(
      (obj) => obj["priority"] === priority
    );
    _renderTasks(priorityTasks, contentDiv);
  };

  const _showFormHideBtn = ([catBtn, sidebarDiv]) => {
    const form =
      sidebarDiv.lastElementChild.lastElementChild.previousElementSibling;
    catBtn.classList.add("hidden");
    form.classList.remove("hidden");
  };

  const _showBtnHideForm = ([event, sidebarDiv]) => {
    const form =
      sidebarDiv.lastElementChild.lastElementChild.previousElementSibling;
    const btn =
      sidebarDiv.lastElementChild.lastElementChild.previousElementSibling
        .previousElementSibling;
    btn.classList.remove("hidden");
    form.classList.add("hidden");
    if (event.target.id === "cat-save-btn") _saveBtnClicked(event, form);
    form.firstElementChild.value = "";
  };

  const _displayCategoryHandler = ([category, contentDiv]) => {
    const taskContainer = contentDiv.lastElementChild;
    const catName = category.getAttribute("data-name");
    _resetClassName(contentDiv);
    taskContainer.classList.add(catName.replace(/\s/g, ""));
    taskContainer.innerHTML = "";
    const arrayList = Tasks.getDataFromStorage();
    const filtered = arrayList.filter((obj) => obj["category"] === catName);
    _renderTasks(filtered, contentDiv);
    // console.log(arrayList);
  };

  // support functions
  const _convertDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const _saveBtnClicked = (event, form) => {
    event.preventDefault();
    const input = form.firstElementChild;
    if (input.value.trim() === "") {
      alert("category name cannot be empty");
      input.value = "";
      return;
    }
    pubsub.publish("newCatCreated", input.value.trim().toLowerCase(), form);
  };

  const _saveCategory = ([catName, form]) => {
    const catDiv = form.nextElementSibling;
    Tasks.addDataToStorage(catName, "categories");

    _renderCategories(catDiv);
  };

  const _renderCategories = (container) => {
    const categories = Tasks.getDataFromStorage("categories");
    catContainer.innerHTML = "";
    console.log(categories);
    categories.forEach((cat) => {
      const div = document.createElement("div");
      const del = document.createElement("span");
      div.textContent = cat;
      del.textContent = "\u2716";
      div.setAttribute("data-name", cat.replace(/\s/g, ""));
      div.classList.add("nav-item", "dynamic");
      div.appendChild(del);
      container.appendChild(div);
    });
  };

  const _resetClassName = (contentDiv) => {
    const taskContainer = contentDiv.lastElementChild;
    taskContainer.className = "";
  };

  return {
    render,
  };
})();
