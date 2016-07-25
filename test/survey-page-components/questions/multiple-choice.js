import { expect } from 'chai';
import { ListView } from 'react-native';
import MultipleChoice from '../../../src/survey-page-components/questions/multiple-choice';
import qs from '../../../test-data/multiple-choice-xml';
import Question from '../../../src/survey-page-components/question';
import React from 'react';
import { shallow } from 'enzyme';
import TextField from '../../../src/survey-page-components/elements/text-field';

describe('<MultipleChoice />', () => {
  describe('Displays', () => {
    it('shows 1 ListView', () => {
      var qProps = Question.prototype.getMultipleChoiceProps(qs.asEntered);
      var wrapper = shallow(<MultipleChoice {...qProps}/>);
      expect(wrapper.find(ListView)).to.have.length(1);
    });

    it('shows a TextField for other choice when selected', () => {
      var qProps = Question.prototype.getMultipleChoiceProps(qs.withOtherChoice);
      var wrapper = shallow(<MultipleChoice {...qProps}/>);
      expect(wrapper.find(TextField)).to.have.length(0);

      wrapper.setState({
        inputs: {
          selectedAnswers: [-1]
        }
      });
      var textFieldWrapper = wrapper.find(TextField);
      expect(textFieldWrapper).to.have.length(1);
      expect(textFieldWrapper.prop('name')).to.equal('otherOption');
    });

    it('shows a TextField for user comments', () => {
      var qProps = Question.prototype.getMultipleChoiceProps(qs.withComment);
      var wrapper = shallow(<MultipleChoice {...qProps}/>);
      expect(wrapper.find(TextField)).to.have.length(1);
      expect(wrapper.find(TextField).prop('name')).to.equal('userComments');
    });
  });

  describe('getError()', () => {
    var errors = {
      mandatory: 'This is a mandatory question.',
      toofew: 'You need to select more choices',
      toomany: 'You have selected too many choices',
      otheroption: 'Please provide the other option description'
    };

    describe('too few error: show when too few choices selected', () => {
      it('for mandatory question', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.twoToFourChoicesAllowed);
        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: [1]
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.toofew);
      });

      it('for non-mandatory question', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.fakeNotMandatoryMinNumber); // fake: currently, Polldaddy.com always marks questions as mandatory when they have a minimum number set
        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: [1]
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.toofew);
      });
    });

    describe('too many error: show when too many choices selected', () => {
      it('for mandatory question', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.twoToFourChoicesAllowed); // fake:  currently, it's not possible to select more than the max number of answers in the UI
        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: [1,2,3,4,5]
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.toomany);
      });

      it('for non-mandatory question', () => {
        // fake 1: currently, it's not possible to select more than the max number of answers in the UI
        // fake 2: Polldaddy.com always marks questions as mandatory when they have a minimum number set

        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.fakeNotMandatoryMinNumber);
        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: [1,2,3,4,5]
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.toomany);
      });
    });

    describe('other option text error: show when other option selected, but not text entered', () => {
      it('for mandatory question', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.withOtherChoiceNotMand);

        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: [-1]
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.otheroption);
      });

      it('for non-mandatory question', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.withOtherChoiceMand);

        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: [-1]
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.otheroption);
      });
    });

    describe('mandatory error', () => {
      it('shown for mandatory question, shown when no choices selected', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.withoutCommentMand);

        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: []
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.mandatory);
      });

      it('shown for mandatory question, shown when no choices selected and no comments entered', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.withCommentMand);

        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: []
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(errors.mandatory);
      });

      it('not shown for non-mandatory question with comments', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.withComment);

        var inputsArray = [
          {
            userComments: '',
            otherOption: '',
            selectedAnswers: []
          },
          {
            userComments: '',
            otherOption: '',
            selectedAnswers: undefined
          }
        ];
        inputsArray.map(function (inputs) {
          var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
          expect(result).to.equal(false);
        });
      });

      it('not shown for non-mandatory question with comments', () => {
        var qProps = Question.prototype.
          getMultipleChoiceProps(qs.withoutComment);

        var inputs = {
          userComments: '',
          otherOption: '',
          selectedAnswers: []
        };
        var result = MultipleChoice.prototype.getError(qProps, inputs, errors);
        expect(result).to.equal(false);
      });
    });
  });
});
