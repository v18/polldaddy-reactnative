import { expect } from 'chai';
import questions from '../../../test-data/email-question-xml';
import React from 'react';
import { shallow } from 'enzyme';
import TextField from '../../../src/survey-page-components/elements/text-field';
var errors = {
  mandatory: 'This is a mandatory question.',
  invalid: 'You must enter a valid email address here.'
};


describe('<Email />', () => {
  var Email = require('../../../src/survey-page-components/questions/email');

  describe('correctly displays', () => {
    it('placeholder', () => {
      var wrapper = shallow(<Email question={questions.mandatoryExample} />);
      expect(wrapper.find(TextField)).to.have.length(1);

      var placeholder = wrapper.find({placeholder: 'person@place.com'});
      expect(placeholder).to.have.length(1);
    });

    it('no placeholder', () => {
      var wrapper = shallow(<Email question={questions.mandatoryNoExample} />);
      expect(wrapper.find(TextField)).to.have.length(1);

      var placeholder = wrapper.find({placeholder: ''});
      expect(placeholder).to.have.length(1);
    });
  });

  describe('getError()', () => {
    describe('when an invalid email is entered', () => {
      var tests = [
        {inputs: { value: 'name'}},
        {inputs: { value: 'name@'}},
        {inputs: { value: 'name@domain'}},
        {inputs: { value: 'name@domain.'}},
        {inputs: { value: 'name@domain.c'}},
        {inputs: { value: '@'}},
        {inputs: { value: '@domain'}},
        {inputs: { value: '@domain.'}},
        {inputs: { value: '@domain.c'}},
        {inputs: { value: '@domain.abcde'}},
        {inputs: { value: '.'}},
        {inputs: { value: 'domain.c'}},
        {inputs: { value: 'domain.abcd'}},
        {inputs: { value: 'name@domain.1'}}
      ];

      describe('returns an invalid error for a mandatory question', () => {
        var question = questions.mandatoryExample;
        tests.map(function (test) {
          it(test.inputs.value, () => {
            var result = Email.prototype.getError(question, test.inputs, errors);
            expect(result).to.equal(errors.invalid);
          });
        });
      });

      describe('returns an invalid error for a non-mandatory question', () => {
        var question = questions.notMandatoryExample;
        tests.map(function (test) {
          it(test.inputs.value, () => {
            var result = Email.prototype.getError(question, test.inputs, errors);
            expect(result).to.equal(errors.invalid);
          });
        });
      });
    });

    describe('when no input is entered', () => {
      describe('returns an error for a mandatory question', () => {
        var question = questions.mandatoryExample;

        var tests = [
          {inputs: { value: ''}},
          {inputs: { }}
        ];

        tests.map(function (test) {
          it(`value: "${test.inputs.value}"`, () => {
            var result = Email.prototype.getError(question, test.inputs, errors);
            expect(result).to.equal(errors.mandatory);
          });
        });
      });

      describe('returns false for a non mandatory question', () => {
        var question = questions.notMandatoryExample;

        var tests = [
          {inputs: { value: ''}},
          {inputs: { }}
        ];

        tests.map(function (test) {
          it(`value: "${test.inputs.value}"`, () => {
            var result = Email.prototype.getError(question, test.inputs, errors);
            expect(result).to.equal(false);
          });
        });
      });
    });

    describe('when a valid email is entered', () => {
      describe('returns false for a mandatory question', () => {
        var question = questions.mandatoryExample;
        var tests = [
          {inputs: { value: 'name@domain.com'}},
          {inputs: { value: 'name+1@domain.com'}}
        ];

        tests.map(function (test) {
          it(test.inputs.value, () => {
            var result = Email.prototype.getError(question, test.inputs, errors);
            expect(result).to.equal(false);
          });
        });
      });

      describe('returns false for a non-mandatory question', () => {
        var question = questions.notMandatoryExample;
        var tests = [
          {inputs: { value: 'name@domain.com'}},
          {inputs: { value: 'name+1@domain.com'}}
        ];

        tests.map(function (test) {
          it(test.inputs.value, () => {
            var result = Email.prototype.getError(question, test.inputs, errors);
            expect(result).to.equal(false);
          });
        });
      });
    });
  });
});
