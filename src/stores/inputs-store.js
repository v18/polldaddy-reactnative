var Reflux = require('reflux');
import Actions from '../actions/current-question.js';

module.exports = Reflux.createStore({
  listenables: [Actions],
  saveInputs: function (fieldName, value) {
    if(!this.inputs) {
      this.inputs = {};
    }
    this.inputs[fieldName] = value;
    this.triggerChange();
  },
  reset: function () {
    this.inputs = {};
  },
  triggerChange: function() {
    this.trigger(this.inputs);
  }
});
