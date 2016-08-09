import _ from 'lodash';

module.exports = {
  setQuizSettings: function (quizSettings) {
    this.resultsView = quizSettings.resultsView;
    this.passThreshold = quizSettings.passThreshold;
    this.answers = [];
  },
  saveAnswer: function (userAnswer) {
    this.answers.push(userAnswer);
  },
  setQuestions: function (questionsXmlDoc) {
    this.questions = this._getScorableQuestions(questionsXmlDoc);
  },
  resetAnswers: function () {
    this.answers = [];
  },
  _getScorableQuestions: function (questions) {
    var scorableQuestions = questions.filter(this._isMultipleChoice);
    return _.map(scorableQuestions, this._getQuestionInfo.bind(this));
  },
  _isMultipleChoice(question) {
    return Number(question.attr.qType) === 400;
  },
  _getQuestionInfo(question) {
    var optionsInfo = _.map(question.childNamed('options').children, this._getOptionInfo);
    return {
      id: Number(question.attr.qID),
      correctAnswer: Number(question.childNamed('answer').val),
      name: question.childNamed('qText').val,
      options: optionsInfo
    }
  },
  _getOptionInfo: function (option) {
    return {
      id: Number(option.attr.oID),
      text: option.val
    };
  }
};
