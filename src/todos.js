import { pubsub } from "./pubsub.js";

export default (function Tasks() {
  const render = () => {
    // listen to a new task created event
    pubsub.subscribe("newTaskCreated", _saveTask);

    // display task cards if stored in local storage
  };

  const _saveTask = ([data, container]) => {
    // create task ID, (use length of array in local storage)
    const taskID = _getDataFromStorage().length + 1;

    // create date stamp (date of creation)
    const date = new Date();
    const st = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    // merge all the objects from data into one object
    dataObj = Object.assign({}, ...data);
    dataObj["taskID"] = taskID;
    dataObj["createdDate"] = st;

    // store task in local storage
    _addDataToStorage(dataObj);

    console.log(dataObj);
    console.log(container);
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
