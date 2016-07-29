var Reflux = require('reflux');
import Actions from '../actions/current-question.js';

module.exports = Reflux.createStore({
  listenables: [Actions],
  saveError: function (errorMessage) {
    this.hasError = true;
    this.errorMessage = errorMessage;
    this.answers = {};
    this.triggerChange();
  },
  saveAnswers: function (questionId, questionType, answers) {
    this.questionId = questionId;
    this.questionType = questionType;
    this.answers = answers;
    this.hasError = false;
    this.errorMessage = '';
    this.triggerChange();
  },
  triggerChange: function () {
    this.trigger({
      questionId: this.questionId,
      questionType: this.questionType,
      answers: this.answers,
      hasError: this.hasError,
      errorMessage: this.errorMessage
    });
  },
  reset: function () {
    delete this.hasError;
    delete this.errorMessage;
    delete this.answers;
    this.triggerChange();
  }
});
