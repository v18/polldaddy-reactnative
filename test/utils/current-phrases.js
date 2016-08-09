import { getScorePhraseFromTemplate } from '../../src/utils/current-phrases';
import _ from 'lodash';
import { expect } from 'chai';

describe('CurrentPhrases', function () {
  describe('getScorePhraseFromTemplate()', function () {
    var phrase = 'You scored [score]%!';
    var score = 100;

    it('returns the phrase replaced with the score', function () {
      var possibleScores = [100, 0, 50];
      var expected = [
        'You scored 100%!',
        'You scored 0%!',
        'You scored 50%!'
      ];
      possibleScores.map(function (score, index) {
        var result = getScorePhraseFromTemplate(phrase, score);
        expect(result).to.equal(expected[index]);
      });
    });

    it('returns empty string if score not given', function () {
      var possibleScores = [
        undefined,
        null
      ];

      possibleScores.map(function (score) {
        var result = getScorePhraseFromTemplate(phrase, score);
        expect(result).to.equal('');
      });
    });

    it('returns empty string if phrase not given', function () {
      var possibleTemplates = [
        undefined,
        null
      ];

      possibleTemplates.map(function (template) {
        var result = getScorePhraseFromTemplate(template, score);
        expect(result).to.equal('');
      });
    });

    it('returns empty string if phrase does not contain [score]', function () {
      var phrase = 'You scored X%!';
      var result = getScorePhraseFromTemplate(phrase, score);
      expect(result).to.equal('');
    });
  });
});
