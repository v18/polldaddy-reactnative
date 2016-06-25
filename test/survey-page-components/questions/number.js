import { expect } from 'chai';
import getErrorProps from '../../../test-data/number-question-getError-props';
import props from '../../../test-data/number-question-props';
import React from 'react';
import { shallow } from 'enzyme';
import SingleFieldInput from '../../../src/survey-page-components/elements/single-line-field';
import { Text } from 'react-native';

var errors = {
  mandatory: 'This is a mandatory question.',
  invalidNumber: 'Please enter a valid number',
  withinRange: 'Please enter a number within range'
};

describe('<NumberQuestion />', () => {
  var NumberQuestion = require('../../../src/survey-page-components/questions/number');

  describe('slider', () => {
    it('displays correctly'); // pending test: <Slider /> not working with mocha
    it('shows number without label', () => {
      var wrapper = shallow(<NumberQuestion {...props.sliderNoLabel} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(0);
      expect(wrapper.find(Text)).to.have.length(1);
      expect(wrapper.containsMatchingElement(<Text>0</Text>)).to.equal(true);
    });

    it('shows number and label', () => {
      var wrapper = shallow(<NumberQuestion {...props.sliderWithLabel} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(0);
      expect(wrapper.find(Text)).to.have.length(2);
      expect(wrapper.containsMatchingElement(<Text>1</Text>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<Text>$</Text>)).to.equal(true);
    });
  });

  describe('input field', () => {
    describe('with label', () => {
      var wrapper = shallow(<NumberQuestion {...props.inputWithLabel} />);
      it('has <SingleFieldInput /> with the correct default value', () => {
        expect(wrapper.find(SingleFieldInput)).to.have.length(1);
        expect(wrapper.find(SingleFieldInput).props().default).to.equal('3');
      });
      it('displays correct label', () => {
        expect(wrapper.find(Text)).to.have.length(1);
        expect(wrapper.containsMatchingElement(
          <Text>$</Text>
        )).to.equal(true);
      });
    });

    describe('without label', () => {
      var wrapper = shallow(<NumberQuestion {...props.inputNoLabel} />);
      it('does not display a label', () => {
        expect(wrapper.find(Text)).to.have.length(0);
      });
    });
  });

  describe('getError()', () => {
    describe('slider question', () => {
      var number = 0;
      it('returns false if mandatory', () => {
        var result = NumberQuestion.prototype.getError(
          getErrorProps.sliderPropsMandatory,
          number, errors);
        expect(result).to.equal(false);
      });

      it('returns false if not mandatory', () => {
        var result = NumberQuestion.prototype.getError(
          getErrorProps.sliderPropsNotMandatory,
          number, errors);
        expect(result).to.equal(false);
      });
    });

    describe('not slider question', () => {
      describe('and is mandatory', () => {
        it('return mandatory error if input is empty', () => {
          var number = '';
          var result = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsMandatory,
            number, errors);
          expect(result).to.equal(errors.mandatory);
        });

        it('returns a valid number error if input is not a number', () => {
          var number = 'notanumber';
          var result = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsMandatory,
            number, errors);
          expect(result).to.equal(errors.invalidNumber);
        });

        it('returns a within range error if number is not within range', () => {
          var result1 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeMandatory,
            '11', errors);

          var result2 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeMandatory,
            '0', errors);

          var result3 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeMandatory,
            '-1', errors);

          expect(result1).to.equal(errors.withinRange);
          expect(result2).to.equal(errors.withinRange);
          expect(result3).to.equal(errors.withinRange);
        });

        it('returns false if number is valid, and no min max is set', () => {
          var result = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsNoRangeMandatory,
            '2', errors);
          expect(result).to.equal(false);
        });

        it('returns false if number is within range if min and max are set', () => {
          var result1 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeMandatory,
            '2', errors);

          var result2 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithMinMandatory,
            '2', errors);

          var result3 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithMaxMandatory,
            '2', errors);

          expect(result1).to.equal(false);
          expect(result2).to.equal(false);
          expect(result3).to.equal(false);
        });
      });

      describe('and is not mandatory', () => {
        it('return false if input is empty', () => {
          var number = '';
          var result = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsNotMandatory,
            number, errors);
          expect(result).to.equal(false);
        });

        it('returns a valid number error if input is not a number', () => {
          var number = 'notanumber';
          var result = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsNotMandatory,
            number, errors);
          expect(result).to.equal(errors.invalidNumber);
        });

        it('returns a within range error if number is not within range', () => {
          var result1 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeNotMandatory,
            '11', errors);

          var result2 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeNotMandatory,
            '0', errors);

          var result3 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeNotMandatory,
            '-1', errors);

          expect(result1).to.equal(errors.withinRange);
          expect(result2).to.equal(errors.withinRange);
          expect(result3).to.equal(errors.withinRange);
        });

        it('returns false if number is valid, and no min max is set', () => {
          var result = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsNoRangeNotMandatory,
            '2', errors);
          expect(result).to.equal(false);
        });

        it('returns false if number is within range if min and max are set', () => {
          var result1 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithRangeNotMandatory,
            '2', errors);

          var result2 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithMinNotMandatory,
            '2', errors);

          var result3 = NumberQuestion.prototype.getError(
            getErrorProps.notSliderPropsWithMaxNotMandatory,
            '2', errors);

          expect(result1).to.equal(false);
          expect(result2).to.equal(false);
          expect(result3).to.equal(false);
        });
      });
    });
  });

  describe('truncateNumber()', () => {
    it('input empty string returns empty string', () => {
      expect(NumberQuestion.prototype.truncateNumber('', 0)).to.equal('');
      expect(NumberQuestion.prototype.truncateNumber('', 1)).to.equal('');
      expect(NumberQuestion.prototype.truncateNumber('', 2)).to.equal('');
      expect(NumberQuestion.prototype.truncateNumber('', 3)).to.equal('');
      expect(NumberQuestion.prototype.truncateNumber('', 4)).to.equal('');
      expect(NumberQuestion.prototype.truncateNumber('', 5)).to.equal('');
    });

    it('NaN string returns empty string', () => {
      expect(NumberQuestion.prototype.truncateNumber('abc', 0)).to.equal('');
    });

    it('- is allowed as the first character', () => {
      expect(NumberQuestion.prototype.truncateNumber('-', 0)).to.equal('-');
      expect(NumberQuestion.prototype.truncateNumber('-', 1)).to.equal('-');
      expect(NumberQuestion.prototype.truncateNumber('-', 2)).to.equal('-');
      expect(NumberQuestion.prototype.truncateNumber('-', 3)).to.equal('-');
      expect(NumberQuestion.prototype.truncateNumber('-', 4)).to.equal('-');
      expect(NumberQuestion.prototype.truncateNumber('-', 5)).to.equal('-');
      expect(NumberQuestion.prototype.truncateNumber('-0', 1)).to.equal('-0');
      expect(NumberQuestion.prototype.truncateNumber('-0', 2)).to.equal('-0');
      expect(NumberQuestion.prototype.truncateNumber('-0', 3)).to.equal('-0');
      expect(NumberQuestion.prototype.truncateNumber('-0', 4)).to.equal('-0');
      expect(NumberQuestion.prototype.truncateNumber('-0', 5)).to.equal('-0');
    });

    describe('0 decimal places allowed', () => {
      it('input: "1", return: "1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1', 0)).to.equal('1');
      });

      it('input: "1.", return: "1."', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.', 0)).to.equal('1');
      });

      it('input: "1.0", return: "1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.0', 0)).to.equal('1');
      });

      it('input: "0", return: "0"', () => {
        expect(NumberQuestion.prototype.truncateNumber('0', 0)).to.equal('0');
      });

      it('input: "23", return: "23"', () => {
        expect(NumberQuestion.prototype.truncateNumber('23', 0)).to.equal('23');
      });

      it('input: "1..", return: "1."', () => {
        expect(NumberQuestion.prototype.truncateNumber('1..', 0)).to.equal('1.');
      });

      it('input: ".", return: ""', () => {
        expect(NumberQuestion.prototype.truncateNumber('.', 0)).to.equal('');
      });

      it('input: ".1", return: ""', () => {
        expect(NumberQuestion.prototype.truncateNumber('.1', 0)).to.equal('');
      });
    });

    describe('1 decimal places allowed', () => {
      it('input: "1", return: "1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1', 1)).to.equal('1');
      });

      it('input: "1.", return: "1."', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.', 1)).to.equal('1.');
      });

      it('input: "1.1", return: "1.1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.1', 1)).to.equal('1.1');
      });

      it('input: "1.0", return: "1.0"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.0', 1)).to.equal('1.0');
      });

      it('input: "1.10", return: "1.10"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.10', 1)).to.equal('1.1');
      });

      it('input: "1.11", return: "1.1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.11', 1)).to.equal('1.1');
      });

      it('input: "1.101", return: "1.1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.101', 1)).to.equal('1.1');
      });

      it('input: "1..", return: "1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1..', 1)).to.equal('1.');
      });

      it('input: ".1", return: ".1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('.1', 1)).to.equal('.1');
      });
    });

    describe('2 decimal places allowed', () => {
      it('input: "1", return: "1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1', 2)).to.equal('1');
      });

      it('input: "1.", return: "1."', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.', 2)).to.equal('1.');
      });

      it('input: "1.1", return: "1.1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.1', 2)).to.equal('1.1');
      });

      it('input: "1.10", return: "1.10"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.10', 2)).to.equal('1.10');
      });

      it('input: "1.101", return: "1.10"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.101', 2)).to.equal('1.10');
      });

      it('input: "1.111", return: "1.11"', () => {
        expect(NumberQuestion.prototype.truncateNumber('1.111', 2)).to.equal('1.11');
      });

      it('input: "1..", return: "1."', () => {
        expect(NumberQuestion.prototype.truncateNumber('1..', 2)).to.equal('1.');
      });

      it('input: ".1", return: ".1"', () => {
        expect(NumberQuestion.prototype.truncateNumber('.1', 2)).to.equal('.1');
      });
    });
  });
});
