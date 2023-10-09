import { pubsub } from "./pubsub.js";
import Tasks from "./todos.js";

export default (function Category() {
  // ! should not call document here ......
  const catContainer = document.querySelector("#category-container");

  const render = () => {
    // listen to each category event and fire associated func
    pubsub.subscribe("allClicked", _displayAllTasks);
    pubsub.subscribe("dueTodayClicked", _displayDueToday);
    pubsub.subscribe("dueThisWeekClicked", _displayDueThisWeek);
    pubsub.subscribe("priorityClicked", _displayPriorityHandler);
    pubsub.subscribe("categoryClicked", _displayCategoryHandler);
    pubsub.subscribe("completedClicked", _handleCompleted);
    pubsub.subscribe("checkBoxClicked", _handleCheckBoxClicked);
    pubsub.subscribe("navClicked", _handleNavClick);
    pubsub.subscribe("addCatBtnClicked", _showFormHideBtn);
    pubsub.subscribe("catSaveCancelClicked", _showBtnHideForm);
    pubsub.subscribe("newCatCreated", _saveCategory);
    pubsub.subscribe("catDelBtnClicked", _deleteCatWithTasks);
    pubsub.subscribe("clearAllBtnClicked", _removeAllTasks);

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
    const taskContainer = contentDiv.lastElementChild;
    taskContainer.className = "";
    Tasks.createTaskCards(contentDiv);
  };

  const _displayDueToday = ([dueToday, contentDiv]) => {
    const today = new Date().toLocaleDateString("en-GB");
    const tasks = Tasks.getDataFromStorage();
    const dueT = tasks.filter((obj) => _convertDate(obj["dueDate"]) === today);
    _renderTasks(dueT, contentDiv);
  };

  const _displayDueThisWeek = ([dueToday, contentDiv]) => {
    const today = new Date();
    const tasks = Tasks.getDataFromStorage();
    const currentWeek = Tasks.getWeek(today);
    const dueThisWeek = tasks.filter((obj) => obj["week"] === currentWeek);
    _renderTasks(dueThisWeek, contentDiv);
  };

  const _displayPriorityHandler = ([priority, contentDiv]) => {
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

  const _displayCategoryHandler = ([category, contentDiv, catContainer]) => {
    _handleCategoryDiv(catContainer, category);
    _handleTaskContainer(contentDiv, category);
    const arrayList = Tasks.getDataFromStorage();
    const filtered = arrayList.filter(
      (obj) => obj["category"] === category.getAttribute("data-name")
    );
    _renderTasks(filtered, contentDiv);
  };

  const _deleteCatWithTasks = ([event]) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const catName = event.parentElement.getAttribute("data-name");
    const tasks = Tasks.getDataFromStorage();
    const categories = Tasks.getDataFromStorage("categories");
    const filtered = tasks.filter((obj) => obj["category"] !== catName);
    categories.splice(categories.indexOf(catName), 1);
    Tasks.updateDataInStorage(categories, "categories");
    Tasks.updateDataInStorage(filtered);
    location.reload();
  };

  const _handleCheckBoxClicked = ([checkBox, contentDiv]) => {
    if (!confirm("Do you want to mark this task complete?")) {
      checkBox.checked = false;
      return;
    }
    const task = checkBox.parentElement.parentElement;
    task.classList.add("striked");
    const taskArray = Tasks.getTaskToEdit(checkBox);
    checkBox.disabled = true;
    const options =
      checkBox.parentElement.nextElementSibling.nextElementSibling
        .nextElementSibling.lastElementChild;
    options.classList.add("hidden");
    // create new local storage for completed
    Tasks.addDataToStorage(taskArray[0], "completed");
    Tasks.removeItemFromArray(checkBox);
  };

  const _handleCompleted = ([completedNav, contentDiv, addTaskBtn]) => {
    const array = Tasks.getDataFromStorage("completed");
    const clearAllBtn = _clearAllBtn();
    addTaskBtn.classList.add("hidden");
    if (contentDiv.children[0].id !== "clear-btn") {
      contentDiv.insertBefore(clearAllBtn, addTaskBtn);
    }
    _renderTasks(array, contentDiv);
    const list = contentDiv.lastElementChild.querySelectorAll("[data-index]");
    list.forEach((task) => {
      const options = task.lastElementChild.lastElementChild;
      const checkbox = task.children[1];
      task.classList.add("striked");
      options.classList.add("hidden");
      task.removeChild(checkbox);
    });
  };

  const _handleNavClick = ([addBtn, contentDiv, sidebar]) => {
    addBtn.classList.remove("hidden");
    if (contentDiv.children[0].id === "clear-btn") {
      contentDiv.removeChild(contentDiv.children[0]);
    }
    const navItems = sidebar.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
      }
    });
  };

  const _removeAllTasks = ([contentDiv]) => {
    localStorage.removeItem("completed");
    contentDiv.lastElementChild.innerHTML = "";
  };

  // * support functions
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
    categories.forEach((cat) => {
      const div = document.createElement("div");
      const p = document.createElement("p");
      const del = document.createElement("span");
      p.textContent = cat;
      del.textContent = "\u2716";
      del.classList.add("del-btn");
      div.setAttribute("data-name", cat.replace(/\s/g, ""));
      div.classList.add("nav-item", "dynamic");
      div.append(p, del);
      container.appendChild(div);
    });
  };

  const _handleTaskContainer = (contentDiv, category) => {
    const taskContainer = contentDiv.lastElementChild;
    const catName = category.getAttribute("data-name");
    taskContainer.className = "";
    taskContainer.classList.add(catName.replace(/\s/g, ""));
    taskContainer.innerHTML = "";
  };

  const _handleCategoryDiv = (catContainer, category) => {
    Array.from(catContainer.children).forEach((item) => {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
      }
    });
    category.classList.add("selected");
  };

  const _clearAllBtn = () => {
    const button = document.createElement("button");
    button.classList.add("clear", "btn");
    button.id = "clear-btn";
    button.textContent = "clear all";
    return button;
  };

  return {
    render,
  };
})();
