import { DOM } from "./DOM.js";
import { pubsub } from "./pubsub.js";

export default (function TodoForm() {
  const getData = function () {
    return DOM;
  };

  const render = function () {
    // ask pubsub controller to notify when addTaskClicked event occurs
    pubsub.subscribe("addTaskClicked", _showForm);
  };

  const _showForm = function (button) {
    console.log(DOM.mainContainer);
    console.log(button);
  };

  return {
    getData,
    render,
  };
})();
