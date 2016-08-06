import { Text, TouchableHighlight } from 'react-native';
import { expect } from 'chai';
import Matrix from '../../../src/survey-page-components/questions/matrix';
import matrixQ from '../../../test-data/matrix-xml';
import Question from '../../../src/survey-page-components/question';
import React from 'react';
import { shallow } from 'enzyme';

describe('<Matrix />', () => {
  describe('displays', () => {
    var props = Question.prototype.getMatrixProps(matrixQ.standard);
    var wrapper = shallow(<Matrix {...props}/>);

    it('the right number of columns and rows', () => {
      expect(wrapper.find(Text)).to.have.length(5);
    });

    it('the right number of answers', () => {
      expect(wrapper.find(TouchableHighlight)).to.have.length(6);
    });
  });

  describe('getError()', () => {
    describe('mandatory question', () => {
      var isMandatory = true;
      it('returns mand error when no selections are made', () => {
        var expectedNumberOfAnswers = 2;

        var noInputs = {};
        var emptyInputs = {
          3597163: []
        };

        var result1 = Matrix.prototype.getError(noInputs, expectedNumberOfAnswers, isMandatory);
        var result2 = Matrix.prototype.getError(emptyInputs, expectedNumberOfAnswers, isMandatory);

        expect(result1).to.equal('matrixIncomplete');
        expect(result2).to.equal('matrixIncomplete');
      });

      it('returns mand error when selections are made for some rows', () => {
        var expectedNumberOfAnswers = 2;
        var oneInput = {
          3597163: [3361064]
        };
        var secondInputEmpty = {
          3597163: [3361064],
          3597164: []
        };

        var result1 = Matrix.prototype.getError(oneInput, expectedNumberOfAnswers, isMandatory);
        var result2 = Matrix.prototype.getError(secondInputEmpty, expectedNumberOfAnswers, isMandatory);

        expect(result1).to.equal('matrixIncomplete');
        expect(result2).to.equal('matrixIncomplete');
      });

      it('returns false when selections are made for all rows', () => {
        var expectedNumberOfAnswers = 2;
        var inputs = {
          3597163: [3361064],
          3597164: [3361064]
        };
        var result = Matrix.prototype.getError(inputs, expectedNumberOfAnswers, isMandatory);
        expect(result).to.equal(false);
      });
    });

    describe('not mandatory question', () => {
      var isMandatory = false;
      it('returns false when no selections are made', () => {
        var expectedNumberOfAnswers = 2;

        var noInputs = {};
        var emptyInputs = {
          3597163: []
        };

        var result1 = Matrix.prototype.getError(noInputs, expectedNumberOfAnswers, isMandatory);
        var result2 = Matrix.prototype.getError(emptyInputs, expectedNumberOfAnswers, isMandatory);

        expect(result1).to.equal(false);
        expect(result2).to.equal(false);
      });

      it('returns false when selections are made for some rows', () => {
        var expectedNumberOfAnswers = 2;
        var oneInput = {
          3597163: [3361064]
        };
        var secondInputEmpty = {
          3597163: [3361064],
          3597164: []
        };

        var result1 = Matrix.prototype.getError(oneInput, expectedNumberOfAnswers, isMandatory);
        var result2 = Matrix.prototype.getError(secondInputEmpty, expectedNumberOfAnswers, isMandatory);

        expect(result1).to.equal(false);
        expect(result2).to.equal(false);
      });

      it('returns false when selections are made for all rows', () => {
        var expectedNumberOfAnswers = 2;
        var inputs = {
          3597163: [3361064],
          3597164: [3361064]
        };
        var result = Matrix.prototype.getError(inputs, expectedNumberOfAnswers, isMandatory);
        expect(result).to.equal(false);
      });
    });
  });
});
