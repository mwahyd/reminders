export const DOM = {
  init: function () {
    this.cacheDOM();
  },

  cacheDOM: function () {
    this.docu = document.querySelector("body");
    this.header = this.docu.querySelector("header");
    this.mainContainer = this.docu.querySelector(".container");
    this.content = this.docu.querySelector("#content");
    this.sidebar = this.docu.querySelector("#sidebar");
  },

  bindEvents: function () {},
};

DOM.init();
