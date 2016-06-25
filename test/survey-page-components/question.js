import Address from '../../src/survey-page-components/questions/address';
import DateTime from '../../src/survey-page-components/questions/date-time';
import Email from '../../src/survey-page-components/questions/email';
import { expect } from 'chai';
import FileUpload from '../../src/survey-page-components/questions/file-upload';
import FreeText from '../../src/survey-page-components/questions/free-text';
import HtmlSnippet from '../../src/survey-page-components/questions/html-snippet';
import Matrix from '../../src/survey-page-components/questions/matrix';
import MultipleChoice from '../../src/survey-page-components/questions/multiple-choice';
import Name from '../../src/survey-page-components/questions/name';
import NumberQuestion from '../../src/survey-page-components/questions/number';
import numberQuestions from '../../test-data/number-question-xml';
import PageHeader from '../../src/survey-page-components/questions/page-header';
import PhoneNumber from '../../src/survey-page-components/questions/phone-number';
import questions from '../../test-data/questions-xml';
import Rank from '../../src/survey-page-components/questions/rank';
import React from 'react';
import { shallow } from 'enzyme';
import { Text } from 'react-native';
import Url from '../../src/survey-page-components/questions/url';

describe('<Question />', () => {
  var Question = require('../../src/survey-page-components/question');
  it('exists', () => {
    expect(Question).not.to.be.undefined;
  });

  describe('note', () => {
    it('is displayed when question has note', () => {
      var wrapper = shallow(<Question question={questions.withNote} />);
      expect(wrapper.containsMatchingElement(
        <Text>This is a note</Text>
      )).to.equal(true);
    });
    // pending - wait until the note is displayed using an HTML component
    it('is not displayed when question does not have note');
  });

  describe('mandatory * indicator', () => {
    it('is displayed when question is mandatory', () => {
      var wrapper = shallow(<Question question={questions.mandatory} />);
      expect(wrapper.containsMatchingElement(
        <Text>*</Text>
      )).to.equal(true);
    });
    it('is not displayed when question is not mandatory', () => {
      var wrapper = shallow(<Question question={questions.notMandatory} />);
      expect(wrapper.containsMatchingElement(
        <Text>*</Text>
      )).to.equal(false);
    });
  });

  describe('correctly displays', () => {
    describe('address', () => {
      var wrapper = shallow(<Question question={questions.address} />);
      it('with the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Address</Text>
        )).to.equal(true);
      });
      it('with <Address />', () => {
        expect(wrapper.containsMatchingElement(
          <Address />
        )).to.equal(true);
      });
    });

    describe('date/time', () => {
      var wrapper = shallow(<Question question={questions.dateTime} />);
      it('with the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Date/Time</Text>
        )).to.equal(true);
      });
      it('with <DateTime />', () => {
        expect(wrapper.containsMatchingElement(
          <DateTime />
        )).to.equal(true);
      });
    });

    describe('email', () => {
      var wrapper = shallow(<Question question={questions.email} />);
      it('with the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Email address</Text>
        )).to.equal(true);
      });
      it('with <Email />', () => {
        expect(wrapper.containsMatchingElement(
          <Email />
        )).to.equal(true);
      });
    });

    describe('file upload', () => {
      var wrapper = shallow(<Question question={questions.fileUpload} />);
      it('with the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>File upload</Text>
        )).to.equal(true);
      });
      it('with <FileUpload />', () => {
        expect(wrapper.containsMatchingElement(
          <FileUpload />
        )).to.equal(true);
      });
    });

    describe('free text', () => {
      var wrapper = shallow(<Question question={questions.freeText} />);
      it('with the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Free text</Text>
        )).to.equal(true);
      });
      it('with <FreeText />', () => {
        expect(wrapper.containsMatchingElement(
          <FreeText />
        )).to.equal(true);
      });
    });

    describe('HTML snippet', () => {
      var wrapper = shallow(<Question question={questions.htmlSnippet} />);
      it('does not display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Please enter your question here.</Text>
        )).to.equal(false);
      });
      it('with <HtmlSnippet />', () => {
        expect(wrapper.containsMatchingElement(
          <HtmlSnippet />
        )).to.equal(true);
      });
    });

    describe('matrix', () => {
      var wrapper = shallow(<Question question={questions.matrix} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Matrix/Likert</Text>
        )).to.equal(true);
      });
      it('with <Matrix />', () => {
        expect(wrapper.containsMatchingElement(
          <Matrix />
        )).to.equal(true);
      });
    });

    describe('multiple choice', () => {
      var wrapper = shallow(<Question question={questions.multipleChoice} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Multiple Choice</Text>
        )).to.equal(true);
      });
      it('with <MultipleChoice />', () => {
        expect(wrapper.containsMatchingElement(
          <MultipleChoice />
        )).to.equal(true);
      });
    });

    describe('name', () => {
      var wrapper = shallow(<Question question={questions.name} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Name</Text>
        )).to.equal(true);
      });
      it('with <Name />', () => {
        expect(wrapper.containsMatchingElement(
          <Name />
        )).to.equal(true);
      });
    });

    describe('number', () => {
      var wrapper = shallow(<Question question={questions.numberQuestion} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Number Question</Text>
        )).to.equal(true);
      });
      it('with <Number />', () => {
        expect(wrapper.containsMatchingElement(
          <NumberQuestion />
        )).to.equal(true);
      });
    });

    describe('page header', () => {
      var wrapper = shallow(<Question question={questions.pageHeader} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Page Header</Text>
        )).to.equal(true);
      });
      it('with <PageHeader />', () => {
        expect(wrapper.containsMatchingElement(
          <PageHeader />
        )).to.equal(true);
      });
    });

    describe('phone number', () => {
      var wrapper = shallow(<Question question={questions.phoneNumber} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Phone number</Text>
        )).to.equal(true);
      });
      it('with <PhoneNumber />', () => {
        expect(wrapper.containsMatchingElement(
          <PhoneNumber />
        )).to.equal(true);
      });
    });

    describe('rank', () => {
      var wrapper = shallow(<Question question={questions.rank} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>Rank</Text>
        )).to.equal(true);
      });
      it('with <Rank />', () => {
        expect(wrapper.containsMatchingElement(
          <Rank />
        )).to.equal(true);
      });
    });

    describe('url', () => {
      var wrapper = shallow(<Question question={questions.url} />);
      it('does display the title', () => {
        expect(wrapper.containsMatchingElement(
          <Text>URL</Text>
        )).to.equal(true);
      });
      it('with <Url />', () => {
        expect(wrapper.containsMatchingElement(
          <Url />
        )).to.equal(true);
      });
    });
  });

  describe('getNumberProps', () => {
    describe('decimalPlaces', () => {
      var result = Question.prototype.getNumberProps(
        numberQuestions.decimalPlaces).decimalPlaces;

      it('returns num decimal places entered by user', () => {
        expect(result).to.equal(1);
      });

      it('has type number', () => {
        expect(typeof result).to.equal('number');
      });
    });

    describe('labelValue', () => {
      it('returns the label value as sent', () => {
        var result = Question.prototype.getNumberProps(
          numberQuestions.withLabel).labelValue;
        expect(result).to.equal('$');
      });
    });

    describe('labelPosition', () => {
      it('returns "none" if value 0 was received', () => {
        var result = Question.prototype.getNumberProps(
          numberQuestions.labelPositionNone).labelPosition;
        expect(result).to.equal('none');
      });

      it('returns "before" if value 1 was received', () => {
        var result = Question.prototype.getNumberProps(
          numberQuestions.labelPositionBefore).labelPosition;
        expect(result).to.equal('before');
      });

      it('returns "after" if value 2 was received', () => {
        var result = Question.prototype.getNumberProps(
          numberQuestions.labelPositionAfter).labelPosition;
        expect(result).to.equal('after');
      });
    });

    describe('for slider type', () => {
      describe('defaultValue', () => {
        it('is set to the user-entered default if entered', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderDefaultValueSet).defaultValue;
          expect(result).to.equal(2);
        });

        it('is set to the minimum value if not entered by user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderDefaultValueNotSet).defaultValue;
          expect(result).to.equal(10);
        });

        it('has type number', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderDefaultValueSet).defaultValue;
          expect(typeof result).to.equal('number');
        });
      });

      describe('min', () => {
        it('is set to the minimum set by ther user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderMinSet).min;
          expect(result).to.equal(10);
        });

        it('is set to 0 if not entered by user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderMinNotSet).min;
          expect(result).to.equal(0);
        });

        it('has type number', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderMinSet).min;
          expect(typeof result).to.equal('number');
        });
      });

      describe('max', () => {
        it('is set to the minimum set by ther user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderMaxSet).max;
          expect(result).to.equal(30);
        });

        it('is set to 0 if not entered by user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderMaxNotSet).max;
          expect(result).to.equal(1);
        });

        it('has type number', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.sliderMaxSet).max;
          expect(typeof result).to.equal('number');
        });
      });

      describe('isSlider', () => {
        var result = Question.prototype.getNumberProps(
          numberQuestions.sliderMaxSet).isSlider;

        it('is set to true', () => {
          expect(result).to.equal(true);
        });

        it('has type boolean', () => {
          expect(typeof result).to.equal('boolean');
        });
      });
    });

    describe('for input/not-slider type', () => {
      describe('defaultValue', () => {
        it('is set to the user-entered default if entered', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.inputDefaultValueSet).defaultValue;
          expect(result).to.equal(2);
          expect(typeof result).to.equal('number');
        });

        it('is set to empty string if no default is entered by user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.inputDefaultValueNotSet).defaultValue;
          expect(result).to.equal('');
        });
      });

      describe('min', () => {
        it('is set to the user-entered default if entered', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.inputMinSet).min;
          expect(result).to.equal(10);
          expect(typeof result).to.equal('number');
        });

        it('is set to empty string if no default is entered by user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.inputMinNotSet).min;
          expect(result).to.equal('');
          expect(typeof result).to.equal('string');
        });
      });

      describe('max', () => {
        it('is set to the user-entered default if entered', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.inputMaxSet).max;
          expect(result).to.equal(30);
          expect(typeof result).to.equal('number');
        });

        it('is set to empty string if no default is entered by user', () => {
          var result = Question.prototype.getNumberProps(
            numberQuestions.inputMaxNotSet).max;
          expect(result).to.equal('');
          expect(typeof result).to.equal('string');
        });
      });

      describe('isSlider', () => {
        var result = Question.prototype.getNumberProps(
          numberQuestions.inputMaxSet).isSlider;

        it('is set to false', () => {
          expect(result).to.equal(false);
        });

        it('has type boolean', () => {
          expect(typeof result).to.equal('boolean');
        });
      });
    });
  });
});
