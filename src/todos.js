import { pubsub } from "./pubsub.js";

export default (function Tasks() {
  const render = () => {
    // listen to a new task created event
    pubsub.subscribe("newTaskCreated", _saveTask);

    // display task cards if stored in local storage
  };

  const _saveTask = ([data, container]) => {
    // create task ID, (use length of array in local storage)
    // create date stamp (date of creation)
    // store task in local storage
    console.log(data);
    console.log(container);
  };

  return {
    render,
  };
})();
