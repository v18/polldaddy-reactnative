import { expect } from 'chai';
import PhoneNumber from '../../../src/survey-page-components/questions/phone-number';
import { Picker } from 'react-native';
import questions from '../../../test-data/phone-number-xml';
import React from 'react';
import { shallow } from 'enzyme';
import QuizFinishMessage from '../../../src/survey-page-components/questions/quiz-finish-message';

describe('<QuizFinishMessage>', function () {
  describe('_calculateScore', function () {
    var questions = [
      { id: 1,
        correctAnswer: 1,
        name: 'Question 1',
        options: [
          { id: 1, text: 'correct' },
          { id: 2, text: 'incorrect' }
        ]
      },
      { id: 2,
        correctAnswer: 1,
        name: 'Question 2',
        options: [
          { id: 1, text: 'correct' },
          { id: 2, text: 'incorrect' }
        ]
      },
      { id: 3,
        correctAnswer: 2,
        name: 'Question 3',
        options: [
          { id: 1, text: 'incorrect' },
          { id: 2, text: 'correct' }
        ]
      }
    ];

    it('returns 0 when answers array is empty', function () {
      var answers = [];
      var result = QuizFinishMessage.prototype._calculateScore(answers, questions);
      expect(result).to.equal(0);
    });

    it('returns 0 when no answers are right', function () {
      var answers = [
        { questionId: 1, answer: [ 2 ] },
        { questionId: 2, answer: [ 2 ] },
        { questionId: 3, answer: [ 1 ] }
      ];
      var result = QuizFinishMessage.prototype._calculateScore(answers, questions);
      expect(result).to.equal(0);
    });

    it('returns 67 when 2/3 answers are right', function () {
      var answers = [
        { questionId: 1, answer: [ 1 ] },
        { questionId: 2, answer: [ 1 ] },
        { questionId: 3, answer: [ 1 ] }
      ];
      var result = QuizFinishMessage.prototype._calculateScore(answers, questions);
      expect(result).to.equal(67);
    });

    it('returns 100 when all answers are right', function () {
      var answers = [
        { questionId: 1, answer: [ 1 ] },
        { questionId: 2, answer: [ 1 ] },
        { questionId: 3, answer: [ 2 ] }
      ];
      var result = QuizFinishMessage.prototype._calculateScore(answers, questions);
      expect(result).to.equal(100);
    });
  });
});
