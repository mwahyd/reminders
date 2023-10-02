import { pubsub } from "./pubsub.js";
import Tasks from "./todos.js";

export default (function Category() {
  const render = () => {
    // listen to each category event and fire associated func
    pubsub.subscribe("priorityLowClicked", _displayLow);
  };

  const _renderTasks = (tasks, contentDiv) => {
    contentDiv.lastElementChild.innerHTML = "";
    tasks.forEach((task) => {
      const elements = Tasks.createTaskElements(task);
      contentDiv.lastElementChild.appendChild(elements);
    });
  };

  const _displayLow = ([priorityLow, contentDiv]) => {
    console.log("prority: low clicked");
    const allTasks = Tasks.getDataFromStorage();
    const lowTasks = allTasks.filter((obj) => obj["priority"] === "low");
    _renderTasks(lowTasks, contentDiv);
  };

  return {
    render,
  };
})();
