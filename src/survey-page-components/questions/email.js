import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
import TextField from '../elements/text-field';

var errorMessages = {
  mandatory: 'This is a mandatory question.',
  invalid: 'You must enter a valid email address here.'
};

module.exports = React.createClass({
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
        email: ''
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
  render: function () {
    return (
      <TextField
          name='email'
          placeholder={this.props.question.childNamed('example').val}
      />);
  },
  getError: function (question = this.props.question,
    inputs=this.state.inputs, errors = errorMessages) {

    var isMand = question.childNamed('mand');
    var isComplete = true;
    var isValid = true;
    var error = false;

    var isEmailValid = function (email) {
      var re = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
      return re.test(email);
    };

    if(inputs.email && inputs.email !== '') {
      // if there's input, make sure it's valid
      isValid = isEmailValid(inputs.email);
    } else {
      // if there's no input, and question is mandatory
      // then the answer is not complete
      if(isMand && isMand.val === 'true') {
        isComplete = false;
      }
    }

    if(!isComplete) {
      error = errors.mandatory;
    } else if(!isValid) {
      error = errors.invalid;
    }

    return error;
  }
});
