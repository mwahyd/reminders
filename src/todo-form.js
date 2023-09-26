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
    const data = [];
    console.log(addBtn);
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

    form.classList.add("hidden");
    addBtn.classList.remove("hidden");

    console.log(data);
    return data;
  };

  return {
    render,
  };
})();
