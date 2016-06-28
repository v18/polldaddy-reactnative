import { expect } from 'chai';
import PhoneNumber from '../../../src/survey-page-components/questions/phone-number';
import { Picker } from 'react-native';
import questions from '../../../test-data/phone-number-xml';
import React from 'react';
import { shallow } from 'enzyme';
import SingleLineInput from '../../../src/survey-page-components/elements/single-line-field';

var errors = {
  mandatory: 'This is a mandatory question.'
};

describe('<PhoneNumber />', () => {

  describe('correctly display', () => {
    var wrapperWithCountry = shallow(<PhoneNumber question={questions.withCountry} />);

    var wrapperWithoutCountry = shallow(<PhoneNumber question={questions.withoutCountry} />);

    var wrapperWithPlaceholder = shallow(<PhoneNumber question={questions.withCountry} />);

    var wrapperWithoutPlaceholder = shallow(<PhoneNumber question={questions.withoutCountry} />);

    it('the country picker if set', () => {
      expect(wrapperWithCountry.find(Picker)).to.have.length(1);
      expect(wrapperWithoutCountry.find(Picker)).to.have.length(0);
    });

    it('the default country', () => {
      var selectedValue = wrapperWithCountry.find(Picker).prop('selectedValue');
      expect(selectedValue).to.equal('JP');
    });

    it('displays the single line field with placeholder if given', () => {
      var withPlaceholderResult = wrapperWithPlaceholder.find(SingleLineInput).prop('placeholder');

      var withoutPlaceholderResult = wrapperWithoutPlaceholder.find(SingleLineInput).prop('placeholder');

      expect(withPlaceholderResult).to.equal('Placeholder');
      expect(withoutPlaceholderResult).to.equal('');
    });
  });

  describe('getError()', () => {

    describe('when mandatory', () => {
      it('returns false if there is input', () => {
        var result = PhoneNumber.prototype.getError(questions.mandatory,
          'input', errors);
        expect(result).to.equal(false);
      });

      it('returns a mandatory error if there is no input', () => {
        var result = PhoneNumber.prototype.getError(questions.mandatory,
          '', errors);
        expect(result).to.equal(errors.mandatory);
      });
    });

    describe('when not mandatory', () => {
      it('returns false if there is input', () => {
        var result = PhoneNumber.prototype.getError(questions.notMandatory,
          'input', errors);
        expect(result).to.equal(false);
      });

      it('returns false if there is no input', () => {
        var result = PhoneNumber.prototype.getError(questions.notMandatory,
          '', errors);
        expect(result).to.equal(false);
      });
    });
  });
});
