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
  },

  bindEvents: function () {
    this.addTaskBtn.addEventListener("click", this.onClickHandler.bind(this));
  },

  // handler functions
  onClickHandler: function (event) {
    event.preventDefault();
    console.log(event.target);
    // announce the button is clicked to subscribers
    pubsub.publish("addTaskClicked", event.target);
  },

  // support functions
};

DOM.init();
