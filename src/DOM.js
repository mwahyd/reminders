import { pubsub } from "./pubsub.js";

export const DOM = {
  init: function () {
    this.cacheDOM();
    this.bindEvents();
    this.updateDatePicker();
  },

  cacheDOM: function () {
    this.docu = document.querySelector("body");
    this.header = this.docu.querySelector("header");
    this.mainContainer = this.docu.querySelector(".container");
    this.content = this.docu.querySelector("#content");
    this.sidebar = this.docu.querySelector("#sidebar");
    this.form = this.docu.querySelector("#form");
    this.overlay = this.docu.querySelector("#overlay");
    this.addTaskBtn = this.docu.querySelector("#add-btn");
    this.saveFormBtn = this.docu.querySelector("#save-btn");
    this.cancelFormBtn = this.docu.querySelector("#cancel-btn");
    this.datePicker = this.docu.querySelector("#datePicker");
  },

  bindEvents: function () {
    this.addTaskBtn.addEventListener("click", this.onAddBtnClicked.bind(this));
    this.saveFormBtn.addEventListener(
      "click",
      this.onFormBtnClicked.bind(this)
    );
    this.cancelFormBtn.addEventListener(
      "click",
      this.onFormBtnClicked.bind(this)
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

  // support functions
  updateDatePicker: function () {
    this.datePicker.valueAsDate = new Date();
  },
};

DOM.init();
