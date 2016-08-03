import Actions from '../actions/responses';
var Reflux = require('reflux');

module.exports = Reflux.createStore({
  listenables: [Actions],
  setResponsesFromDatabase: function (surveyId, totalResponses) {
    if(!this.responses) {
      this.responses = {};
    }
    this.responses[surveyId] = totalResponses;
    this.triggerChange();
  },
  triggerChange: function () {
    this.trigger(this.responses);
  }
});
