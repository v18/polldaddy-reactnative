import { ListView, View } from 'react-native';
import { expect } from 'chai';
import Question from '../../../src/survey-page-components/question';
import Rank from '../../../src/survey-page-components/questions/rank';
import rankQ from '../../../test-data/rank-xml';
import React from 'react';
import { shallow } from 'enzyme';

describe('<Rank />', () => {
  describe('Displays', () => {
    var qProps = Question.prototype.getRankProps(rankQ.asEntered);

    it('empty <View> before loading', () => {
      var wrapper = shallow(<Rank {...qProps}/>);
      wrapper.setState({renderPage: false});
      expect(wrapper.find(View)).to.have.length(1);
      expect(wrapper.find(View).html()).to.equal('');
    });

    it('<ListView> after loading if at least one answer provided', () => {
      var wrapper = shallow(<Rank {...qProps}/>);
      wrapper.setState({renderPage: true});
      expect(wrapper.find(ListView)).to.have.length(1);
    });

    it('empty <View> if no answers provided', () => {
      var props = {isMandatory: false, answers: []};
      var wrapper = shallow(<Rank {...props}/>);
      expect(wrapper.find(View)).to.have.length(1);
      expect(wrapper.find(View).html()).to.equal('');
    });
  });

  describe('swap', () => {
    it('returns original array if given ids are the same', () => {
      var arrays = [
        [1,2,3],
        [{id: 1}, {id:2}, {id:3}]
      ];

      arrays.map(function (array) {
        var result = Rank.prototype.swap(1, 1, array);
        expect(result).to.eql(array);

        // want new array passed, not a reference to original array
        expect(result).to.not.equal(array);
      });
    });

    it('returns original array if given id are not number types', () => {
      var arrays = [
        [1,2,3],
        [{id: 1}, {id:2}, {id:3}]
      ];

      var possibleIds = [
        {
          id1: 1,
          id2: '0'
        },
        {
          id1: '2',
          id2: 1
        },
        {
          id1: 'x',
          id2: 1
        }
      ];

      arrays.map(function (array) {
        possibleIds.map(function (ids) {
          var result = Rank.prototype.swap(ids.id1, ids.id2, array);
          expect(result).to.eql(array);

          // want new array passed, not a reference to original array
          expect(result).to.not.equal(array);
        });
      });
    });

    it('returns original array if one of given ids does not exist in array', () => {
      var arrays = [
        [1,2,3],
        [{id: 1}, {id:2}, {id:3}]
      ];

      var possibleIds = [
        {
          id1: -1,
          id2: 2
        },
        {
          id1: 5,
          id2: -1
        }
      ];

      arrays.map(function (array) {
        possibleIds.map(function (ids) {
          var result = Rank.prototype.swap(ids.id1, ids.id2, array);
          expect(result).to.eql(array);

          // want new array passed, not a reference to original array
          expect(result).to.not.equal(array);
        });
      });
    });

    it('returns a new array with elements swapped when both ids are within array length', () => {
      var scenarios = [
        {
          array: [1,2,3],
          switches: [
            {
              id1: 0,
              id2: 1,
              result: [2,1,3]
            },
            {
              id1: 1,
              id2: 0,
              result: [2,1,3]
            },
            {
              id1: 2,
              id2: 0,
              result: [3,2,1]
            }
          ]
        },
        {
          array: [{id: 1},{id: 2},{id: 3}],
          switches: [
            {
              id1: 0,
              id2: 1,
              result: [{id: 2},{id: 1},{id: 3}]
            },
            {
              id1: 1,
              id2: 0,
              result: [{id: 2},{id: 1},{id: 3}]
            },
            {
              id1: 2,
              id2: 0,
              result: [{id: 3},{id: 2},{id: 1}]
            }
          ]
        }
      ];

      scenarios.map(function (scenario) {
        scenario.switches.map(function (s) {
          var result = Rank.prototype.swap(s.id1,
            s.id2, scenario.array);
          expect(result).to.eql(s.result);
          expect(result).to.not.equal(scenario.array);
        });
      });
    });
  });
});
