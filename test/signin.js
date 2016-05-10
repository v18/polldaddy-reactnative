import { Text, TouchableHighlight } from 'react-native';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

describe('Sign in page', () => {
  var Signin = require('../src/signin');
  it('exists', () => {
    expect(Signin).not.to.be.undefined;
  });

  var wrapper = shallow(<Signin />);

  it('has three <Text />s', () => {
    expect(wrapper.find(Text)).to.have.length(3);
  });

  describe('text fields', () => {
    it('has one email field', () => {
      var emailWrapper = wrapper.find({placeholder: 'email'});
      expect(emailWrapper).to.have.length(1);
    });

    it('has one password field', () => {
      var passwordWrapper = wrapper.find({placeholder: 'password'});
      expect(passwordWrapper).to.have.length(1);
      expect(passwordWrapper.prop('secureTextEntry')).to.equal(true);
    });
  });

  it('has one signin button', () => {
    var signinWrapper = wrapper.find(TouchableHighlight);
    expect(signinWrapper).to.have.length(1);
    expect(signinWrapper.contains(Text)).to.equal(true);
  });
});
