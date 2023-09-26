import { DOM } from "./DOM.js";
import { pubsub } from "./pubsub.js";

export default (function TodoForm() {
  let addBtn;
  const getData = function () {
    return DOM;
  };

  const render = function () {
    // ask pubsub controller to notify when addTaskClicked event occurs
    pubsub.subscribe("addTaskClicked", _showFormHideButton);
    pubsub.subscribe("formCancelBtnClicked", _showBtnHideForm);
  };

  const _showFormHideButton = function (button) {
    console.log(DOM.mainContainer.querySelector("#form"));
    DOM.mainContainer.querySelector("#form").classList.remove("hidden");
    button.classList.add("hidden");
    addBtn = button;
  };

  const _showBtnHideForm = function (data) {
    DOM.mainContainer.querySelector("#form").classList.add("hidden");
    addBtn.classList.remove("hidden");
  };

  return {
    getData,
    render,
  };
})();
