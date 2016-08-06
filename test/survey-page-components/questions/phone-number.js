import { expect } from 'chai';
import PhoneNumber from '../../../src/survey-page-components/questions/phone-number';
import { Picker } from 'react-native';
import questions from '../../../test-data/phone-number-xml';
import React from 'react';
import { shallow } from 'enzyme';
import TextField from '../../../src/survey-page-components/elements/text-field';

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
      var withPlaceholderResult = wrapperWithPlaceholder.find(TextField).prop('placeholder');

      var withoutPlaceholderResult = wrapperWithoutPlaceholder.find(TextField).prop('placeholder');

      expect(withPlaceholderResult).to.equal('Placeholder');
      expect(withoutPlaceholderResult).to.equal('');
    });
  });

  describe('getError()', () => {

    describe('when mandatory', () => {
      it('returns false if there is input', () => {
        var result = PhoneNumber.prototype.getError(questions.mandatory,
          'input');
        expect(result).to.equal(false);
      });

      it('returns a mandatory error if there is no input', () => {
        var result = PhoneNumber.prototype.getError(questions.mandatory,
          '');
        expect(result).to.equal('mandatory');
      });
    });

    describe('when not mandatory', () => {
      it('returns false if there is input', () => {
        var result = PhoneNumber.prototype.getError(questions.notMandatory,
          'input');
        expect(result).to.equal(false);
      });

      it('returns false if there is no input', () => {
        var result = PhoneNumber.prototype.getError(questions.notMandatory,
          '');
        expect(result).to.equal(false);
      });
    });
  });
});
