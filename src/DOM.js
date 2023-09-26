import { pubsub } from "./pubsub.js";

export const DOM = {
  init: function () {
    this.cacheDOM();
    this.bindEvents();
  },

  cacheDOM: function () {
    this.docu = document.querySelector("body");
    this.header = this.docu.querySelector("header");
    this.mainContainer = this.docu.querySelector(".container");
    this.content = this.docu.querySelector("#content");
    this.sidebar = this.docu.querySelector("#sidebar");
    this.addTaskBtn = this.docu.querySelector("#add-btn");
    this.saveFormBtn = this.docu.querySelector("#save-btn");
    this.cancelFormBtn = this.docu.querySelector("#cancel-btn");
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
    console.log(event.target);
    // announce the button is clicked to subscribers
    pubsub.publish("addTaskClicked", event.target);
  },

  onFormBtnClicked: function (event) {
    event.preventDefault();
    console.log(event.target);
    switch (event.target.id) {
      case "save-btn":
        // announce the save button clicked to subscribers
        pubsub.publish("formSaveBtnClicked", event.target);
        break;
      case "cancel-btn":
        pubsub.publish("formCancelBtnClicked", event.target);
        break;
    }
  },

  // support functions
};

DOM.init();
