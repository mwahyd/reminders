// import style from "./style.css";
import todoForm from "./todo-form.js";

console.log(todoForm.getData());
document.addEventListener("DOMContentLoaded", () => {
  // add a form to add tasks
  // when add task button clicked, display form
  todoForm.render();
});
