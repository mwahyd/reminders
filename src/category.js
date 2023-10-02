import { pubsub } from "./pubsub.js";
import Tasks from "./todos.js";

export default (function Category() {
  const render = () => {
    // listen to each category event and fire associated func
    pubsub.subscribe("priorityClicked", _displayPriorityHandler);
    pubsub.subscribe("allClicked", _displayAllTasks);
  };

  const _renderTasks = (tasks, contentDiv) => {
    contentDiv.lastElementChild.innerHTML = "";
    tasks.forEach((task) => {
      const elements = Tasks.createTaskElements(task);
      contentDiv.lastElementChild.appendChild(elements);
    });
  };

  const _displayAllTasks = (allButton) => {
    console.log(allButton);
    // display all the tasks from other categories as well
    document.location.reload();
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
    const lowTasks = allTasks.filter((obj) => obj["priority"] === priority);
    _renderTasks(lowTasks, contentDiv);
  };

  return {
    render,
  };
})();
