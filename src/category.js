import { pubsub } from "./pubsub.js";
import Tasks from "./todos.js";

export default (function Category() {
  const render = () => {
    // listen to each category event and fire associated func
    pubsub.subscribe("priorityClicked", _displayPriorityHandler);
    pubsub.subscribe("allClicked", _displayAllTasks);
    pubsub.subscribe("dueTodayClicked", _dueToday);
    pubsub.subscribe("addCatBtnClicked", _showFormHideBtn);
    pubsub.subscribe("catSaveCancelClicked", _showBtnHideForm);
  };

  const _renderTasks = (tasks, contentDiv) => {
    contentDiv.lastElementChild.innerHTML = "";
    tasks.forEach((task) => {
      const elements = Tasks.createTaskElements(task);
      contentDiv.lastElementChild.appendChild(elements);
    });
  };

  const _displayAllTasks = ([allButton, contentDiv]) => {
    console.log(allButton);
    // display all the tasks from other categories as well
    document.location.reload();
  };

  const _dueToday = ([dueToday, contentDiv]) => {
    const today = new Date().toLocaleDateString("en-GB");
    const allTasks = Tasks.getDataFromStorage();
    const dueTasks = allTasks.filter(
      (obj) => _convertDate(obj["dueDate"]) === today
    );
    _renderTasks(dueTasks, contentDiv);
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

  const _showBtnHideForm = ([catBtn, sidebarDiv]) => {
    const form =
      sidebarDiv.lastElementChild.lastElementChild.previousElementSibling;
    const btn =
      sidebarDiv.lastElementChild.lastElementChild.previousElementSibling
        .previousElementSibling;
    btn.classList.remove("hidden");
    form.classList.add("hidden");
  };

  // support functions
  const _convertDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return {
    render,
  };
})();
