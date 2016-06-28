import { expect } from 'chai';
import questions from '../../../test-data/free-text-xml';
import React from 'react';
import { shallow } from 'enzyme';
import SingleFieldInput from '../../../src/survey-page-components/elements/single-line-field';

var errors = {
  mandatory: 'This is a mandatory question.'
};

describe('<FreeText />', () => {
  var FreeText = require('../../../src/survey-page-components/questions/free-text');

  describe('correctly displays', () => {
    it('single line', () => {
      var wrapperSingleLineSmall = shallow(<FreeText question={questions.mandatorySingleLineSmall} />);

      var wrapperSingleLineMedium = shallow(<FreeText question={questions.mandatorySingleLineSmall} />);

      var wrapperSingleLineLarge = shallow(<FreeText question={questions.mandatorySingleLineSmall} />);

      expect(wrapperSingleLineSmall.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperSingleLineSmall.find(SingleFieldInput)
          .prop('name')).to.equal('freeText');


      expect(wrapperSingleLineMedium.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperSingleLineMedium.find(SingleFieldInput)
          .prop('name')).to.equal('freeText');

      expect(wrapperSingleLineLarge.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperSingleLineLarge.find(SingleFieldInput)
          .prop('name')).to.equal('freeText');
    });

    it('single line password', () => {
      var wrapperPasswordSmall = shallow(<FreeText question={questions.mandatoryPasswordSmall} />);

      var wrapperPasswordMedium = shallow(<FreeText question={questions.mandatoryPasswordMedium} />);

      var wrapperPasswordLarge = shallow(<FreeText question={questions.mandatoryPasswordLarge} />);

      expect(wrapperPasswordSmall.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperPasswordSmall.find(SingleFieldInput)
        .prop('secureTextEntry')).to.equal(true);
      expect(wrapperPasswordSmall.find(SingleFieldInput)
        .prop('name')).to.equal('freeText');

      expect(wrapperPasswordMedium.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperPasswordMedium.find(SingleFieldInput)
        .prop('secureTextEntry')).to.equal(true);
      expect(wrapperPasswordMedium.find(SingleFieldInput)
          .prop('name')).to.equal('freeText');

      expect(wrapperPasswordLarge.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperPasswordLarge.find(SingleFieldInput)
        .prop('secureTextEntry')).to.equal(true);
      expect(wrapperPasswordLarge.find(SingleFieldInput)
          .prop('name')).to.equal('freeText');
    });

    it('multiline', () => {
      var wrapperMultiLineSmall = shallow(<FreeText question={questions.mandatoryMultiLineSmall} />);

      var wrapperMultiLineMedium = shallow(<FreeText question={questions.mandatoryMultiLineMedium} />);

      var wrapperMultiLineMedium = shallow(<FreeText question={questions.mandatoryMultiLineLarge} />);

      expect(wrapperMultiLineSmall.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperMultiLineSmall.find(SingleFieldInput)
        .prop('multiline')).to.equal(true);
      expect(wrapperMultiLineSmall.find(SingleFieldInput)
        .prop('name')).to.equal('freeText');

      expect(wrapperMultiLineMedium.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperMultiLineMedium.find(SingleFieldInput)
        .prop('multiline')).to.equal(true);
      expect(wrapperMultiLineMedium.find(SingleFieldInput)
          .prop('name')).to.equal('freeText');

      expect(wrapperMultiLineMedium.find(SingleFieldInput)).to.have.length(1);
      expect(wrapperMultiLineMedium.find(SingleFieldInput)
        .prop('multiline')).to.equal(true);
      expect(wrapperMultiLineMedium.find(SingleFieldInput)
          .prop('name')).to.equal('freeText');
    });
  });

  describe('getError()', () => {
    describe('for mandatory question', () => {
      it('returns false when input is not empty', () => {
        var result = FreeText.prototype.getError(questions.notMandatorySingleLineSmall,
          'Some text', errors);
        expect(result).to.equal(false);
      });

      it('returns a mandatry error when input empty', () => {
        var result = FreeText.prototype.getError(questions.notMandatorySingleLineSmall,
          '', errors);
        expect(result).to.equal(false);
      });
    });

    describe('for mandatory question', () => {
      it('returns false when input is not empty', () => {
        var result = FreeText.prototype.getError(questions.mandatoryMultiLineSmall,
          'Some text', errors);
        expect(result).to.equal(false);
      });

      it('returns false when input empty', () => {
        var result = FreeText.prototype.getError(questions.mandatoryMultiLineSmall,
          '', errors);
        expect(result).to.equal(errors.mandatory);
      });
    });
  })
});
