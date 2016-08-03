import DateTime from '../../../src/survey-page-components/questions/date-time';
import { expect } from 'chai';
import questions from '../../../test-data/date-time-question-xml';
import React from 'react';
import { shallow } from 'enzyme';
import { TouchableWithoutFeedback } from 'react-native';

var errors = {
  mandatory: 'This is a mandatory question.'
};

describe('<DateTime />', () => {
  describe('displays', () => {
    it('only date', () => {
      var wrapper = shallow(<DateTime question={questions.mandatoryOnlyDateAsked} />);
      expect(wrapper.find(TouchableWithoutFeedback)).to.have.length(1);
    });

    it('only time', () => {
      var wrapper = shallow(<DateTime question={questions.mandatoryOnlyTimeAsked} />);
      expect(wrapper.find(TouchableWithoutFeedback)).to.have.length(1);
    });

    it('both date and time', () => {
      var wrapper = shallow(<DateTime question={questions.mandatoryDateAndTimeAsked} />);
      expect(wrapper.find(TouchableWithoutFeedback)).to.have.length(2);
    });
  });

  describe('getFormattedDateText()', () => {
    it('returns a string with the date when given year, month, day', () => {
      expect(DateTime.prototype.getFormattedDateText(2016, 6, 9))
        .to.equal('July 9, 2016');
    });

    it('when not given year, month, day, returns string asking user to enter date', () => {
      expect(DateTime.prototype.getFormattedDateText())
        .to.equal('Select a date');
    });

    it('when given empty strings, returns string asking user to enter date', () => {
      expect(DateTime.prototype.getFormattedDateText('', '', ''))
        .to.equal('Select a date');
    });
  });

  describe('getFormattedTimeText()', () => {
    it('returns a string with the formatted time when given hour, minute', () => {
      expect(DateTime.prototype.getFormattedTimeText(12, 0))
        .to.equal('12:00');
      expect(DateTime.prototype.getFormattedTimeText(0, 0))
        .to.equal('00:00');
      expect(DateTime.prototype.getFormattedTimeText(1, 54))
        .to.equal('01:54');
    });

    it('when not given hour or minute, returns string asking user to enter date', () => {
      expect(DateTime.prototype.getFormattedTimeText())
        .to.equal('Select a time');
    });

    it('when given empty strings, returns string asking user to enter date', () => {
      expect(DateTime.prototype.getFormattedTimeText('', ''))
        .to.equal('Select a time');
    });
  });

  describe('shouldShowTime()', () => {
    it('should return true when type is 0, 1, 4', () => {
      expect(DateTime.prototype.shouldShowTime(questions.type0))
        .to.equal(true);
      expect(DateTime.prototype.shouldShowTime(questions.type1))
        .to.equal(true);
      expect(DateTime.prototype.shouldShowTime(questions.type4))
        .to.equal(true);
    });

    it('should return false when type is 2,3', () => {
      expect(DateTime.prototype.shouldShowTime(questions.type2))
        .to.equal(false);
      expect(DateTime.prototype.shouldShowTime(questions.type3))
        .to.equal(false);
    });
  });

  describe('shouldShowDate()', () => {
    it('should return true when type is 0, 1, 2, or 3', () => {
      expect(DateTime.prototype.shouldShowDate(questions.type0))
        .to.equal(true);
      expect(DateTime.prototype.shouldShowDate(questions.type1))
        .to.equal(true);
      expect(DateTime.prototype.shouldShowDate(questions.type2))
        .to.equal(true);
      expect(DateTime.prototype.shouldShowDate(questions.type3))
        .to.equal(true);
    });

    it('should return false when type is 4', () => {
      expect(DateTime.prototype.shouldShowDate(questions.type4))
        .to.equal(false);
    });
  });

  describe('getError()', () => {
    describe('when mandatory', () => {
      describe('and both time and date are asked', () => {
        it('returns false when both fields are filled', () => {
          var inputs = {
            dd: '1',
            mm: '10',
            yyyy: '2016',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 10, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns a mandatory error when date is not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(errors.mandatory);
        });

        it('returns a mandatory error when time is not filled', () => {
          var inputs = {
            dd: '1',
            mm: '10',
            yyyy: '2016',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 10, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(errors.mandatory);
        });

        it('returns a mandatory error when both are not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(errors.mandatory);
        });
      });

      describe('and only date is asked', () => {
        it('returns mandatory error when date is not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryOnlyDateAsked, inputs, errors))
            .to.equal(errors.mandatory);
        });

        it('returns false when date is filled', () => {
          var inputs = {
            dd: '1',
            mm: '10',
            yyyy: '2016',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 10, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryOnlyDateAsked, inputs, errors))
            .to.equal(false);
        });
      });

      describe('and only time is asked', () => {
        it('returns mandatory error when time is not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryOnlyTimeAsked, inputs, errors))
            .to.equal(errors.mandatory);
        });

        it('returns false when time is filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.mandatoryOnlyTimeAsked, inputs, errors))
            .to.equal(false);
        });
      });
    });

    describe('when not mandatory', () => {
      describe('and both time and date are asked', () => {
        it('returns false when both fields are filled', () => {
          var inputs = {
            dd: '1',
            mm: '1',
            yyyy: '2016',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 1, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when time is not filled', () => {
          var inputs = {
            dd: '1',
            mm: '1',
            yyyy: '2016',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 1, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when date is not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when both fields are not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryDateAndTimeAsked, inputs, errors))
            .to.equal(false);
        });
      });

      describe('and only date is asked', () => {
        it('returns false when both fields are filled', () => {
          var inputs = {
            dd: '1',
            mm: '1',
            yyyy: '2016',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 1, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyDateAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when time is not filled', () => {
          var inputs = {
            dd: '1',
            mm: '1',
            yyyy: '2016',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 1, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyDateAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when date is not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyDateAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when both fields are not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyDateAsked, inputs, errors))
            .to.equal(false);
        });
      });

      describe('and only time is asked', () => {
        it('returns false when both fields are filled', () => {
          var inputs = {
            dd: '1',
            mm: '1',
            yyyy: '2016',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 1, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyTimeAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when time is not filled', () => {
          var inputs = {
            dd: '1',
            mm: '1',
            yyyy: '2016',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(2016, 1, 1),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyTimeAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when date is not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '1',
            m: '2',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText(1, 2)
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyTimeAsked, inputs, errors))
            .to.equal(false);
        });

        it('returns false when both fields are not filled', () => {
          var inputs = {
            dd: '',
            mm: '',
            yyyy: '',
            h: '',
            m: '',
            formattedDate: DateTime.prototype.getFormattedDateText(),
            formattedTime: DateTime.prototype.getFormattedTimeText()
          };

          expect(DateTime.prototype.getError(
            questions.notMandatoryOnlyTimeAsked, inputs, errors))
            .to.equal(false);
        });
      });
    });
  });
});
