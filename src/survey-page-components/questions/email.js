import Actions from '../../actions/current-question';
import InputsStore from '../../stores/inputs-store';
import React from 'react';
import TextField from '../elements/text-field';

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
        value: ''
      },
      answers: {},
      errorMessage: ''
    };
  },
  onInputsChange: function (inputs) {
    this.setState({
      inputs: inputs
    });

    var questionId = Number(this.props.question.attr.qID);
    var questionType = Number(this.props.question.attr.qType);

    var error = this.getError();
    if(!error) {
      // if validated with no errors, save to answer
      this.setState({
        answers: this.state.inputs
      });
      Actions.saveAnswers(questionId, questionType, this.state.answers);
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
          keyboardType='email-address'
          name='value'
          placeholder={this.props.question.childNamed('example').val}
      />);
  },
  getError: function (question = this.props.question,
    inputs=this.state.inputs) {

    var isMand = question.childNamed('mand');
    var isComplete = true;
    var isValid = true;
    var error = false;

    var isEmailValid = function (email) {
      var re = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
      return re.test(email);
    };

    if(inputs.value && inputs.value !== '') {
      // if there's input, make sure it's valid
      isValid = isEmailValid(inputs.value);
    } else {
      // if there's no input, and question is mandatory
      // then the answer is not complete
      if(isMand && isMand.val === 'true') {
        isComplete = false;
      }
    }

    if(!isComplete) {
      error = 'mandatory';
    } else if(!isValid) {
      error = 'validEmail';
    }

    return error;
  }
});
