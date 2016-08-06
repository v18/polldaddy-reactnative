// CurrentPhrases is separate from CurrentSurvey
// as a hack to get around
// issue that rnfs causes with mocha tests

module.exports = {
  setPhrases: function (phrases) {
    this.phrases = phrases;
  },
  resetPhrases: function () {
    this.phrases = undefined;
  }
};
