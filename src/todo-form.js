import { DOM } from "./DOM.js";
import { pubsub } from "./pubsub.js";

export default (function TodoForm() {
  const render = function () {
    // ask pubsub controller to notify when following events occur
    pubsub.subscribe("addTaskClicked", _showFormHideButton);
    pubsub.subscribe("formCancelBtnClicked", _showBtnHideForm);
    pubsub.subscribe("formSaveBtnClicked", _processForm);
  };

  const _showFormHideButton = function ([addBtn, form, overlay]) {
    addBtn.classList.add("hidden");
    form.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const _showBtnHideForm = function ([addBtn, form, overlay]) {
    _addAddRemoveHidden(addBtn, form, overlay);
  };

  const _processForm = function ([addBtn, form, overlay]) {
    const data = [];
    const input = form.children[0].children[0];
    const description = form.children[1].children[0];
    const priority = form.children[2].children[0];
    const dueDate = form.children[3].children[0];

    if (input.value.trim() === "") {
      alert("title cannot be empty");
      input.value = "";
      return;
    }

    data.push({ title: input.value.toLowerCase() });
    data.push({ description: description.value.toLowerCase().trim() });
    data.push({ priority: priority.value.toLowerCase() });
    data.push({ dueDate: new Date(dueDate.value).toLocaleDateString("en-GB") });

    input.value = "";
    description.value = "";
    DOM.updateDatePicker();

    _addAddRemoveHidden(addBtn, form, overlay);

    pubsub.publish("newTaskCreated", data, form.parentElement);
    // return data;
  };

  const _addAddRemoveHidden = (addBtn, form, overlay) => {
    form.classList.add("hidden");
    overlay.classList.add("hidden");
    addBtn.classList.remove("hidden");
  };

  return {
    render,
  };
})();
