import { DOM } from "./DOM.js";
import { pubsub } from "./pubsub.js";

export default (function TodoForm() {
  const render = function () {
    // ask pubsub controller to notify when following events occur
    pubsub.subscribe("addTaskClicked", showFormHideButton);
    pubsub.subscribe("formCancelBtnClicked", _showBtnHideForm);
    pubsub.subscribe("formSaveBtnClicked", _processForm);
  };

  const showFormHideButton = function ([addBtn, form, overlay]) {
    addBtn.nodeName === "SPAN"
      ? addBtn.parentElement.classList.add("hidden")
      : addBtn.classList.add("hidden");
    form.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const _showBtnHideForm = function ([addBtn, form, overlay]) {
    _addAddRemoveHidden(addBtn, form, overlay);
    // if cancel button clicked, remove edit class from save button
    const saveBtn = form.lastElementChild.firstElementChild;
    saveBtn.classList.remove("edit");
    // clear form
    _resetForm();
  };

  const _processForm = function ([addBtn, form, overlay]) {
    // if edit class in save button return
    const saveBtn = form.lastElementChild.firstElementChild;
    if (saveBtn.classList.contains("edit")) {
      _resetForm();
      return;
    }
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
    data.push({ dueDate: dueDate.value });

    input.value = "";
    description.value = "";
    DOM.updateDatePicker();

    _addAddRemoveHidden(addBtn, form, overlay);
    pubsub.publish("newTaskCreated", data, form.parentElement);
  };

  const _addAddRemoveHidden = (addBtn, form, overlay) => {
    form.classList.add("hidden");
    overlay.classList.add("hidden");
    addBtn.classList.remove("hidden");
  };

  const _resetForm = () => {
    form.children[0].children[0].value = "";
    form.children[1].children[0].value = "";
    form.children[2].children[0].value = "low";
    DOM.updateDatePicker();
    form.lastElementChild.firstElementChild.textContent = "save";
    form.lastElementChild.firstElementChild.classList.remove("edit");
  };

  return {
    render,
    showFormHideButton,
  };
})();
