// import style from "./style.css";
import TodoForm from "./todo-form.js";
import Tasks from "./todos.js";
import Category from "./category.js";

document.addEventListener("DOMContentLoaded", () => {
  // add a form to add tasks
  // when add task button clicked, display form
  TodoForm.render();

  // when a new task is created; store the task
  // when page loads, display tasks from storage
  Tasks.render();

  // display tasks in their own categories
  Category.render();
});
