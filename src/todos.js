import { pubsub } from "./pubsub.js";
import TodoForm from "./todo-form.js";

export default (function Tasks() {
  // ! should not call document here ......
  const contentContainer = document.querySelector("#content");

  const render = () => {
    // listen to a new task created event
    pubsub.subscribe("newTaskCreated", _saveTask);
    pubsub.subscribe("taskCardBtnClicked", _taskCardBtnClicked);

    // display task cards if stored in local storage
    createTaskCards(contentContainer);
  };

  const _saveTask = ([data, container]) => {
    const className = container.lastElementChild.classList[0];
    const tasksArray = getDataFromStorage();
    let taskID;
    tasksArray.length === 0
      ? (taskID = tasksArray.length + 1)
      : (taskID = tasksArray.at(-1)["taskID"] + 1);
    // merge all the objects from data into one object
    data = Object.assign({}, ...data);

    // create date stamp (date of creation)
    data["issuedDate"] = new Date().toLocaleDateString("fr-CA");
    data["taskID"] = taskID;
    data["week"] = getWeek(data["dueDate"]);
    // if #tasks-container contains a class (when category clicked)
    if (className !== undefined) {
      data["category"] = className;
    }
    addDataToStorage(data, "tasksArray");
    createTaskCards(container, "tasksArray", className);
  };

  const createTaskCards = (contentDiv, arrayName, className = null) => {
    contentDiv.firstElementChild.firstElementChild.textContent = "all tasks";
    let tasks = getDataFromStorage(arrayName);
    if (className) {
      tasks = tasks.filter((obj) => obj["category"] === className);
    }
    contentDiv.lastElementChild.innerHTML = "";
    tasks.forEach((task) => {
      const elements = createTaskElements(task);
      contentDiv.lastElementChild.appendChild(elements);
    });
  };

  const addDataToStorage = (task, arrayName) => {
    let dataFromStorage = getDataFromStorage(arrayName);
    dataFromStorage.push(task);
    dataFromStorage = Array.from(new Set(dataFromStorage));
    localStorage.setItem(arrayName, JSON.stringify(dataFromStorage));
  };

  const updateDataInStorage = (array, storageName = "tasksArray") => {
    localStorage.setItem(storageName, JSON.stringify(array));
  };

  const getDataFromStorage = (arrayName = "tasksArray") => {
    let dataFromStorage;

    if (localStorage.getItem(arrayName) === null) {
      dataFromStorage = [];
    } else {
      dataFromStorage = JSON.parse(localStorage.getItem(arrayName));
    }
    return dataFromStorage;
  };

  const _taskCardBtnClicked = ([clickedBtn, contentDiv]) => {
    clickedBtn.id === "delete-btn"
      ? _delBtnClicked(clickedBtn, contentDiv)
      : _editBtnClicked(clickedBtn, contentDiv);
  };

  const _delBtnClicked = (btn, contentDiv) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    removeItemFromArray(btn);
    const className = contentDiv.lastElementChild.classList[0];
    createTaskCards(contentDiv, "tasksArray", className);
  };

  const removeItemFromArray = (element) => {
    const taskArray = getDataFromStorage();
    let taskID;
    if (element.nodeName === "BUTTON") {
      taskID = Number(
        element.parentElement.parentElement.parentElement.getAttribute(
          "data-index"
        )
      );
    } else if (element.nodeName === "INPUT") {
      taskID = Number(
        element.parentElement.parentElement.getAttribute("data-index")
      );
    }
    // remove the item based on the taskID by filtering it
    const updatedArray = taskArray.filter((obj) => obj["taskID"] !== taskID);
    updateDataInStorage(updatedArray);
  };

  const _editBtnClicked = (btn, contentDiv) => {
    // when edit button is clicked, fill the form with task data
    const [taskToEdit] = getTaskToEdit(btn);
    _displayForm(contentDiv);
    _populateForm(form, taskToEdit);

    // subscribe to save button clicked for update
    pubsub.subscribe("taskFromEdited", (data) => {
      const updatedData = _updatedData(data, taskToEdit);
      _updateExistingData(updatedData, contentDiv);
      location.reload();
    });
  };

  const getTaskToEdit = (element) => {
    const taskArray = getDataFromStorage();
    let taskID;
    if (element.nodeName === "BUTTON") {
      taskID = Number(
        element.parentElement.parentElement.parentElement.getAttribute(
          "data-index"
        )
      );
    } else if (element.nodeName === "INPUT") {
      taskID = Number(
        element.parentElement.parentElement.getAttribute("data-index")
      );
    }
    const taskToEdit = taskArray.filter((obj) => obj["taskID"] === taskID);
    return taskToEdit;
  };

  const _displayForm = (contentDiv) => {
    TodoForm.showFormHideButton([
      contentDiv.firstElementChild.children[1],
      contentDiv.children[1],
      contentDiv.children[2],
    ]);

    // add edit class to save button
    const saveBtn = form.lastElementChild.firstElementChild;
    saveBtn.classList.add("edit");
    saveBtn.textContent = "update";
  };

  const _populateForm = (form, task) => {
    const [title, des, priority, due] = _getFormElements(form);
    title.value = task["title"];
    des.value = task["description"];
    priority.value = task["priority"];
    due.value = task["dueDate"];
  };

  // when save button clicked, update the array and put back to local storage
  const _updatedData = ([form], taskToEdit) => {
    const formElements = _getFormElements(form);
    formElements.forEach((element) => {
      Object.keys(taskToEdit).forEach((key) => {
        if (key === element.id) {
          taskToEdit[key] = element.value;
        }
      });
    });
    return taskToEdit;
  };

  const _updateExistingData = (updatedTask, contentDiv) => {
    const taskArray = getDataFromStorage();
    taskArray.forEach((task, index) => {
      if (task["taskID"] === updatedTask["taskID"]) {
        taskArray[index] = updatedTask;
      }
    });
    updateDataInStorage(taskArray);
  };

  const _getFormElements = (form) => {
    return [
      form.children[0].children[0], // title
      form.children[1].children[0], // des
      form.children[2].children[0], // priority
      form.children[3].children[0], // dueDate
    ];
  };

  const createTaskElements = (obj) => {
    const options = { day: "2-digit", month: "short", year: "2-digit" };
    const due = new Date(obj["dueDate"]).toLocaleDateString("en-GB", options);
    const is = new Date(obj["issuedDate"]).toLocaleDateString("en-GB", options);
    const container = document.createElement("div");
    container.setAttribute("data-index", obj["taskID"]);
    container.innerHTML = `
      <div class="task-header flex-sb">
        <p><span id="taskID">&#10747;</span> <span>${obj["taskID"]}</span></p>
        <p><span id="prio">&#x24D8;</span> <span class="bold">${obj["priority"]}</span></p>
        <p><span id="issuedD">&#128337;</span> <span>${is}</span>
      </div>

      <label>status: <input type="checkbox" name="status" class="checkbox" title="task completed?"  /></label>
      <div id="task-title"><p>title: <span class="bold">${obj["title"]}</span></p></div>
      <div id="task-description"><p>description: <em>${obj["description"]}</em></p></div>
      <div id="task-due" class="flex-sb">
        <p><span id="dueD">&#128198;</span> <span>${due}</span></p>
        <div class="options">
          <button class="option edit btn" id="edit-btn">&#x1F589;</button>
          <button class="option delete btn" id="delete-btn">&#128465;</button>
        </div>
      </div>
    `;
    return container;
  };

  const getWeek = (dueDate) => {
    const currentDate = new Date(dueDate);
    // start date = 1st Jan currentYear
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    // This returns the difference between dates in milliseconds.
    // divide by total milliseconds === difference between days
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return weekNumber;
  };

  return {
    render,
    getDataFromStorage,
    addDataToStorage,
    updateDataInStorage,
    getTaskToEdit,
    removeItemFromArray,
    createTaskCards,
    createTaskElements,
    getWeek,
  };
})();
