import { pubsub } from "./pubsub.js";

export default (function Tasks() {
  // ! should not call document here ...
  const contentContainer = document.querySelector("#content");

  const render = () => {
    // listen to a new task created event
    pubsub.subscribe("newTaskCreated", _saveTask);
    pubsub.subscribe("taskCardBtnClicked", _taskCardBtnClicked);

    // display task cards if stored in local storage
    _createTaskCards(contentContainer);
  };

  const _saveTask = ([data, container]) => {
    let taskID;
    const tasksArray = _getDataFromStorage();
    tasksArray.length === 0
      ? (taskID = tasksArray.length + 1)
      : (taskID = tasksArray.at(-1)["taskID"] + 1);
    // create date stamp (date of creation)
    const date = new Date();
    // merge all the objects from data into one object
    data = Object.assign({}, ...data);
    data["taskID"] = taskID;
    data["issuedDate"] = date.toLocaleDateString("en-GB");
    // store task in local storage
    _addDataToStorage(data);
    // call task cards render to update DOM
    _createTaskCards(container);
  };

  const _createTaskCards = (contentDiv) => {
    const tasks = _getDataFromStorage();
    contentDiv.lastElementChild.innerHTML = "";
    tasks.forEach((task) => {
      const elements = _createTaskElements(task);
      contentDiv.lastElementChild.appendChild(elements);
    });
  };

  const _addDataToStorage = (task) => {
    const dataFromStorage = _getDataFromStorage();
    dataFromStorage.push(task);
    localStorage.setItem("tasksArray", JSON.stringify(dataFromStorage));
  };

  const _updateDataInStorage = (array) => {
    localStorage.setItem("tasksArray", JSON.stringify(array));
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

  const _taskCardBtnClicked = ([clickedBtn, contentDiv]) => {
    clickedBtn.id === "delete-btn"
      ? _delBtnClicked(clickedBtn, contentDiv)
      : _editBtnClicked(clickedBtn, contentDiv);
  };

  const _delBtnClicked = (btn, contentDiv) => {
    if (!confirm("Are you sure you want to remove this item?")) {
      return;
    }
    _removeItemFromArray(btn);
    _createTaskCards(contentDiv);
  };

  const _removeItemFromArray = (btn) => {
    const taskArray = _getDataFromStorage();
    const taskID = Number(
      btn.parentElement.parentElement.parentElement.getAttribute("data-index")
    );
    // remove the item based on the taskID by filtering it
    const updatedArray = taskArray.filter((obj) => obj["taskID"] !== taskID);
    _updateDataInStorage(updatedArray);
  };

  const _editBtnClicked = (btn, contentDiv) => {
    console.log(btn);
  };

  const _createTaskElements = (obj) => {
    const container = document.createElement("div");
    container.setAttribute("data-index", obj["taskID"]);
    container.classList.add("red-border"); //                            ! delete later
    container.innerHTML = `
      <div class="task-header flex-sb">
        <p>taskID: <span>${obj["taskID"]}</span></p>
        <p>issued: <span>${obj["issuedDate"]}</span>
      </div>

      <div id="task-priority"><p>priority: <span>${obj["priority"]}</span></p></div>
      <div id="task-title"><p>title: <span class="bold">${obj["title"]}</span></p></div>
      <div id="task-description"><p>description: <span>${obj["description"]}</span></p></div>
      <div id="task-due" class="flex-sb">
        <p>due: <span>${obj["dueDate"]}</span></p>
        <div class="options">
          <button class="edit btn" id="edit-btn">
            <span class="icon icon-edit">&#x1F589;</span> edit
          </button>
          <button class="delete btn" id="delete-btn">
            <span class="icon icon-delete">&#128465;</span> delete
          </button>
        </div>
      </div>
    `;
    return container;
  };

  return {
    render,
  };
})();
