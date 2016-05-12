import { expect } from 'chai';
import { Image } from 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

describe('Splash page', () => {
  var Splash = require('../src/splash');
  it('exists', () => {
    expect(Splash).not.to.be.undefined;
  });

  var wrapper = shallow(<Splash />);

  it('has one <Image>', () => {
    expect(wrapper.find(Image)).to.have.length(1);
  });
});
