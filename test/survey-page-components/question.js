import _ from 'lodash';
import Address from '../../src/survey-page-components/questions/address';
import DateTime from '../../src/survey-page-components/questions/date-time';
import Email from '../../src/survey-page-components/questions/email';
import { expect } from 'chai';
import FileUpload from '../../src/survey-page-components/questions/file-upload';
import FreeText from '../../src/survey-page-components/questions/free-text';
import Html from '../../src/survey-page-components/elements/html';
import HtmlSnippet from '../../src/survey-page-components/questions/html-snippet';
import Matrix from '../../src/survey-page-components/questions/matrix';
import matrixQ from '../../test-data/matrix-xml';
import mcQuestions from '../../test-data/multiple-choice-xml';
import MultipleChoice from '../../src/survey-page-components/questions/multiple-choice';
import Name from '../../src/survey-page-components/questions/name';
import NumberQuestion from '../../src/survey-page-components/questions/number';
import numberQuestions from '../../test-data/number-question-xml';
import PhoneNumber from '../../src/survey-page-components/questions/phone-number';
import questions from '../../test-data/questions-xml';
import Rank from '../../src/survey-page-components/questions/rank';
import rankQ from '../../test-data/rank-xml';
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
        <Html />
      )).to.equal(true);
    });
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

  describe('getMultipleChoiceProps()', () => {
    describe('max', () => {
      it('returns max = 1 when users allowed to choose one', () => {
        var questions = [mcQuestions.oneChoiceAllowedRadio,
          mcQuestions.oneChoiceAllowedList];

        questions.map(function (question) {
          var result = Question.prototype.getMultipleChoiceProps(question);
          expect(result.max).to.equal(1);
        });
      });

      it('returns the max set in limits', () => {
        var scenarios = [
          {
            q: mcQuestions.threeChoicesAllowedCheck,
            a: 3
          },
          {
            q: mcQuestions.threeChoicesAllowedList,
            a: 3
          },
          {
            q: mcQuestions.twoToFourChoicesAllowed,
            a: 4
          }
        ];

        scenarios.map(function (scenario) {
          var result = Question.prototype.getMultipleChoiceProps(scenario.q);
          expect(result.max).to.equal(scenario.a);
        });
      });
    });

    describe('min', () => {
      it('returns 0 if there is no limits tag sent', () => {
        var questions = [mcQuestions.oneChoiceAllowedRadio,
          mcQuestions.oneChoiceAllowedList];

        questions.map(function (question) {
          var result = Question.prototype.getMultipleChoiceProps(question);
          expect(result.min).to.equal(0);
        });
      });
      it('returns the min defined in the limits tag', () => {
        var scenarios = [
          {
            q: mcQuestions.threeChoicesAllowedCheck,
            a: 3
          },
          {
            q: mcQuestions.threeChoicesAllowedList,
            a: 3
          },
          {
            q: mcQuestions.twoToFourChoicesAllowed,
            a: 2
          },
          {
            q: mcQuestions.minSetToZero,
            a: 0
          }
        ];

        scenarios.map(function (scenario) {
          var result = Question.prototype.getMultipleChoiceProps(scenario.q);
          expect(result.min).to.equal(scenario.a);
        });
      });
    });

    describe('comments', () => {
      it('returns comment question text if user comments are allowed', () => {
        var result = Question.prototype
          .getMultipleChoiceProps(mcQuestions.withComment);
        expect(result.comments).to.equal('Please enter a comment here');
      });

      it('returns false for comments if comments are not allowed', () => {
        var result = Question.prototype
          .getMultipleChoiceProps(mcQuestions.withoutComment);
        expect(result.comments).to.equal(false);
      });
    });

    describe('correctAnswerId', () => {
      it('returns the answer Id set', () => {
        var result = Question.prototype
          .getMultipleChoiceProps(mcQuestions.asEntered);
        expect(result.correctAnswerId).to.equal(15961155);
      });
    });

    describe('answers', () => {
      it('returns the answers using getMultipleChoiceAnswerArray', () => {
        var result = Question.prototype
          .getMultipleChoiceProps(mcQuestions.asEntered);
        var answers = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.asEntered);
        expect(result.answers).to.eql(answers);
      });
    });

    describe('isMandatory', () => {
      it('returns true when the mandatory tag value is true', () => {
        var result = Question.prototype
          .getMultipleChoiceProps(mcQuestions.mandatory);
        expect(result.isMandatory).to.eql(true);
      });
      it('returns false when the mandatory tag value is false', () => {
        var result = Question.prototype
          .getMultipleChoiceProps(mcQuestions.notMandatory);
        expect(result.isMandatory).to.eql(false);
      });
    });
  });

  describe('getMultipleChoiceAnswerArray', () => {
    describe('with other option enabled', () => {
      it('will return an array with other option with id -1', () => {
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.withOtherChoice);
        var expected = [
          {
            id: 15961226,
            text: '1',
            selected: false
          },
          {
            id: 15961227,
            text: '2',
            selected: false
          },
          {
            id: -1,
            text: 'Other',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });
    });

    describe('answer order correct for', () => {
      it('as entered', () => {
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.asEntered);
        var expected = [
          {
            id: 15961155,
            text: 'zebra',
            selected: false
          },
          {
            id: 15961156,
            text: 'dragon',
            selected: false
          },
          {
            id: 15961157,
            text: 'elephant',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });

      it('A to Z', () => {
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.AtoZ);
        var expected = [
          {
            id: 15961156,
            text: 'dragon',
            selected: false
          },
          {
            id: 15961157,
            text: 'elephant',
            selected: false
          },
          {
            id: 15961155,
            text: 'zebra',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });

      it('Z to A', () => {
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.ZtoA);
        var expected = [
          {
            id: 15961155,
            text: 'zebra',
            selected: false
          },
          {
            id: 15961157,
            text: 'elephant',
            selected: false
          },
          {
            id: 15961156,
            text: 'dragon',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });

      it('random', () => {
        var shuffle = _.reverse;
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.random, shuffle);

        // expect the answers to appear in reverse order
        // due to our custom shuffle function
        var expected = [
          {
            id: 15961157,
            text: 'elephant',
            selected: false
          },
          {
            id: 15961156,
            text: 'dragon',
            selected: false
          },
          {
            id: 15961155,
            text: 'zebra',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });
    });

    describe('images correctly set', () => {
      it('if not image sent, returns an answer without image prop', () => {
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.withoutImages);
        var expected = [
          {
            id: 15961155,
            text: 'zebra',
            selected: false
          },
          {
            id: 15961156,
            text: 'dragon',
            selected: false
          },
          {
            id: 15961157,
            text: 'elephant',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });

      it('if library images sent, sets the image source as the prop', () => {
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.withImages);
        var expected = [
          {
            id: 15961218,
            text: 'with image',
            image: 'http://i1.wp.com/files.polldaddy.com/d3e86d5c1cb2a31aa01c83df946592ee-577c40e0e7ceb.jpg',
            selected: false
          },
          {
            id: 15961219,
            text: 'with image 2',
            image: 'http://i1.wp.com/files.polldaddy.com/d505868e0c297cc78ed917af90d0c521-577c4118eaae0.jpg',
            selected: false
          },
          {
            id: 15961220,
            text: 'no image',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });

      it('if non-library image sent, returns an answer without image prop', () => {
        var actual = Question.prototype
          .getMultipleChoiceAnswerArray(mcQuestions.withNonImageMedia);
        var expected = [
          {
            id: 15961212,
            text: 'embedded media',
            selected: false
          },
          {
            id: 15961213,
            text: 'no media',
            selected: false
          }
        ];
        expect(actual).to.eql(expected);
      });
    });
  });

  describe('getRankProps', () => {
    describe('answers array', () => {
      describe('images', () => {
        it('return media URL when library media is used in question', () => {
          var actual = Question.prototype.getRankProps(rankQ.withLibraryMedia);
          var expected = [
            {
              id: 521154,
              text: 'Zebra, with library media',
              image: 'file:///data/user/0/com.polldaddy/files/surveyImages/2300490/56220b276b87fc4ec430256e633bfe28-577c2a6ee63db.png'
            },
            {
              id: 521155,
              text: 'Dragon'
            },
            {
              id: 521156,
              text: 'Elephant'
            }
          ];
          expect(actual.answers).to.eql(expected);
        });

        it('returns no media URL when none is used in question', () => {
          var actual = Question.prototype.getRankProps(rankQ.asEntered);
          var expected = [
            {
              id: 521154,
              text: 'Zebra'
            },
            {
              id: 521155,
              text: 'Dragon'
            },
            {
              id: 521156,
              text: 'Elephant'
            }
          ];
          expect(actual.answers).to.eql(expected);
        });

        it('ignored embed media', () => {
          var actual = Question.prototype.getRankProps(rankQ.withEmbedMedia);
          var expected = [
            {
              id: 521154,
              text: 'Zebra'
            },
            {
              id: 521155,
              text: 'Dragon'
            },
            {
              id: 521156,
              text: 'Elephant with embed media'
            }
          ];
          expect(actual.answers).to.eql(expected);
        });
      });

      describe('answer order', () => {
        it('as entered', () => {
          var actual = Question.prototype.getRankProps(rankQ.asEntered);
          var expected = [
            {
              id: 521154,
              text: 'Zebra'
            },
            {
              id: 521155,
              text: 'Dragon'
            },
            {
              id: 521156,
              text: 'Elephant'
            }
          ];
          expect(actual.answers).to.eql(expected);
        });

        it('A-Z', () => {
          var actual = Question.prototype.getRankProps(rankQ.az);
          var expected = [
            {
              id: 521155,
              text: 'Dragon'
            },
            {
              id: 521156,
              text: 'Elephant'
            },
            {
              id: 521154,
              text: 'Zebra'
            }
          ];
          expect(actual.answers).to.eql(expected);
        });

        it('Z-A', () => {
          var actual = Question.prototype.getRankProps(rankQ.za);
          var expected = [
            {
              id: 521154,
              text: 'Zebra'
            },
            {
              id: 521156,
              text: 'Elephant'
            },
            {
              id: 521155,
              text: 'Dragon'
            }
          ];
          expect(actual.answers).to.eql(expected);
        });

        it('random', () => {
          var shuffle = _.reverse;
          var actual = Question.prototype.getRankProps(rankQ.random, shuffle);
          var expected = [
            {
              id: 521156,
              text: 'Elephant'
            },
            {
              id: 521155,
              text: 'Dragon'
            },
            {
              id: 521154,
              text: 'Zebra'
            }
          ];
          expect(actual.answers).to.eql(expected);
        });
      });
    });

    describe('isMandatory prop', () => {
      it('true when question is mandatory', () => {
        var actual = Question.prototype.getRankProps(rankQ.asEntered);
        expect(actual.isMandatory).to.eql(false);
      });

      it('false when question is not mandatory', () => {
        var actual = Question.prototype.getRankProps(rankQ.asEnteredMandatory);
        expect(actual.isMandatory).to.eql(true);
      });
    });

    describe('rows and columns', () => {
      it('returns rows using getMatrixOptions()', () => {
        var result = Question.prototype
          .getMatrixProps(matrixQ.standard);
        var answers = Question.prototype
          .getMatrixOptions(matrixQ.standard);

        expect(result.rows).to.eql(answers.rows);
        expect(result.columns).to.eql(answers.columns);
      });
    });
  });

  describe('getMatrixProps()', () => {
    describe('multipleChoicesAllowed', () => {
      it('returns false for elmType 0', () => {
        var actual = Question.prototype
          .getMatrixProps(matrixQ.elmType0);
        expect(actual.multipleChoicesAllowed).to.equal(false);
      });

      it('returns false for elmType 2', () => {
        var actual = Question.prototype
          .getMatrixProps(matrixQ.elmType2);
        expect(actual.multipleChoicesAllowed).to.equal(false);
      });

      it('returns true for elmType 1', () => {
        var actual = Question.prototype
          .getMatrixProps(matrixQ.elmType1);
        expect(actual.multipleChoicesAllowed).to.equal(true);
      });
    });

    it('isMandatory is equal to value of getIsMandatory()', () => {
      var actual = Question.prototype
        .getMatrixProps(matrixQ.standard);
      var isMandatory = Question.prototype
        .getIsMandatory(matrixQ.standard);
      expect(actual.isMandatory).to.equal(isMandatory);
    });

    it('rows and columns equal to value from getMatrixOptions', () => {
      var actual = Question.prototype
        .getMatrixProps(matrixQ.standard);
      var {rows, columns} = Question.prototype
        .getMatrixOptions(matrixQ.standard);
      expect(actual.rows).to.eql(rows);
      expect(actual.columns).to.eql(columns);
    });
  });

  describe('getMatrixOptions()', () => {
    it('returns rows and columns as arrays of objects', () => {
      var result = Question.prototype
        .getMatrixOptions(matrixQ.standard);

      var expected = {
        rows: [
          {
            id: 3555584,
            text: 'What?'
          },
          {
            id: 3555585,
            text: 'Something?'
          }
        ],
        columns: [
          {
            id: 3324137,
            text: 'This'
          },
          {
            id: 3324138,
            text: 'That'
          },
          {
            id: 3324139,
            text: 'Another'
          }
        ]
      };
      expect(result).to.eql(expected);
    });

    describe('order', () => {
      var shuffle = _.reverse;
      it('as entered: rows and columns', () => {
        var result = Question.prototype
          .getMatrixOptions(matrixQ.standard, shuffle);

        var expected = {
          rows: [
            {
              id: 3555584,
              text: 'What?'
            },
            {
              id: 3555585,
              text: 'Something?'
            }
          ],
          columns: [
            {
              id: 3324137,
              text: 'This'
            },
            {
              id: 3324138,
              text: 'That'
            },
            {
              id: 3324139,
              text: 'Another'
            }
          ]
        };
        expect(result).to.eql(expected);
      });

      it('rows: random', () => {
        var result = Question.prototype
          .getMatrixOptions(matrixQ.randomRows, shuffle);
        var expected = {
          rows: [
            {
              id: 3555585,
              text: 'Something?'
            },
            {
              id: 3555584,
              text: 'What?'
            }
          ],
          columns: [
            {
              id: 3324137,
              text: 'This'
            },
            {
              id: 3324138,
              text: 'That'
            },
            {
              id: 3324139,
              text: 'Another'
            }
          ]
        };
        expect(result).to.eql(expected);
      });

      it('columns: random', () => {
        var result = Question.prototype
          .getMatrixOptions(matrixQ.randomColumns, shuffle);
        var expected = {
          rows: [
            {
              id: 3555584,
              text: 'What?'
            },
            {
              id: 3555585,
              text: 'Something?'
            }
          ],
          columns: [
            {
              id: 3324139,
              text: 'Another'
            },
            {
              id: 3324138,
              text: 'That'
            },
            {
              id: 3324137,
              text: 'This'
            }
          ]
        };
        expect(result).to.eql(expected);
      });

      it('both rows and columns random', () => {
        var shuffle = _.reverse;
        var result = Question.prototype
          .getMatrixOptions(matrixQ.bothRandom, shuffle);
        var expected = {
          rows: [
            {
              id: 3555585,
              text: 'Something?'
            },
            {
              id: 3555584,
              text: 'What?'
            }
          ],
          columns: [
            {
              id: 3324139,
              text: 'Another'
            },
            {
              id: 3324138,
              text: 'That'
            },
            {
              id: 3324137,
              text: 'This'
            }
          ]
        };
        expect(result).to.eql(expected);
      });
    });
  });
});
