import { DOM } from "./DOM.js";
import { pubsub } from "./pubsub.js";

export default (function TodoForm() {
  const render = function () {
    // ask pubsub controller to notify when addTaskClicked event occurs
    pubsub.subscribe("addTaskClicked", _showFormHideButton);
    pubsub.subscribe("formCancelBtnClicked", _showBtnHideForm);
    pubsub.subscribe("formSaveBtnClicked", _processForm);
  };

  const _showFormHideButton = function ([button, form]) {
    button.classList.add("hidden");
    form.classList.remove("hidden");
  };

  const _showBtnHideForm = function ([addBtn, form]) {
    addBtn.classList.remove("hidden");
    form.classList.add("hidden");
  };

  const _processForm = function ([addBtn, form]) {
    console.log(addBtn);
    console.log(form);
  };

  return {
    render,
  };
})();
