import { pubsub } from "./pubsub.js";

export const DOM = {
  init: function () {
    this.cacheDOM();
    this.bindEvents();
    this.updateDatePicker();
  },

  cacheDOM: function () {
    this.docu = document.querySelector("body");
    // this.header = this.docu.querySelector("header");
    // this.mainContainer = this.docu.querySelector(".container");
    this.content = this.docu.querySelector("#content");
    this.sidebar = this.docu.querySelector("#sidebar");
    this.form = this.docu.querySelector("#form");
    this.overlay = this.docu.querySelector("#overlay");
    this.addTaskBtn = this.docu.querySelector("#add-btn");
    this.saveFormBtn = this.docu.querySelector("#save-btn");
    this.cancelFormBtn = this.docu.querySelector("#cancel-btn");
    this.datePicker = this.docu.querySelector("#dueDate");
  },

  bindEvents: function () {
    this.saveFormBtn.addEventListener("mouseup", () => {
      if (this.saveFormBtn.classList.contains("edit")) {
        this.onEditComplete();
      }
    });

    this.content.lastElementChild.addEventListener(
      "click",
      this.onCheckBoxClicked.bind(this)
    );

    this.sidebar.addEventListener("click", this.onSideBarClicked.bind(this));

    this.addTaskBtn.addEventListener("click", this.onAddBtnClicked.bind(this));
    this.saveFormBtn.addEventListener(
      "click",
      this.onFormBtnClicked.bind(this)
    );
    this.cancelFormBtn.addEventListener(
      "click",
      this.onFormBtnClicked.bind(this)
    );
    this.content.lastElementChild.addEventListener(
      "click",
      this.delegateEditDelBtns.bind(this)
    );
  },

  // handler functions
  onAddBtnClicked: function (event) {
    event.preventDefault();
    // announce the button is clicked to subscribers
    pubsub.publish("addTaskClicked", event.target, this.form, this.overlay);
    console.log("add button clicked");
  },

  onFormBtnClicked: function (event) {
    event.preventDefault();
    console.log(event.target);
    switch (event.target.id) {
      case "save-btn":
        // announce the save button clicked to subscribers
        pubsub.publish(
          "formSaveBtnClicked",
          this.addTaskBtn,
          this.form,
          this.overlay
        );
        break;
      case "cancel-btn":
        pubsub.publish(
          "formCancelBtnClicked",
          this.addTaskBtn,
          this.form,
          this.overlay
        );
        break;
    }
  },

  delegateEditDelBtns: function (event) {
    if (!event.target.classList.contains("option")) {
      return;
    }
    pubsub.publish("taskCardBtnClicked", event.target, this.content);
  },

  onEditComplete: function () {
    pubsub.publish("taskFromEdited", this.form);
  },

  onSideBarClicked: function (event) {
    pubsub.publish("navClicked", this.addTaskBtn, this.content);
    console.log(event.target);
    if (event.target.classList.contains("dynamic")) {
      pubsub.publish(
        "categoryClicked",
        event.target,
        this.content,
        this.sidebar.lastElementChild.lastElementChild,
        this.addTaskBtn
      );
    } else if (event.target.classList.contains("del-btn")) {
      pubsub.publish("catDelBtnClicked", event.target);
    }

    switch (event.target.id) {
      case "home":
        pubsub.publish("allClicked", event.target, this.content);
        break;
      case "today":
        pubsub.publish("dueTodayClicked", event.target, this.content);
        break;
      case "this-week":
        pubsub.publish("dueThisWeekClicked", event.target, this.content);
        break;
      case "priority-low":
        pubsub.publish("priorityClicked", event.target, this.content);
        break;
      case "priority-medium":
        pubsub.publish("priorityClicked", event.target, this.content);
        break;
      case "priority-high":
        pubsub.publish("priorityClicked", event.target, this.content);
        break;
      case "completed":
        pubsub.publish(
          "completedClicked",
          event.target,
          this.content,
          this.addTaskBtn
        );
        break;
      case "category-btn":
        pubsub.publish("addCatBtnClicked", event.target, this.sidebar);
        break;
      case "cat-save-btn":
        pubsub.publish("catSaveCancelClicked", event, this.sidebar);
        break;
      case "cat-cancel-btn":
        pubsub.publish("catSaveCancelClicked", event, this.sidebar);
        break;
    }
  },

  onCheckBoxClicked: function (event) {
    if (event.target.id !== "checkbox") {
      return;
    }
    pubsub.publish("checkBoxClicked", event.target, this.content);
  },

  // support functions
  updateDatePicker: function () {
    this.datePicker.valueAsDate = new Date();
  },
};

DOM.init();
