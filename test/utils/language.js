import {
  getCustomPhrasesFromLanguagePack,
  getFullPhrases
} from '../../src/utils/language';
import _ from 'lodash';
import { expect } from 'chai';

describe('getFullPhrases()', function () {
  var defaultPhrases = {
    a: 'Aaaa',
    b: 'Baaa',
    c: 'Cccc',
    d: 'Dddd'
  };

  var quizPhrases = {
    b: 'QQQbbbb',
    c: 'QQQcccc',
    e: 'QQQeeee'
  };

  var idMap = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e'
  };

  var fromLanguagePack = {
    1: '@@@@',
    3: 'c!c!c!'
  };

  describe('survey', function () {
    it('returns survey phrases if no custom phrases given', function () {
      var possibleCustomPhrases = [
        {},
        undefined,
        null
      ];

      possibleCustomPhrases.map(function (customPhrases) {
        var result = getFullPhrases(customPhrases, 'survey', idMap, defaultPhrases, quizPhrases);
        expect(result).to.eql(defaultPhrases);
      });
    });

    it('returns survey phrases replaced with custom phrases', function () {
      var result = getFullPhrases(fromLanguagePack, 'survey', idMap, defaultPhrases, quizPhrases);
      expect(result).to.eql({
        a: '@@@@',
        b: 'Baaa',
        c: 'c!c!c!',
        d: 'Dddd'
      });
    });

    it('does not include custom phrases that are not found in id map', function () {
      var possibleCustomPhrases = [
        {
          11: 'eleven'
        },
        {
          1: 'one',
          11: 'eleven'
        }
      ];

      var expected = [
        defaultPhrases,
        {
          a: 'one',
          b: 'Baaa',
          c: 'Cccc',
          d: 'Dddd'
        }
      ];

      possibleCustomPhrases.map(function (custom, index) {
        var result = getFullPhrases(custom, 'survey', idMap, defaultPhrases, quizPhrases);
        expect(result).to.eql(expected[index]);
      });
    });
  });

  describe('quiz', function () {
    it('returns quiz phrases if no custom phrases given', function () {
      var possibleCustomPhrases = [
        {},
        undefined,
        null
      ];

      possibleCustomPhrases.map(function (customPhrases) {
        var result = getFullPhrases(customPhrases, 'quiz', idMap, defaultPhrases, quizPhrases);
        var expected = _.extend(defaultPhrases, quizPhrases);
        expect(result).to.eql(expected);
      });
    });

    it('returns quiz phrases replaced with custom phrases', function () {
      var fromLanguagePack = {
        1: '@@@@',
        3: 'c!c!c!',
        5: 'elephant'
      };
      var result = getFullPhrases(fromLanguagePack, 'quiz', idMap, defaultPhrases, quizPhrases);
      expect(result).to.eql({
        a: '@@@@',
        b: 'QQQbbbb',
        c: 'c!c!c!',
        d: 'Dddd',
        e: 'elephant'
      });
    });

    it('does not include custom phrases that are not found in id map', function () {
      var possibleCustomPhrases = [
        {
          11: 'eleven'
        },
        {
          1: 'one',
          5: 'five'
        }
      ];

      var expected = [
        {
          a: 'Aaaa',
          b: 'QQQbbbb',
          c: 'QQQcccc',
          d: 'Dddd',
          e: 'QQQeeee'
        },
        {
          a: 'one',
          b: 'QQQbbbb',
          c: 'QQQcccc',
          d: 'Dddd',
          e: 'five'
        }
      ];

      possibleCustomPhrases.map(function (custom, index) {
        var result = getFullPhrases(custom, 'quiz', idMap, defaultPhrases, quizPhrases);
        expect(result).to.eql(expected[index]);
      });
    });
  });

  describe('getCustomPhrasesFromLanguagePack()', function () {
    it('returns a phrases object', function () {
      var possibleLanguagePacks = [
        [
          { content: 'alphalpha', phraseID: '1' },
          { content: 'beta fish', phraseID: '2' },
          { content: 'cat pictures', phraseID: '3' }
        ],
        [],
        [
          {content: 'yep', notPhraseID: '1'},
          {notContent: 'yep', phraseID: '1'}
        ]
      ];

      var expected = [
        {
          1: 'alphalpha',
          2: 'beta fish',
          3: 'cat pictures'
        },
        {},
        {}
      ];

      possibleLanguagePacks.map(function (languagePack, index) {
        var result = getCustomPhrasesFromLanguagePack(languagePack);
        expect(result).to.eql(expected[index]);
      });
    });
  });

});
