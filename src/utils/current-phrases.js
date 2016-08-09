// CurrentPhrases is separate from CurrentSurvey
// as a hack to get around
// issue that rnfs causes with mocha tests

import _ from 'lodash';

module.exports = {
  setPhrases: function (phrases) {
    this.phrases = phrases;
  },
  resetPhrases: function () {
    this.phrases = undefined;
  },
  getScorePhraseFromTemplate: function (templatePhrase, score) {
    var scoreString = '[score]';
    var phraseWithScore = '';
    if(templatePhrase
      && templatePhrase !== ''
      && (score > 0 || score === 0)
      && templatePhrase.indexOf(scoreString) > -1) {
      phraseWithScore =  _.replace(templatePhrase, scoreString, score);
    }
    return phraseWithScore;
  }
};
