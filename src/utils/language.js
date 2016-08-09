import _ from 'lodash';

module.exports = {
  getFullPhrases: function (customPhrasesMap = {}, type, idMap = idToPhraseMap, phrases = defaultPhrases, quiz = quizPhrases) {
    var base = _.cloneDeep(phrases);

    if(type === 'quiz') {
      base = _.extend({}, base, quiz);
    }

    var customPhrases = _.mapKeys(customPhrasesMap, function (value, key) {
      var phraseName = idMap[key];
      if(_.has(base, phraseName)) {
        return idMap[key];
      }
    });

    delete customPhrases.undefined;

    return _.extend({}, base, customPhrases);
  },
  getCustomPhrasesFromLanguagePack: function (languagePack) {
    var customPhrases = {};

    if(languagePack.length > 0) {
      customPhrases = languagePack.reduce(function (phrases, currentPhrase) {
        var key = Number(currentPhrase.phraseID);
        var value = currentPhrase.content;
        if(key && value) {
          phrases[key] = value;
        }
        return phrases;
      }, {});
    }

    return customPhrases;
  }
};

var idToPhraseMap = {
  1: 'continue',
  2: 'start',
  3: 'completed',
  5: 'mandatory',
  6: 'validEmail',
  7: 'validUrl',
  8: 'validDate',
  9: 'close',
  10: 'q',
  11: 'other',
  17: 'finish',
  21: 'scored', // for quizzes
  22: 'passed', // for quizzes
  23: 'failed', // for quizzes
  24: 'validPhone',
  25: 'validNumber',
  26: 'withinRange',
  29: 'matrixIncomplete',
  30: 'tooFew',
  31: 'tooMany',
  36: 'back'
};

var defaultPhrases = {
  continue: 'Continue',
  start: 'Start Survey',
  completed: 'Survey Completed',
  mandatory: 'This question is mandatory.',
  validEmail: 'You must enter a valid email address here.',
  validUrl: 'You must enter a valid URL here.',
  validDate: 'You must enter a valid date here.',
  close: 'Close Survey',
  q: 'Q',
  other: 'Other',
  finish: 'Finish Survey',
  validPhone: 'Please enter a valid phone number',
  validNumber: 'Please enter a valid number',
  withinRange: 'Please enter a number within range',
  matrixIncomplete: 'Please make a selection in each row',
  tooFew: 'You need to select more choices',
  tooMany: 'You have selected too many choices',
  back: 'Back'
};

var quizPhrases = {
  start: 'Start Quiz',
  end: 'End of Quiz',
  completed: 'Quiz Completed',
  close: 'Close Quiz',
  finish: 'Finish Quiz',
  scored: 'You scored [score]%!',
  passed: 'This means you passed the quiz.',
  failed: 'Sorry, but you did not pass the quiz.'
};
