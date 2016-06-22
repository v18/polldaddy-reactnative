import { expect } from 'chai';
import questions from '../../../test-data/address-questions-xml';
import React from 'react';
import { shallow } from 'enzyme';
import SingleFieldInput from '../../../src/survey-page-components/elements/single-line-field';
var errors = {
  mandatory: 'This is a mandatory question.'
};


describe('<Address />', () => {
  var Address = require('../../../src/survey-page-components/questions/address');
  it('exists', () => {
    expect(Address).not.to.be.undefined;
  });

  describe('correctly displays', () => {
    it('add1 and add2', () => {
      var wrapper = shallow(<Address question={questions.mandatoryPlace} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(2);

      var add1 = wrapper.find({placeholder: 'Address Line 1'});
      expect(add1).to.have.length(1);

      var add2 = wrapper.find({placeholder: 'Address Line 2'});
      expect(add2).to.have.length(1);
    });
    it('state field', () => {
      var wrapper = shallow(<Address question={questions.mandatoryState} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(1);

      var state = wrapper.find({placeholder: 'State'});
      expect(state).to.have.length(1);
    });
    it('all fields', () => {
      var wrapper = shallow(<Address question={questions.mandatoryAll} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(6);

      var add1 = wrapper.find({placeholder: 'Address Line 1'});
      expect(add1).to.have.length(1);

      var add2 = wrapper.find({placeholder: 'Address Line 2'});
      expect(add2).to.have.length(1);

      var city = wrapper.find({placeholder: 'City'});
      expect(city).to.have.length(1);

      var state = wrapper.find({placeholder: 'State'});
      expect(state).to.have.length(1);

      var zip = wrapper.find({placeholder: 'Zip Code'});
      expect(zip).to.have.length(1);

      var country = wrapper.find({placeholder: 'Country'});
      expect(country).to.have.length(1);
    });
    it('city and country', () => {
      var wrapper = shallow(<Address question={questions.mandatoryTwoNonPlace} />);
      expect(wrapper.find(SingleFieldInput)).to.have.length(2);

      var city = wrapper.find({placeholder: 'City'});
      expect(city).to.have.length(1);

      var country = wrapper.find({placeholder: 'Country'});
      expect(country).to.have.length(1);
    });
  });

  describe('validate()', () => {
    describe('mandatory', () => {
      describe('all 5 fields are used', () => {
        it('returns an error message when user did not add all fields', () => {
          var input1 = {
            add1: '',
            add2: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          };
          var input2 = {};
          var input3 = {
            add1: '',
            add2: '',
            city: '',
            zip: '',
            country: ''
          };
          var input4 = {
            add1: '',
            add2: '',
            city: '',
            state: '',
            zip: '90210',
            country: ''
          };

          expect(Address.prototype.getError(questions.mandatoryAll, input1, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryAll, input2, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryAll, input3, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryAll, input4, errors)).to.equal(errors.mandatory);
        });

        it('returns false when user added all fields', () => {
          var input1 = {
            add1: 'address1',
            add2: 'address2',
            city: 'city',
            state: 'state',
            zip: 'zip',
            country: 'country'
          };
          expect(Address.prototype.getError(questions.mandatoryAll, input1, errors)).to.equal(false);
        });
      });

      describe('2 non-place are fields used: city, country', () => {
        it('returns the mandatory error message when user did not add all fields', () => {
          var input1 = {
            city: '',
            country: ''
          };
          var input2 = {};
          var input3 = {
            city: 'city',
            country: ''
          };

          expect(Address.prototype.getError(questions.mandatoryTwoNonPlace, input1, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryTwoNonPlace, input2, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryTwoNonPlace, input3, errors)).to.equal(errors.mandatory);
        });
        it('returns false when user added all fields', () => {
          var input1 = {
            city: 'city',
            country: 'country'
          };
          expect(Address.prototype.getError(questions.mandatoryTwoNonPlace, input1, errors)).to.equal(false);
        });
      });

      describe('only place is used', () => {
        it('returns the mandatory error message when user did not add all fields', () => {
          var input1 = {
            add1: '',
            add2: ''
          };
          var input2 = {};
          var input3 = {
            add1: 'add1',
            add2: ''
          };

          expect(Address.prototype.getError(questions.mandatoryPlace, input1, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryPlace, input2, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryPlace, input3, errors)).to.equal(errors.mandatory);
        });
        it('returns false when user added all fields', () => {
          var input1 = {
            add1: 'add1',
            add2: 'add2'
          };
          expect(Address.prototype.getError(questions.mandatoryPlace, input1, errors)).to.equal(false);
        });
      });

      describe('only state is used', () => {
        it('returns the mandatory error message when user did not add all fields', () => {
          var input1 = {
            state: ''
          };
          var input2 = {};

          expect(Address.prototype.getError(questions.mandatoryState, input1, errors)).to.equal(errors.mandatory);
          expect(Address.prototype.getError(questions.mandatoryState, input2, errors)).to.equal(errors.mandatory);
        });
        it('returns false when user added all fields', () => {
          var input1 = {
            state: 'state'
          };
          expect(Address.prototype.getError(questions.mandatoryState, input1, errors)).to.equal(false);
        });
      });
    });

    describe('not mandatory', () => {
      describe('all 5 fields are used', () => {
        it('returns false for any input, including none', () => {
          var input1 = {
            add1: '',
            add2: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          };
          var input2 = {};
          var input3 = {
            add1: '',
            add2: '',
            city: '',
            zip: '',
            country: ''
          };
          var input4 = {
            add1: '',
            add2: '',
            city: '',
            state: '',
            zip: '90210',
            country: ''
          };
          var input5 = {
            add1: 'address1',
            add2: 'address2',
            city: 'city',
            state: 'state',
            zip: 'zip',
            country: 'country'
          };

          expect(Address.prototype.getError(questions.notMandatoryAll, input1, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryAll, input2, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryAll, input3, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryAll, input4, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryAll, input5, errors)).to.equal(false);
        });
      });

      describe('2 non-place are fields used: city, country', () => {
        it('returns false for any input, including none', () => {
          var input1 = {
            city: '',
            country: ''
          };
          var input2 = {};
          var input3 = {
            city: 'city',
            country: ''
          };
          var input4 = {
            city: 'city',
            country: 'country'
          };

          expect(Address.prototype.getError(questions.notMandatoryTwoNonPlace, input1, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryTwoNonPlace, input2, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryTwoNonPlace, input3, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryTwoNonPlace, input4, errors)).to.equal(false);
        });
      });

      describe('only place is used', () => {
        it('returns false for any input, including none', () => {
          var input1 = {
            add1: '',
            add2: ''
          };
          var input2 = {};
          var input3 = {
            add1: 'add1',
            add2: ''
          };
          var input4 = {
            add1: 'add1',
            add2: 'add2'
          };

          expect(Address.prototype.getError(questions.notMandatoryPlace, input1, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryPlace, input2, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryPlace, input3, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryPlace, input4, errors)).to.equal(false);
        });
      });

      describe('only state is used', () => {
        it('returns false for any input, including none', () => {
          var input1 = {
            state: ''
          };
          var input2 = {};
          var input3 = {
            state: 'state'
          };

          expect(Address.prototype.getError(questions.notMandatoryState, input1, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryState, input2, errors)).to.equal(false);
          expect(Address.prototype.getError(questions.notMandatoryState, input3, errors)).to.equal(false);
        });
      });
    });
  });
});
