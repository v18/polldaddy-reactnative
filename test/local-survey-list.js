import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarAndroid } from 'react-native';

describe('Local surveys page', () => {
  var LocalSurveyList = require('../src/local-survey-list');
  it('exists', () => {
    expect(LocalSurveyList).not.to.be.undefined;
  });

  var wrapper = shallow(<LocalSurveyList />);

  it('has one <ToolbarAndroid>', () => {
    expect(wrapper.find(ToolbarAndroid)).to.have.length(1);
  });
});
