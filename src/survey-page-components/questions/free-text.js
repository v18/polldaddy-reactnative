import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
import TextField from '../elements/text-field';
import { View } from 'react-native';

var errorMessages = {
  mandatory: 'This is a mandatory question.'
};

module.exports = React.createClass({
  render: function () {
    return (
      <View>
        {this.renderCorrectSize()}
      </View>);
  },
  componentDidMount: function () {
    this.unsubscribeFromInputs = InputsStore.listen(this.onInputsChange);
    this.focusListener = this.props.navigator.navigationContext.addListener('willfocus', () => {
      this.focusListener.remove();
      this.unsubscribeFromInputs();
    });
  },
  componentWillUnmount: function () {
    if(this.focusListener) {
      this.focusListener.remove();
    }
    if(this.unsubscribeFromAnswers) {
      this.unsubscribeFromAnswers();
    }
  },
  getInitialState: function () {
    return {
      inputs: {
        freeText: ''
      },
      answers: {},
      errorMessage: ''
    };
  },
  onInputsChange: function (inputs) {
    this.setState({
      inputs: inputs
    });

    var error = this.getError();
    if(!error) {
      // if validated with no errors, save to answer
      this.setState({
        answers: this.state.inputs
      });
      Actions.saveAnswers(this.state.answers);
    } else {
      // if not validated, remove answer & save error instead
      this.setState({
        answers: ''
      });
      Actions.saveError(error);
    }
  },
  renderCorrectSize: function (question = this.props.question) {
    var type = Number(question.childNamed('type').val);
    switch(type) {
      case 0: // single-line
        return (
          <TextField
              autoFocus={true}
              maxLength={500}
              name='freeText'
              placeholder=''
          />);
      case 1: // multi-line
        return (
          <TextField
              autoCapitalize='sentences'
              autoFocus={true}
              multiline={true}
              name='freeText'
              placeholder=''
          />);
      case 2: // password
        return (
          <TextField
              autoFocus={true}
              maxLength={500}
              name='freeText'
              placeholder=''
              secureTextEntry={true}
          />);
    }
  },
  getError: function (question = this.props.question,
    text=this.state.inputs.freeText, errors = errorMessages) {

    var error = false;
    var isMand = question.childNamed('mand');

    if(isMand && isMand.val === 'true') {
      // make sure input is not empty
      if(! text || text === '') {
        error = errors.mandatory;
      }
    }

    return error;
  }
});
