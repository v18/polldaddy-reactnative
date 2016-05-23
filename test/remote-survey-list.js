import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarAndroid } from 'react-native';

describe('Remote surveys page', () => {
  var RemoteSurveyList = require('../src/remote-survey-list');
  it('exists', () => {
    expect(RemoteSurveyList).not.to.be.undefined;
  });

  var wrapper = shallow(<RemoteSurveyList />);

  it('has one <ToolbarAndroid>', () => {
    expect(wrapper.find(ToolbarAndroid)).to.have.length(1);
  });

  describe('formatSurveyAndQuizData()', () => {
    it('returns an object with survey and quiz data when given an array with survey and quiz data, and an empty selected items array', () => {
      var selectedItems = [];
      var surveys = [
        {
          closed:0,
          created:1463580844,
          folder_id:25733992,
          id:1,
          name:'Survey 1 Name',
          owner:12,
          responses:0,
          title:'Survey 1 Title'
        },
        {
          closed:0,
          created:1463580844,
          folder_id:25733992,
          id:2,
          name:'Survey 2 Name',
          owner:12,
          responses:0,
          title:'Survey 2 Title'
        }];
      var quizzes = [{
        closed:0,
        created:1463580844,
        folder_id:25733992,
        id:3,
        name:'Quiz 1 Name',
        owner:12,
        responses:0,
        title:'Quiz 1 Title'
      }];
      var expected = [
        [
          {
            id: 1,
            title: 'Survey 1 Title',
            selected: false
          },
          {
            id: 2,
            title: 'Survey 2 Title',
            selected: false
          }
        ],
        [{
          id: 3,
          title: 'Quiz 1 Title',
          selected: false
        }]
      ];
      var result = RemoteSurveyList.prototype.formatSurveyAndQuizData([surveys, quizzes], selectedItems);
      expect(result).to.eql(expected);
    });

    it('returns an object with survey data and an empty quizzes data array when given an array with only survey data and an empty selected items array', () => {
      var selectedItems = [];
      var surveys = [
        {
          closed:0,
          created:1463580844,
          folder_id:25733992,
          id:1,
          name:'Survey 1 Name',
          owner:12,
          responses:0,
          title:'Survey 1 Title'
        },
        {
          closed:0,
          created:1463580844,
          folder_id:25733992,
          id:2,
          name:'Survey 2 Name',
          owner:12,
          responses:0,
          title:'Survey 2 Title'
        }];
      var quizzes = [];
      var expected = [
        [
          {
            id: 1,
            title: 'Survey 1 Title',
            selected: false
          },
          {
            id: 2,
            title: 'Survey 2 Title',
            selected: false
          }],
        []
      ];
      var result = RemoteSurveyList.prototype.formatSurveyAndQuizData([surveys, quizzes], selectedItems);
      expect(result).to.eql(expected);
    });

    it('returns an object with quiz data and an survey data array when given an array with only survey data, and an empty selected items array', () => {
      var selectedItems = [];
      var surveys = [];
      var quizzes = [{
        closed:0,
        created:1463580844,
        folder_id:25733992,
        id:3,
        name:'Quiz 1 Name',
        owner:12,
        responses:0,
        title:'Quiz 1 Title'
      }];
      var expected = [
        [],
        [{
          id: 3,
          title: 'Quiz 1 Title',
          selected: false
        }]
      ];
      var result = RemoteSurveyList.prototype.formatSurveyAndQuizData([surveys, quizzes], selectedItems);
      expect(result).to.eql(expected);
    });

    it('returns an object with quiz data and an survey data array with the correct selected status when given a non-empty selected surveys array',  () => {
      var selectedItems = [1,3];
      var surveys = [
        {
          closed:0,
          created:1463580844,
          folder_id:25733992,
          id:1,
          name:'Survey 1 Name',
          owner:12,
          responses:0,
          title:'Survey 1 Title'
        },
        {
          closed:0,
          created:1463580844,
          folder_id:25733992,
          id:2,
          name:'Survey 2 Name',
          owner:12,
          responses:0,
          title:'Survey 2 Title'
        }];
      var quizzes = [{
        closed:0,
        created:1463580844,
        folder_id:25733992,
        id:3,
        name:'Quiz 1 Name',
        owner:12,
        responses:0,
        title:'Quiz 1 Title'
      }];
      var expected = [
        [
          {
            id: 1,
            title: 'Survey 1 Title',
            selected: true
          },
          {
            id: 2,
            title: 'Survey 2 Title',
            selected: false
          }],
          [{
            id: 3,
            title: 'Quiz 1 Title',
            selected: true
          }]
      ];
      var result = RemoteSurveyList.prototype.formatSurveyAndQuizData([surveys, quizzes], selectedItems);
      expect(result).to.eql(expected);
    });
  });
});
