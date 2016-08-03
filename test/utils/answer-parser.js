import answerParser from '../../src/utils/answer-parser';
import { expect } from 'chai';

describe('answer-parser', function () {
  var qId = 1; // dummy question ID

  describe('address', function () {
    var qType = 900;

    it('returns empty string for unanswered question', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          add1: '',
          add2: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        {
          add1: '',
          add2: '',
          city: ''
        }
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with question type, id, answers', function () {
      var possibleAnswers = [
        {
          add1: 'address 1',
          add2: 'address 2',
          city: 'city',
          state: 'state',
          zip: 'zip',
          country: 'country'
        },
        {
          add1: 'address 1',
          add2: '',
          city: '',
          state: '',
          zip: '',
          country: undefined
        },
        {
          add1: 'address 1',
          add2: 'address 2'
        }
      ];

      var expected = [
        `<answer qID='${qId}' qType='${qType}'><add1>address 1</add1><add2>address 2</add2><city>city</city><state>state</state><zip>zip</zip><country>country</country></answer>`,

        `<answer qID='${qId}' qType='${qType}'><add1>address 1</add1></answer>`,

        `<answer qID='${qId}' qType='${qType}'><add1>address 1</add1><add2>address 2</add2></answer>`
      ];
      possibleAnswers.map(function (answers, index) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal(expected[index]);
      });
    });
  });

  describe('date/time', function () {
    var qType = 1000;

    it('return empty string if no answer is given', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          dd: '',
          mm: '',
          yyyy: '',
          h: '',
          m: ''
        },
        {
          dd: '',
          mm: '',
          yyyy: ''
        },
        {
          h: '',
          m: ''
        }
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('return xml string with day, month, year, hours, minutes', function () {
      var possibleAnswers = [
        {
          dd: 1,
          mm: 2,
          yyyy: 2016,
          h: '',
          m: ''
        },
        {
          dd: 1,
          mm: 2,
          yyyy: 2016,
          h: 11,
          m: 13
        },
        {
          yyyy: undefined,
          h: 11,
          m: 13
        }
      ];

      var expected = [
        `<answer qID='${qId}' qType='${qType}'><dd>1</dd><mm>2</mm><yyyy>2016</yyyy></answer>`,

        `<answer qID='${qId}' qType='${qType}'><dd>1</dd><mm>2</mm><yyyy>2016</yyyy><h>11</h><m>13</m></answer>`,

        `<answer qID='${qId}' qType='${qType}'><h>11</h><m>13</m></answer>`
      ];

      possibleAnswers.map(function (answers, index) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal(expected[index]);
      });
    });
  });

  describe('email', function () {
    var qType = 1400;

    it('returns empty is no answer is given', function () {
      var possibleAnswers = [
        undefined,
        {
          value: ''
        },
        {}
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with email field if answer given', function () {
      var answer = { value: 'email@example.com' };
      var result = answerParser.getAnswerXml(qId, qType, answer);
      expect(result).to.equal(`<answer qID='${qId}' qType='${qType}'><value>email@example.com</value></answer>`);
    });
  });

  describe('free text', function () {
    var qType = 200; // 200 is for multiline, 100 is for single line

    it('returns empty is no answer is given', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          value: ''
        }
      ];

      possibleAnswers.map(function (answer) {
        var result = answerParser.getAnswerXml(qId, qType, answer);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with email field if answer given', function () {
      var answer = { value: 'Some text.' };
      var result = answerParser.getAnswerXml(qId, qType, answer);
      expect(result).to.equal(`<answer qID='${qId}' qType='${qType}'><value>Some text.</value></answer>`);
    });
  });

  describe('matrix', function () {
    var qType = 1200;
    it('returns empty is no answer is given', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          123: []
        }
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with options, question id, type', function () {
      var possibleAnswers = [
        {
          123: [1, 2, 3],
          124: [1],
          125: []
        },
        {
          123: [1,2,3],
          124: undefined
        }
      ];

      var expected = [
        `<answer qID='${qId}' qType='${qType}'><options><option rowID='123' colID='1,2,3'/><option rowID='124' colID='1'/></options></answer>`,

        `<answer qID='${qId}' qType='${qType}'><options><option rowID='123' colID='1,2,3'/></options></answer>`
      ];

      possibleAnswers.map(function (answers, index) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal(expected[index]);
      });
    });
  });

  describe('multiple choice', function () {
    var qType = 400;

    it('returns empty if no answers given', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          selectedAnswers: []
        },
        {
          selectedAnswers: undefined,
          otherText: '',
          commentText: ''
        },
        {
          otherText: undefined,
          commentText: undefined
        }
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with question id, type, answers', function () {
      var possibleAnswers = [
        {
          selectedAnswers: [-1],
          otherText: 'another',
          commentText: 'comment'
        },
        {
          selectedAnswers: [1,2,3]
        },
        {
          selectedAnswers: [1]
        },
        {
          selectedAnswers: [1, 2, -1],
          otherText: 'another'
        },
        {
          selectedAnswers: [1, 2],
          commentText: 'comment'
        }
      ];

      var expected = [
        `<answer qID='${qId}' qType='${qType}'><options><otherText>another</otherText><commentText>comment</commentText><option oID='-1'/></options></answer>`,

        `<answer qID='${qId}' qType='${qType}'><options><option oID='1,2,3'/></options></answer>`,

        `<answer qID='${qId}' qType='${qType}'><options><option oID='1'/></options></answer>`,

        `<answer qID='${qId}' qType='${qType}'><options><otherText>another</otherText><option oID='1,2,-1'/></options></answer>`,

        `<answer qID='${qId}' qType='${qType}'><options><commentText>comment</commentText><option oID='1,2'/></options></answer>`
      ];

      possibleAnswers.map(function (answers, index) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal(expected[index]);
      });
    });
  });

  describe('name', function () {
    var qType = 800;

    it('returns empty if no answers given', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          title: '',
          firstName: '',
          lastName: '',
          suffix: ''
        },
        {
          firstName: '',
          lastName: undefined
        }
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with question id, type, answers', function () {
      var possibleAnswers = [
        {
          title: 'mr',
          firstName: 'first',
          lastName: 'last',
          suffix: 'jr'
        },
        {
          firstName: 'first',
          lastName: ''
        }
      ];

      var expected = [
        `<answer qID='${qId}' qType='${qType}'><title>mr</title><firstName>first</firstName><lastName>last</lastName><suffix>jr</suffix></answer>`,

        `<answer qID='${qId}' qType='${qType}'><firstName>first</firstName></answer>`
      ];

      possibleAnswers.map(function (answers, index) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal(expected[index]);
      });
    });
  });

  describe('number', function () {
    var qType = 1100;

    it('returns empty if no answers given', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          number: ''
        },
        {
          number: undefined
        }
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with question id, type, answers', function () {
      var possibleAnswers = [
        {
          number: 123
        },
        {
          number: -1
        },
        {
          number: -1.3
        }
      ];

      var expected = [
        `<answer qID='${qId}' qType='${qType}'><number>123</number></answer>`,

        `<answer qID='${qId}' qType='${qType}'><number>-1</number></answer>`,

        `<answer qID='${qId}' qType='${qType}'><number>-1.3</number></answer>`
      ];

      possibleAnswers.map(function (answers, index) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal(expected[index]);
      });
    });
  });

  describe('phone number', function () {
    var qType = 950; // eslint-disable-line no-unused-vars

    it('returns empty if no answers given', function () {
      var possibleAnswers = [
        {},
        undefined,
        {
          raw: ''
        },
        {
          raw: '',
          countryCode: ''
        }
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with question id, type, answers', function () {
      var possibleAnswers = [
        {
          raw: '1234'
        },
        {
          raw: '1234',
          country: 'US'
        }
      ];

      var expected = [
        `<answer qID='${qId}' qType='${qType}'><raw>1234</raw></answer>`,
        `<answer qID='${qId}' qType='${qType}'><raw>1234</raw><country>US</country></answer>`
      ];

      possibleAnswers.map(function (answers, index) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal(expected[index]);
      });
    });
  });

  describe('rank', function () {
    var qType = 1300;

    it('returns empty if no answers given', function () {
      var possibleAnswers = [
        {},
        undefined
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with question id, type, answers', function () {
      var answers =
        [
          { id: 1, text: 'Skiing' },
          { id: 2, text: 'Skating' },
          { id: 3, text: 'Snowboarding' },
          { id: 4, text: 'Hockey' }
        ];

      var expected = `<answer qID='${qId}' qType='${qType}'><rank>1,2,3,4</rank></answer>`;

      var result = answerParser.getAnswerXml(qId, qType, answers);
      expect(result).to.equal(expected);
    });
  });

  describe('url', function () {
    var qType = 1500;

    it('returns empty if no answers given', function () {
      var possibleAnswers = [
        undefined,
        {
          value: ''
        },
        {}
      ];

      possibleAnswers.map(function (answers) {
        var result = answerParser.getAnswerXml(qId, qType, answers);
        expect(result).to.equal('');
      });
    });

    it('returns xml string with question id, type, answers', function () {
      var answer = { value: 'www.example.com' };
      var result = answerParser.getAnswerXml(qId, qType, answer);
      expect(result).to.equal(`<answer qID='${qId}' qType='${qType}'><value>www.example.com</value></answer>`);
    });
  });

  describe('html snippet, custom questions, page header', function () {
    it('returns empty string', function () {
      var qTypes = [2000, 1900];
      var possibleAnswers = [{}, undefined];

      qTypes.map(function (qType) {
        possibleAnswers.map(function (answers) {
          var result = answerParser.getAnswerXml(qId, qType, answers);
          expect(result).to.equal('');
        });
      });
    });
  });

});
