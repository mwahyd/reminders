import { pubsub } from "./pubsub.js";

export default (function Tasks() {
  const render = () => {
    // listen to a new task created event
    pubsub.subscribe("newTaskCreated", _saveTask);

    // display task cards if stored in local storage
    // ! should not call document here ...
    _createTaskCards(document.querySelector("#content"));
  };

  const _saveTask = ([data, container]) => {
    // create task ID, (use length of array in local storage)
    const taskID = _getDataFromStorage().length + 1;

    // create date stamp (date of creation)
    const date = new Date();
    const st = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    // merge all the objects from data into one object
    data = Object.assign({}, ...data);
    data["taskID"] = taskID;
    data["createdDate"] = st;

    // store task in local storage
    _addDataToStorage(data);

    // call task cards render to update DOM
    _createTaskCards(container);

    console.log(data);
    console.log(container);
  };

  const _createTaskCards = (contentDiv) => {
    // listen for a task saved in storage
    // get data from storage
    const tasks = _getDataFromStorage();
    // if empty display none; else display on DOM
    if (tasks.length === 0) {
      console.log("array empty");
      return;
    }
    console.log(tasks);
    contentDiv.lastElementChild.innerHTML = "";
    tasks.forEach((task) => {
      const elements = _createTaskElements(task);
      contentDiv.lastElementChild.appendChild(elements);
    });

    // create a task card for each item stored in storage
  };

  const _addDataToStorage = (task) => {
    const dataFromStorage = _getDataFromStorage();
    dataFromStorage.push(task);
    localStorage.setItem("tasksArray", JSON.stringify(dataFromStorage));
  };

  const _getDataFromStorage = () => {
    let dataFromStorage;

    if (localStorage.getItem("tasksArray") === null) {
      dataFromStorage = [];
    } else {
      dataFromStorage = JSON.parse(localStorage.getItem("tasksArray"));
    }
    return dataFromStorage;
  };

  // _createTaskCards();
  const _createTaskElements = (obj) => {
    const container = document.createElement("div");
    container.setAttribute("data-index", obj["taskID"]);
    container.classList.add("red-border");
    container.innerHTML = `
      <div class="task-header flex-sb">
        <p>taskID: <span>${obj["taskID"]}</span></p>
        <p>issued: <span>${obj["createdDate"]}</span>
      </div>

      <div id="task-priority"><p>priority: <span>${obj["priority"]}</span></p></div>
      <div id="task-title"><p>title: <span class="bold">${obj["title"]}</span></p></div>
      <div id="task-description"><p>description: <span>${obj["description"]}</span></p></div>
      <div id="task-due"><p>due: <span>${obj["dueDate"]}</span></p></div>
    `;
    return container;
  };

  return {
    render,
  };
})();
