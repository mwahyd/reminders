export const pubsub = {
  // store created events to track broadcasts
  events: {},

  subscribe: function (eventName, func) {
    console.log(`PUBSUB: someone subscribed to know about ${eventName}`);
    // save eventName in events, if not create eventName and set it to an empty array
    this.events[eventName] = this.events[eventName] || [];
    // then save the function that called for this event in the list
    this.events[eventName].push(func);
    console.log("PUBSUB: " + this.events);
  },
};
