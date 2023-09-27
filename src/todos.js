import { pubsub } from "./pubsub.js";

export default (function Tasks() {
  const render = () => {
    // listen to a new task created event
    pubsub.subscribe("newTaskCreated", _saveTask);
    // // listen to a new task being saved in storage
    // pubsub.subscribe("newTaskSavedInStorage", _createTaskCard);

    // display task cards if stored in local storage
    _createTaskCards();
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

    console.log(data);
    console.log(container);
  };

  const _createTaskCards = () => {
    // listen for a task saved in storage
    // get data from storage
    const tasks = _getDataFromStorage();
    console.log(tasks);
    // if empty display none; else display on DOM

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

  return {
    render,
  };
})();
