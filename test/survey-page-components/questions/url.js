import { expect } from 'chai';
import questions from '../../../test-data/url-question-xml';
import React from 'react';
import { shallow } from 'enzyme';
import TextField from '../../../src/survey-page-components/elements/text-field';
import Url from '../../../src/survey-page-components/questions/url';

var errors = {
  mandatory: 'This is a mandatory question.'
};

describe('<Url />', () => {

  describe('correctly display', () => {
    var wrapperWithPlaceholder = shallow(<Url question={questions.mandatoryWithPlaceholder} />);

    var wrapperWithoutPlaceholder = shallow(<Url question={questions.mandatoryNoPlaceholder} />);

    it('displays the input field with placeholder if given', () => {
      var placeholderResult = wrapperWithPlaceholder.find(TextField).prop('placeholder');

      var noPlaceholderResult = wrapperWithoutPlaceholder.find(TextField).prop('placeholder');

      expect(placeholderResult).to.equal('http://www.example.com');
      expect(noPlaceholderResult).to.equal('');
    });
  });

  describe('getError()', () => {

    describe('when mandatory', () => {
      it('returns false if there is input', () => {
        var result = Url.prototype.getError(questions.mandatoryNoPlaceholder,
          'www.example.com', errors);
        expect(result).to.equal(false);
      });

      it('returns a mandatory error if there is no input', () => {
        var result = Url.prototype.getError(questions.mandatoryWithPlaceholder,
          '', errors);
        expect(result).to.equal(errors.mandatory);
      });
    });

    describe('when not mandatory', () => {
      it('returns false if there is input', () => {
        var result = Url.prototype.getError(
          questions.notMandatoryNoPlaceholder, 'input', errors);
        expect(result).to.equal(false);
      });

      it('returns false if there is no input', () => {
        var result = Url.prototype.getError(
          questions.notMandatoryWithPlaceholder, '', errors);
        expect(result).to.equal(false);
      });
    });
  });
});
