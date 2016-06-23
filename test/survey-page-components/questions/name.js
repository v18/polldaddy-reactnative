import { expect } from 'chai';
import questions from '../../../test-data/name-question-xml';
import React from 'react';
import { shallow } from 'enzyme';
import SingleFieldInput from '../../../src/survey-page-components/elements/single-line-field';
var errors = {
  mandatory: 'This is a mandatory question.'
};

describe('<Name />', () => {
  var Name = require('../../../src/survey-page-components/questions/name');

  describe('correctly displays', () => {
    it('case 0: title, first, last, suffix', () => {
      var wrapper = shallow(<Name question={questions.mandatoryFullName} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(4);

      var title = wrapper.find({placeholder: 'Title'});
      expect(title).to.have.length(1);

      var first = wrapper.find({placeholder: 'First Name'});
      expect(first).to.have.length(1);

      var last = wrapper.find({placeholder: 'Last Name'});
      expect(last).to.have.length(1);

      var suffix = wrapper.find({placeholder: 'Suffix'});
      expect(suffix).to.have.length(1);
    });

    it('case 1: title, first, and last', () => {
      var wrapper = shallow(<Name question={questions.mandatoryTitleFirstAndLast} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(3);

      var title = wrapper.find({placeholder: 'Title'});
      expect(title).to.have.length(1);

      var first = wrapper.find({placeholder: 'First Name'});
      expect(first).to.have.length(1);

      var last = wrapper.find({placeholder: 'Last Name'});
      expect(last).to.have.length(1);
    });

    it('case 2: first and last', () => {
      var wrapper = shallow(<Name question={questions.mandatoryFirstAndLast} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(2);

      var first = wrapper.find({placeholder: 'First Name'});
      expect(first).to.have.length(1);

      var last = wrapper.find({placeholder: 'Last Name'});
      expect(last).to.have.length(1);
    });
  });

  describe('getErrors()', () => {
    describe('mandatory', () => {
      it('returns error when all fields empty', () => {
        var input = {
          title: '',
          firstName: '',
          lastName: '',
          suffix: ''
        };

        expect(Name.prototype.getError(questions.mandatoryFullName, input, errors)).to.equal(errors.mandatory);
        expect(Name.prototype.getError(questions.mandatoryTitleFirstAndLast, input, errors)).to.equal(errors.mandatory);
        expect(Name.prototype.getError(questions.mandatoryFirstAndLast, input, errors)).to.equal(errors.mandatory);
      });

      it('returns error when at least one of the is fields empty', () => {
        var input = {
          title: 'title',
          firstName: '',
          lastName: '',
          suffix: ''
        };

        expect(Name.prototype.getError(questions.mandatoryFullName, input, errors)).to.equal(errors.mandatory);
        expect(Name.prototype.getError(questions.mandatoryTitleFirstAndLast, input, errors)).to.equal(errors.mandatory);
        expect(Name.prototype.getError(questions.mandatoryFirstAndLast, input, errors)).to.equal(errors.mandatory);
      });
    });

    describe('not mandatory', () => {
      it('passes no matter what the input is', () => {
        var inputs = [
          {inputs: {title: '', firstName: '', lastName: '', suffix: ''}},
          {inputs: {title: 'a', firstName: '', lastName: '', suffix: ''}},
          {inputs: {title: '', firstName: 'a', lastName: '', suffix: ''}},
          {inputs: {title: '', firstName: '', lastName: 'a', suffix: ''}},
          {inputs: {title: '', firstName: '', lastName: '', suffix: 'a'}},
          {inputs: {title: 'a', firstName: 'a', lastName: 'a', suffix: 'a'}}
        ];

        var notMandQuestions = [
          questions.notMandatoryFullName,
          questions.notMandatoryTitleFirstAndLast,
          questions.notMandatoryFirstAndLast
        ];

        notMandQuestions.map(function (question) {
          inputs.map(function (input) {
            var result = Name.prototype.getError(question, input, errors);
            expect(result).to.equal(false);
          });
        });

      });
    });
  });
});
