export const pubsub = {
  // store created events to track broadcasts
  events: {},

  subscribe: function (eventName, func) {
    console.log(`PUBSUB: someone subscribed to know about ${eventName}`);
    // save eventName in events, if not create eventName and set it to an empty array
    this.events[eventName] = this.events[eventName] || [];
    // then save the function that called for this event in the list
    this.events[eventName].push(func);
    console.log("PUBSUB: ");
    console.log(this.events);
  },

  unsubscribe: function (eventName, func) {
    // remove func from the event list to stop listening
  },

  publish: function (eventName, ...data) {
    console.dir(`PUBSUB: broadcast about ${eventName} with ${data}`);
    // announce the event to anyone who is subscribed
    if (this.events[eventName]) {
      this.events[eventName].forEach((func) => func(data));
    }
  },
};
